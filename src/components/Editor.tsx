"use client";

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
      <div
        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
        style={{
          borderBottom: `1px solid ${currentTheme.border}`,
          color: currentTheme.text,
          opacity: 0.6,
        }}
      >
        Markdown Editor
      </div>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="flex-1 resize-none outline-none font-mono text-sm p-4 leading-relaxed"
        style={{
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
          caretColor: currentTheme.accent,
        }}
        placeholder={`# Slide Title\n\nWrite your content here...\n\n---\n\n# Second Slide\n\nUse --- to separate slides`}
        spellCheck={false}
      />
    </div>
  );
}
