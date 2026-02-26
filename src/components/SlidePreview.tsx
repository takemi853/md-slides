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
            boxShadow: `0 4px 24px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)`,
            background: `radial-gradient(ellipse at 50% 0%, ${currentTheme.heading}08 0%, transparent 70%), ${currentTheme.bg}`,
          }}
        >
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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

        <div className="flex gap-1.5 items-center" style={{ color: currentTheme.text, fontSize: "0.85rem" }}>
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                useSlides.getState().setCurrentIndex(i);
              }}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.85 }}
              className="w-2 h-2 rounded-full cursor-pointer"
              style={{
                backgroundColor: i === currentIndex ? currentTheme.accent : currentTheme.border,
                transition: "background-color 0.2s",
                boxShadow: i === currentIndex ? `0 0 6px ${currentTheme.accent}88` : "none",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{ marginLeft: "0.5rem" }}
          >
            {slides.length > 0 ? currentIndex + 1 : 0} / {slides.length}
          </motion.span>
        </div>

        <motion.button
          onClick={handleNext}
          disabled={currentIndex === slides.length - 1}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
