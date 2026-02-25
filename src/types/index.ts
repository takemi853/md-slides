export interface Slide {
  id: string;
  html: string;
  rawMarkdown: string;
  index: number;
}

export type ThemeName = "dark" | "light" | "manim";

export interface Theme {
  name: ThemeName;
  label: string;
  bg: string;
  text: string;
  heading: string;
  accent: string;
  codeBg: string;
  codeText: string;
  border: string;
}

export type AnimationPreset = "fade" | "slide" | "zoom";
