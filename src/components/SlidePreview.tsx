"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Slide from "./Slide";
import { useSlides } from "@/hooks/useSlides";
import { getTheme } from "@/lib/themes";

export default function SlidePreview() {
  const { slides, currentIndex, theme, nextSlide, prevSlide } = useSlides();
  const [direction, setDirection] = useState(1);
  const currentTheme = getTheme(theme);

  const handleNext = () => { setDirection(1); nextSlide(); };
  const handlePrev = () => { setDirection(-1); prevSlide(); };
  const currentSlide = slides[currentIndex];

  const progress = slides.length > 1 ? currentIndex / (slides.length - 1) : 1;

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: currentTheme.bg,
        fontFamily: "var(--font-noto-jp), var(--font-geist-sans), sans-serif",
      }}
    >
      {/* Slide display — 16:9 aspect ratio */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div
          className="relative w-full overflow-hidden aspect-[16/9]"
          style={{
            border: `1px solid ${currentTheme.border}`,
            borderRadius: "0.5rem",
            boxShadow: `0 4px 24px rgba(0,0,0,0.28), 0 1px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)`,
            background: currentTheme.bg,
          }}
        >
          {/* Animated progress bar */}
          <motion.div
            className="absolute top-0 left-0 h-[3px] z-10"
            style={{
              background: `linear-gradient(90deg, ${currentTheme.accent}, ${currentTheme.heading})`,
              transformOrigin: "left",
              boxShadow: `0 0 8px ${currentTheme.accent}88`,
              borderRadius: "0 2px 2px 0",
            }}
            animate={{ scaleX: progress }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
            initial={false}
          />

          {slides.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ color: currentTheme.text, opacity: 0.5 }}
            >
              <p>No slides yet. Start writing Markdown!</p>
            </motion.div>
          ) : (
            <AnimatePresence custom={direction} mode="wait">
              {currentSlide && (
                <Slide
                  key={currentSlide.id}
                  slide={currentSlide}
                  theme={currentTheme}
                  direction={direction}
                />
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Navigation bar */}
      <div
        className="flex items-center justify-between px-4 py-3 sm:px-6"
        style={{
          borderTop: `1px solid ${currentTheme.border}`,
          boxShadow: `inset 0 1px 0 ${currentTheme.border}`,
        }}
      >
        <motion.button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          whileHover={{ scale: 1.06, x: -2 }}
          whileTap={{ scale: 0.94 }}
          className="px-4 py-2 rounded font-medium text-sm disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentTheme.accent,
            color: currentTheme.bg,
            boxShadow: `0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)`,
            fontFamily: "var(--font-noto-jp), var(--font-geist-sans), sans-serif",
          }}
        >
          ← Prev
        </motion.button>

        <div className="flex gap-2 items-center" style={{ color: currentTheme.text, fontSize: "0.85rem" }}>
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                useSlides.getState().setCurrentIndex(i);
              }}
              whileHover={{ scale: 1.6 }}
              whileTap={{ scale: 0.8 }}
              animate={{
                width: i === currentIndex ? 20 : 8,
                backgroundColor: i === currentIndex ? currentTheme.accent : currentTheme.border,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="h-2 rounded-full cursor-pointer"
              style={{
                boxShadow: i === currentIndex ? `0 0 8px ${currentTheme.accent}99` : "none",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{ marginLeft: "0.25rem", minWidth: "3rem", textAlign: "right" }}
          >
            {slides.length > 0 ? currentIndex + 1 : 0} / {slides.length}
          </motion.span>
        </div>

        <motion.button
          onClick={handleNext}
          disabled={currentIndex === slides.length - 1}
          whileHover={{ scale: 1.06, x: 2 }}
          whileTap={{ scale: 0.94 }}
          className="px-4 py-2 rounded font-medium text-sm disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentTheme.accent,
            color: currentTheme.bg,
            boxShadow: `0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)`,
            fontFamily: "var(--font-noto-jp), var(--font-geist-sans), sans-serif",
          }}
        >
          Next →
        </motion.button>
      </div>
    </div>
  );
}
