"use client";
import { useEffect, useState } from "react";

type IntroBoxProps = {
  text: string;
  speed?: number; // ms per character
  pauseAfter?: { [char: string]: number };
  completeDelay?: number; // ms to hold the full text before onComplete
  onComplete?: () => void;
};

export default function IntroBox({
  text,
  speed = 100,
  pauseAfter = { ",": 500 },
  completeDelay = 500,
  onComplete,
}: IntroBoxProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function typeNext() {
      if (index < text.length) {
        const nextChar = text[index];
        index++;
        // Slice rather than append so a re-run effect can't duplicate chars.
        setDisplayedText(text.slice(0, index));

        let delay = speed;
        if (pauseAfter[nextChar]) {
          delay += pauseAfter[nextChar];
        }

        timeoutId = setTimeout(typeNext, delay);
      } else {
        timeoutId = setTimeout(() => {
          onComplete?.();
        }, completeDelay);
      }
    }

    typeNext();
    return () => clearTimeout(timeoutId);
  }, [text, speed, pauseAfter, completeDelay, onComplete]);

  return <div className="text-white text-xl">{displayedText}</div>;
}
