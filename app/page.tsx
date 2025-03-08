"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "motion/react";

import MemojiScrubber from "@/components/MemojiScrubber";
import IntroBox from "@/components/IntroBox";
import CategoryCard from "@/components/CategoryCard";

export default function Home() {
  const [memojiLoaded, setMemojiLoaded] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Standard mobile breakpoint
    };

    // Check on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const stablePauseAfter = useMemo(() => ({ ",": 500 }), []);
  const handleComplete = useCallback(() => setIntroComplete(true), []);

  const showCard = memojiLoaded && introComplete;

  // Define card configurations based on layout
  const cardConfigs = useMemo(() => {
    if (isMobile) {
      // Mobile layout - cards at top
      return [
        {
          title: "Github",
          emoji: "github",
          angle: 250,
          distance: 40,
          delay: 200,
          primaryColor: "255,99,71",
          secondaryColor: "255,127,80",
        },
        {
          title: "Projects",
          emoji: "hammer-and-wrench",
          angle: 280,
          distance: 40,
          delay: 600,
          primaryColor: "0,123,255",
          secondaryColor: "0,200,255",
        },
        {
          title: "About me",
          emoji: "book",
          angle: 45,
          distance: 15,
          delay: 800,
          primaryColor: "34,139,34",
          secondaryColor: "50,205,50",
        },
        {
          title: "X",
          emoji: "x",
          angle: 100,
          distance: 20,
          delay: 1000,
          primaryColor: "255,0,150",
          secondaryColor: "0,255,255",
        },
        {
          title: "Interests",
          emoji: "thinking",
          angle: 155,
          distance: 20,
          delay: 30,
          primaryColor: "138,43,226",
          secondaryColor: "186,85,211",
        },
      ];
    } else {
      // Desktop layout - original configuration
      return [
        {
          title: "Github",
          emoji: "github",
          angle: 180,
          distance: 40,
          delay: 200,
          primaryColor: "255,99,71",
          secondaryColor: "255,127,80",
        },
        {
          title: "Projects",
          emoji: "hammer-and-wrench",
          angle: 270,
          distance: 40,
          delay: 600,
          primaryColor: "0,123,255",
          secondaryColor: "0,200,255",
        },
        {
          title: "About me",
          emoji: "book",
          angle: 320,
          distance: 45,
          delay: 800,
          primaryColor: "34,139,34",
          secondaryColor: "50,205,50",
        },
        {
          title: "X",
          emoji: "x",
          angle: 0,
          distance: 35,
          delay: 1000,
          primaryColor: "255,0,150",
          secondaryColor: "0,255,255",
        },
        {
          title: "Interests",
          emoji: "thinking",
          angle: 220,
          distance: 50,
          delay: 400,
          primaryColor: "138,43,226",
          secondaryColor: "186,85,211",
        },
      ];
    }
  }, [isMobile]);

  return (
    <main className="relative min-h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={showCard ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, transparent 60%)",
        }}
      />

      {/* Cards */}
      {cardConfigs.map((config, index) => (
        <CategoryCard
          key={config.title}
          title={config.title}
          emoji={config.emoji}
          onClick={() => alert(`Clicked ${config.title}!`)}
          angle={config.angle}
          distance={config.distance}
          isVisible={showCard}
          delay={config.delay}
          primaryColor={config.primaryColor}
          secondaryColor={config.secondaryColor}
        />
      ))}

      {/* Mobile layout: content at the bottom 
          Desktop layout: content in center */}
      <div
        className={`
          relative 
          ${isMobile ? "absolute bottom-16 w-full" : ""}
          flex flex-col items-center justify-center
        `}
      >
        {/* Intro text */}
        <IntroBox
          text="Hi, this is Guli"
          speed={100}
          pauseAfter={stablePauseAfter}
          onComplete={handleComplete}
        />

        {/* MemojiScrubber */}
        <div className={`${isMobile ? "mt-4" : "mt-8"}`}>
          <MemojiScrubber
            onLoaded={() => setMemojiLoaded(true)}
            displayMemoji={introComplete}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-12 w-full text-center text-gray-400 text-xs md:hidden">
        Drag along to make Guli follow you.
      </div>
      <footer className="absolute bottom-4 text-white text-s">
        Made with ❤️ in Madrid by Gulipad
      </footer>
    </main>
  );
}
