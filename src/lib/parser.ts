import { marked } from "marked";
import type { Slide } from "@/types";

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function parseMarkdownToSlides(markdown: string): Slide[] {
  const sections = markdown.split(/\n---\n/);

  return sections
    .map((section, index) => {
      const trimmed = section.trim();
      if (!trimmed) return null;

      const html = marked.parse(trimmed) as string;

      return {
        id: `slide-${index}`,
        html,
        rawMarkdown: trimmed,
        index,
      };
    })
    .filter((s): s is Slide => s !== null);
}
