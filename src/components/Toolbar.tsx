"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSlides } from "@/hooks/useSlides";
import { getTheme, themes } from "@/lib/themes";
import type { ThemeName } from "@/types";

export default function Toolbar() {
  const { slides, currentIndex, theme, setTheme } = useSlides();
  const currentTheme = getTheme(theme);

  return (
    <div
      className="flex items-center justify-between px-4 py-2 text-sm"
      style={{
        backgroundColor: currentTheme.bg,
        borderBottom: `1px solid ${currentTheme.border}`,
        color: currentTheme.text,
        boxShadow: `0 1px 8px rgba(0,0,0,0.2), inset 0 -1px 0 ${currentTheme.border}`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        fontFamily: "var(--font-noto-jp), var(--font-geist-sans), sans-serif",
      }}
    >
      {/* Left: App name */}
      <div className="flex items-center gap-3">
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="font-bold text-base tracking-tight"
          style={{ color: currentTheme.heading }}
        >
          md-slides
        </motion.span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ opacity: 0.6 }}>
          Slide {slides.length > 0 ? currentIndex + 1 : 0} / {slides.length}
        </span>
      </div>

      {/* Center: Theme switcher */}
      <div className="flex items-center gap-1">
        {(Object.keys(themes) as ThemeName[]).map((t) => (
          <motion.button
            key={t}
            onClick={() => setTheme(t)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 rounded text-xs font-medium cursor-pointer"
            style={{
              backgroundColor: t === theme ? currentTheme.accent : "transparent",
              color: t === theme ? currentTheme.bg : currentTheme.text,
              border: `1px solid ${t === theme ? currentTheme.accent : currentTheme.border}`,
              opacity: t === theme ? 1 : 0.7,
              transition: "background-color 0.15s, color 0.15s, border-color 0.15s",
              boxShadow: t === theme ? `0 2px 8px ${currentTheme.accent}44` : "none",
            }}
          >
            {themes[t].label}
          </motion.button>
        ))}
      </div>

      {/* Right: Present mode button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/present"
          className="px-4 py-1.5 rounded font-medium text-xs block"
          style={{
            backgroundColor: currentTheme.heading,
            color: currentTheme.bg,
            boxShadow: `0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
            transition: "opacity 0.15s",
            fontFamily: "var(--font-noto-jp), var(--font-geist-sans), sans-serif",
          }}
        >
          Present →
        </Link>
      </motion.div>
    </div>
  );
}
