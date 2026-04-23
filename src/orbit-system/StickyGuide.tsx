import { useEffect, useRef, useState } from "react";
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

  const enterMs = activeBubble?.enterMs ?? 260;
  const exitMs = activeBubble?.exitMs ?? 220;
  const holdMs = activeBubble?.holdMs ?? 2200;
  const fadeMs = activeBubble?.fadeMs ?? 6000;
  const maxWidthPx = activeBubble?.maxWidthPx ?? 180;
  const offsetX = activeBubble?.offsetX ?? 0;
  const offsetY = activeBubble?.offsetY ?? 0;

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
    }, holdMs);

    hideTimerRef.current = window.setTimeout(() => {
      setBubbleVisible(false);
      setBubbleFading(false);
    }, holdMs + fadeMs);
  }

  function openBubble(text: string) {
    setBubbleText(text);
    setBubbleVisible(true);
    setBubbleFading(false);
    scheduleBubbleFade();
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

  const presenterWidth = "clamp(72px, 6.8vw, 100px)";

  return (
    <div
      dir="ltr"
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
      <div className="pointer-events-auto relative inline-block">
        {/* Speech bubble — floats above the presenter, tail points down-left toward mouth */}
        <div
          className="absolute"
          style={{
            bottom: `calc(${presenterWidth} * 0.62 + 6px)`,
            left: "46%",
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            opacity: bubbleVisible ? (bubbleFading ? 0 : 1) : 0,
            transition: bubbleVisible
              ? bubbleFading
                ? `opacity ${fadeMs}ms ease`
                : `opacity ${enterMs}ms ease, transform ${enterMs}ms cubic-bezier(0.22,1,0.36,1)`
              : `opacity ${exitMs}ms ease`,
            pointerEvents: bubbleVisible ? "auto" : "none",
          }}
          onMouseEnter={handleBubbleMouseEnter}
          onMouseLeave={handleBubbleMouseLeave}
        >
          {/* Bubble body */}
          <div
            className="relative overflow-hidden"
            style={{
              maxWidth: `${maxWidthPx}px`,
              minWidth: 0,
              borderRadius: "1.4rem",
              padding: "8px 14px 10px",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.04) 0%, rgba(255,90,10,0.18) 60%, rgba(255,60,0,0.32) 100%)",
              border: "1px solid rgba(255,120,20,0.28)",
              boxShadow:
                "0 6px 28px rgba(255,80,0,0.18), inset 0 1px 0 rgba(255,200,100,0.12)",
            }}
          >
            {/* Decorative background stars layer */}
            {assets.bubbleStarsRed && (
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `url(${assets.bubbleStarsRed})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.1,
                  borderRadius: "inherit",
                }}
              />
            )}

            {/* Fire gradient text */}
            <p
              className="relative z-10 text-right leading-[1.55] font-medium"
              style={{
                fontSize: "clamp(0.72rem, 1.05vw, 0.82rem)",
                whiteSpace: "normal",
                wordBreak: "keep-all",
                overflowWrap: "break-word",
                background:
                  "linear-gradient(to bottom, #ffdd55 0%, #ff8800 42%, #ff3300 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: 0,
              }}
            >
              {bubbleText}
            </p>
          </div>

          {/* Tail — bottom-left triangle pointing down toward the presenter's mouth */}
          <span
            style={{
              position: "absolute",
              bottom: "-10px",
              left: "18px",
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: "11px solid rgba(255,75,10,0.42)",
              filter: "drop-shadow(0 2px 4px rgba(255,60,0,0.2))",
            }}
          />
        </div>

        {/* Presenter image */}
        <img
          src={presenter.looks.default.src}
          alt={presenter.looks.default.alt}
          className="pointer-events-none h-auto object-contain"
          style={{
            width: presenterWidth,
            maxWidth: "100px",
            filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.22))",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
