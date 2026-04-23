import { useMemo, type CSSProperties } from "react";
import { getThemeAssets } from "./theme.assets";
import { getOrbitItemPosition, getRenderedItemClockAngle } from "./angle.utils";
import type { OrbitItemConfig, OrbitItemId, ThemeMode } from "./orbit.types";

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
  passiveMinSizePx: number;
  passiveMaxSizePx: number;
  activeMinSizePx: number;
  activeMaxSizePx: number;
  passiveFluidVw: number;
  activeFluidVw: number;
  passiveRadiusPercent: number;
  activeRadiusPercent: number;
  spoilerLines: number;
};

function measureOrbitItem(item: OrbitItemConfig): MeasuredItem {
  const titleText = (item.title ?? item.label).trim();
  const spoilerText = (item.spoiler ?? "").trim();
  const eyebrowText = item.eyebrow?.trim();
  const hasRichContent = Boolean(item.title || item.spoiler || item.eyebrow);

  // Passive: 1/3 of original sizes. Active: ~40% for legible text.
  if (!hasRichContent) {
    return {
      item,
      hasRichContent: false,
      titleText,
      spoilerText,
      eyebrowText,
      passiveMinSizePx: 50,
      passiveMaxSizePx: 77,
      activeMinSizePx: 50,
      activeMaxSizePx: 77,
      passiveFluidVw: 5.2,
      activeFluidVw: 5.2,
      passiveRadiusPercent: clamp(34.5 + (item.radiusBoostPercent ?? 0), 34.5, 45.5),
      activeRadiusPercent: clamp(34.5 + (item.radiusBoostPercent ?? 0), 34.5, 45.5),
      spoilerLines: 0,
    };
  }

  const titleLength = titleText.length;
  const spoilerLength = spoilerText.length;
  const eyebrowLength = eyebrowText?.length ?? 0;

  const titleScore = titleLength * 1.15 + eyebrowLength * 0.18;
  const activeScore =
    titleLength * 1.15 +
    Math.min(spoilerLength, 160) * 0.62 +
    eyebrowLength * 0.24;

  const passiveRequestedMin = 50;
  const passiveRequestedMax = 79;

  const passiveMaxSizePx = clamp(
    57 + titleScore * 0.12,
    passiveRequestedMin + 3,
    passiveRequestedMax
  );
  const passiveMinSizePx = clamp(
    passiveMaxSizePx * 0.82,
    passiveRequestedMin,
    passiveMaxSizePx - 4
  );
  const passiveFluidVw = clamp(passiveMaxSizePx / 14.5, 5.1, 6.2);

  const activeRequestedMin = item.minBubbleSizePx
    ? Math.round(item.minBubbleSizePx * 0.4)
    : 90;
  const activeRequestedMax = item.maxBubbleSizePx
    ? Math.round(item.maxBubbleSizePx * 0.4)
    : 145;

  const activeMaxSizePx = clamp(
    78 + activeScore * 0.18,
    activeRequestedMin + 4,
    activeRequestedMax
  );
  const activeMinSizePx = clamp(
    activeMaxSizePx * 0.82,
    activeRequestedMin,
    activeMaxSizePx - 6
  );
  const activeFluidVw = clamp(activeMaxSizePx / 12.5, 7.2, 11.8);

  const passiveRadiusPercent = clamp(35 + (item.radiusBoostPercent ?? 0), 35, 45.5);

  const activeRadiusBoost =
    Math.max(activeMaxSizePx - 90, 0) / 20 +
    Math.max(spoilerLength - 52, 0) / 45;

  const activeRadiusPercent = clamp(
    36 + activeRadiusBoost + (item.radiusBoostPercent ?? 0),
    36,
    47.5
  );

  return {
    item,
    hasRichContent: true,
    titleText,
    spoilerText,
    eyebrowText,
    passiveMinSizePx,
    passiveMaxSizePx,
    activeMinSizePx,
    activeMaxSizePx,
    passiveFluidVw,
    activeFluidVw,
    passiveRadiusPercent,
    activeRadiusPercent,
    spoilerLines: 1,
  };
}

