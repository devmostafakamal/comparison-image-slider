import React, { useRef, useEffect, useState } from "react";

export default function ImageComparison({
  before,
  after,
  width = 600,
  height = 350,
}) {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const sliderRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

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

    const overlay = overlayRef.current;
    const slider = sliderRef.current;
    const container = containerRef.current;
    if (!overlay || !slider || !container) return;

    let clicked = false;
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    // Initial position (middle)
    let currentX = w / 2;
    overlay.style.clipPath = `inset(0 ${w - currentX}px 0 0)`;
    slider.style.left = `${currentX - slider.offsetWidth / 2}px`;
    slider.style.top = `${h / 2 - slider.offsetHeight / 2}px`;

    const getCursorPos = (e) => {
      e = e.changedTouches ? e.changedTouches[0] : e;
      const rect = container.getBoundingClientRect();
      let x = e.pageX - rect.left - window.pageXOffset;
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

    return () => {
      slider.removeEventListener("mousedown", slideReady);
      slider.removeEventListener("touchstart", slideReady);
      window.removeEventListener("mouseup", slideFinish);
      window.removeEventListener("touchend", slideFinish);
      window.removeEventListener("mousemove", slideMove);
      window.removeEventListener("touchmove", slideMove);
    };
  }, [loaded]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl shadow-lg bg-gray-200"
      style={{ width, height }}
    >
      {/* Left (before) image */}
      <img
        src={before}
        alt="before"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Right (after) image, fixed — clip only */}
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
