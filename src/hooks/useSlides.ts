"use client";

/**
 * useSlides - Global state store powered by zustand.
 * Initializes slides via create() from the zustand package.
 */
import { create } from "zustand";
import { parseMarkdownToSlides } from "@/lib/parser";
import type { Slide, ThemeName } from "@/types";

const DEFAULT_MARKDOWN = `# Welcome to md-slides

Transform your **Markdown** into animated slides

- Fast live preview
- Manim-style animations
- Multiple themes

---

## Getting Started

Write your content using Markdown

\`\`\`typescript
const slide = {
  title: "My Slide",
  content: "Hello World"
};
\`\`\`

---

## Features

- **Editor** — live Markdown editing
- **Preview** — real-time slide preview
- **Present** — fullscreen presentation mode
- **Themes** — Dark, Light, and Manim

---

## Present Mode

Press the **Present** button or navigate to \`/present\`

Use **← →** arrow keys to navigate slides

---

# Thank You!

Start editing the Markdown on the left to create your slides
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
