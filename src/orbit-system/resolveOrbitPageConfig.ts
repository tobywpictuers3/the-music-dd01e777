import { mergeOrbitPageDesign } from "./orbit.design";
import type {
  BubbleConfig,
  OrbitPageContentConfig,
  OrbitPageDesignConfig,
  PageConfig,
  PageId,
} from "./orbit.types";

type ResolveOrbitPageConfigArgs = {
  pageId: PageId;
  route: string;
  content: OrbitPageContentConfig;
  design?: Partial<OrbitPageDesignConfig>;
};

function resolveBubbleConfig(
  bubble: NonNullable<OrbitPageContentConfig["stickyGuide"]>["bubbles"][number],
  mergedDesign: OrbitPageDesignConfig
): BubbleConfig {
  return {
    id: bubble.id,
    text: bubble.text,
    showFromAfterHeroPx: bubble.showFromAfterHeroPx,
    hideAfterHeroPx: bubble.hideAfterHeroPx,
    dismissible:
      bubble.dismissible ?? mergedDesign.stickyGuide.bubble.dismissible,
    maxWidthPx: mergedDesign.stickyGuide.bubble.maxWidthPx,
    offsetX: mergedDesign.stickyGuide.bubble.offsetX,
    offsetY: mergedDesign.stickyGuide.bubble.offsetY,
    enterMs: mergedDesign.stickyGuide.bubble.enterMs,
    exitMs: mergedDesign.stickyGuide.bubble.exitMs,
    holdMs: mergedDesign.stickyGuide.bubble.holdMs,
    fadeMs: mergedDesign.stickyGuide.bubble.fadeMs,
  };
}

export function resolveOrbitPageConfig({
  pageId,
  route,
  content,
  design,
}: ResolveOrbitPageConfigArgs): PageConfig {
  const mergedDesign = mergeOrbitPageDesign(design);

  const stickyGuideContent = content.stickyGuide;
  const tickerBannerContent = content.tickerBanner;

  return {
    pageId,
    route,
    presenterId: content.presenterId,

    hero: {
      titleLines: content.hero.titleLines,
      introLines: content.hero.introLines,
      headerOffsetPx: mergedDesign.hero.headerOffsetPx,
    },

    orbit: {
      items: content.orbit.items.map((item) => ({ ...item })),
      rotationSpeedDegPerSec: mergedDesign.orbit.rotationSpeedDegPerSec,
      defaultLook: mergedDesign.orbit.defaultLook,
    },

    stickyGuide: {
      idleLook: mergedDesign.stickyGuide.idleLook,
      activationOffsetPx:
        stickyGuideContent?.activationOffsetPx ??
        mergedDesign.stickyGuide.activationOffsetPx,
      activationRatio:
        stickyGuideContent?.activationRatio ??
        mergedDesign.stickyGuide.activationRatio,
      showFromAfterHeroPx:
        stickyGuideContent?.showFromAfterHeroPx ??
        mergedDesign.stickyGuide.showFromAfterHeroPx,
      bubbles: (stickyGuideContent?.enabled === false
        ? []
        : stickyGuideContent?.bubbles ?? []
      ).map((bubble) => resolveBubbleConfig(bubble, mergedDesign)),
    },

    tickerBanner: {
      enabled:
        tickerBannerContent?.enabled ?? mergedDesign.tickerBanner.enabled,
      items: tickerBannerContent?.items ?? [],
      heightPx: mergedDesign.tickerBanner.heightPx,
      bottomOffsetPx: mergedDesign.tickerBanner.bottomOffsetPx,
      opacity: mergedDesign.tickerBanner.opacity,
      loopDurationSec: mergedDesign.tickerBanner.loopDurationSec,
      showFromAfterHeroPx:
        tickerBannerContent?.showFromAfterHeroPx ??
        mergedDesign.tickerBanner.showFromAfterHeroPx,
      enterMs: mergedDesign.tickerBanner.enterMs,
      exitMs: mergedDesign.tickerBanner.exitMs,
    },
  };
}
