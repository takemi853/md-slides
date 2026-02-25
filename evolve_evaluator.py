"""md-slides カスタム評価器 for evolve_code.

Markdown → Manim風アニメーションスライドツールの品質を
TypeScript/Next.js ソースの静的解析で評価する。

5軸 × 10点 = 50点満点:
  - markdown_fidelity:    Markdown変換精度（見出し/箇条書き/コード/数式/テーブル）
  - animation_quality:    Framer Motion使用量・stagger・AnimatePresence・バリエーション
  - feature_completeness: エディタ・プレビュー・発表モード・テーマ・キーボードナビ
  - ui_quality:           StaticWebEvaluatorBase の visual+layout 品質
  - ux_intuitiveness:     キーボード操作・分割ペイン・スライド番号・フィードバック

MAP-Elites 次元: animation_quality × feature_completeness × ui_quality

CurriculumScheduler 3フェーズ:
  Phase A (0–40%): feature_completeness=1.5, animation_quality=0.7
  Phase B (40–70%): feature_completeness=1.0, animation_quality=1.4
  Phase C (70–100%): animation_quality=1.5, ux_intuitiveness=1.4
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from evolve_code.evaluator import StaticWebEvaluatorBase


class SlideshowEvaluator(StaticWebEvaluatorBase):
    """md-slides の評価器。

    5軸で評価（各10点、合計50点満点）:
      - markdown_fidelity:    Markdown変換の正確さと対応要素の多様性
      - animation_quality:    アニメーションの量・質・バリエーション（最重要）
      - feature_completeness: ツールとしての機能完成度
      - ui_quality:           ビジュアル品質 + レイアウト品質
      - ux_intuitiveness:     操作性・フィードバック・直感的UI
    """

    _WEIGHTS = {
        "markdown_fidelity":    1.0,
        "animation_quality":    1.4,   # Manim風アニメが最重要
        "feature_completeness": 1.0,
        "ui_quality":           1.3,
        "ux_intuitiveness":     1.0,
    }

    # feature_completeness のチェック項目
    # (機能名, 検出パターン, 必須ファイルパターン, 最小マッチ数)
    _FEATURES: list[tuple[str, str, str, int]] = [
        ("エディタ",           r"textarea|onChange|setMarkdown|Editor",               r"Editor|page",          3),
        ("Markdownパース",      r"marked|parseMarkdown|split.*---|\-\-\-",             r"parser|useSlides",     3),
        ("スライド分割",        r"split.*---|\-\-\-.*split|sections|slides\.map",      r"parser|useSlides",     3),
        ("プレビューパネル",    r"SlidePreview|AnimatePresence|slide.*preview",        r"SlidePreview|page",    3),
        ("ナビゲーション",      r"nextSlide|prevSlide|currentIndex|prev.*next",        r"SlidePreview|useSlides", 3),
        ("発表モード",          r"present|fullscreen|/present|PresentPage",            r"present",              3),
        ("キーボードナビ",      r"ArrowRight|ArrowLeft|keydown|addEventListener.*key", r"present",              3),
        ("テーマ切替",          r"setTheme|ThemeName|dark|light|manim",                r"themes|Toolbar|useSlides", 3),
        ("Zustandストア",       r"create\(|useSlides|zustand",                        r"useSlides",            3),
        ("スライド番号表示",    r"currentIndex.*slides\.length|n.*total|スライド.*\/", r"Toolbar|SlidePreview", 2),
    ]

    def evaluate(self, target_dir: str) -> dict[str, Any]:
        """ソースコードを静的解析してスコアを返す。"""
        src = Path(target_dir).resolve()
        if not src.exists():
            return {"error": f"Target directory not found: {target_dir}"}

        ts_files, all_code = self._load_ts_files(target_dir)
        if not ts_files:
            return {"error": "No TypeScript files found"}

        md    = self._eval_markdown_fidelity(ts_files, all_code)
        anim  = self._eval_animation_quality(ts_files, all_code)
        feat  = self._eval_feature_completeness(ts_files, all_code)
        ui    = self._eval_ui_quality(ts_files, all_code)
        ux    = self._eval_ux_intuitiveness(ts_files, all_code)

        build_ok = self._check_build(target_dir)

        # ビルド失敗ペナルティ: 全スコア半減
        if not build_ok:
            for d in (md, anim, feat, ui, ux):
                d["score"] = round(d["score"] * 0.5, 1)

        raw_scores = {
            "markdown_fidelity":    md["score"],
            "animation_quality":    anim["score"],
            "feature_completeness": feat["score"],
            "ui_quality":           ui["score"],
            "ux_intuitiveness":     ux["score"],
        }
        weighted_total = self._weighted_score(
            raw_scores, self._WEIGHTS, axis_max=10.0, total_max=50.0
        )

        return {
            "markdown_fidelity":    md["score"],
            "animation_quality":    anim["score"],
            "feature_completeness": feat["score"],
            "ui_quality":           ui["score"],
            "ux_intuitiveness":     ux["score"],
            "weighted_total":       weighted_total,
            "build_ok":             build_ok,
            "meta_file_count":      str(len(ts_files)),
            "meta_total_lines":     str(sum(len(c.splitlines()) for c in ts_files.values())),
            "features_found":       feat.get("found", []),
            "features_missing":     feat.get("missing", []),
        }

    # ================================================================
    # 1. markdown_fidelity (10点)
    # ================================================================
    def _eval_markdown_fidelity(
        self, files: dict[str, str], all_code: str
    ) -> dict[str, Any]:
        """Markdown要素の変換対応度（最大10点）。"""
        score = 0.0

        # marked/remark/mdx 使用 (1.5点)
        if re.search(r"marked|remark|unified|mdx|MDX", all_code):
            score += 1.5
        elif re.search(r"split.*\n|html.*heading|parseMarkdown", all_code):
            score += 0.5

        # --- セパレータによるスライド分割 (2.0点)
        if re.search(r"split.*---|\-\-\-|sections.*split|slices", all_code):
            score += 1.0
        if re.search(r"trim\(\)|filter.*Boolean|filter.*null|\.filter\(", all_code):
            score += 0.5
        if re.search(r"slide.*id|id.*slide-|index.*\d", all_code):
            score += 0.5

        # 見出し h1/h2/h3 対応 (1.0点)
        heading_patterns = sum(1 for p in [
            r"<h1|\"h1\"|heading.*1|fontSize.*2\.5|fontSize.*3xl",
            r"<h2|\"h2\"|heading.*2|fontSize.*1\.8|fontSize.*2xl",
            r"<h3|\"h3\"|heading.*3|fontSize.*1\.5|fontSize.*xl",
        ] if re.search(p, all_code))
        score += min(1.0, heading_patterns * 0.35)

        # 箇条書き ul/ol 対応 (1.0点)
        list_patterns = sum(1 for p in [
            r"<ul|ul.*li|list.*item",
            r"<ol|ol.*li|ordered.*list",
            r"slide-element.*ul|list-style|before.*content",
        ] if re.search(p, all_code))
        score += min(1.0, list_patterns * 0.35)

        # コードブロック対応 (1.0点)
        code_patterns = sum(1 for p in [
            r"<pre|<code|codeBg|codeText",
            r"font.*mono|monospace|Courier",
            r"pre.*code|code.*block",
        ] if re.search(p, all_code))
        score += min(1.0, code_patterns * 0.35)

        # テーブル対応 (0.5点)
        if re.search(r"<table|table.*collapse|th.*td|border.*collapse", all_code):
            score += 0.5

        # 引用 blockquote 対応 (0.5点)
        if re.search(r"blockquote|border-left|borderLeft.*accent", all_code):
            score += 0.5

        # インラインマークアップ (strong/em) (0.5点)
        inline = sum(1 for p in [
            r"strong.*font.*700|fontWeight.*700|bold",
            r"em.*italic|fontStyle.*italic",
        ] if re.search(p, all_code))
        score += min(0.5, inline * 0.25)

        # HTML化 (dangerouslySetInnerHTML) (1.5点)
        if re.search(r"dangerouslySetInnerHTML|__html|innerHtml", all_code):
            score += 1.0
        if re.search(r"marked\.parse|parse.*md|parseMarkdown", all_code):
            score += 0.5

        return {"score": round(min(score, 10.0), 1)}

    # ================================================================
    # 2. animation_quality (10点)
    # ================================================================
    def _eval_animation_quality(
        self, files: dict[str, str], all_code: str
    ) -> dict[str, Any]:
        """Framer Motion アニメーションの品質（最大10点）。"""
        score = 0.0

        # framer-motion のインポート (1.0点)
        fm_imports = len(re.findall(r"from.*framer-motion|import.*motion", all_code))
        score += min(1.0, fm_imports * 0.25)

        # AnimatePresence 使用 (1.5点)
        ap_count = len(re.findall(r"AnimatePresence", all_code))
        score += min(1.5, ap_count * 0.5)

        # motion コンポーネント使用量 (1.5点)
        motion_count = len(re.findall(r"<motion\.", all_code))
        score += min(1.5, motion_count * 0.15)

        # variants 定義 (1.5点)
        variant_count = len(re.findall(r"variants\s*[:=]\s*\{|const.*Variants\s*=", all_code))
        score += min(1.5, variant_count * 0.3)

        # stagger アニメーション (1.0点)
        stagger = sum(1 for p in [
            r"staggerChildren",
            r"delayChildren",
            r"staggerDirection",
        ] if re.search(p, all_code))
        score += min(1.0, stagger * 0.4)

        # アニメーションバリエーション（fade/slide/scale/x/y/opacity）(1.0点)
        anim_types = sum(1 for p in [
            r"opacity.*0.*1|opacity.*1.*0",
            r"x:\s*[-\d]+|y:\s*[-\d]+",
            r"scale.*0\.9|scale.*1\.1|scale.*0\.95",
            r"rotate:\s*\d",
        ] if re.search(p, all_code))
        score += min(1.0, anim_types * 0.3)

        # イージング / duration (0.5点)
        easing = sum(1 for p in [
            r"ease.*Out|ease.*In|easeInOut",
            r"duration:\s*0\.[2-9]",
            r"spring|type.*spring",
        ] if re.search(p, all_code))
        score += min(0.5, easing * 0.2)

        # exit アニメーション (1.0点)
        exit_count = len(re.findall(r"\bexit\s*=\s*\{|\bexit:\s*\{", all_code))
        score += min(1.0, exit_count * 0.25)

        # custom/direction によるスライド遷移 (0.5点)
        if re.search(r"custom.*direction|direction.*custom|\bcustom\b.*AnimatePresence", all_code):
            score += 0.5

        # 複数スライドコンポーネントでのアニメーション (0.5点)
        slide_files = [f for f in files if "Slide" in f or "slide" in f.lower()]
        if len(slide_files) >= 1 and motion_count >= 3:
            score += 0.5

        return {"score": round(min(score, 10.0), 1)}

    # ================================================================
    # 3. feature_completeness (10点)
    # ================================================================
    def _eval_feature_completeness(
        self, files: dict[str, str], all_code: str
    ) -> dict[str, Any]:
        """スライドツールとしての機能完成度（_feature_check に委譲）。"""
        return self._feature_check(self._FEATURES, files, all_code)

    # ================================================================
    # 4. ui_quality (10点)
    # ================================================================
    def _eval_ui_quality(
        self, files: dict[str, str], all_code: str
    ) -> dict[str, Any]:
        """UIクオリティ（visual 5点 + layout 5点）。"""
        visual = self._eval_visual_quality(files, all_code, max_score=5.0)
        layout = self._eval_slide_layout_quality(files, all_code)
        return {"score": round(min(visual + layout, 10.0), 1)}

    def _eval_slide_layout_quality(
        self, files: dict[str, str], all_code: str
    ) -> float:
        """スライドレイアウト品質（最大5点）。"""
        score = 0.0

        # 分割レイアウト (1.0点)
        split_layout = sum(1 for p in [
            r"flex.*flex-1|flex-1.*flex",
            r"split|pane|column|col",
            r"w-1/2|w-\[50%\]|grid.*cols-2",
        ] if re.search(p, all_code))
        score += min(1.0, split_layout * 0.4)

        # スライド表示品質 (1.0点)
        slide_display = sum(1 for p in [
            r"aspect.*ratio|aspect-\[|16/9|16:9",
            r"overflow-hidden",
            r"position.*absolute|absolute.*inset",
            r"border.*radius|rounded",
        ] if re.search(p, all_code))
        score += min(1.0, slide_display * 0.3)

        # タイポグラフィ品質 (1.0点)
        typo = sum(1 for p in [
            r"text-(3xl|4xl|5xl)|fontSize.*2\.(5|8)|fontSize.*3",
            r"font-(bold|extrabold|black)|fontWeight.*[789]00",
            r"tracking|letterSpacing|leading-|lineHeight",
            r"font.*mono|Courier|monospace",
        ] if re.search(p, all_code))
        score += min(1.0, typo * 0.3)

        # テーマ対応（色変数）(1.0点)
        theme_vars = sum(1 for p in [
            r"theme\.(bg|text|heading|accent|codeBg)",
            r"backgroundColor.*theme|color.*theme",
            r"dark.*light.*manim|manim.*dark|ThemeName",
        ] if re.search(p, all_code))
        score += min(1.0, theme_vars * 0.4)

        # レスポンシブ / フルスクリーン対応 (1.0点)
        responsive = sum(1 for p in [
            r"h-screen|min-h-screen|w-screen",
            r"h-full.*w-full|100vh|100vw",
            r"sm:|md:|lg:|xl:",
            r"overflow-hidden.*flex-1|flex-col.*h-",
        ] if re.search(p, all_code))
        score += min(1.0, responsive * 0.3)

        return max(0.0, min(score, 5.0))

    # ================================================================
    # 5. ux_intuitiveness (10点)
    # ================================================================
    def _eval_ux_intuitiveness(
        self, files: dict[str, str], all_code: str
    ) -> dict[str, Any]:
        """操作性・フィードバック・直感的UI（最大10点）。"""
        score = 0.0

        # キーボードナビゲーション (2.0点)
        kb = sum(1 for p in [
            r"ArrowRight|ArrowLeft",
            r"ArrowDown|ArrowUp",
            r"keydown|addEventListener.*key|onKeyDown",
            r"Escape.*href|Escape.*router",
            r"Home.*setCurrentIndex|End.*setCurrentIndex",
        ] if re.search(p, all_code))
        score += min(2.0, kb * 0.45)

        # スライド番号・進捗表示 (1.5点)
        progress = sum(1 for p in [
            r"currentIndex.*\+.*1.*slides|slide.*\d.*\/.*\d",
            r"n\s*\/\s*total|index.*length",
            r"dot.*navigation|indicator|bullet",
        ] if re.search(p, all_code))
        score += min(1.5, progress * 0.6)

        # 発表モードへの誘導 (1.0点)
        present_ux = sum(1 for p in [
            r"Present.*→|発表.*モード|href.*present",
            r"Link.*present|<Link.*present",
            r"present.*button|btn.*present",
        ] if re.search(p, all_code))
        score += min(1.0, present_ux * 0.4)

        # ライブプレビュー / リアルタイム更新 (1.5点)
        live = sum(1 for p in [
            r"onChange.*setMarkdown|onChange.*update",
            r"useEffect.*markdown|watch.*markdown",
            r"live.*update|real.*time|リアルタイム",
        ] if re.search(p, all_code))
        score += min(1.5, live * 0.6)

        # ビジュアルフィードバック (1.5点)
        feedback = sum(1 for p in [
            r"whileHover|whileTap",
            r"transition.*opacity|transition-all|transition-colors",
            r"disabled.*opacity|opacity.*disabled",
            r"cursor-pointer|cursor.*not-allowed",
        ] if re.search(p, all_code))
        score += min(1.5, feedback * 0.3)

        # ツールバー / UI構造 (1.0点)
        toolbar = sum(1 for p in [
            r"Toolbar|toolbar",
            r"flex.*justify-between|space-between",
            r"md-slides|アプリ.*タイトル",
        ] if re.search(p, all_code))
        score += min(1.0, toolbar * 0.4)

        # エンプティステート / エラーハンドリング (0.5点)
        if re.search(r"No.*slide|slides.*empty|まだスライド|placeholder", all_code, re.IGNORECASE):
            score += 0.5

        # デフォルトコンテンツ (1.0点)
        default_content = sum(1 for p in [
            r"DEFAULT_MARKDOWN|defaultMarkdown|initialMarkdown",
            r"Welcome.*md-slides|md-slides.*Welcome",
            r"Getting.*Started|Start.*editing",
        ] if re.search(p, all_code))
        score += min(1.0, default_content * 0.4)

        return {"score": round(self._clamp(score), 1)}

    # ================================================================
    # rubric
    # ================================================================
    def rubric(self) -> list[dict[str, str]]:
        """評価基準を返す。"""
        return [
            {
                "name": "markdown_fidelity",
                "category": "Markdown変換",
                "description": (
                    "marked使用(1.5点)、---分割(2.0点)、見出しh1/h2/h3(1.0点)、"
                    "ul/ol(1.0点)、コードブロック(1.0点)、テーブル(0.5点)、"
                    "引用(0.5点)、インラインマークアップ(0.5点)、HTML化(1.5点)"
                ),
                "max": "10.0",
            },
            {
                "name": "animation_quality",
                "category": "アニメーション",
                "description": (
                    "framer-motion import(1.0点)、AnimatePresence(1.5点)、"
                    "motion コンポーネント使用量(1.5点)、variants定義(1.5点)、"
                    "stagger(1.0点)、アニメーションバリエーション(1.0点)、"
                    "イージング(0.5点)、exit(1.0点)、custom/direction(0.5点)、"
                    "複数スライドでの使用(0.5点)"
                ),
                "max": "10.0",
                "weight": "1.4",
            },
            {
                "name": "feature_completeness",
                "category": "機能",
                "description": (
                    "エディタ・Markdownパース・スライド分割・プレビューパネル・"
                    "ナビゲーション・発表モード・キーボードナビ・テーマ切替・"
                    "Zustandストア・スライド番号表示（各1点）"
                ),
                "max": "10.0",
            },
            {
                "name": "ui_quality",
                "category": "UI品質",
                "description": (
                    "ビジュアル品質(5点): Framer Motion/グラデーション/シャドウ/テーマカラー | "
                    "レイアウト品質(5点): 分割レイアウト/スライド表示/タイポグラフィ/テーマ変数/レスポンシブ"
                ),
                "max": "10.0",
                "weight": "1.3",
            },
            {
                "name": "ux_intuitiveness",
                "category": "UX直感性",
                "description": (
                    "キーボードナビ(2.0点)・スライド番号/進捗(1.5点)・"
                    "発表モード誘導(1.0点)・ライブプレビュー(1.5点)・"
                    "ビジュアルフィードバック(1.5点)・ツールバー(1.0点)・"
                    "エンプティステート(0.5点)・デフォルトコンテンツ(1.0点)"
                ),
                "max": "10.0",
            },
        ]
