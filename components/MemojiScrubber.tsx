"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import Spinner from "@/components/Spinner";

type MemojiScrubberProps = {
  onLoaded?: () => void;
  displayMemoji: boolean;
};

const TOTAL_FRAMES = 168;
const FRAME_PATH = "/memoji-frames/frame-";

export default function MemojiScrubber({
  onLoaded,
  displayMemoji,
}: MemojiScrubberProps) {
  // Default frame (zero-indexed 130 corresponds to frame 131)
  const [currentFrame, setCurrentFrame] = useState(130);
  const [allFramesLoaded, setAllFramesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(130);
  const velocityRef = useRef(0);
  // Cursor distance from screen center; governs how strongly we pull toward
  // targetFrame. Starts at Infinity so behavior is normal before first move.
  const radiusRef = useRef(Infinity);
  const lastTimeRef = useRef<number | null>(null);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get responsive canvas size
  const canvasSize = isMobile ? 140 : 220;

  // Preload all images and store them in imagesRef.
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    const promises = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const padded = String(i).padStart(3, "0");
      const src = `${FRAME_PATH}${padded}.webp`;
      const img = new Image();
      img.src = src;
      images.push(img);
      promises.push(
        new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load ${src}`));
        })
      );
    }
    Promise.all(promises)
      .then(() => {
        imagesRef.current = images;
        setAllFramesLoaded(true);
        if (onLoaded) onLoaded();
        // Draw the initial frame.
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(images[130], 0, 0, canvas.width, canvas.height);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [onLoaded, canvasSize]);

  // Animation loop: critically-damped spring toward targetFrame, with a
  // deadband near the radial center where atan2 is unstable.
  useEffect(() => {
    const STIFFNESS = 120;
    const DAMPING = 22; // ~2 * sqrt(STIFFNESS), critically damped
    const DEADBAND = 120; // px; full pull kicks in beyond this radius
    const MAX_DT = 1 / 30; // clamp spikes (e.g. backgrounded tab)

    let animationFrameId: number;
    const animate = (now: number) => {
      const last = lastTimeRef.current;
      lastTimeRef.current = now;
      const dt = last == null ? 0 : Math.min((now - last) / 1000, MAX_DT);

      setCurrentFrame((prev) => {
        let diff = targetFrameRef.current - prev;
        if (diff > TOTAL_FRAMES / 2) diff -= TOTAL_FRAMES;
        else if (diff < -TOTAL_FRAMES / 2) diff += TOTAL_FRAMES;

        const pullWeight = Math.min(1, radiusRef.current / DEADBAND);
        const accel =
          STIFFNESS * diff * pullWeight - DAMPING * velocityRef.current;
        velocityRef.current += accel * dt;

        if (Math.abs(diff) < 0.01 && Math.abs(velocityRef.current) < 0.01) {
          velocityRef.current = 0;
          return targetFrameRef.current;
        }

        let next = prev + velocityRef.current * dt;
        next = ((next % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
        return next;
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Update targetFrame based on mouse or touch position.
  useEffect(() => {
    const updateFrame = (clientX: number, clientY: number) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      radiusRef.current = Math.hypot(dx, dy);
      let angle = Math.atan2(dy, dx) - Math.PI;
      if (angle < 0) angle += 2 * Math.PI;
      const degrees = angle * (180 / Math.PI);
      let frame = Math.floor(degrees * (TOTAL_FRAMES / 360));
      if (frame >= TOTAL_FRAMES) frame = TOTAL_FRAMES - 1;
      targetFrameRef.current = frame;
    };

    const handleMouseMove = (e: MouseEvent) =>
      updateFrame(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length)
        updateFrame(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Redraw the canvas whenever currentFrame updates.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const frameIndex = Math.round(currentFrame);
    const img = imagesRef.current[frameIndex];
    if (img) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, [currentFrame]);

  // Render: always reserve a 220×220 container.
  return (
    <div className="relative" style={{ width: canvasSize, height: canvasSize }}>
      {displayMemoji ? (
        allFramesLoaded ? (
          <motion.canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="select-none"
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <Spinner />
          </div>
        )
      ) : (
        // Before text is complete, reserve space (render empty container)
        <div className="w-full h-full" />
      )}
    </div>
  );
}
