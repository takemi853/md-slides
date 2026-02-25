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

  const handleNext = () => {
    setDirection(1);
    nextSlide();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevSlide();
  };

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: currentTheme.bg }}
    >
      {/* Slide area */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{
          border: `1px solid ${currentTheme.border}`,
          borderRadius: "0.5rem",
          margin: "1rem",
          boxShadow: `0 4px 24px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15)`,
        }}
      >
        {slides.length === 0 ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: currentTheme.text, opacity: 0.5 }}
          >
            <p>No slides yet. Start writing Markdown!</p>
          </div>
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

      {/* Navigation */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: `1px solid ${currentTheme.border}` }}
      >
        <motion.button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded font-medium text-sm transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentTheme.accent,
            color: currentTheme.bg,
            boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
          }}
        >
          ← Prev
        </motion.button>

        <div
          className="flex gap-1.5 items-center"
          style={{ color: currentTheme.text, fontSize: "0.85rem" }}
        >
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                useSlides.getState().setCurrentIndex(i);
              }}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.9 }}
              className="w-2 h-2 rounded-full cursor-pointer"
              style={{
                backgroundColor:
                  i === currentIndex ? currentTheme.accent : currentTheme.border,
                transform: i === currentIndex ? "scale(1.4)" : "scale(1)",
                transition: "background-color 0.2s, transform 0.2s",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
          <span style={{ opacity: 0.6, marginLeft: "0.5rem" }}>
            {slides.length > 0 ? currentIndex + 1 : 0} / {slides.length}
          </span>
        </div>

        <motion.button
          onClick={handleNext}
          disabled={currentIndex === slides.length - 1}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded font-medium text-sm transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentTheme.accent,
            color: currentTheme.bg,
            boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
          }}
        >
          Next →
        </motion.button>
      </div>
    </div>
  );
}
