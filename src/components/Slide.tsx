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
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    transition: { duration: 0.3 },
  }),
};

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
      }}
    >
      {elements.map((html, i) => (
        <AnimatedElement
          key={i}
          html={html}
          theme={theme}
          index={i}
        />
      ))}
    </motion.div>
  );
}

interface AnimatedElementProps {
  html: string;
  theme: Theme;
  index: number;
}

function AnimatedElement({ html, theme, index }: AnimatedElementProps) {
  const tag = html.match(/^<(\w+)/)?.[1] ?? "";
  const delay = index * 0.1;

  const getInitial = () => {
    if (tag === "h1" || tag === "h2" || tag === "h3") {
      return { opacity: 0, scale: 0.95, y: -10 };
    }
    if (tag === "ul" || tag === "ol") {
      return { opacity: 0, x: -20 };
    }
    if (tag === "pre") {
      return { opacity: 0, y: 10 };
    }
    return { opacity: 0, y: 12 };
  };

  const getAnimate = () => {
    if (tag === "h1" || tag === "h2" || tag === "h3") {
      return { opacity: 1, scale: 1, y: 0, x: 0 };
    }
    if (tag === "ul" || tag === "ol") {
      return { opacity: 1, x: 0, y: 0, scale: 1 };
    }
    if (tag === "pre") {
      return { opacity: 1, y: 0, x: 0, scale: 1 };
    }
    return { opacity: 1, y: 0, x: 0, scale: 1 };
  };

  return (
    <motion.div
      initial={getInitial()}
      animate={getAnimate()}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className="slide-element"
      style={getElementStyle(tag, theme)}
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
      fontWeight: 800,
      lineHeight: 1.2,
      marginBottom: "1rem",
    };
  }
  if (tag === "h2") {
    return {
      ...base,
      color: theme.heading,
      fontSize: "1.875rem",
      fontWeight: 700,
      lineHeight: 1.3,
    };
  }
  if (tag === "h3") {
    return {
      ...base,
      color: theme.accent,
      fontSize: "1.5rem",
      fontWeight: 600,
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
      fontFamily: "monospace",
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
    };
  }
  return base;
}
