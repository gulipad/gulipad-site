"use client";
import { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import MemojiScrubber from "@/components/MemojiScrubber";
import IntroBox from "@/components/IntroBox";

export default function Home() {
  const [memojiLoaded, setMemojiLoaded] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  const stablePauseAfter = useMemo(() => ({ ",": 500 }), []);
  const handleComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <main className="relative min-h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={
          memojiLoaded && introComplete ? { opacity: 1 } : { opacity: 0 }
        }
        transition={{ duration: 1 }}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, transparent 60%)",
        }}
      />
      <IntroBox
        text="Hi, this is Guli"
        speed={100}
        pauseAfter={stablePauseAfter}
        onComplete={handleComplete}
      />
      <div className="mt-8">
        <MemojiScrubber
          onLoaded={() => {
            setMemojiLoaded(true);
          }}
          displayMemoji={introComplete}
        />
      </div>
    </main>
  );
}
