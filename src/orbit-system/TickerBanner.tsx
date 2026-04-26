import tickerFloorLight from "@/assets/orbit-system/ui/light/ticker-floor.webp";
import tickerFloorDark from "@/assets/orbit-system/ui/dark/ticker-floor.webp";
import type { ThemeMode, TickerBannerConfig } from "./orbit.types";

type TickerBannerProps = {
  themeMode: ThemeMode;
  config: TickerBannerConfig;
  visible: boolean;
  dockOffsetPx?: number;
  pauseMotion?: boolean;
};

export default function TickerBanner({
  themeMode,
  config,
  visible,
  dockOffsetPx = 0,
  pauseMotion = false,
}: TickerBannerProps) {
  if (!config.enabled) return null;

  // מכפילים פי 4 לגלילה חלקה לחלוטין ללא עצירות
  const repeated = [...config.items, ...config.items, ...config.items, ...config.items];
  const tickerText = repeated.join("   ✦   ");

  const enterMs = config.enterMs ?? 320;
  const exitMs = config.exitMs ?? 320;
  const transitionMs = visible ? enterMs : exitMs;

  return (
    <>
      <style>
        {`
          @keyframes orbitTickerMarquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-25%); }
          }
        `}
      </style>

      <div
        className="pointer-events-none fixed inset-x-0 z-[60]"
        style={{
          bottom: `${config.bottomOffsetPx + dockOffsetPx}px`,
          opacity: visible ? config.opacity : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: `opacity ${transitionMs}ms ease, transform ${transitionMs}ms ease`,
        }}
        aria-hidden={!visible}
      >
        <div
          className="relative overflow-hidden border-y"
          style={{
            height: `${config.heightPx}px`,
            borderColor:
              themeMode === "dark"
                ? "rgba(255,255,255,0.14)"
                : "rgba(45,25,25,0.12)",
            backgroundColor:
              themeMode === "dark"
                ? "rgba(16,16,20,0.42)"
                : "rgba(255,255,255,0.42)",
            transition:
              "background-color 700ms ease, border-color 700ms ease",
          }}
        >
          {/* רקע תמונה */}
          <span
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${tickerFloorLight})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: themeMode === "light" ? 1 : 0,
              transition: "opacity 700ms ease",
            }}
          />
          <span
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${tickerFloorDark})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: themeMode === "dark" ? 1 : 0,
              transition: "opacity 700ms ease",
            }}
          />

          {/* שכבת blur */}
          <span
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(4px)",
              background:
                themeMode === "dark"
                  ? "linear-gradient(to right, rgba(0,0,0,0.18), rgba(255,255,255,0.02), rgba(0,0,0,0.18))"
                  : "linear-gradient(to right, rgba(255,255,255,0.18), rgba(255,255,255,0.05), rgba(255,255,255,0.18))",
              transition: "background 700ms ease",
            }}
          />

          {/* הטקסט הנע — לולאה אינסופית ורציפה */}
          <div className="relative h-full overflow-hidden">
            <div
              className="flex h-full min-w-max items-center whitespace-nowrap"
              style={{
                animationName: "orbitTickerMarquee",
                animationDuration: `${config.loopDurationSec}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationPlayState: pauseMotion ? "paused" : "running",
                width: "max-content",
              }}
            >
              <span
                className="px-6 text-[clamp(0.72rem,1.1vw,0.88rem)] font-medium tracking-[0.025em]"
                style={{
                  color: themeMode === "dark" ? "#ffffff" : "#1b1b1b",
                  transition: "color 700ms ease",
                }}
              >
                {tickerText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
