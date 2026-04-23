import type { OrbitPageDesignConfig } from "./orbit.types";

export const defaultOrbitPageDesign: OrbitPageDesignConfig = {
  layout: {
    contentLeftOffsetPx: 220,
  },

  hero: {
    headerOffsetPx: 96,
  },

  orbit: {
    rotationSpeedDegPerSec: 1.05,
    defaultLook: "default",
  },

  stickyGuide: {
    idleLook: "default",
    activationOffsetPx: 0,
    activationRatio: 0.5,
    showFromAfterHeroPx: 0,
    bubble: {
      maxWidthPx: 180,
      offsetX: 0,
      offsetY: 0,
      enterMs: 240,
      exitMs: 180,
      holdMs: 2400,
      fadeMs: 5200,
      dismissible: true,
    },
  },

  tickerBanner: {
    enabled: true,
    heightPx: 48,
    bottomOffsetPx: 0,
    opacity: 0.92,
    loopDurationSec: 38,
    showFromAfterHeroPx: 0,
    enterMs: 320,
    exitMs: 260,
  },
};

export function mergeOrbitPageDesign(
  overrides?: Partial<OrbitPageDesignConfig>
): OrbitPageDesignConfig {
  return {
    layout: {
      ...defaultOrbitPageDesign.layout,
      ...(overrides?.layout ?? {}),
    },
    hero: {
      ...defaultOrbitPageDesign.hero,
      ...(overrides?.hero ?? {}),
    },
    orbit: {
      ...defaultOrbitPageDesign.orbit,
      ...(overrides?.orbit ?? {}),
    },
    stickyGuide: {
      ...defaultOrbitPageDesign.stickyGuide,
      ...(overrides?.stickyGuide ?? {}),
      bubble: {
        ...defaultOrbitPageDesign.stickyGuide.bubble,
        ...(overrides?.stickyGuide?.bubble ?? {}),
      },
    },
    tickerBanner: {
      ...defaultOrbitPageDesign.tickerBanner,
      ...(overrides?.tickerBanner ?? {}),
    },
  };
}
