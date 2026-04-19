import { useMemo, type CSSProperties } from "react";
import { getThemeAssets } from "./theme.assets";
import { getOrbitItemPosition, getRenderedItemClockAngle } from "./angle.utils";
import type {
  OrbitItemConfig,
  OrbitItemId,
  ThemeMode,
} from "./orbit.types";

type OrbitWheelProps = {
  items: OrbitItemConfig[];
  rotationDeg: number;
  activeItemId: OrbitItemId | null;
  themeMode: ThemeMode;
  onItemEnter: (itemId: OrbitItemId) => void;
  onItemLeave: () => void;
  onItemClick?: (item: OrbitItemConfig) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getSpoilerClampStyle(lines: number): CSSProperties {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}

type MeasuredItem = {
  item: OrbitItemConfig;
  hasRichContent: boolean;
  titleText: string;
  spoilerText: string;
  eyebrowText?: string;
  minSizePx: number;
  maxSizePx: number;
  fluidVw: number;
  radiusPercent: number;
  spoilerLines: number;
};

function measureOrbitItem(item: OrbitItemConfig): MeasuredItem {
  const titleText = (item.title ?? item.label).trim();
  const spoilerText = (item.spoiler ?? "").trim();
  const eyebrowText = item.eyebrow?.trim();

  const hasRichContent = Boolean(item.title || item.spoiler || item.eyebrow);

  if (!hasRichContent) {
    return {
      item,
      hasRichContent: false,
      titleText,
      spoilerText,
      eyebrowText,
      minSizePx: 142,
      maxSizePx: 236,
      fluidVw: 15.5,
      radiusPercent: clamp(34.5 + (item.radiusBoostPercent ?? 0), 34.5, 45.5),
      spoilerLines: 0,
    };
  }

  const titleLength = titleText.length;
  const spoilerLength = spoilerText.length;
  const eyebrowLength = eyebrowText?.length ?? 0;

  const textScore =
    titleLength * 1.35 +
    Math.min(spoilerLength, 140) * 0.56 +
    eyebrowLength * 0.32;

  const requestedMin = item.minBubbleSizePx ?? 168;
  const requestedMax = item.maxBubbleSizePx ?? 284;

  const maxSizePx = clamp(
    184 + textScore * 0.55,
    requestedMin + 10,
    requestedMax
  );
  const minSizePx = clamp(maxSizePx * 0.74, requestedMin, maxSizePx - 12);
  const fluidVw = clamp(maxSizePx / 13.8, 16.2, 20.2);

  const autoRadiusBoost =
    Math.max(maxSizePx - 210, 0) / 13 +
    Math.max(spoilerLength - 44, 0) / 34;

  const radiusPercent = clamp(
    34.5 + autoRadiusBoost + (item.radiusBoostPercent ?? 0),
    34.5,
    45.5
  );

  return {
    item,
    hasRichContent: true,
    titleText,
    spoilerText,
    eyebrowText,
    minSizePx,
    maxSizePx,
    fluidVw,
    radiusPercent,
    spoilerLines: item.maxSpoilerLines ?? 3,
  };
}

export default function OrbitWheel({
  items,
  rotationDeg,
  activeItemId,
  themeMode,
  onItemEnter,
  onItemLeave,
  onItemClick,
}: OrbitWheelProps) {
  const assets = getThemeAssets(themeMode);

  const measuredItems = useMemo(() => items.map(measureOrbitItem), [items]);

  const maxRadiusPercent = measuredItems.reduce(
    (maxValue, current) => Math.max(maxValue, current.radiusPercent),
    34.5
  );

  const outerRingInsetPercent = clamp(
    50 - (maxRadiusPercent + 4.2),
    5.5,
    13.5
  );
  const innerRingInsetPercent = clamp(
    50 - (maxRadiusPercent - 4.8),
    13.5,
    22.5
  );

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[840px]">
      <div
        className="absolute rounded-full border"
        style={{
          inset: `${outerRingInsetPercent}%`,
          borderColor:
            themeMode === "dark"
              ? "rgba(255,255,255,0.12)"
              : "rgba(120,30,30,0.12)",
          boxShadow:
            themeMode === "dark"
              ? "0 0 44px rgba(255,255,255,0.05)"
              : "0 0 34px rgba(120,30,30,0.06)",
          transition:
            "inset 260ms ease, border-color 700ms ease, box-shadow 700ms ease",
        }}
      />

      <div
        className="absolute rounded-full border"
        style={{
          inset: `${innerRingInsetPercent}%`,
          borderStyle: "dashed",
          borderColor:
            themeMode === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(120,30,30,0.10)",
          transition: "inset 260ms ease, border-color 700ms ease",
        }}
      />

      {measuredItems.map((measured) => {
        const { item } = measured;

        const renderedAngle = getRenderedItemClockAngle(
          item.baseAngleDeg,
          rotationDeg
        );

        const position = getOrbitItemPosition(
          renderedAngle,
          measured.radiusPercent
        );
        const isActive = item.id === activeItemId;
        const ariaText = measured.titleText || item.label;

        return (
          <button
            key={item.id}
            type="button"
            className="absolute z-20 overflow-hidden rounded-full border backdrop-blur-[4px]"
            style={{
              ...position,
              width: `clamp(${Math.round(
                measured.minSizePx
              )}px, ${measured.fluidVw}vw, ${Math.round(
                measured.maxSizePx
              )}px)`,
              height: `clamp(${Math.round(
                measured.minSizePx
              )}px, ${measured.fluidVw}vw, ${Math.round(
                measured.maxSizePx
              )}px)`,
              borderColor: isActive
                ? themeMode === "dark"
                  ? "rgba(255,235,205,0.74)"
                  : "rgba(170,90,30,0.34)"
                : themeMode === "dark"
                ? "rgba(255,255,255,0.24)"
                : "rgba(120,30,30,0.14)",
              backgroundColor: isActive
                ? themeMode === "dark"
                  ? "rgba(64, 14, 22, 0.52)"
                  : "rgba(183, 57, 70, 0.22)"
                : themeMode === "dark"
                ? "rgba(54, 12, 20, 0.32)"
                : "rgba(158, 41, 55, 0.14)",
              boxShadow: isActive
                ? "0 0 28px rgba(220,170,90,0.18)"
                : "0 12px 24px rgba(0,0,0,0.08)",
              transform: `${position.transform} scale(${
                isActive ? 1.04 : 1
              })`,
              transition:
                "transform 220ms ease, width 260ms ease, height 260ms ease, border-color 700ms ease, background-color 700ms ease, box-shadow 700ms ease",
            }}
            onMouseEnter={() => onItemEnter(item.id)}
            onMouseLeave={onItemLeave}
            onFocus={() => onItemEnter(item.id)}
            onBlur={onItemLeave}
            onClick={() => onItemClick?.(item)}
            aria-label={ariaText}
          >
            <span
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${assets.bubbleStarsRed})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: isActive ? 0.74 : 0.5,
                transition: "opacity 280ms ease",
              }}
            />

            <span
              className="absolute inset-0"
              style={{
                background: isActive
                  ? "linear-gradient(to bottom, rgba(255,224,170,0.22), rgba(146,34,46,0.30))"
                  : "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(120,18,30,0.10))",
                transition: "background 280ms ease",
              }}
            />

            <span
              className="absolute inset-0"
              style={{
                background:
                  themeMode === "dark"
                    ? "radial-gradient(circle at top, rgba(255,255,255,0.04), rgba(0,0,0,0.12))"
                    : "radial-gradient(circle at top, rgba(255,255,255,0.24), rgba(255,255,255,0.06))",
                transition: "background 700ms ease",
              }}
            />

            {measured.hasRichContent ? (
              <span className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 py-5 text-center">
                {measured.eyebrowText ? (
                  <span
                    className="mb-2 inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.22em]"
                    style={{
                      color: themeMode === "dark" ? "#ffe8be" : "#8f5d18",
                      borderColor:
                        themeMode === "dark"
                          ? "rgba(255,240,210,0.22)"
                          : "rgba(143,93,24,0.18)",
                      backgroundColor:
                        themeMode === "dark"
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(255,255,255,0.34)",
                    }}
                  >
                    {measured.eyebrowText}
                  </span>
                ) : null}

                <span
                  className="text-[clamp(0.98rem,1.45vw,1.42rem)] font-bold leading-[1.18]"
                  style={{
                    color: isActive
                      ? themeMode === "dark"
                        ? "#ffe0aa"
                        : "#9f6118"
                      : themeMode === "dark"
                      ? "#f3d08a"
                      : "#8f5d18",
                    textShadow:
                      themeMode === "dark"
                        ? "0 2px 10px rgba(0,0,0,0.30)"
                        : "0 1px 6px rgba(255,255,255,0.16)",
                    transition: "color 280ms ease, text-shadow 700ms ease",
                  }}
                >
                  {measured.titleText}
                </span>

                {measured.spoilerText ? (
                  <span
                    className="mt-2 text-[clamp(0.69rem,0.95vw,0.86rem)] leading-[1.42]"
                    style={{
                      ...getSpoilerClampStyle(measured.spoilerLines),
                      color:
                        themeMode === "dark"
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(34,24,18,0.82)",
                      maxWidth: "92%",
                    }}
                  >
                    {measured.spoilerText}
                  </span>
                ) : null}
              </span>
            ) : (
              <span
                className="relative z-10 grid h-full w-full place-items-center text-[clamp(1.2rem,1.9vw,1.7rem)] font-semibold"
                style={{
                  color: isActive
                    ? themeMode === "dark"
                      ? "#ffe0aa"
                      : "#9f6118"
                    : themeMode === "dark"
                    ? "#f3d08a"
                    : "#8f5d18",
                  textShadow:
                    themeMode === "dark"
                      ? "0 2px 10px rgba(0,0,0,0.30)"
                      : "0 1px 6px rgba(255,255,255,0.16)",
                  transition: "color 280ms ease, text-shadow 700ms ease",
                }}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
