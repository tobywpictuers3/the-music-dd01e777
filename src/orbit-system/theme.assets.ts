/**
 * כל הנכסים שתלויים במצב כהה/בהיר.
 * אם תרצי לשנות שמות קבצים או נתיבים - זה המקום.
 */

import type { ThemeMode } from "./orbit.types";

import stageBgLight from "@/assets/orbit-system/stage/light/stage-bg.webp";
import stageBgDark from "@/assets/orbit-system/stage/dark/stage-bg.webp";

import orbitStarsLight from "@/assets/orbit-system/ui/light/orbit-stars.webp";
import orbitStarsDark from "@/assets/orbit-system/ui/dark/orbit-stars.webp";

import tickerFloorLight from "@/assets/orbit-system/ui/light/ticker-floor.webp";
import tickerFloorDark from "@/assets/orbit-system/ui/dark/ticker-floor.webp";

import bubbleStarsRedLight from "@/assets/orbit-system/ui/light/bubble-stars-red.webp";
import bubbleStarsRedDark from "@/assets/orbit-system/ui/dark/bubble-stars-red.webp";

export const themeAssets = {
  light: {
    stageBg: stageBgLight,
    orbitStars: orbitStarsLight,
    tickerFloor: tickerFloorLight,
    bubbleStarsRed: bubbleStarsRedLight,
  },
  dark: {
    stageBg: stageBgDark,
    orbitStars: orbitStarsDark,
    tickerFloor: tickerFloorDark,
    bubbleStarsRed: bubbleStarsRedDark,
  },
} as const;

export function getThemeAssets(mode: ThemeMode) {
  return themeAssets[mode];
}
