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
      <CategoryCard
        title="Github"
        emoji="github"
        onClick={() => alert("Clicked My Craft!")}
        angle={180}
        distance={40}
        isVisible={showCard}
        delay={200}
        primaryColor="255,99,71"
        secondaryColor="255,127,80"
      />
      <CategoryCard
        title="Projects"
        emoji="hammer-and-wrench"
        onClick={() => alert("Clicked My Craft!")}
        angle={270}
        distance={40}
        isVisible={showCard}
        delay={600}
        primaryColor="0,123,255"
        secondaryColor="0,200,255"
      />
      <CategoryCard
        title="About me"
        emoji="book"
        onClick={() => alert("Clicked My Craft!")}
        angle={320}
        distance={45}
        isVisible={showCard}
        delay={800}
        primaryColor="34,139,34"
        secondaryColor="50,205,50"
      />
      <CategoryCard
        title="X"
        emoji="x"
        onClick={() => alert("Clicked My Craft!")}
        angle={0}
        distance={35}
        isVisible={showCard}
        delay={1000}
        primaryColor="255,0,150"
        secondaryColor="0,255,255"
      />
      <CategoryCard
        title="Interests"
        emoji="thinking"
        onClick={() => alert("Clicked My Craft!")}
        angle={220}
        distance={50}
        isVisible={showCard}
        delay={400}
        primaryColor="138,43,226"
        secondaryColor="186,85,211"
      />
      <footer className="absolute bottom-4 text-white text-sm">
        Made with ❤️ in Madrid by Gulipad
      </footer>
    </main>
  );
}
