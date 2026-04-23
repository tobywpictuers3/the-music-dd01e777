import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { BubbleConfig, ThemeMode } from "./orbit.types";

type SpeechBubbleLayerProps = {
  bubble: BubbleConfig | null;
  themeMode: ThemeMode;
};

export default function SpeechBubbleLayer({
  bubble,
  themeMode: _themeMode,
}: SpeechBubbleLayerProps) {
  const [dismissedBubbleId, setDismissedBubbleId] = useState<string | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const fullTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const currentBubbleIdRef = useRef<string | null>(null);

  function clearTimers() {
    if (fullTimerRef.current) {
      window.clearTimeout(fullTimerRef.current);
      fullTimerRef.current = null;
    }

    if (fadeTimerRef.current) {
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }

  function startLifecycle() {
    clearTimers();
    setIsFading(false);
    setIsRendered(true);

    fullTimerRef.current = window.setTimeout(() => {
      setIsFading(true);
    }, 2000);

    fadeTimerRef.current = window.setTimeout(() => {
      setIsRendered(false);
      setIsFading(false);
    }, 5000);
  }

  function closeImmediately() {
    clearTimers();
    setIsRendered(false);
    setIsFading(false);

    if (bubble?.id) {
      setDismissedBubbleId(bubble.id);
    }
  }

  useEffect(() => {
    if (!bubble) {
      clearTimers();
      setIsRendered(false);
      setIsFading(false);
      currentBubbleIdRef.current = null;
      return;
    }

    const isNewBubble = currentBubbleIdRef.current !== bubble.id;

    if (isNewBubble) {
      currentBubbleIdRef.current = bubble.id;
      setDismissedBubbleId(null);
      startLifecycle();
      return;
    }

    if (dismissedBubbleId === bubble.id) {
      setIsRendered(false);
      setIsFading(false);
      return;
    }

    if (!isRendered && !isFading) {
      startLifecycle();
    }

    return () => {
      clearTimers();
    };
  }, [bubble, dismissedBubbleId, isRendered, isFading]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  if (!bubble) return null;
  if (dismissedBubbleId === bubble.id) return null;
  if (!isRendered && !isFading) return null;

  const transitionMs = isFading ? 3000 : bubble.enterMs ?? 180;
  const bubbleWidth = Math.min(bubble.maxWidthPx ?? 360, 360);

  return (
    <div
      className="absolute left-[calc(100%+18px)] bottom-[122px] z-50"
      style={{
        transform: `translate(${bubble.offsetX ?? 0}px, ${bubble.offsetY ?? 0}px)`,
      }}
      onMouseEnter={() => {
        clearTimers();
        setIsFading(false);
      }}
      onMouseLeave={() => {
        startLifecycle();
      }}
    >
      <div
        className="relative overflow-hidden rounded-[14px] backdrop-blur-[8px]"
        style={{
          width: `min(${Math.round(bubbleWidth / 3)}px, 8vw)`,
          minWidth: "93px",
          minHeight: "73px",
          borderColor: "transparent",
          backgroundColor: "transparent",
          boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
          opacity: isFading ? 0 : 1,
          transform: isFading ? "translateY(6px)" : "translateY(0px)",
          transition: `opacity ${transitionMs}ms linear, transform ${transitionMs}ms linear`,
        }}
      >
        {/* Glass body — ultra-subtle tint */}
        <span
          className="absolute inset-0 rounded-[14px]"
          style={{
            background: "radial-gradient(circle at 50% 55%, rgba(202,95,33,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Glass bottom caustic */}
        <span
          className="absolute inset-0 rounded-[14px]"
          style={{
            background: "radial-gradient(ellipse 88% 52% at 50% 100%, rgba(168,72,90,0.55) 0%, rgba(202,95,33,0.22) 42%, transparent 68%)",
          }}
        />

        {/* Glass top specular */}
        <span
          className="absolute inset-0 rounded-[14px]"
          style={{
            background: "radial-gradient(ellipse 38% 22% at 36% 14%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.06) 44%, transparent 64%)",
          }}
        />

        <button
          type="button"
          onClick={closeImmediately}
          aria-label="סגירת בועה"
          className="absolute left-1 top-1 z-20 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/25 text-white ring-1 ring-white/10 transition hover:bg-black/40"
        >
          <X className="h-2.5 w-2.5" />
        </button>

        <div className="relative z-10 flex min-h-[55px] flex-col justify-center px-2 py-2 text-right">
          <div
            className="text-[0.46rem] leading-[1.4]"
            style={{
              color: "#ffffff",
              textShadow: "0 1px 6px rgba(0,0,0,0.45)",
            }}
          >
            {bubble.text}
          </div>
        </div>

        {/* Tail pointer */}
        <span
          className="absolute bottom-4 -left-1.5 h-3 w-3 rotate-45 rounded-[2px]"
          style={{
            background: "rgba(168,72,90,0.45)",
          }}
        />
      </div>
    </div>
  );
}
