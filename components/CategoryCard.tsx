"use client";
import React from "react";
import { motion } from "motion/react";

type CategoryCardProps = {
  title: string;
  emoji: string;
  description?: string;
  onClick?: () => void;

  // New props:
  angle?: number; // degrees from 0..360
  distance?: number; // how far from center, in "vh" (for responsiveness)
  isVisible?: boolean; // whether the card should pop in or be hidden
  delay?: number; // delay (in seconds) before popping in
};

export default function CategoryCard({
  title,
  emoji,
  description,
  onClick,
  angle = 0,
  distance = 0,
  isVisible = false,
  delay = 0,
}: CategoryCardProps) {
  // Convert angle to radians
  const rad = (Math.PI / 180) * angle;

  // Calculate the position based on angle and distance
  const x = `${distance * Math.cos(rad)}vh`;
  const y = `${distance * Math.sin(rad)}vh`;

  return (
    // Motion wrapper for pop-in and floating animation
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={
        isVisible
          ? {
              scale: 1,
              opacity: 1,
              y: [0, -5, 0],
              rotate: [0, 5, -5, 0], // Added rotation animation
              boxShadow: [
                "0 0 5px 2px rgba(255,0,150,0.1), 0 0 10px 5px rgba(0,255,255,0.1)",
                "0 0 10px 5px rgba(255,0,150,0.3), 0 0 20px 10px rgba(0,255,255,0.3)",
                "0 0 5px 2px rgba(255,0,150,0.1), 0 0 10px 5px rgba(0,255,255,0.1)",
              ],
            }
          : { scale: 0, opacity: 0, rotate: 0 }
      }
      transition={{
        delay,
        type: "spring",
        stiffness: 300,
        damping: 20,
        y: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
        rotate: {
          duration: 4, // Duration for the rotation animation
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      }}
      style={{
        // Absolute positioning around center
        position: "absolute",
        top: `calc(50% + ${y})`,
        left: `calc(50% + ${x})`,
        transform: `translate(-50%, -50%)`,
      }}
    >
      {/* The actual card styling */}
      <div
        onClick={onClick}
        className="
          w-18 h-18
          bg-gray-300 
          border border-white
          rounded-lg 
          flex flex-col 
          items-center 
          justify-center 
          text-gray-800 
          cursor-pointer 
          transition-transform 
          duration-300 
          shadow-[0_0_5px_2px_rgba(255,0,150,0.2),0_0_10px_5px_rgba(0,255,255,0.2)]
          hover:scale-105 
          hover:shadow-[0_0_10px_5px_rgba(255,0,150,0.5),0_0_20px_10px_rgba(0,255,255,0.5)]
          hover:bg-gray-200
          p-4
        "
      >
        {/* The Emoji as an Image */}
        <img
          src={`/icons/${emoji}.png`}
          alt={emoji}
          className="text-lg transform transition-transform duration-300 hover:scale-110"
        />
      </div>
    </motion.div>
  );
}
