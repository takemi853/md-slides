import type { Theme, ThemeName } from "@/types";

export const themes: Record<ThemeName, Theme> = {
  dark: {
    name: "dark",
    label: "Dark",
    bg: "#1a1a2e",
    text: "#e2e8f0",
    heading: "#93c5fd",
    accent: "#60a5fa",
    codeBg: "#0f172a",
    codeText: "#7dd3fc",
    border: "#334155",
  },
  light: {
    name: "light",
    label: "Light",
    bg: "#ffffff",
    text: "#1e293b",
    heading: "#1e40af",
    accent: "#3b82f6",
    codeBg: "#f1f5f9",
    codeText: "#0f172a",
    border: "#cbd5e1",
  },
  manim: {
    name: "manim",
    label: "Manim",
    bg: "#000000",
    text: "#ffffff",
    heading: "#ffff00",
    accent: "#00ffff",
    codeBg: "#111111",
    codeText: "#00ff88",
    border: "#333333",
  },
};

export function getTheme(name: ThemeName): Theme {
  return themes[name];
}
