import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export interface PanelProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
  isNavigating?: boolean;
}

interface PanelShellProps extends PanelProps {
  title: string;
  lastUpdated: string; // ISO date, e.g. "2026-10-01"
  children: React.ReactNode;
}

// Minimum horizontal travel (px) for a touch to count as a swipe, and how
// dominant the horizontal axis must be so vertical scrolls don't trigger it.
const SWIPE_MIN_DISTANCE = 60;
const SWIPE_AXIS_RATIO = 1.5;

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const PanelShell: React.FC<PanelShellProps> = ({
  isVisible,
  onClose,
  onNavigateNext,
  onNavigatePrevious,
  isNavigating = false,
  title,
  lastUpdated,
  children,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (
      Math.abs(dx) < SWIPE_MIN_DISTANCE ||
      Math.abs(dx) < Math.abs(dy) * SWIPE_AXIS_RATIO
    ) {
      return;
    }
    // Swipe left reveals the next section, swipe right the previous one.
    if (dx < 0) onNavigateNext?.();
    else onNavigatePrevious?.();
  };

  const modifierKey = isMac ? "⌘" : "Ctrl";

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        display: isVisible ? "flex" : "none",
      }}
      transition={{ duration: 0.1 }}
      // Clicking/tapping the backdrop around the panel closes it.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="relative w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] bg-black/50 backdrop-blur-xl
                   bg-gradient-to-br from-black/60 to-gray-900/60 text-white rounded-xl
                   border border-white/20 shadow-2xl overflow-y-auto z-10 isolate m-4"
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.95,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: isNavigating ? 0 : 0.1,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="sticky top-0 mx-4 pt-0 z-20">
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 via-black/50 to-transparent backdrop-blur-2xl"
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div className="relative flex justify-between items-center pt-4">
            {/* Navigation buttons */}
            <div className="flex gap-2">
              <button
                onClick={onNavigatePrevious}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-xl
                           hover:bg-white/40 border border-white/10 transition-colors text-sm font-mono"
                title={`Previous section (${modifierKey}I)`}
              >
                <span className="text-white/70">‹</span>
                {mounted && !isMobile && (
                  <span className="text-white/70">{modifierKey}I</span>
                )}
              </button>
              <button
                onClick={onNavigateNext}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-xl
                           hover:bg-white/40 border border-white/10 transition-colors text-sm font-mono"
                title={`Next section (${modifierKey}O)`}
              >
                {mounted && !isMobile && (
                  <span className="text-white/70">{modifierKey}O</span>
                )}
                <span className="text-white/70">›</span>
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-xl
                         hover:bg-white/40 border border-white/10 transition-colors text-sm font-mono"
            >
              <span className="text-white/70">esc</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-6xl font-bold text-center pt-8 mt-4">{title}</h1>
        <p className="text-center text-xs text-gray-500 mt-3 pb-8">
          Last updated{" "}
          <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
        </p>
        <div className="px-6 py-8 sm:px-8">
          <div className="max-w-4xl mx-auto space-y-8">{children}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PanelShell;
