import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ExternalLink } from "lucide-react";
import Spinner from "@/components/Spinner";

interface LinkPreviewBadgeProps {
  link: string;
  display: string;
  openInNewTab?: boolean;
  isBlocked?: boolean;
}

/**
 * A simplified link badge with preview that balances responsiveness with usability.
 * Shows preview on hover and immediately hides it when mouse leaves the badge.
 * Positions the preview intelligently based on screen position to avoid clipping.
 */
const LinkPreviewBadge: React.FC<LinkPreviewBadgeProps> = ({
  link,
  display,
  openInNewTab = true,
  isBlocked = false,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, width: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(isBlocked);
  const [hoverStart, setHoverStart] = useState<number | null>(null);
  const [previewPosition, setPreviewPosition] = useState<"left" | "right">(
    "right"
  );

  // Set up load error detection
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (showPreview && !isLoaded && !loadError && !isBlocked) {
      timer = setTimeout(() => {
        if (!isLoaded) {
          setLoadError(true);
        }
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showPreview, isLoaded, loadError, isBlocked]);

  // Handle scroll/gesture events
  useEffect(() => {
    function handleScrollOrGesture() {
      hidePreviewImmediately();
    }

    if (showPreview) {
      window.addEventListener("scroll", handleScrollOrGesture, {
        passive: true,
      });
      window.addEventListener("wheel", handleScrollOrGesture, {
        passive: true,
      });
      window.addEventListener("touchmove", handleScrollOrGesture, {
        passive: true,
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScrollOrGesture);
      window.removeEventListener("wheel", handleScrollOrGesture);
      window.removeEventListener("touchmove", handleScrollOrGesture);
    };
  }, [showPreview]);

  function handleMouseEnter(e: React.MouseEvent<HTMLSpanElement>) {
    setHoverStart(Date.now());
    setShowPreview(true);

    const rect = e.currentTarget.getBoundingClientRect();

    // Determine if we're on the right side of the screen
    // Use window.innerWidth to get the viewport width
    const isRightSide = rect.left > window.innerWidth / 2;

    // Set the position based on where we are on the screen
    setPreviewPosition(isRightSide ? "left" : "right");

    setCoords({
      x: rect.left,
      y: rect.bottom + window.scrollY,
      width: rect.width,
    });
  }

  function handleMouseLeave() {
    // Hide preview immediately when mouse leaves the badge
    hidePreviewImmediately();
  }

  function hidePreviewImmediately() {
    setShowPreview(false);
    resetPreviewState();
  }

  function resetPreviewState() {
    setIsLoaded(false);
    setLoadError(isBlocked);
    setHoverStart(null);
  }

  function handlePreviewClick() {
    if (openInNewTab) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = link;
    }
  }

  // Extract domain from the link
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return "This site";
    }
  };

  return (
    <span
      className="inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* The Badge */}
      <a
        href={link}
        target={openInNewTab ? "_blank" : "_self"}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        className="inline-flex items-center px-2 py-px rounded-md bg-gray-200 text-gray-900 text-sm font-medium hover:bg-gray-300 transition-colors"
      >
        {display}
        {openInNewTab && <ExternalLink className="ml-1 h-4 w-4" />}
      </a>

      {/* The Preview rendered via a portal */}
      {showPreview &&
        createPortal(
          <div
            className="absolute"
            style={{
              top: coords.y + 5,
              left: previewPosition === "right" ? coords.x : "auto",
              right:
                previewPosition === "left"
                  ? `calc(100vw - ${coords.x + coords.width}px)`
                  : "auto",
              position: "absolute",
              zIndex: 99999,
              cursor: "pointer",
            }}
            onClick={handlePreviewClick}
          >
            {!loadError ? (
              <div className="w-96 h-64 bg-white shadow-lg border border-gray-300 rounded-md overflow-hidden">
                {!isLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Spinner variant="dark" />
                  </div>
                )}
                <div
                  style={{
                    width: "1200px",
                    height: "900px",
                    transform: "scale(0.4)",
                    transformOrigin: "top left",
                    display: isLoaded ? "block" : "none",
                  }}
                >
                  <iframe
                    src={link}
                    title="Link preview"
                    style={{
                      width: "1200px",
                      height: "900px",
                      border: "none",
                      pointerEvents: "none",
                    }}
                    onLoad={(e) => {
                      if (hoverStart && Date.now() - hoverStart < 200) {
                        setLoadError(true);
                        return;
                      }
                      try {
                        const iframe = e.currentTarget;
                        const doc =
                          iframe.contentDocument ||
                          iframe.contentWindow?.document;
                        if (
                          doc &&
                          doc.body.innerText.toLowerCase().includes("refused")
                        ) {
                          setLoadError(true);
                        } else {
                          setIsLoaded(true);
                        }
                      } catch (err) {
                        setIsLoaded(true);
                      }
                    }}
                    onError={() => setLoadError(true)}
                  />
                </div>
              </div>
            ) : (
              <div className="w-80 bg-white text-black shadow-lg border border-gray-300 rounded-md p-4">
                <p className="text-sm font-medium">Preview Unavailable</p>
                <p className="text-xs text-gray-600 mt-1">
                  {getDomain(link)} either blocks embedding or could not be
                  loaded.
                </p>
              </div>
            )}
          </div>,
          document.body
        )}
    </span>
  );
};

export default LinkPreviewBadge;
