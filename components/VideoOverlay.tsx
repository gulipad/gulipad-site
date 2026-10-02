"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { X } from "lucide-react";

interface VideoOverlayProps {
  youtubeId: string;
  title: string;
  onClose: () => void;
}

/**
 * Full-screen dimmed overlay that plays a YouTube video centered in the viewport.
 * Closes on Escape, backdrop click or the close button.
 */
const VideoOverlay: React.FC<VideoOverlayProps> = ({
  youtubeId,
  title,
  onClose,
}) => {
  // Lock page scroll and close on Escape while open. Escape is caught in the
  // capture phase and stopped so the panel underneath doesn't close too.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [onClose]);

  const closeOnBackdrop = (e: React.MouseEvent) =>
    e.target === e.currentTarget && onClose();

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={closeOnBackdrop}
      // React events bubble through portals; keep swipes here from reaching
      // the panel's swipe-to-navigate handlers.
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Close"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>
      {/* As wide as fits while keeping 16:9 inside the viewport padding. */}
      <motion.div
        className="w-[min(100%,calc((100dvh-1.5rem)*16/9))] sm:w-[min(100%,calc((100dvh-5rem)*16/9))] max-w-6xl aspect-video"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ y: 16, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.1] }}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          className="w-full h-full rounded-xl border border-gray-700 bg-black shadow-2xl"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default VideoOverlay;
