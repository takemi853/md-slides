"use client";

import { motion } from "framer-motion";
import { useSlides } from "@/hooks/useSlides";
import { getTheme } from "@/lib/themes";

export default function Editor() {
  const { markdown, setMarkdown, theme } = useSlides();
  const currentTheme = getTheme(theme);

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: currentTheme.bg }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
        style={{
          borderBottom: `1px solid ${currentTheme.border}`,
          color: currentTheme.text,
          opacity: 0.6,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          boxShadow: `inset 0 -1px 0 ${currentTheme.border}`,
          fontFamily: "var(--font-noto-jp), var(--font-geist-sans), sans-serif",
        }}
      >
        Markdown Editor
      </motion.div>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="flex-1 resize-none outline-none font-mono text-sm p-4 leading-relaxed"
        style={{
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
          caretColor: currentTheme.accent,
          fontFamily: "var(--font-noto-jp), var(--font-geist-mono), 'Courier New', monospace",
        }}
        placeholder={`# スライドタイトル / Slide Title\n\nMarkdownで内容を書いてください...\n\n---\n\n# 2枚目 / Second Slide\n\n--- でスライドを分割`}
        spellCheck={false}
      />
    </div>
  );
}
