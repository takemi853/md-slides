"use client";

import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
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
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded font-medium text-sm transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentTheme.accent,
            color: currentTheme.bg,
          }}
        >
          ← Prev
        </button>

        <div
          className="flex gap-1.5 items-center"
          style={{ color: currentTheme.text, opacity: 0.6, fontSize: "0.85rem" }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                useSlides.getState().setCurrentIndex(i);
              }}
              className="w-2 h-2 rounded-full transition-all cursor-pointer"
              style={{
                backgroundColor:
                  i === currentIndex ? currentTheme.accent : currentTheme.border,
                transform: i === currentIndex ? "scale(1.4)" : "scale(1)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === slides.length - 1}
          className="px-4 py-2 rounded font-medium text-sm transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentTheme.accent,
            color: currentTheme.bg,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
