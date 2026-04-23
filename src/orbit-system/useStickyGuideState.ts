/**
 * קובע:
 * - מתי המגיש הקבוע מופיע (אחרי threshold של ה-hero)
 * - מתי הבאנר מופיע (מיד עם תחילת גלילה — tracking נפרד)
 * - איזו בועה פעילה כרגע
 */

import { useEffect, useMemo, useState, type RefObject } from "react";
import type {
  BubbleConfig,
  StickyGuideConfig,
  TickerBannerConfig,
} from "./orbit.types";

type UseStickyGuideStateArgs = {
  heroRef: RefObject<HTMLElement | null>;
  stickyGuide: StickyGuideConfig;
  tickerBanner: TickerBannerConfig;
  headerOffsetPx: number;
};

export function useStickyGuideState({
  heroRef,
  stickyGuide,
  tickerBanner,
  headerOffsetPx,
}: UseStickyGuideStateArgs) {
  const [afterActivationScrollPx, setAfterActivationScrollPx] = useState(0);
  const [rawFromHeroScrollPx, setRawFromHeroScrollPx] = useState(0);

  useEffect(() => {
    const update = () => {
      const heroEl = heroRef.current;
      if (!heroEl) return;

      const heroStartY = Math.max(heroEl.offsetTop - headerOffsetPx, 0);
      const heroHeight = heroEl.offsetHeight;

      const activationRatio = stickyGuide.activationRatio ?? 0.5;
      const activationOffsetPx = stickyGuide.activationOffsetPx ?? 0;

      const activationThresholdPx =
        Math.min(heroHeight * activationRatio, window.innerHeight * 0.52) +
        activationOffsetPx;

      const currentScrollY = window.scrollY;

      // מגיש: מופיע אחרי threshold
      const delta = Math.max(
        currentScrollY - (heroStartY + activationThresholdPx),
        0
      );
      setAfterActivationScrollPx(delta);

      // באנר: מופיע מיד עם תחילת גלילה (raw scroll מתחילת ה-hero)
      const rawDelta = Math.max(currentScrollY - heroStartY, 0);
      setRawFromHeroScrollPx(rawDelta);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headerOffsetPx, heroRef, stickyGuide.activationOffsetPx, stickyGuide.activationRatio]);

  const stickyVisible =
    afterActivationScrollPx >= (stickyGuide.showFromAfterHeroPx ?? 0);

  const bannerVisible =
    tickerBanner.enabled &&
    rawFromHeroScrollPx >= (tickerBanner.showFromAfterHeroPx ?? 0);

  const activeBubble = useMemo(() => {
    return (
      stickyGuide.bubbles.find(
        (bubble: BubbleConfig) =>
          afterActivationScrollPx >= bubble.showFromAfterHeroPx &&
          afterActivationScrollPx <= bubble.hideAfterHeroPx
      ) ?? null
    );
  }, [afterActivationScrollPx, stickyGuide.bubbles]);

  return {
    stickyVisible,
    bannerVisible,
    afterHeroScrollPx: afterActivationScrollPx,
    activeBubble,
  };
}
