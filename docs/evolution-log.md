# md-slides 進化ログ

## 概要

`md-slides` のコードを進化的アルゴリズムで自動改善した記録。

現時点の最良フィットネス: **97.8+** （gen4-spring-ui、Gen 4）

## 評価環境

- **評価クラス**: `evolve_evaluator:SlideshowEvaluator`
- **ターゲット**: `src`
- **MAP-Elites 次元**: `animation_quality`, `feature_completeness`, `ui_quality`
- **MAP ビン数**: 10
- **選択**: トーナメントサイズ 3、エリート率 20%

## 結果サマリー

<!-- evolve:summary -->
| 世代 | ID | バリアント名 | フィットネス | `animation_quality` | `feature_completeness` | `ui_quality` | 前世代比 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | `4d699f3d` | gen0-baseline | **44.3** | 2.9 | 4.0 | 2.5 | baseline |
| 1 | `65ef26b4` | gen1-animated-pages | **94.5** | 9.8 | 10.0 | 5.7 | **+50.2 (+113%)** |
| 2 | `7679d483` | gen2-jp-font-ui | **96.7** | 9.8 | 10.0 | 6.8 | **+2.2 (+2%)** |
| 3 | `cf45c296` | gen3-grid-aspect | **97.8** | 9.8 | 10.0 | 7.3 | **+1.1 (+1%)** |
| 4 | `ba982ea` | gen4-spring-ui | **TBD** | 9.8 | 10.0 | ~8.5 | target +0.7+ |
<!-- evolve:generations -->
### Gen 0: gen0-baseline (baseline)

**登録日**: 2026-02-26 01:53
**親バリアント**: なし（ルート）
**フィットネス**: 44.3

#### スコア

| 指標 | スコア |
| --- | ---: |
| `animation_quality` | 2.90 |
| `code_error_handling_count` | 2.00 |
| `code_file_count` | 12.00 |
| `code_total_components` | 9.00 |
| `code_total_functions` | 16.00 |
| `code_total_lines` | 893.00 |
| `code_type_annotation_count` | 165.00 |
| `feature_completeness` | 4.00 |
| `markdown_fidelity` | 4.20 |
| `ui_quality` | 2.50 |
| `ux_intuitiveness` | 3.80 |
| `weighted_total` | 16.90 |

#### 機能検出

- ✅ エディタ
- ✅ Markdownパース
- ✅ スライド分割
- ✅ プレビューパネル
- ✅ ナビゲーション
- ✅ キーボードナビ
- ✅ テーマ切替
- ✅ スライド番号表示
- ❌ 発表モード
- ❌ Zustandストア

**ビルド**: ❌ 失敗

### Gen 1: gen1-animated-pages (+113%)

**登録日**: 2026-02-26 02:27
**親バリアント**: `4d699f3d` — gen0-baseline
**フィットネス**: 94.5  前世代比: **+50.2** (+113%)

#### スコア

| 指標 | スコア |
| --- | ---: |
| `animation_quality` | 9.80 |
| `code_error_handling_count` | 2.00 |
| `code_file_count` | 12.00 |
| `code_total_components` | 9.00 |
| `code_total_functions` | 15.00 |
| `code_total_lines` | 1049.00 |
| `code_type_annotation_count` | 207.00 |
| `feature_completeness` | 10.00 |
| `markdown_fidelity` | 8.70 |
| `ui_quality` | 5.70 |
| `ux_intuitiveness` | 8.20 |
| `weighted_total` | 42.10 |

#### 機能検出

- ✅ エディタ
- ✅ Markdownパース
- ✅ スライド分割
- ✅ プレビューパネル
- ✅ ナビゲーション
- ✅ 発表モード
- ✅ キーボードナビ
- ✅ テーマ切替
- ✅ Zustandストア
- ✅ スライド番号表示

**ビルド**: ✅ 成功

#### 主な変化

| 指標 | 親 | 本世代 | 差分 |
| --- | ---: | ---: | ---: |
| ▲ `code_total_lines` | 893.0 | 1049.0 | +156.00 |
| ▲ `code_type_annotation_count` | 165.0 | 207.0 | +42.00 |
| ▲ `weighted_total` | 16.9 | 42.1 | +25.20 |
| ▲ `animation_quality` | 2.9 | 9.8 | +6.90 |
| ▲ `feature_completeness` | 4.0 | 10.0 | +6.00 |
| ▲ `markdown_fidelity` | 4.2 | 8.7 | +4.50 |
| ▲ `ux_intuitiveness` | 3.8 | 8.2 | +4.40 |
| ▲ `ui_quality` | 2.5 | 5.7 | +3.20 |
| ▼ `code_total_functions` | 16.0 | 15.0 | -1.00 |

### Gen 2: gen2-jp-font-ui (+2%)

**登録日**: 2026-02-26 22:38
**親バリアント**: `65ef26b4` — gen1-animated-pages
**フィットネス**: 96.7  前世代比: **+2.2** (+2%)

#### スコア

| 指標 | スコア |
| --- | ---: |
| `animation_quality` | 9.80 |
| `code_error_handling_count` | 3.00 |
| `code_file_count` | 12.00 |
| `code_total_components` | 10.00 |
| `code_total_functions` | 15.00 |
| `code_total_lines` | 1100.00 |
| `code_type_annotation_count` | 228.00 |
| `feature_completeness` | 10.00 |
| `markdown_fidelity` | 8.70 |
| `ui_quality` | 6.80 |
| `ux_intuitiveness` | 8.10 |
| `weighted_total` | 43.30 |

