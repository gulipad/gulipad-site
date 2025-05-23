"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react"; // Import the external link icon from lucide

type CategoryCardProps = {
  title: string;
  emoji: string;

  // Two options for click behavior:
  onClick?: () => void; // Function to execute (like showing components)
  linkUrl?: string; // URL to open in new tab

  angle?: number; // in degrees
  distance?: number; // in vh
  gridPosition?: { row: number; col: number; section?: string }; // For mobile grid layout
  isVisible?: boolean;
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
  gridPosition,
  isVisible = false,
  delay = 0,
  primaryColor = "255,0,150",
  secondaryColor = "0,255,255",
}: CategoryCardProps) {
  // Convert angle to radians
  const rad = (Math.PI / 180) * angle;
  // Calculate the position based on angle & distance (in vh)
  const x = `${distance * Math.cos(rad)}vh`;
  const y = `${distance * Math.sin(rad)}vh`;

  // Generate small random offsets so each card's cycle is slightly unique
  const smallOffset = useRef(Math.random() * (0.4 - 0.1) + 0.1).current;
  const bigOffset = useRef(Math.random() * (4 - 1) + 1).current;

  // Track hover state
  const [hover, setHover] = useState(false);
  // Track if we're on a mobile device
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // For desktop, use floating positioning. For mobile, use static positioning (handled by CSS Grid)
  const useFloatingPosition = !isMobile && (angle !== 0 || distance !== 0);

  // Non-hover style
  const nonHoverShadow = `0 0 5px 2px rgba(${primaryColor},0.2), 0 0 10px 5px rgba(${secondaryColor},0.2)`;
  // Hover style
  const hoverShadow = `0 0 10px 5px rgba(${primaryColor},0.5), 0 0 20px 10px rgba(${secondaryColor},0.5)`;

  // Decide which shadow & scale to apply based on hover
  const boxShadow = hover ? hoverShadow : nonHoverShadow;
  const scale = hover ? 1.1 : 1.05;

  // Handle click based on whether linkUrl or onClick is provided
  const handleClick = () => {
    if (linkUrl) {
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    } else if (onClick) {
      onClick();
    }
  };

  // Calculate grid position for mobile
  const gridX = gridPosition ? `${(gridPosition.col - 1) * 70 - 35}px` : "0px";
  const gridY = gridPosition
    ? gridPosition.section === "top"
      ? `${-140}px` // Above center
      : gridPosition.section === "bottom"
      ? `${140}px` // Below center
      : "0px" // Default/desktop
    : "0px";

  // Use grid positioning for mobile, floating for desktop
  const isGridLayout = isMobile && gridPosition;
  const positionX = isGridLayout ? gridX : x;
  const positionY = isGridLayout ? gridY : y;

  return (
    <motion.div
      // Start invisible
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      // Animate in if visible, bob up/down & rotate
      animate={
        isVisible
          ? {
              scale: 1, // baseline scale from 0 → 1
              opacity: 1,
              y: [bigOffset, bigOffset - 5, bigOffset],
              rotate: [0, 5, -5, 0],
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
          duration: 2 + smallOffset,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
        rotate: {
          duration: 4 + smallOffset,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      }}
      style={{
        position: useFloatingPosition ? "absolute" : "relative",
        top: useFloatingPosition ? `calc(50% + ${y})` : "auto",
        left: useFloatingPosition ? `calc(50% + ${x})` : "auto",
        transform: useFloatingPosition ? "translate(-50%, -50%)" : "none",
        zIndex: hover ? 10 : 1, // Ensure hovered cards are on top
      }}
    >
      {/* 
        The card: 
        - no dynamic tailwind classes for shadow 
        - rely on onMouseEnter/onMouseLeave for inline style
      */}
      <div
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
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
        "
      >
        <motion.img
          src={`/icons/${emoji}.png`}
          alt={emoji}
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
              w-full
              px-2 py-1
              rounded
              bg-black
              text-white
              text-xs
              border border-gray-400
              ${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
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
              <ExternalLink className="ml-1 inline-block" size={12} />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
