"use client";
import { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";

import MemojiScrubber from "@/components/MemojiScrubber";
import IntroBox from "@/components/IntroBox";
import CategoryCard from "@/components/CategoryCard"; // updated with polar + pop logic

export default function Home() {
  const [memojiLoaded, setMemojiLoaded] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  const stablePauseAfter = useMemo(() => ({ ",": 500 }), []);
  const handleComplete = useCallback(() => setIntroComplete(true), []);

  // If you only want the card to appear once *both* memoji is loaded & intro is done,
  // we can do: const showCard = memojiLoaded && introComplete;
  // For demonstration, let's just tie it to memojiLoaded:
  const showCard = memojiLoaded && introComplete;

  return (
    <main className="relative min-h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* A background motion effect */}
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

      {/* Intro text */}
      <IntroBox
        text="Hi, this is Guli"
        speed={100}
        pauseAfter={stablePauseAfter}
        onComplete={handleComplete}
      />

      {/* MemojiScrubber */}
      <div className="mt-8">
        <MemojiScrubber
          onLoaded={() => setMemojiLoaded(true)}
          displayMemoji={introComplete}
        />
      </div>

      {/* CategoryCard: floating 45 degrees from center, 20vh away, 1s delay */}
      <CategoryCard
        title="My Craft"
        emoji="hammer-and-wrench"
        description="All about coding & tech"
        onClick={() => alert("Clicked My Craft!")}
        angle={0}
        distance={30}
        isVisible={showCard}
        delay={1} // 1 second after showCard => pop in
      />
    </main>
  );
}
