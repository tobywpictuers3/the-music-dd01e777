/**
 * חישוב הזווית של העיגול הפעיל.
 *
 * חלוקת השעון:
 * 12-2   = upperRight
 * 2-4    = right
 * 4-6    = lowerRight
 * 6-8    = lowerLeft
 * 8-10   = left
 * 10-12  = upperLeft
 */

import type { PresenterLook } from "./orbit.types";

export function normalizeClockAngleDeg(angleDeg: number): number {
  const normalized = angleDeg % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function clockAngleToLook(
  clockAngleDeg: number
): Exclude<PresenterLook, "default" | "stageSign"> {
  const angle = normalizeClockAngleDeg(clockAngleDeg);

  if (angle >= 0 && angle < 60) return "upperRight";
  if (angle >= 60 && angle < 120) return "right";
  if (angle >= 120 && angle < 180) return "lowerRight";
  if (angle >= 180 && angle < 240) return "lowerLeft";
  if (angle >= 240 && angle < 300) return "left";
  return "upperLeft";
}

export function getRenderedItemClockAngle(
  baseAngleDeg: number,
  rotationDeg: number
): number {
  return normalizeClockAngleDeg(baseAngleDeg + rotationDeg);
}

export function getOrbitItemPosition(
  clockAngleDeg: number,
  radiusPercent = 39
) {
  const radians = ((clockAngleDeg - 90) * Math.PI) / 180;

  const x = Math.cos(radians) * radiusPercent;
  const y = Math.sin(radians) * radiusPercent;

  return {
    left: `calc(50% + ${x}%)`,
    top: `calc(50% + ${y}%)`,
    transform: "translate(-50%, -50%)",
  } as const;
}
