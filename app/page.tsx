"use client";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion } from "motion/react";

import MemojiScrubber from "@/components/MemojiScrubber";
import IntroBox from "@/components/IntroBox";
import CategoryCard from "@/components/CategoryCard";
import AboutMePanel from "@/components/panels/AboutMePanel";
import InterestsPanel from "@/components/panels/InterestsPanel";
import ProjectsPanel from "@/components/panels/ProjectsPanel";

export default function Home() {
  const [memojiLoaded, setMemojiLoaded] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [previousPanel, setPreviousPanel] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Define the navigation sections
  const sections = useMemo(() => ["Projects", "About", "Interests"], []);

  // Navigation functions
  const navigateToNext = useCallback(() => {
    if (!activePanel) {
      setActivePanel(sections[0]);
    } else {
      setIsNavigating(true);
      setPreviousPanel(activePanel);
      const currentIndex = sections.indexOf(activePanel);
      const nextIndex = (currentIndex + 1) % sections.length;
      setActivePanel(sections[nextIndex]);
      // Reset navigation state after component renders
      setTimeout(() => {
        setIsNavigating(false);
        setPreviousPanel(null);
      }, 50);
    }
  }, [activePanel, sections]);

  const navigateToPrevious = useCallback(() => {
    if (!activePanel) {
      setActivePanel(sections[sections.length - 1]);
    } else {
      setIsNavigating(true);
      setPreviousPanel(activePanel);
      const currentIndex = sections.indexOf(activePanel);
      const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
      setActivePanel(sections[prevIndex]);
      // Reset navigation state after component renders
      setTimeout(() => {
        setIsNavigating(false);
        setPreviousPanel(null);
      }, 50);
    }
  }, [activePanel, sections]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCtrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      if (isCtrlOrCmd && event.key === "i") {
        event.preventDefault();
        navigateToNext();
      } else if (isCtrlOrCmd && event.key === "o") {
        event.preventDefault();
        navigateToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateToNext, navigateToPrevious]);

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

  // Fix for mobile viewport issues
  useEffect(() => {
    // Function to set the correct viewport height
    const setViewportHeight = () => {
      if (mainRef.current) {
        // Set a custom CSS property based on the actual window inner height
        document.documentElement.style.setProperty(
          "--app-height",
          `${window.innerHeight}px`
        );
      }
    };

    // Initial set
    setViewportHeight();

    // Update on resize and orientation change
    window.addEventListener("resize", setViewportHeight);
    window.addEventListener("orientationchange", setViewportHeight);

    return () => {
      window.removeEventListener("resize", setViewportHeight);
      window.removeEventListener("orientationchange", setViewportHeight);
    };
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
          linkUrl: "https://github.com/gulipad",
          angle: 250,
          distance: 47,
          delay: 200,
          primaryColor: "255,99,71",
          secondaryColor: "255,127,80",
        },
        {
          title: "Projects",
          emoji: "hammer-and-wrench",
          onClick: () =>
            setActivePanel((prev) => (prev === "Projects" ? null : "Projects")),
          angle: 280,
          distance: 45,
          delay: 600,
          primaryColor: "0,123,255",
          secondaryColor: "0,200,255",
        },
        {
          title: "About me",
          emoji: "book",
          onClick: () =>
            setActivePanel((prev) => (prev === "About" ? null : "About")),
          angle: 25,
          distance: 12,
          delay: 800,
          primaryColor: "34,139,34",
          secondaryColor: "50,205,50",
        },
        {
          title: "X",
          emoji: "x",
          linkUrl: "https://x.com/GuliMoreno",
          angle: 110,
          distance: 15,
          delay: 1000,
          primaryColor: "255,0,150",
          secondaryColor: "0,255,255",
        },
        {
          title: "Interests",
          emoji: "thinking",
          onClick: () =>
            setActivePanel((prev) =>
              prev === "Interests" ? null : "Interests"
            ),
          angle: 170,
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
          linkUrl: "https://github.com/gulipad",
          angle: 180,
          distance: 40,
          delay: 200,
          primaryColor: "255,99,71",
          secondaryColor: "255,127,80",
        },
        {
          title: "Projects",
          emoji: "hammer-and-wrench",
          onClick: () =>
            setActivePanel((prev) => (prev === "Projects" ? null : "Projects")),
          angle: 270,
          distance: 40,
          delay: 600,
          primaryColor: "0,123,255",
          secondaryColor: "0,200,255",
        },
        {
          title: "About me",
          emoji: "book",
          onClick: () =>
            setActivePanel((prev) => (prev === "About" ? null : "About")),
          angle: 320,
          distance: 45,
          delay: 800,
          primaryColor: "34,139,34",
          secondaryColor: "50,205,50",
        },
        {
          title: "X",
          emoji: "x",
          linkUrl: "https://x.com/GuliMoreno",
          angle: 0,
          distance: 35,
          delay: 1000,
          primaryColor: "255,0,150",
          secondaryColor: "0,255,255",
        },
        {
          title: "Interests",
          emoji: "thinking",
          onClick: () =>
            setActivePanel((prev) =>
              prev === "Interests" ? null : "Interests"
            ),
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
    <main
      ref={mainRef}
      className="relative w-screen bg-black flex flex-col items-center justify-center overflow-hidden"
      style={{ height: "var(--app-height, 100vh)" }}
    >
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
          onClick={config.onClick}
          linkUrl={config.linkUrl}
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
          ${isMobile ? "absolute bottom-24 w-full" : ""}
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

      {/* Content panels that appear when cards are clicked */}
      <ProjectsPanel
        isVisible={
          activePanel === "Projects" ||
          (isNavigating && previousPanel === "Projects")
        }
        onClose={() => setActivePanel(null)}
        onNavigateNext={navigateToNext}
        onNavigatePrevious={navigateToPrevious}
        isNavigating={isNavigating}
      />

      <AboutMePanel
        isVisible={
          activePanel === "About" || (isNavigating && previousPanel === "About")
        }
        onClose={() => setActivePanel(null)}
        onNavigateNext={navigateToNext}
        onNavigatePrevious={navigateToPrevious}
        isNavigating={isNavigating}
      />

      {/* Interests Panel */}
      <InterestsPanel
        isVisible={
          activePanel === "Interests" ||
          (isNavigating && previousPanel === "Interests")
        }
        onClose={() => setActivePanel(null)}
        onNavigateNext={navigateToNext}
        onNavigatePrevious={navigateToPrevious}
        isNavigating={isNavigating}
      />

      {isMobile && (
        <div className="absolute bottom-12 w-full text-center text-gray-500 text-xs">
          This site is better experienced on desktop.
        </div>
      )}

      {/* Footer */}
      <footer className="absolute bottom-4 text-white text-sm">
        Made with ❤️ in Madrid by Gulipad
      </footer>
    </main>
  );
}
