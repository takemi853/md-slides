import { marked } from "marked";
import type { Slide } from "@/types";

// Custom renderer for enhanced HTML output
const renderer = {
  hr() {
    return '<hr class="slide-hr" />';
  },
  link({ href, title, text }: { href: string; title?: string | null; text: string }) {
    const isExternal = href?.startsWith("http");
    const titleAttr = title ? ` title="${title}"` : "";
    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${href}"${titleAttr}${targetAttr} class="slide-link">${text}</a>`;
  },
  image({ href, title, text }: { href: string; title?: string | null; text: string }) {
    const alt = text ?? "";
    const titleAttr = title ? ` title="${title}"` : "";
    const caption = title ? `<figcaption class="slide-figcaption">${title}</figcaption>` : "";
    return `<figure class="slide-figure"><img src="${href}" alt="${alt}"${titleAttr} class="slide-img" />${caption}</figure>`;
  },
};

marked.use({
  renderer,
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
