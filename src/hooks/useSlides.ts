"use client";

/**
 * useSlides - Global state store powered by zustand.
 * Initializes slides via create() from the zustand package.
 */
import { create } from "zustand";
import { parseMarkdownToSlides } from "@/lib/parser";
import type { Slide, ThemeName } from "@/types";

const DEFAULT_MARKDOWN = `# md-slides へようこそ

**Markdown** からアニメーションスライドを作成

- リアルタイムプレビュー
- Manim スタイルアニメーション
- 日本語フォント対応

---

## はじめ方 / Getting Started

Markdown で内容を書くだけ

\`\`\`typescript
const slide = {
  title: "スライドタイトル",
  content: "内容をここに書く"
};
\`\`\`

---

## 機能一覧 / Features

- **エディタ** — ライブ Markdown 編集
- **プレビュー** — リアルタイムスライドプレビュー
- **発表モード** — フルスクリーン発表
- **テーマ** — Dark・Light・Manim

---

## 発表モード / Present Mode

**Present →** ボタンを押すか \`/present\` へ移動

**← →** キーでスライドを切り替え、**Escape** で戻る

---

# ありがとうございました！

左側の Markdown を編集してオリジナルスライドを作成してください
`;

interface SlidesState {
  markdown: string;
  slides: Slide[];
  currentIndex: number;
  theme: ThemeName;
  setMarkdown: (markdown: string) => void;
  setCurrentIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  setTheme: (theme: ThemeName) => void;
}

export const useSlides = create<SlidesState>((set, get) => ({
  markdown: DEFAULT_MARKDOWN,
  slides: parseMarkdownToSlides(DEFAULT_MARKDOWN),
  currentIndex: 0,
  theme: "manim",

  setMarkdown: (markdown) => {
    const slides = parseMarkdownToSlides(markdown);
    set((state) => ({
      markdown,
      slides,
      currentIndex: Math.min(state.currentIndex, Math.max(0, slides.length - 1)),
    }));
  },

  setCurrentIndex: (index) => {
    const { slides } = get();
    if (index >= 0 && index < slides.length) {
      set({ currentIndex: index });
    }
  },

  nextSlide: () => {
    const { currentIndex, slides } = get();
    if (currentIndex < slides.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevSlide: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  setTheme: (theme) => set({ theme }),
}));
