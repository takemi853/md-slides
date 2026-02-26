"use client";

import Editor from "@/components/Editor";
import SlidePreview from "@/components/SlidePreview";
import Toolbar from "@/components/Toolbar";
import { useSlides } from "@/hooks/useSlides";
import { getTheme } from "@/lib/themes";

export default function Home() {
  const { theme } = useSlides();
  const currentTheme = getTheme(theme);

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: currentTheme.bg }}
    >
      <Toolbar />
      {/* Split pane: editor column | preview column */}
      <div className="grid grid-cols-2 flex-1 overflow-hidden">
        {/* Left pane: Markdown editor */}
        <div
          className="overflow-hidden"
          style={{ borderRight: `1px solid ${currentTheme.border}` }}
        >
          <Editor />
        </div>

        {/* Right pane: Slide preview */}
        <div className="overflow-hidden">
          <SlidePreview />
        </div>
      </div>
    </div>
  );
}
