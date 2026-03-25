import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Volume2, X } from "lucide-react";
import type { FloatingBubbleMessage } from "./orbit.types";
import { ORBIT_SETTINGS } from "./orbit.constants";

type CompactPresenterRailProps = {
  heroId: string;
  presenterSrc: string;
  presenterAlt?: string;
  label?: string;
  bubbleMessages?: FloatingBubbleMessage[];
  floorLightTextureSrc?: string;
  floorDarkTextureSrc?: string;
};

export default function CompactPresenterRail({
  heroId,
  presenterSrc,
  presenterAlt = "המגיש",
  label = "עזרה",
  bubbleMessages = [],
  floorLightTextureSrc,
  floorDarkTextureSrc,
}: CompactPresenterRailProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [bubble, setBubble] = useState<FloatingBubbleMessage | null>(null);
  const [bubbleFading, setBubbleFading] = useState(false);

  const hasMessages = bubbleMessages.length > 0;
  const bubbleMessagesKey = useMemo(
    () => bubbleMessages.map((item) => item.id).join("|"),
    [bubbleMessages]
  );

  useEffect(() => {
    const updateVisibility = () => {
      const hero = document.getElementById(heroId);

      if (!hero) {
        setIsVisible(false);
        return;
      }

      const rect = hero.getBoundingClientRect();
      setIsVisible(rect.bottom < 110);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [heroId]);

  useEffect(() => {
    const root = document.documentElement;

    if (!isVisible) {
      root.style.setProperty("--page-rail-offset", "0px");
      return;
    }

    const offset = bubble
      ? `${ORBIT_SETTINGS.compactRail.expandedOffsetPx}px`
      : `${ORBIT_SETTINGS.compactRail.collapsedOffsetPx}px`;

    root.style.setProperty("--page-rail-offset", offset);

    return () => {
      root.style.setProperty("--page-rail-offset", "0px");
    };
  }, [isVisible, bubble]);

  useEffect(() => {
    if (!isVisible || !hasMessages) {
      setBubble(null);
      setBubbleFading(false);
      return;
    }

    let cycleTimer: number | null = null;
    let fadeTimer: number | null = null;
    let hideTimer: number | null = null;
    let counter = 0;

    const showNext = () => {
      const next = bubbleMessages[counter % bubbleMessages.length];
      counter += 1;

      setBubble(next);
      setBubbleFading(false);

      fadeTimer = window.setTimeout(() => {
        setBubbleFading(true);
      }, ORBIT_SETTINGS.compactRail.bubbleHoldMs);

      hideTimer = window.setTimeout(() => {
        setBubble(null);
        setBubbleFading(false);
      }, ORBIT_SETTINGS.compactRail.bubbleHoldMs + ORBIT_SETTINGS.compactRail.bubbleFadeMs);

      cycleTimer = window.setTimeout(() => {
        showNext();
      }, ORBIT_SETTINGS.compactRail.bubbleLoopMs);
    };

    cycleTimer = window.setTimeout(showNext, 2600);

    return () => {
      if (cycleTimer) window.clearTimeout(cycleTimer);
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, [isVisible, hasMessages, bubbleMessages, bubbleMessagesKey]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[70] flex flex-col items-start gap-2 md:bottom-6 md:left-6">
      {bubble ? (
        <div
          dir="rtl"
          className="relative max-w-[230px] overflow-hidden rounded-[1.4rem] border border-white/10 shadow-[0_18px_46px_rgba(0,0,0,0.26)] backdrop-blur-sm transition-opacity duration-[6000ms]"
          style={{ opacity: bubbleFading ? 0 : 1 }}
        >
          <div className="pointer-events-none absolute inset-0">
            {floorLightTextureSrc ? (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 dark:hidden"
                style={{ backgroundImage: `url(${floorLightTextureSrc})` }}
              />
            ) : null}

            {floorDarkTextureSrc ? (
              <div
                className="absolute inset-0 hidden bg-cover bg-center opacity-50 dark:block"
                style={{ backgroundImage: `url(${floorDarkTextureSrc})` }}
              />
            ) : null}

            <div className="absolute inset-0 bg-background/68 dark:bg-background/72" />
          </div>

          <button
            type="button"
            onClick={() => {
              setBubble(null);
              setBubbleFading(false);
            }}
            className="absolute left-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/85 transition hover:bg-black/35"
            aria-label="סגירת הודעה"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-10 px-4 py-4 pr-4 text-sm leading-7 text-foreground">
            {bubble.text}
          </div>

          <div className="absolute -bottom-2 left-7 h-4 w-4 rotate-45 border-r border-b border-white/10 bg-background/85" />
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-card/92 text-primary shadow-lg transition hover:-translate-y-[1px] hover:bg-card"
          aria-label="צ׳אט עזרה"
        >
          <MessageCircle className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-card/92 text-primary shadow-lg transition hover:-translate-y-[1px] hover:bg-card"
          aria-label="השמעת תוכן"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        className="group relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/40 bg-card shadow-xl transition hover:scale-105"
        aria-label={label}
      >
        <img
          src={presenterSrc}
          alt={presenterAlt}
          className="h-full w-full object-cover object-top"
        />
      </button>

      <span className="rounded-full bg-card/92 px-3 py-1 text-xs font-semibold text-foreground shadow backdrop-blur">
        {label}
      </span>
    </div>
  );
}
