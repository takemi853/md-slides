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
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        <div
          className="flex-1 overflow-hidden"
          style={{ borderRight: `1px solid ${currentTheme.border}` }}
        >
          <Editor />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 overflow-hidden">
          <SlidePreview />
        </div>
      </div>
    </div>
  );
}
