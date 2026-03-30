/**
 * קובע:
 * - מתי המגיש הקבוע מופיע
 * - מתי הבאנר מופיע
 * - איזו בועה פעילה כרגע
 *
 * ההופעה מתחילה רק כשההירו נגלל בערך לחצי גובהו.
 */

import { useEffect, useMemo, useState, type RefObject } from "react";
import type { BubbleConfig } from "./orbit.types";

type UseStickyGuideStateArgs = {
  heroRef: RefObject<HTMLElement | null>;
  bubbles: BubbleConfig[];
  headerOffsetPx: number;
};

export function useStickyGuideState({
  heroRef,
  bubbles,
  headerOffsetPx,
}: UseStickyGuideStateArgs) {
  const [afterActivationScrollPx, setAfterActivationScrollPx] = useState(0);

  useEffect(() => {
    const update = () => {
      const heroEl = heroRef.current;
      if (!heroEl) return;

      const heroStartY = Math.max(heroEl.offsetTop - headerOffsetPx, 0);
      const heroHeight = heroEl.offsetHeight;
      const activationThresholdPx = Math.min(
        heroHeight * 0.5,
        window.innerHeight * 0.52
      );

      const currentScrollY = window.scrollY;
      const delta = Math.max(
        currentScrollY - (heroStartY + activationThresholdPx),
        0
      );

      setAfterActivationScrollPx(delta);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headerOffsetPx, heroRef]);

  const stickyVisible = afterActivationScrollPx > 0;
  const bannerVisible = stickyVisible;

  const activeBubble = useMemo(() => {
    return (
      bubbles.find(
        (bubble) =>
          afterActivationScrollPx >= bubble.showFromAfterHeroPx &&
          afterActivationScrollPx <= bubble.hideAfterHeroPx
      ) ?? null
    );
  }, [afterActivationScrollPx, bubbles]);

  return {
    stickyVisible,
    bannerVisible,
    afterHeroScrollPx: afterActivationScrollPx,
    activeBubble,
  };
}