// Multi-layer text shadow simulates text engraved on a sphere surface
function sphereTextStyle(isActive: boolean): CSSProperties {
  return {
    fontFamily: "'Frank Ruhl Libre', 'Playfair Display', Georgia, serif",
    display: "inline-block",
    transform: isActive ? "perspective(200px) rotateX(5deg)" : "none",
    textShadow: isActive
      ? `0 1px 2px rgba(255,255,255,0.22),
         0 -1px 2px rgba(0,0,0,0.55),
         0 2px 10px rgba(0,0,0,0.42),
         0 0 10px rgba(243,146,30,0.28)`
      : "0 1px 5px rgba(0,0,0,0.38)",
    WebkitTextStroke: isActive ? "0.35px rgba(0,0,0,0.18)" : "none",
    transition: "color 280ms ease, text-shadow 280ms ease, transform 280ms ease",
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

  const maxRadiusPercent = measuredItems.reduce((maxValue, current) => {
    const candidate =
      current.item.id === activeItemId
        ? current.activeRadiusPercent
        : current.passiveRadiusPercent;
    return Math.max(maxValue, candidate);
  }, 35.5);

  const outerRingInsetPercent = clamp(50 - (maxRadiusPercent + 4.5), 4.5, 12.8);
  const innerRingInsetPercent = clamp(50 - (maxRadiusPercent - 5.2), 12.5, 22);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[920px]">
      {/* Outer orbit ring */}
      <div
        className="absolute rounded-full border"
        style={{
          inset: `${outerRingInsetPercent}%`,
          borderColor:
            themeMode === "dark"
              ? "rgba(243,146,30,0.14)"
              : "rgba(207,65,18,0.10)",
          boxShadow:
            themeMode === "dark"
              ? "0 0 44px rgba(243,146,30,0.06)"
              : "0 0 34px rgba(207,65,18,0.05)",
          transition:
            "inset 260ms ease, border-color 700ms ease, box-shadow 700ms ease",
        }}
      />

      {/* Inner dashed ring */}
      <div
        className="absolute rounded-full border"
        style={{
          inset: `${innerRingInsetPercent}%`,
          borderStyle: "dashed",
          borderColor:
            themeMode === "dark"
              ? "rgba(243,146,30,0.08)"
              : "rgba(207,65,18,0.08)",
          transition: "inset 260ms ease, border-color 700ms ease",
        }}
      />

      {measuredItems.map((measured) => {
        const { item } = measured;

        const renderedAngle = getRenderedItemClockAngle(
          item.baseAngleDeg,
          rotationDeg
        );
        const isActive = item.id === activeItemId;
        const radiusPercent = isActive
          ? measured.activeRadiusPercent
          : measured.passiveRadiusPercent;
        const position = getOrbitItemPosition(renderedAngle, radiusPercent);
        const minSizePx = isActive
          ? measured.activeMinSizePx
          : measured.passiveMinSizePx;
        const maxSizePx = isActive
          ? measured.activeMaxSizePx
          : measured.passiveMaxSizePx;
        const fluidVw = isActive
          ? measured.activeFluidVw
          : measured.passiveFluidVw;
        const ariaText = measured.titleText || item.label;

        return (
          <button
            key={item.id}
            type="button"
            className="absolute z-20 overflow-hidden rounded-full border backdrop-blur-[6px]"
            style={{
              ...position,
              width: `clamp(${Math.round(minSizePx)}px, ${fluidVw}vw, ${Math.round(maxSizePx)}px)`,
              height: `clamp(${Math.round(minSizePx)}px, ${fluidVw}vw, ${Math.round(maxSizePx)}px)`,
              borderColor: isActive
                ? "rgba(243,146,30,0.82)"
                : "rgba(243,146,30,0.28)",
              // 90% transparent passive (alpha 0.10), 75% active
              backgroundColor: isActive
                ? "rgba(100,16,26,0.25)"
                : "rgba(100,16,26,0.10)",
              boxShadow: isActive
                ? "0 0 0 1.5px rgba(243,146,30,0.55), 0 0 20px rgba(243,146,30,0.42), 0 4px 16px rgba(0,0,0,0.28)"
                : "0 0 0 1px rgba(243,146,30,0.16), 0 2px 10px rgba(0,0,0,0.08)",
              transform: `${position.transform} scale(${isActive ? 1.08 : 1})`,
              transition:
                "transform 260ms cubic-bezier(0.16,1,0.30,1), width 260ms ease, height 260ms ease, border-color 280ms ease, background-color 280ms ease, box-shadow 280ms ease",
            }}
            onMouseEnter={() => onItemEnter(item.id)}
            onMouseLeave={onItemLeave}
            onFocus={() => onItemEnter(item.id)}
            onBlur={onItemLeave}
            onClick={() => onItemClick?.(item)}
            aria-label={ariaText}
          >
            {/* 3D Sphere — Layer 1: body gradient (fire × wine palette) */}
            <span
              className="absolute inset-0"
              style={{
                background: isActive
                  ? `radial-gradient(circle at 42% 38%,
                      rgba(243,146,30,0.90) 0%,
                      rgba(207,65,18,0.80) 28%,
                      rgba(142,27,8,0.90) 60%,
                      rgba(99,16,30,0.96) 100%)`
                  : `radial-gradient(circle at 42% 38%,
                      rgba(243,146,30,0.13) 0%,
                      rgba(207,65,18,0.08) 28%,
                      rgba(142,27,8,0.10) 60%,
                      rgba(99,16,30,0.14) 100%)`,
                transition: "background 280ms ease",
              }}
            />

            {/* 3D Sphere — Layer 2: stars texture */}
            <span
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${assets.bubbleStarsRed})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: isActive ? 0.32 : 0.10,
                transition: "opacity 280ms ease",
              }}
            />

            {/* 3D Sphere — Layer 3: limb darkening (creates spherical depth) */}
            <span
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 50%,
                  transparent 22%,
                  rgba(0,0,0,0.22) 58%,
                  rgba(0,0,0,0.58) 100%)`,
              }}
            />

            {/* 3D Sphere — Layer 4: specular highlight (top-left sheen) */}
            <span
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 52% 42% at 33% 28%,
                  rgba(255,255,255,${isActive ? "0.62" : "0.38"}) 0%,
                  rgba(255,255,255,0.10) 32%,
                  transparent 58%)`,
                transition: "background 280ms ease",
              }}
            />

            {/* 3D Sphere — Layer 5: bottom rim light (secondary reflection) */}
            <span
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 58% 28% at 58% 88%,
                  rgba(243,146,30,${isActive ? "0.36" : "0.10"}) 0%,
                  transparent 58%)`,
                transition: "background 280ms ease",
              }}
            />

            {/* Text rendered as if engraved on the sphere surface */}
            {measured.hasRichContent ? (
              <span
                className={`relative z-10 flex h-full w-full flex-col items-center text-center ${
                  isActive
                    ? "justify-start px-2 py-2.5"
                    : "justify-center px-2 py-2"
                }`}
              >
                {isActive && measured.eyebrowText ? (
                  <span
                    className="mb-1 inline-flex rounded-full border px-1.5 py-0.5 text-[0.44rem] font-semibold tracking-[0.14em]"
                    style={{
                      color: "#ffe8be",
                      borderColor: "rgba(255,240,210,0.22)",
                      backgroundColor: "rgba(255,255,255,0.06)",
                    }}
                  >
                    {measured.eyebrowText}
                  </span>
                ) : null}

                <span
                  className={
                    isActive
                      ? "text-[clamp(0.5rem,0.78vw,0.72rem)] font-bold leading-[1.18]"
                      : "text-[clamp(0.52rem,0.88vw,0.74rem)] font-bold leading-[1.18]"
                  }
                  style={{
                    ...sphereTextStyle(isActive),
                    color: isActive ? "#ffe0aa" : "#f3d08a",
                  }}
                >
                  {measured.titleText}
                </span>

                {isActive && measured.spoilerText ? (
                  <span
                    className="mt-1 text-[clamp(0.4rem,0.58vw,0.54rem)] leading-[1.38]"
                    style={{
                      ...getSpoilerClampStyle(measured.spoilerLines),
                      color: "rgba(255,255,255,0.88)",
                      textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                      maxWidth: "90%",
                    }}
                  >
                    {measured.spoilerText}
                  </span>
                ) : null}
              </span>
            ) : (
              <span
                className="relative z-10 grid h-full w-full place-items-center text-[clamp(0.58rem,1vw,0.82rem)] font-semibold"
                style={{
                  ...sphereTextStyle(isActive),
                  color: isActive ? "#ffe0aa" : "#f3d08a",
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
