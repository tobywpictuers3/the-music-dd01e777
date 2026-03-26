/**
 * מנהל:
 * - תנועה איטית רציפה
 * - עצירה חלקה בהובר
 * - קביעת הזווית הפעילה של הדמות במרכז
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  clockAngleToLook,
  getRenderedItemClockAngle,
  normalizeClockAngleDeg,
} from "./angle.utils";
import type { OrbitItemConfig, OrbitItemId, PresenterLook } from "./orbit.types";

type UseOrbitHeroStateArgs = {
  items: OrbitItemConfig[];
  rotationSpeedDegPerSec: number;
  defaultLook: PresenterLook;
};

export function useOrbitHeroState({
  items,
  rotationSpeedDegPerSec,
  defaultLook,
}: UseOrbitHeroStateArgs) {
  const [rotationDeg, setRotationDeg] = useState(0);
  const [activeItemId, setActiveItemId] = useState<OrbitItemId | null>(null);

  const rotationRef = useRef(0);
  const speedRef = useRef(rotationSpeedDegPerSec);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const activeItemIdRef = useRef<OrbitItemId | null>(null);

  useEffect(() => {
    activeItemIdRef.current = activeItemId;
  }, [activeItemId]);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (lastTsRef.current === null) {
        lastTsRef.current = timestamp;
      }

      const dt = (timestamp - lastTsRef.current) / 1000;
      lastTsRef.current = timestamp;

      const isHovered = activeItemIdRef.current !== null;
      const targetSpeed = isHovered ? 0 : rotationSpeedDegPerSec;

      const easing = isHovered ? 8 : 3.5;
      speedRef.current += (targetSpeed - speedRef.current) * Math.min(1, easing * dt);

      rotationRef.current = normalizeClockAngleDeg(
        rotationRef.current + speedRef.current * dt
      );

      setRotationDeg(rotationRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [rotationSpeedDegPerSec]);

  const activeLook = useMemo<PresenterLook>(() => {
    if (!activeItemId) return defaultLook;

    const activeItem = items.find((item) => item.id === activeItemId);
    if (!activeItem) return defaultLook;

    const renderedClockAngle = getRenderedItemClockAngle(
      activeItem.baseAngleDeg,
      rotationDeg
    );

    return clockAngleToLook(renderedClockAngle);
  }, [activeItemId, defaultLook, items, rotationDeg]);

  return {
    rotationDeg,
    activeItemId,
    activeLook,
    setActiveItemId,
    clearActiveItem: () => setActiveItemId(null),
  };
}
