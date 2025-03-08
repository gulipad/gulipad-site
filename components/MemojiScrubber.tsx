"use client";
import { useEffect, useState } from "react";

const TOTAL_FRAMES = 375;
const FRAME_PATH = "/memoji-frames/frame-";

export default function MemojiScrubberPolar() {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const updateFrame = (clientX: number, clientY: number) => {
      // Calculate the center of the viewport.
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // Compute differences from center.
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      // Standard atan2 gives 0 rad when pointing right, with angles increasing counter-clockwise.
      // We want 0º when the mouse is directly left, so we subtract π.
      let angle = Math.atan2(dy, dx) - Math.PI;
      // Ensure the angle is in [0, 2π).
      if (angle < 0) {
        angle += 2 * Math.PI;
      }
      // Convert the angle from radians to degrees.
      const degrees = angle * (180 / Math.PI);
      // Map the degrees (0 to 360) to a frame index (0 to TOTAL_FRAMES - 1).
      let frame = Math.floor(degrees * (TOTAL_FRAMES / 360));
      if (frame >= TOTAL_FRAMES) {
        frame = TOTAL_FRAMES - 1;
      }
      setCurrentFrame(frame);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateFrame(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length) {
        updateFrame(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={`${FRAME_PATH}${currentFrame}.webp`}
        alt="Interactive Memoji"
        className="max-w-full max-h-full object-contain select-none"
        draggable={false}
      />
    </div>
  );
}
