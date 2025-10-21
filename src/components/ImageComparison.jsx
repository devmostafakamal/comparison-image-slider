// src/components/ImageComparison.jsx
import React, { useRef, useEffect, useState } from "react";

export default function ImageComparison({ before, after }) {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const sliderRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Ensure images are loaded
  useEffect(() => {
    const imgs = containerRef.current.querySelectorAll("img");
    let count = 0;
    imgs.forEach((img) => {
      if (img.complete) count++;
      else
        img.onload = () => {
          count++;
          if (count === 2) setLoaded(true);
        };
    });
    if (count === 2) setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const container = containerRef.current;
    const overlay = overlayRef.current;
    const slider = sliderRef.current;
    if (!container || !overlay || !slider) return;

    let clicked = false;
    let w = 0;
    let h = 0;

    const updateSlider = () => {
      w = container.offsetWidth;
      h = container.offsetHeight;

      // Initial position (middle)
      const currentX = w / 2;
      overlay.style.clipPath = `inset(0 ${w - currentX}px 0 0)`;
      slider.style.left = `${currentX - slider.offsetWidth / 2}px`;
      slider.style.top = `${h / 2 - slider.offsetHeight / 2}px`;
    };

    updateSlider();

    const getCursorPos = (e) => {
      e = e.changedTouches ? e.changedTouches[0] : e;
      const rect = container.getBoundingClientRect();
      let x = e.clientX - rect.left;
      if (x < 0) x = 0;
      if (x > w) x = w;
      return x;
    };

    const slide = (x) => {
      overlay.style.clipPath = `inset(0 ${w - x}px 0 0)`;
      slider.style.left = `${x - slider.offsetWidth / 2}px`;
    };

    const slideMove = (e) => {
      if (!clicked) return;
      slide(getCursorPos(e));
    };

    const slideReady = (e) => {
      e.preventDefault();
      clicked = true;
      window.addEventListener("mousemove", slideMove);
      window.addEventListener("touchmove", slideMove);
    };

    const slideFinish = () => {
      clicked = false;
      window.removeEventListener("mousemove", slideMove);
      window.removeEventListener("touchmove", slideMove);
    };

    slider.addEventListener("mousedown", slideReady);
    slider.addEventListener("touchstart", slideReady);
    window.addEventListener("mouseup", slideFinish);
    window.addEventListener("touchend", slideFinish);
    window.addEventListener("resize", updateSlider);

    return () => {
      slider.removeEventListener("mousedown", slideReady);
      slider.removeEventListener("touchstart", slideReady);
      window.removeEventListener("mouseup", slideFinish);
      window.removeEventListener("touchend", slideFinish);
      window.removeEventListener("mousemove", slideMove);
      window.removeEventListener("touchmove", slideMove);
      window.removeEventListener("resize", updateSlider);
    };
  }, [loaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full sm:w-[90%] md:w-full max-w-2xl mx-auto overflow-hidden rounded-xl shadow-lg bg-gray-200"
      style={{ aspectRatio: "16/9" }}
    >
      {/* Before Image */}
      <img
        src={before}
        alt="before"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      />

      {/* After Image overlay */}
      <div ref={overlayRef} className="absolute inset-0">
        <img
          src={after}
          alt="after"
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      </div>

      {/* Slider handle */}
      <div
        ref={sliderRef}
        className="absolute z-20 w-8 h-8 bg-blue-500/70 rounded-full shadow-lg cursor-ew-resize border-2 border-white"
      />
    </div>
  );
}
