import orbitStarsLight from "@/assets/orbit-system/ui/light/orbit-stars.webp";
import orbitStarsDark from "@/assets/orbit-system/ui/dark/orbit-stars.webp";
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

export default function OrbitWheel({
  items,
  rotationDeg,
  activeItemId,
  themeMode,
  onItemEnter,
  onItemLeave,
  onItemClick,
}: OrbitWheelProps) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[760px]">
      <div
        className="absolute inset-[12%] rounded-full border"
        style={{
          borderColor:
            themeMode === "dark"
              ? "rgba(255,255,255,0.16)"
              : "rgba(54,36,24,0.12)",
          boxShadow:
            themeMode === "dark"
              ? "0 0 44px rgba(255,255,255,0.05)"
              : "0 0 34px rgba(0,0,0,0.04)",
          transition: "border-color 700ms ease, box-shadow 700ms ease",
        }}
      />
      <div
        className="absolute inset-[20%] rounded-full border"
        style={{
          borderStyle: "dashed",
          borderColor:
            themeMode === "dark"
              ? "rgba(255,255,255,0.09)"
              : "rgba(54,36,24,0.08)",
          transition: "border-color 700ms ease",
        }}
      />

      {items.map((item) => {
        const renderedAngle = getRenderedItemClockAngle(
          item.baseAngleDeg,
          rotationDeg
        );

        const position = getOrbitItemPosition(renderedAngle, 34.5);
        const isActive = item.id === activeItemId;

        return (
          <button
            key={item.id}
            type="button"
            className="absolute z-20 grid place-items-center rounded-full border overflow-hidden backdrop-blur-[3px]"
            style={{
              ...position,
              width: "clamp(142px, 15.5vw, 236px)",
              height: "clamp(142px, 15.5vw, 236px)",
              borderColor: isActive
                ? themeMode === "dark"
                  ? "rgba(255,255,255,0.66)"
                  : "rgba(54,36,24,0.24)"
                : themeMode === "dark"
                ? "rgba(255,255,255,0.28)"
                : "rgba(54,36,24,0.14)",
              backgroundColor: isActive
                ? themeMode === "dark"
                  ? "rgba(9,9,14,0.44)"
                  : "rgba(255,255,255,0.48)"
                : themeMode === "dark"
                ? "rgba(9,9,14,0.28)"
                : "rgba(255,255,255,0.34)",
              boxShadow: isActive
                ? "0 0 26px rgba(255,255,255,0.14)"
                : "0 12px 24px rgba(0,0,0,0.08)",
              transform: `${position.transform} scale(${isActive ? 1.03 : 1})`,
              transition:
                "transform 220ms ease, border-color 700ms ease, background-color 700ms ease, box-shadow 700ms ease",
            }}
            onMouseEnter={() => onItemEnter(item.id)}
            onMouseLeave={onItemLeave}
            onFocus={() => onItemEnter(item.id)}
            onBlur={onItemLeave}
            onClick={() => onItemClick?.(item)}
            aria-label={`עיגול ${item.label}`}
          >
            <span
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${orbitStarsLight})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: themeMode === "light" ? 0.22 : 0,
                transition: "opacity 700ms ease",
              }}
            />
            <span
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${orbitStarsDark})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: themeMode === "dark" ? 0.42 : 0,
                transition: "opacity 700ms ease",
              }}
            />

            <span
              className="absolute inset-0"
              style={{
                background:
                  themeMode === "dark"
                    ? "linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(0,0,0,0.16))"
                    : "linear-gradient(to bottom, rgba(255,255,255,0.24), rgba(255,255,255,0.08))",
                transition: "background 700ms ease",
              }}
            />

            <span
              className="relative z-10 text-[clamp(1.2rem,1.9vw,1.7rem)] font-semibold"
              style={{
                color: themeMode === "dark" ? "#f3d08a" : "#8f5d18",
                textShadow:
                  themeMode === "dark"
                    ? "0 2px 10px rgba(0,0,0,0.30)"
                    : "0 1px 6px rgba(255,255,255,0.16)",
                transition: "color 700ms ease, text-shadow 700ms ease",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
