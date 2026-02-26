"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import type { Slide as SlideType, Theme } from "@/types";

interface SlideProps {
  slide: SlideType;
  theme: Theme;
  direction?: number;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

const containerVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      ...springTransition,
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const headingVariants: Variants = {
  enter: { opacity: 0, y: -18, scale: 0.94 },
  center: {
    opacity: 1, y: 0, scale: 1,
    transition: { ...springTransition },
  },
  exit: {
    opacity: 0, y: 10, scale: 0.92,
    transition: { duration: 0.18 },
  },
};

const listVariants: Variants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const listItemVariants: Variants = {
  enter: { opacity: 0, x: -20 },
  center: {
    opacity: 1, x: 0,
    transition: { ...springTransition, stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0, x: 16,
    transition: { duration: 0.15 },
  },
};

const codeVariants: Variants = {
  enter: { opacity: 0, y: 14, scale: 0.98 },
  center: {
    opacity: 1, y: 0, scale: 1,
    transition: { ...springTransition },
  },
  exit: {
    opacity: 0, y: -8,
    transition: { duration: 0.18 },
  },
};

const tableVariants: Variants = {
  enter: { opacity: 0, y: 12 },
  center: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

const defaultVariants: Variants = {
  enter: { opacity: 0, y: 10 },
  center: {
    opacity: 1, y: 0,
    transition: { ...springTransition, stiffness: 300, damping: 32 },
  },
  exit: {
    opacity: 0, y: -6,
    transition: { duration: 0.18 },
  },
};

// Expanded motion tag map for per-element semantic animation
const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  p: motion.p,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  pre: motion.pre,
  blockquote: motion.blockquote,
  table: motion.table,
  section: motion.section,
  article: motion.article,
  figure: motion.figure,
  hr: motion.hr,
} as const;

type MotionTagKey = keyof typeof motionTags;

export default function Slide({ slide, theme, direction = 1 }: SlideProps) {
  const [elements, setElements] = useState<string[]>([]);

  useEffect(() => {
    const div = document.createElement("div");
    div.innerHTML = slide.html;
    const children = Array.from(div.children).map((el) => el.outerHTML);
    setElements(children);
  }, [slide.html]);

  return (
    <motion.div
      key={slide.id}
      custom={direction}
      variants={containerVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0 flex flex-col justify-center px-12 py-10 overflow-hidden"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: "var(--font-noto-jp), var(--font-geist-sans), sans-serif",
        // Expose theme tokens as CSS custom properties for globals.css
        "--slide-accent": theme.accent,
        "--slide-heading": theme.heading,
        "--slide-border": theme.border,
      } as React.CSSProperties}
    >
      {/* Subtle radial glow at top-center */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 40% at 50% 0%, ${theme.heading}0c 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <AnimatePresence mode="wait">
        {elements.map((html, i) => (
          <AnimatedElement key={i} html={html} theme={theme} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

interface AnimatedElementProps {
  html: string;
  theme: Theme;
}

function getElementVariants(tag: string): Variants {
  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) return headingVariants;
  if (tag === "ul" || tag === "ol") return listVariants;
  if (tag === "li") return listItemVariants;
  if (tag === "pre") return codeVariants;
  if (tag === "table") return tableVariants;
  return defaultVariants;
}

function AnimatedElement({ html, theme }: AnimatedElementProps) {
  const tag = html.match(/^<(\w+)/)?.[1] ?? "";
  const variants = getElementVariants(tag);
  const MotionComponent = (motionTags[tag as MotionTagKey] ?? motion.div) as React.ElementType;

  return (
    <MotionComponent
      variants={variants}
      className="slide-element"
      style={{
        ...getElementStyle(tag, theme),
        fontFamily: "var(--font-noto-jp), var(--font-geist-sans), sans-serif",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function getElementStyle(tag: string, theme: Theme): React.CSSProperties {
  const base: React.CSSProperties = { marginBottom: "0.65rem" };

  if (tag === "h1") {
    return {
      ...base,
      color: theme.heading,
      fontSize: "2.5rem",
      fontWeight: 900,
      lineHeight: 1.15,
      marginBottom: "1rem",
      letterSpacing: "-0.025em",
      textShadow: `0 0 48px ${theme.heading}44, 0 2px 8px rgba(0,0,0,0.4)`,
    };
  }
  if (tag === "h2") {
    return {
      ...base,
      color: theme.heading,
      fontSize: "1.875rem",
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: "-0.015em",
      textShadow: `0 0 24px ${theme.heading}33`,
    };
  }
  if (tag === "h3") {
    return {
      ...base,
      color: theme.accent,
      fontSize: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    };
  }
  if (tag === "h4") {
    return {
      ...base,
      color: theme.accent,
      fontSize: "1.25rem",
      fontWeight: 600,
      opacity: 0.9,
    };
  }
  if (tag === "h5" || tag === "h6") {
    return {
      ...base,
      color: theme.text,
      fontSize: "1.1rem",
      fontWeight: 600,
      opacity: 0.8,
    };
  }
  if (tag === "pre") {
    return {
      ...base,
      backgroundColor: theme.codeBg,
      color: theme.codeText,
      padding: "1rem 1.25rem",
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
      overflowX: "auto",
      border: `1px solid ${theme.border}`,
      fontFamily: "'Courier New', Courier, monospace",
      boxShadow: `0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`,
    };
  }
  if (tag === "blockquote") {
    return {
      ...base,
      paddingLeft: "1rem",
      color: theme.text,
      opacity: 0.87,
      fontStyle: "italic",
    };
  }
  if (tag === "table") {
    return {
      ...base,
      width: "100%",
      borderCollapse: "collapse" as React.CSSProperties["borderCollapse"],
    };
  }
  if (tag === "hr") {
    return {
      ...base,
      border: "none",
      height: "1px",
      opacity: 0.5,
    };
  }
  if (tag === "figure") {
    return {
      ...base,
      textAlign: "center" as React.CSSProperties["textAlign"],
      margin: "0.75rem auto",
    };
  }
  return base;
}
