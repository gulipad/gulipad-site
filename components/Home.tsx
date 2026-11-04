"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "motion/react";

import MemojiScrubber from "@/components/MemojiScrubber";
import IntroBox from "@/components/IntroBox";
import CategoryCard from "@/components/CategoryCard";
import AboutMePanel from "@/components/panels/AboutMePanel";
import InterestsPanel from "@/components/panels/InterestsPanel";
import ProjectsPanel from "@/components/panels/ProjectsPanel";
import type { WritingMeta } from "@/lib/writings-shared";
import { useViewport } from "@/lib/useViewport";

export default function Home({ writings }: { writings: WritingMeta[] }) {
  const [memojiLoaded, setMemojiLoaded] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  // `mounted` stays false until the screen has been measured, so the page
  // never renders one layout and then swaps to the other (which restarted
  // the intro typing on phones).
  const { measured: mounted, isMobile } = useViewport();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [previousPanel, setPreviousPanel] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Define the navigation sections
  const sections = useMemo(() => ["Projects", "About", "Interests"], []);

  // Deep link into a section, e.g. /?section=interests from a writing page.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("section");
    const match = sections.find(
      (s) => s.toLowerCase() === param?.toLowerCase(),
    );
    if (match) setActivePanel(match);
  }, [sections]);

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

      // Matches the panel buttons: ‹ ⌘I (previous) and ⌘O › (next).
      if (isCtrlOrCmd && event.key === "i") {
        event.preventDefault();
        navigateToPrevious();
      } else if (isCtrlOrCmd && event.key === "o") {
        event.preventDefault();
        navigateToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateToNext, navigateToPrevious]);

  const stablePauseAfter = useMemo(() => ({ ",": 350 }), []);
  const handleComplete = useCallback(() => setIntroComplete(true), []);
  const handleMemojiLoaded = useCallback(() => setMemojiLoaded(true), []);
  const closePanel = useCallback(() => setActivePanel(null), []);

  const showCard = memojiLoaded && introComplete;
  // Panels blur the whole screen; animating the home view underneath forces
  // that blur to re-render every frame (and flicker), so freeze it meanwhile.
  const panelOpen = activePanel !== null;

  // Define card configurations based on layout
  const cardConfigs = useMemo(() => {
    if (!mounted) {
      // Return empty array during SSR to prevent hydration mismatch
      return [];
    }

    if (isMobile) {
      // Mobile layout - interactive items on top, external links below
      return [
        // Bottom row - external links
        {
          title: "Github",
          emoji: "github",
          linkUrl: "https://github.com/gulipad",
          angle: 0,
          distance: 0,
          mobileSection: "bottom",
          delay: 200,
          primaryColor: "255,99,71",
          secondaryColor: "255,127,80",
        },
        {
          title: "X",
          emoji: "x",
          linkUrl: "https://x.com/GuliMoreno",
          angle: 0,
          distance: 0,
          mobileSection: "bottom",
          delay: 1000,
          primaryColor: "255,0,150",
          secondaryColor: "0,255,255",
        },
        // Top row - interactive items
        {
          title: "Projects",
          emoji: "hammer-and-wrench",
          onClick: () =>
            setActivePanel((prev) => (prev === "Projects" ? null : "Projects")),
          angle: 0,
          distance: 0,
          mobileSection: "top",
          delay: 600,
          primaryColor: "0,123,255",
          secondaryColor: "0,200,255",
        },
        {
          title: "About me",
          emoji: "book",
          onClick: () =>
            setActivePanel((prev) => (prev === "About" ? null : "About")),
          angle: 0,
          distance: 0,
          mobileSection: "top",
          delay: 800,
          primaryColor: "34,139,34",
          secondaryColor: "50,205,50",
        },
        {
          title: "Interests",
          emoji: "thinking",
          onClick: () =>
            setActivePanel((prev) =>
              prev === "Interests" ? null : "Interests",
            ),
          angle: 0,
          distance: 0,
          mobileSection: "top",
          delay: 400,
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
          mobileSection: undefined,
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
          mobileSection: undefined,
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
          mobileSection: undefined,
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
          mobileSection: undefined,
          delay: 1000,
          primaryColor: "255,0,150",
          secondaryColor: "0,255,255",
        },
        {
          title: "Interests",
          emoji: "thinking",
          onClick: () =>
            setActivePanel((prev) =>
              prev === "Interests" ? null : "Interests",
            ),
          angle: 220,
          distance: 50,
          mobileSection: undefined,
          delay: 400,
          primaryColor: "138,43,226",
          secondaryColor: "186,85,211",
        },
      ];
    }
  }, [isMobile, mounted]);

  return (
    <main className="relative h-app w-screen bg-black flex flex-col items-center justify-center overflow-hidden">
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
      {mounted &&
        !isMobile &&
        cardConfigs.map((config) => (
          <CategoryCard
            key={config.title}
            title={config.title}
            emoji={config.emoji}
            onClick={config.onClick}
            linkUrl={config.linkUrl}
            angle={config.angle}
            distance={config.distance}
            isVisible={showCard}
            paused={panelOpen}
            delay={config.delay}
            primaryColor={config.primaryColor}
            secondaryColor={config.secondaryColor}
          />
        ))}

      {/* Mobile Grid Layout */}
      {mounted && isMobile && (
        // Gaps shrink with the screen height, and the bottom padding keeps the
        // last row's labels clear of the footer on short phones.
        <div className="flex flex-col items-center justify-center h-full pt-6 pb-20">
          {/* Top Section - Interactive Items (the main content comes first) */}
          <div className="flex justify-center space-x-10 mb-[clamp(2.5rem,9dvh,5rem)]">
            {cardConfigs
              .filter((config) => config.mobileSection === "top")
              .map((config) => (
                <CategoryCard
                  key={config.title}
                  title={config.title}
                  emoji={config.emoji}
                  onClick={config.onClick}
                  linkUrl={config.linkUrl}
                  angle={0}
                  distance={0}
                  isVisible={showCard}
                  paused={panelOpen}
                  delay={config.delay}
                  primaryColor={config.primaryColor}
                  secondaryColor={config.secondaryColor}
                />
              ))}
          </div>

          {/* Center Section - Content */}
          <div className="flex flex-col items-center justify-center mb-[clamp(1.5rem,5dvh,3rem)]">
            {/* Intro text */}
            <IntroBox
              text="Hi, this is Guli"
              speed={70}
              pauseAfter={stablePauseAfter}
              completeDelay={350}
              onComplete={handleComplete}
            />

            {/* MemojiScrubber */}
            <div className="mt-4">
              <MemojiScrubber
                onLoaded={handleMemojiLoaded}
                displayMemoji={introComplete}
                paused={panelOpen}
              />
            </div>
          </div>

          {/* Bottom Section - External Links */}
          <div className="flex justify-center space-x-10">
            {cardConfigs
              .filter((config) => config.mobileSection === "bottom")
              .map((config) => (
                <CategoryCard
                  key={config.title}
                  title={config.title}
                  emoji={config.emoji}
                  onClick={config.onClick}
                  linkUrl={config.linkUrl}
                  angle={0}
                  distance={0}
                  isVisible={showCard}
                  paused={panelOpen}
                  delay={config.delay}
                  primaryColor={config.primaryColor}
                  secondaryColor={config.secondaryColor}
                />
              ))}
          </div>
        </div>
      )}

      {/* Desktop layout: content in center */}
      {mounted && !isMobile && (
        <div className="relative flex flex-col items-center justify-center">
          {/* Intro text */}
          <IntroBox
            text="Hi, this is Guli"
            speed={70}
            pauseAfter={stablePauseAfter}
            completeDelay={350}
            onComplete={handleComplete}
          />

          {/* MemojiScrubber */}
          <div className="mt-[clamp(1rem,4dvh,2rem)]">
            <MemojiScrubber
              onLoaded={handleMemojiLoaded}
              displayMemoji={introComplete}
              paused={panelOpen}
            />
          </div>
        </div>
      )}

      {/* Content panels that appear when cards are clicked */}
      <ProjectsPanel
        writings={writings}
        isVisible={
          activePanel === "Projects" ||
          (isNavigating && previousPanel === "Projects")
        }
        onClose={closePanel}
        onNavigateNext={navigateToNext}
        onNavigatePrevious={navigateToPrevious}
        isNavigating={isNavigating}
      />

      <AboutMePanel
        isVisible={
          activePanel === "About" || (isNavigating && previousPanel === "About")
        }
        onClose={closePanel}
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
        onClose={closePanel}
        onNavigateNext={navigateToNext}
        onNavigatePrevious={navigateToPrevious}
        isNavigating={isNavigating}
      />

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center">
        {mounted && isMobile && (
          <div className="text-gray-500 text-xs mb-2">
            This site is better experienced on desktop.
          </div>
        )}
        <div className="text-white text-sm">
          Made with ❤️ in Madrid by Gulipad
        </div>
      </footer>
    </main>
  );
}
