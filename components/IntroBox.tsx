"use client";
import { useEffect, useState } from "react";

type IntroBoxProps = {
  text: string;
  speed?: number; // ms per character
  pauseAfter?: { [char: string]: number };
  onComplete?: () => void;
};

export default function IntroBox({
  text,
  speed = 100,
  pauseAfter = { ",": 500 },
  onComplete,
}: IntroBoxProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function typeNext() {
      if (index < text.length) {
        const nextChar = text[index];
        setDisplayedText((prev) => prev + nextChar);
        index++;

        let delay = speed;
        if (pauseAfter[nextChar]) {
          delay += pauseAfter[nextChar];
        }

        timeoutId = setTimeout(typeNext, delay);
      } else {
        timeoutId = setTimeout(() => {
          onComplete?.();
        }, 500);
      }
    }

    typeNext();
    return () => clearTimeout(timeoutId);
  }, [text, speed, pauseAfter, onComplete]);

  return <div className="text-white text-xl">{displayedText}</div>;
}
