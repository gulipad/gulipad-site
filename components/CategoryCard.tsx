"use client";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react"; // Import the external link icon from lucide

import { useViewport } from "@/lib/useViewport";

type CategoryCardProps = {
  title: string;
  emoji: string;

  // Two options for click behavior:
  onClick?: () => void; // Function to execute (like showing components)
  linkUrl?: string; // URL to open in new tab

  angle?: number; // in degrees
  distance?: number; // in vmin (the smaller of viewport width and height)
  isVisible?: boolean;
  paused?: boolean; // hold still (no bobbing) while covered by a panel
  delay?: number; // in ms

  primaryColor?: string; // "255,0,150"  (no parentheses, no alpha)
  secondaryColor?: string; // "0,255,255"  (same format)
};

export default function CategoryCard({
  title,
  emoji,
  onClick,
  linkUrl,
  angle = 0,
  distance = 0,
  isVisible = false,
  paused = false,
  delay = 0,
  primaryColor = "255,0,150",
  secondaryColor = "0,255,255",
}: CategoryCardProps) {
  // Convert angle to radians
  const rad = (Math.PI / 180) * angle;
  // Calculate the position based on angle & distance. vmin (not vh) keeps the
  // ring on screen in tall, narrow windows such as a portrait iPad.
  // On very short screens (phones on their side) the ring becomes a wide,
  // flat ellipse so the cards clear the memoji and stay on screen.
  const { isMobile, canHover, isShort } = useViewport();
  const x = isShort
    ? `${distance * Math.cos(rad) * 0.65}vw`
    : `${distance * Math.cos(rad)}vmin`;
  const y = `${distance * Math.sin(rad) * (isShort ? 0.9 : 1)}vmin`;

  // Each card gets its own motion "personality", drawn once per mount:
  // different speeds, sizes, directions and start offsets. With shared
  // timings every card rose, fell and tilted in lockstep.
  const motionStyle = useRef({
    tilt: rand(-7, 7), // resting angle, degrees
    sway: rand(3, 6), // how far it rocks either side, degrees
    swayDirection: Math.random() < 0.5 ? 1 : -1,
    swayDuration: rand(3.5, 6), // seconds per half cycle
    swayDelay: rand(0, 2),
    bobBase: rand(-2, 4), // resting vertical offset, px
    bob: rand(3, 6), // px either side of bobBase
    bobDirection: Math.random() < 0.5 ? 1 : -1,
    bobDuration: rand(1.8, 3.2),
    bobDelay: rand(0, 1.5),
  }).current;

  // Track hover state
  const [hover, setHover] = useState(false);
  // Touch screens can't hover, so their labels are always shown.
  const alwaysShowLabel = isMobile || !canHover;

  // For desktop, use floating positioning. For mobile, use static positioning (handled by CSS Grid)
  const useFloatingPosition = !isMobile && (angle !== 0 || distance !== 0);

  // Non-hover style
  const nonHoverShadow = `0 0 5px 2px rgba(${primaryColor},0.2), 0 0 10px 5px rgba(${secondaryColor},0.2)`;
  // Hover style
  const hoverShadow = `0 0 10px 5px rgba(${primaryColor},0.5), 0 0 20px 10px rgba(${secondaryColor},0.5)`;

  // Decide which shadow & scale to apply based on hover
  const boxShadow = hover ? hoverShadow : nonHoverShadow;
  const scale = hover ? 1.1 : 1.05;

  // Only a real mouse hovers. iOS fires synthetic mouse events on tap and
  // never sends the matching "leave", which would leave the card stuck big.
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setHover(true);
  };
  const handlePointerLeave = () => setHover(false);

  // Links are real anchors and actions real buttons, so both work with the
  // keyboard and screen readers. Focus shows the same glow as hover.
  const interactionProps = {
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    // :focus-visible skips the focus a mouse click leaves behind.
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      if (e.currentTarget.matches(":focus-visible")) setHover(true);
    },
    onBlur: () => setHover(false),
  };

  const {
    tilt,
    sway,
    swayDirection,
    swayDuration,
    swayDelay,
    bobBase,
    bob,
    bobDirection,
    bobDuration,
    bobDelay,
  } = motionStyle;
  const bobFrom = bobBase - bob * bobDirection;
  const bobTo = bobBase + bob * bobDirection;

  const CardElement = linkUrl ? "a" : "button";
  const elementProps = linkUrl
    ? { href: linkUrl, target: "_blank", rel: "noopener noreferrer" }
    : { type: "button" as const, onClick };

  return (
    // Cards are anchored by their top-left corner at (x, y). The angles and
    // distances in Home.tsx were tuned for that anchoring (the ring is
    // deliberately lopsided), so don't "centre" them with a translate.
    <div
      style={{
        position: useFloatingPosition ? "absolute" : "relative",
        top: useFloatingPosition ? `calc(50% + ${y})` : "auto",
        left: useFloatingPosition ? `calc(50% + ${x})` : "auto",
        zIndex: hover ? 10 : 1, // Ensure hovered cards are on top
      }}
    >
      <motion.div
        // Start invisible
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        // Animate in if visible, bob up/down & rotate
        animate={
          isVisible && paused
            ? { scale: 1, opacity: 1, y: bobBase, rotate: tilt }
            : isVisible
              ? {
                  scale: 1, // baseline scale from 0 → 1
                  opacity: 1,
                  y: [bobFrom, bobTo],
                  rotate: [
                    tilt,
                    tilt + sway * swayDirection,
                    tilt - sway * swayDirection,
                    tilt,
                  ],
                }
              : { scale: 0, opacity: 0, rotate: 0 }
        }
        // Repeated y & rotate transitions
        transition={{
          delay: delay / 1000, // ms → s
          type: "spring",
          stiffness: 300,
          damping: 20,
          y: {
            duration: bobDuration,
            delay: bobDelay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
          rotate: {
            duration: swayDuration,
            delay: swayDelay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
      >
        {/* 
        The card: 
        - no dynamic tailwind classes for shadow 
        - rely on onMouseEnter/onMouseLeave for inline style
      */}
        <CardElement
          {...elementProps}
          {...interactionProps}
          style={{
            boxShadow,
            transform: `scale(${scale})`,
            transition: "transform 0.3s, box-shadow 0.3s",
            cursor: onClick || linkUrl ? "pointer" : "default",
          }}
          className="
          relative
          group
          w-16 h-16 sm:w-18 sm:h-18
          bg-gray-300
          border border-white
          rounded-lg
          flex flex-col
          items-center
          justify-center
          text-gray-800
          p-2 sm:p-4
          outline-none
        "
        >
          <motion.img
            src={`/icons/${emoji}.png`}
            alt=""
            className="text-lg w-7 h-7 sm:w-8 sm:h-8"
            whileHover={{ scale: 1.2 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
            }}
          />
          {title && (
            <div
              className={`
              absolute
              bottom-0 left-1/2
              translate-x-[-50%]
              translate-y-[120%]
              min-w-full
              whitespace-nowrap
              px-2 py-1
              rounded
              bg-black
              text-white
              text-xs
              border border-gray-400
              ${
                alwaysShowLabel
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              }
              pointer-events-none
              transition-opacity
              duration-200
              text-center
              flex
              items-center
              justify-center
            `}
            >
              <span>{title}</span>
              {/* Optionally show a small icon for external links */}
              {linkUrl && (
                <>
                  <ExternalLink
                    className="ml-1 inline-block"
                    size={12}
                    aria-hidden="true"
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                </>
              )}
            </div>
          )}
        </CardElement>
      </motion.div>
    </div>
  );
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
