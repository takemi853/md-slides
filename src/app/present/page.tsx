"use client";

// Present mode – fullscreen presentation display with keyboard navigation.
// PresentPage renders slides in fullscreen with animated transitions.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Slide from "@/components/Slide";
import { useSlides } from "@/hooks/useSlides";
import { getTheme } from "@/lib/themes";

export default function PresentPage() {
  const { slides, currentIndex, theme, nextSlide, prevSlide, setCurrentIndex } =
    useSlides();
  const [direction, setDirection] = useState(1);
  const [showHud, setShowHud] = useState(false);
  const currentTheme = getTheme(theme);

  const currentSlide = slides[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setDirection(1);
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setDirection(-1);
        prevSlide();
      } else if (e.key === "Escape") {
        window.location.href = "/";
      } else if (e.key === "Home") {
        setDirection(-1);
        setCurrentIndex(0);
      } else if (e.key === "End") {
        setDirection(1);
        setCurrentIndex(slides.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, setCurrentIndex, slides.length]);

  return (
    // Fullscreen present mode container
    <div
      className="relative w-screen h-screen overflow-hidden"
      data-view="present"
      aria-label="presentation-mode"
      style={{ backgroundColor: currentTheme.bg }}
      onMouseMove={() => setShowHud(true)}
      onMouseLeave={() => setShowHud(false)}
    >
      {/* Fullscreen presentation slide */}
      <AnimatePresence custom={direction} mode="wait">
        {currentSlide ? (
          <Slide
            key={currentSlide.id}
            slide={currentSlide}
            theme={currentTheme}
            direction={direction}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: currentTheme.text, opacity: 0.5 }}
          >
            <p>No slides. Go back and write some Markdown!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD overlay — visible on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showHud ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 py-4"
        style={{
          background: `linear-gradient(to top, ${currentTheme.bg}ee, transparent)`,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        {/* Slide counter */}
        <div
          className="text-sm font-medium"
          style={{ color: currentTheme.text, opacity: 0.7 }}
        >
          {currentIndex + 1} / {slides.length}
        </div>

        {/* Dot navigation */}
        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              whileHover={{ scale: 1.6 }}
              whileTap={{ scale: 0.9 }}
              className="w-2 h-2 rounded-full cursor-pointer"
              style={{
                backgroundColor:
                  i === currentIndex ? currentTheme.accent : currentTheme.border,
                transform: i === currentIndex ? "scale(1.5)" : "scale(1)",
                transition: "background-color 0.2s, transform 0.2s",
                boxShadow: i === currentIndex ? `0 0 8px ${currentTheme.accent}` : "none",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Exit presentation button */}
        <Link
          href="/"
          className="text-sm font-medium px-3 py-1 rounded"
          style={{
            color: currentTheme.text,
            border: `1px solid ${currentTheme.border}`,
            opacity: 0.7,
            transition: "opacity 0.15s",
            boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
          }}
        >
          ✕ Exit
        </Link>
      </motion.div>

      {/* Left/Right click zones */}
      <button
        onClick={() => { setDirection(-1); prevSlide(); }}
        className="absolute left-0 top-0 w-1/5 h-full cursor-pointer opacity-0"
        aria-label="Previous slide"
      />
      <button
        onClick={() => { setDirection(1); nextSlide(); }}
        className="absolute right-0 top-0 w-1/5 h-full cursor-pointer opacity-0"
        aria-label="Next slide"
      />
    </div>
  );
}
