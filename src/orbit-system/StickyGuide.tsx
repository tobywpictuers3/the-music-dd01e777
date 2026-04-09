import { useEffect, useRef, useState } from "react";
import { Quote, X } from "lucide-react";
import { getThemeAssets } from "./theme.assets";
import type {
  BubbleConfig,
  PresenterConfig,
  ThemeMode,
} from "./orbit.types";

type StickyGuideProps = {
  presenter: PresenterConfig;
  themeMode: ThemeMode;
  visible: boolean;
  activeBubble: BubbleConfig | null;
  bannerHeightPx: number;
  bannerBottomOffsetPx: number;
  dockOffsetPx?: number;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function StickyGuide({
  presenter,
  themeMode,
  visible,
  activeBubble,
  bannerHeightPx,
  bannerBottomOffsetPx,
  dockOffsetPx = 0,
}: StickyGuideProps) {
  const assets = getThemeAssets(themeMode);

  const [bubbleText, setBubbleText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleFading, setBubbleFading] = useState(false);
  const [dismissedBubbleId, setDismissedBubbleId] = useState<string | null>(null);

  const currentBubbleIdRef = useRef<string | null>(null);
  const bubbleHoverRef = useRef(false);
  const fadeStartTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  function clearBubbleTimers() {
    if (fadeStartTimerRef.current) {
      window.clearTimeout(fadeStartTimerRef.current);
      fadeStartTimerRef.current = null;
    }

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }

  function scheduleBubbleFade() {
    if (bubbleHoverRef.current) return;

    clearBubbleTimers();
    setBubbleFading(false);

    fadeStartTimerRef.current = window.setTimeout(() => {
      setBubbleFading(true);
    }, 2000);

    hideTimerRef.current = window.setTimeout(() => {
      setBubbleVisible(false);
      setBubbleFading(false);
    }, 10000);
  }

  function openBubble(text: string) {
    setBubbleText(text);
    setBubbleVisible(true);
    setBubbleFading(false);
    scheduleBubbleFade();
  }

  function closeBubble() {
    clearBubbleTimers();
    setBubbleVisible(false);
    setBubbleFading(false);

    if (activeBubble?.id) {
      setDismissedBubbleId(activeBubble.id);
    }
  }

  function handleBubbleMouseEnter() {
    bubbleHoverRef.current = true;
    clearBubbleTimers();
    setBubbleFading(false);
  }

  function handleBubbleMouseLeave() {
    bubbleHoverRef.current = false;
    scheduleBubbleFade();
  }

  useEffect(() => {
    if (!visible) {
      clearBubbleTimers();
      setBubbleVisible(false);
      setBubbleFading(false);
      return;
    }

    if (!activeBubble) {
      clearBubbleTimers();
      setBubbleVisible(false);
      setBubbleFading(false);
      currentBubbleIdRef.current = null;
      return;
    }

    const isNewBubble = currentBubbleIdRef.current !== activeBubble.id;

    if (isNewBubble) {
      currentBubbleIdRef.current = activeBubble.id;
      setDismissedBubbleId(null);
      openBubble(activeBubble.text);
      return;
    }

    if (dismissedBubbleId === activeBubble.id) {
      setBubbleVisible(false);
      setBubbleFading(false);
      return;
    }

    if (!bubbleVisible) {
      openBubble(activeBubble.text);
      return;
    }

    if (bubbleText !== activeBubble.text) {
      setBubbleText(activeBubble.text);
    }
  }, [visible, activeBubble, dismissedBubbleId, bubbleVisible, bubbleText]);

  useEffect(() => {
    return () => {
      clearBubbleTimers();
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-[clamp(8px,1.4vw,22px)] z-[70] hidden xl:block"
      style={{
        bottom: `${bannerHeightPx + bannerBottomOffsetPx + 8 + dockOffsetPx}px`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(-140px)",
        transition:
          "bottom 120ms linear, opacity 380ms ease, transform 520ms cubic-bezier(0.22,1,0.36,1)",
      }}
      aria-hidden={!visible}
    >
      <div
        className={cn(
          "pointer-events-auto flex items-end gap-4 transition-transform duration-300",
          bubbleVisible ? "translate-x-6" : "translate-x-0"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <img
            src={presenter.looks.default.src}
            alt={presenter.looks.default.alt}
            className="pointer-events-none h-auto object-contain"
            style={{
              width: "clamp(82px, 7.8vw, 116px)",
              maxWidth: "116px",
              filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.24))",
            }}
          />
        </div>

        <div
          className={cn(
            "transition-all",
            bubbleVisible
              ? bubbleFading
                ? "translate-y-2 opacity-0 [transition-duration:8000ms]"
                : "translate-y-0 opacity-100 duration-300"
              : "pointer-events-none translate-y-4 opacity-0 duration-300"
          )}
        >
          <div
            onMouseEnter={handleBubbleMouseEnter}
            onMouseLeave={handleBubbleMouseLeave}
            className="relative overflow-visible rounded-[1.6rem] border px-5 py-5 shadow-[0_22px_54px_rgba(0,0,0,0.24)] backdrop-blur-sm"
            style={{
              maxWidth: "360px",
              minWidth: "300px",
              borderColor:
                themeMode === "dark"
                  ? "rgba(255,255,255,0.16)"
                  : "rgba(120,30,30,0.14)",
              backgroundColor:
                themeMode === "dark"
                  ? "rgba(76,52,34,0.86)"
                  : "rgba(152,116,78,0.76)",
            }}
          >
            <span
              className="absolute inset-0 rounded-[1.6rem]"
              style={{
                backgroundImage: `url(${assets.bubbleStarsRed})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.26,
              }}
            />

            <span
              className="absolute left-[-18px] top-1/2 z-10 -translate-y-1/2 border-y-[16px] border-y-transparent border-r-[28px]"
              style={{
                borderRightColor:
                  themeMode === "dark"
                    ? "rgba(122,87,52,0.96)"
                    : "rgba(152,116,78,0.96)",
              }}
            />

            <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/18 ring-1 ring-white/10">
                <Quote className="h-5 w-5 text-primary" />
              </div>

              <button
                type="button"
                onClick={closeBubble}
                aria-label="סגירת בועה"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white ring-1 ring-white/10 transition hover:bg-black/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative z-10 rounded-[1.3rem] bg-black/10 px-4 py-3 backdrop-blur-[2px] dark:bg-black/12">
              <div className="text-right text-base leading-8 text-foreground/95">
                “{bubbleText}”
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
