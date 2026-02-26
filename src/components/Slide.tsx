"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import type { Slide as SlideType, Theme } from "@/types";

interface SlideProps {
  slide: SlideType;
  theme: Theme;
  direction?: number;
}

const containerVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const headingVariants: Variants = {
  enter: { opacity: 0, y: -20, scale: 0.92 },
  center: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0, y: 12, scale: 0.9,
    transition: { duration: 0.2 },
  },
};

const listVariants: Variants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const listItemVariants: Variants = {
  enter: { opacity: 0, x: -24 },
  center: {
    opacity: 1, x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0, x: 20,
    transition: { duration: 0.2 },
  },
};

const codeVariants: Variants = {
  enter: { opacity: 0, y: 16 },
  center: {
    opacity: 1, y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0, y: -10,
    transition: { duration: 0.2 },
  },
};

const defaultVariants: Variants = {
  enter: { opacity: 0, y: 12 },
  center: {
    opacity: 1, y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0, y: -8,
    transition: { duration: 0.2 },
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
      }}
    >
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
  if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") return headingVariants;
  if (tag === "ul" || tag === "ol") return listVariants;
  if (tag === "li") return listItemVariants;
  if (tag === "pre") return codeVariants;
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
  const base: React.CSSProperties = { marginBottom: "0.75rem" };

  if (tag === "h1") {
    return {
      ...base,
      color: theme.heading,
      fontSize: "2.5rem",
      fontWeight: 900,
      lineHeight: 1.2,
      marginBottom: "1rem",
      letterSpacing: "-0.02em",
      textShadow: `0 0 40px ${theme.heading}44`,
    };
  }
  if (tag === "h2") {
    return {
      ...base,
      color: theme.heading,
      fontSize: "1.875rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
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
      boxShadow: `0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
    };
  }
  if (tag === "blockquote") {
    return {
      ...base,
      borderLeft: `4px solid ${theme.accent}`,
      paddingLeft: "1rem",
      color: theme.text,
      opacity: 0.85,
      fontStyle: "italic",
      boxShadow: `inset 2px 0 8px rgba(0,0,0,0.1)`,
    };
  }
  return base;
}
