"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import Spinner from "@/components/Spinner";

type MemojiScrubberProps = {
  onLoaded?: () => void;
  displayMemoji: boolean;
  // Stops the animation loop, e.g. while a panel covers the memoji.
  paused?: boolean;
};

const TOTAL_FRAMES = 168;
const FRAME_PATH = "/memoji-frames/frame-";
// Default frame (zero-indexed 130 corresponds to frame 131)
const DEFAULT_FRAME = 130;

export default function MemojiScrubber({
  onLoaded,
  displayMemoji,
  paused = false,
}: MemojiScrubberProps) {
  const [allFramesLoaded, setAllFramesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  // Animation state lives in refs: the spring runs every frame, and routing it
  // through React state would re-render the component ~60 times per second.
  const frameRef = useRef(DEFAULT_FRAME);
  const targetFrameRef = useRef(DEFAULT_FRAME);
  const velocityRef = useRef(0);
  const drawnRef = useRef<{ canvas: HTMLCanvasElement | null; frame: number }>(
    { canvas: null, frame: -1 }
  );
  // Cursor distance from screen center; governs how strongly we pull toward
  // targetFrame. Starts at Infinity so behavior is normal before first move.
  const radiusRef = useRef(Infinity);
  const lastTimeRef = useRef<number | null>(null);
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

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

  // Preload all images once and store them in imagesRef.
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    const promises = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const padded = String(i).padStart(3, "0");
      const src = `${FRAME_PATH}${padded}.webp`;
      const img = new Image();
      img.decoding = "async";
      promises.push(
        new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load ${src}`));
        })
      );
      img.src = src;
      images.push(img);
    }
    Promise.all(promises)
      .then(() => {
        if (cancelled) return;
        imagesRef.current = images;
        setAllFramesLoaded(true);
        onLoadedRef.current?.();
      })
      .catch((err) => console.error(err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Animation loop: critically-damped spring toward targetFrame, with a
  // deadband near the radial center where atan2 is unstable. Draws straight
  // to the canvas, and only when the visible frame actually changes.
  useEffect(() => {
    if (paused) return;
    const STIFFNESS = 120;
    const DAMPING = 22; // ~2 * sqrt(STIFFNESS), critically damped
    const DEADBAND = 120; // px; full pull kicks in beyond this radius
    const MAX_DT = 1 / 30; // clamp spikes (e.g. backgrounded tab)

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const frameIndex = Math.round(frameRef.current) % TOTAL_FRAMES;
      const drawn = drawnRef.current;
      if (drawn.canvas === canvas && drawn.frame === frameIndex) return;
      const img = imagesRef.current[frameIndex];
      const ctx = canvas.getContext("2d");
      if (!img || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawnRef.current = { canvas, frame: frameIndex };
    };

    let animationFrameId: number;
    const animate = (now: number) => {
      const last = lastTimeRef.current;
      lastTimeRef.current = now;
      const dt = last == null ? 0 : Math.min((now - last) / 1000, MAX_DT);

      const prev = frameRef.current;
      let diff = targetFrameRef.current - prev;
      if (diff > TOTAL_FRAMES / 2) diff -= TOTAL_FRAMES;
      else if (diff < -TOTAL_FRAMES / 2) diff += TOTAL_FRAMES;

      if (Math.abs(diff) < 0.01 && Math.abs(velocityRef.current) < 0.01) {
        velocityRef.current = 0;
        frameRef.current = targetFrameRef.current;
      } else {
        const pullWeight = Math.min(1, radiusRef.current / DEADBAND);
        const accel =
          STIFFNESS * diff * pullWeight - DAMPING * velocityRef.current;
        velocityRef.current += accel * dt;
        const next = prev + velocityRef.current * dt;
        frameRef.current = ((next % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
      }

      draw();
      animationFrameId = requestAnimationFrame(animate);
    };
    lastTimeRef.current = null;
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [paused]);

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

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Render: always reserve a canvasSize×canvasSize container.
  return (
    <div className="relative" style={{ width: canvasSize, height: canvasSize }}>
      {displayMemoji ? (
        allFramesLoaded ? (
          <motion.canvas
            // Remount on resize so the loop redraws onto the fresh canvas.
            key={canvasSize}
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
