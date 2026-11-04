"use client";
import { useEffect, useState } from "react";

// Below this width, portrait screens get the stacked layout instead of the
// floating ring of cards.
const STACKED_MAX_WIDTH = 768;
// Below this height, the memoji shrinks so everything still fits.
const COMPACT_MAX_HEIGHT = 600;
// Below this height (phones on their side), the ring is squashed: spread
// horizontally, flattened vertically, smallest memoji.
const SHORT_MAX_HEIGHT = 450;

export interface Viewport {
  // False until the first client measurement, so SSR and hydration agree.
  measured: boolean;
  // Stacked layout: cards above and below the memoji. Narrow landscape
  // screens (phones on their side) are too short for it and use the ring.
  isMobile: boolean;
  // Short screen: shrink the memoji.
  isCompact: boolean;
  // Very short screen, e.g. a phone in landscape.
  isShort: boolean;
  // A mouse or trackpad is the primary pointer, so hover-only labels work.
  canHover: boolean;
}

const UNMEASURED: Viewport = {
  measured: false,
  isMobile: false,
  isCompact: false,
  isShort: false,
  canHover: true,
};

function measure(): Viewport {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return {
    measured: true,
    isMobile: width < STACKED_MAX_WIDTH && height >= width,
    isCompact: height < COMPACT_MAX_HEIGHT,
    isShort: height < SHORT_MAX_HEIGHT,
    canHover: window.matchMedia("(hover: hover)").matches,
  };
}

export function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(UNMEASURED);

  useEffect(() => {
    const update = () => {
      const next = measure();
      setViewport((prev) =>
        prev.measured === next.measured &&
        prev.isMobile === next.isMobile &&
        prev.isCompact === next.isCompact &&
        prev.isShort === next.isShort &&
        prev.canHover === next.canHover
          ? prev
          : next,
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return viewport;
}