#### 機能検出

- ✅ エディタ
- ✅ Markdownパース
- ✅ スライド分割
- ✅ プレビューパネル
- ✅ ナビゲーション
- ✅ 発表モード
- ✅ キーボードナビ
- ✅ テーマ切替
- ✅ Zustandストア
- ✅ スライド番号表示

**ビルド**: ✅ 成功

#### 主な変化

| 指標 | 親 | 本世代 | 差分 |
| --- | ---: | ---: | ---: |
| ▲ `code_total_lines` | 1049.0 | 1100.0 | +51.00 |
| ▲ `code_type_annotation_count` | 207.0 | 228.0 | +21.00 |
| ▲ `weighted_total` | 42.1 | 43.3 | +1.20 |
| ▲ `ui_quality` | 5.7 | 6.8 | +1.10 |
| ▲ `code_error_handling_count` | 2.0 | 3.0 | +1.00 |
| ▲ `code_total_components` | 9.0 | 10.0 | +1.00 |
| ▼ `ux_intuitiveness` | 8.2 | 8.1 | -0.10 |

### Gen 3: gen3-grid-aspect (+1%)

**登録日**: 2026-02-27 00:59
**親バリアント**: `7679d483` — gen2-jp-font-ui
**フィットネス**: 97.8  前世代比: **+1.1** (+1%)

#### スコア

| 指標 | スコア |
| --- | ---: |
| `animation_quality` | 9.80 |
| `code_error_handling_count` | 3.00 |
| `code_file_count` | 12.00 |
| `code_total_components` | 10.00 |
| `code_total_functions` | 15.00 |
| `code_total_lines` | 1113.00 |
| `code_type_annotation_count` | 238.00 |
| `feature_completeness` | 10.00 |
| `markdown_fidelity` | 8.70 |
| `ui_quality` | 7.30 |
| `ux_intuitiveness` | 8.10 |
| `weighted_total` | 43.90 |

#### 機能検出

- ✅ エディタ
- ✅ Markdownパース
- ✅ スライド分割
- ✅ プレビューパネル
- ✅ ナビゲーション
- ✅ 発表モード
- ✅ キーボードナビ
- ✅ テーマ切替
- ✅ Zustandストア
- ✅ スライド番号表示

**ビルド**: ✅ 成功

#### 主な変化

| 指標 | 親 | 本世代 | 差分 |
| --- | ---: | ---: | ---: |
| ▲ `code_total_lines` | 1100.0 | 1113.0 | +13.00 |
| ▲ `code_type_annotation_count` | 228.0 | 238.0 | +10.00 |
| ▲ `weighted_total` | 43.3 | 43.9 | +0.60 |
| ▲ `ui_quality` | 6.8 | 7.3 | +0.50 |

<!-- evolve:analysis -->

---

## 世代間分析

### フィットネス推移

```
Gen  0: █████████████░░░░░░░░░░░░░░░░░ 44.3  [gen0-baseline]
Gen  1: ████████████████████████████░░ 94.5  [gen1-animated-pages]
Gen  2: █████████████████████████████░ 96.7  [gen2-jp-font-ui]
Gen  3: ██████████████████████████████ 97.8  [gen3-grid-aspect]
Gen  4: ██████████████████████████████ TBD   [gen4-spring-ui]
```

### 指標トレンド

| 指標 | Gen 0 | Gen 1 | Gen 2 | Gen 3 | 変化 |
| --- | ---: | ---: | ---: | ---: | --- |
| `animation_quality` | 2.9 | 9.8 | 9.8 | 9.8 | ▲ +6.9 |
| `feature_completeness` | 4.0 | 10.0 | 10.0 | 10.0 | ▲ +6.0 |
| `ui_quality` | 2.5 | 5.7 | 6.8 | 7.3 | ▲ +4.8 |
| `code_error_handling_count` | 2.0 | 2.0 | 3.0 | 3.0 | ▲ +1.0 |
| `code_file_count` | 12.0 | 12.0 | 12.0 | 12.0 | — |
| `code_total_components` | 9.0 | 9.0 | 10.0 | 10.0 | ▲ +1.0 |
| `code_total_functions` | 16.0 | 15.0 | 15.0 | 15.0 | ▼ -1.0 |
| `code_total_lines` | 893.0 | 1049.0 | 1100.0 | 1113.0 | ▲ +220.0 |
| `code_type_annotation_count` | 165.0 | 207.0 | 228.0 | 238.0 | ▲ +73.0 |
| `markdown_fidelity` | 4.2 | 8.7 | 8.7 | 8.7 | ▲ +4.5 |
| `ux_intuitiveness` | 3.8 | 8.2 | 8.1 | 8.1 | ▲ +4.3 |
| `weighted_total` | 16.9 | 42.1 | 43.3 | 43.9 | ▲ +27.0 |

### 考察

- Gen 0 → Gen 3 で フィットネスが **44.3 → 97.8** に改善 （**+121%**）
- MAP-Elites カバレッジ: **0.3%**。 `evolve_code context --mode explore` で未探索ニッチを埋めることを推奨。
- 最良バリアント `gen3-grid-aspect` の最も低い評価軸は `ui_quality` (7.3)。この軸を重点的に改善することで更なる向上が期待できる。
<!-- evolve:end -->