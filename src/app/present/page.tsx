"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Slide from "@/components/Slide";
import { useSlides } from "@/hooks/useSlides";
import { getTheme } from "@/lib/themes";

export default function PresentPage() {
  const { slides, currentIndex, theme, nextSlide, prevSlide, setCurrentIndex } =
    useSlides();
  const [direction, setDirection] = useState(1);
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
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ backgroundColor: currentTheme.bg }}
    >
      {/* Fullscreen slide */}
      <AnimatePresence custom={direction} mode="wait">
        {currentSlide ? (
          <Slide
            key={currentSlide.id}
            slide={currentSlide}
            theme={currentTheme}
            direction={direction}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: currentTheme.text, opacity: 0.5 }}
          >
            <p>No slides. Go back and write some Markdown!</p>
          </div>
        )}
      </AnimatePresence>

      {/* HUD overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 py-4 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to top, ${currentTheme.bg}cc, transparent)`,
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
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className="w-2 h-2 rounded-full transition-all cursor-pointer"
              style={{
                backgroundColor:
                  i === currentIndex ? currentTheme.accent : currentTheme.border,
                transform: i === currentIndex ? "scale(1.5)" : "scale(1)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Exit button */}
        <Link
          href="/"
          className="text-sm font-medium px-3 py-1 rounded transition-all"
          style={{
            color: currentTheme.text,
            border: `1px solid ${currentTheme.border}`,
            opacity: 0.7,
          }}
        >
          ✕ Exit
        </Link>
      </div>

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
