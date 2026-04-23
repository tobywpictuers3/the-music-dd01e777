import {
  useEffect,
  useMemo,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import stageBgLight from "@/assets/orbit-system/stage/light/stage-bg.webp";
import stageBgDark from "@/assets/orbit-system/stage/dark/stage-bg.webp";
import HeroCenterPresenter from "./HeroCenterPresenter";
import OrbitWheel from "./OrbitWheel";
import { useOrbitHeroState } from "./useOrbitHeroState";
import type {
  OrbitItemConfig,
  OrbitItemId,
  PageConfig,
  PresenterConfig,
  ThemeMode,
} from "./orbit.types";

type OrbitHeroLayoutProps = {
  page: PageConfig;
  presenter: PresenterConfig;
  themeMode: ThemeMode;
  heroRef: RefObject<HTMLElement | null>;
  headerOverlay?: ReactNode;
  onOrbitItemClick?: (item: OrbitItemConfig) => void;
  controlledActiveItemId?: OrbitItemId | null;
};

export default function OrbitHeroLayout({
  page,
  presenter,
  themeMode,
  heroRef,
  headerOverlay,
  onOrbitItemClick,
  controlledActiveItemId,
}: OrbitHeroLayoutProps) {
  const {
    rotationDeg,
    activeItemId,
    activeLook,
    setActiveItemId,
    clearActiveItem,
  } = useOrbitHeroState({
    items: page.orbit.items,
    rotationSpeedDegPerSec: page.orbit.rotationSpeedDegPerSec,
    defaultLook: page.orbit.defaultLook,
    controlledActiveItemId,
  });

  function handleItemClick(item: OrbitItemConfig) {
    if (onOrbitItemClick) {
      onOrbitItemClick(item);
      return;
    }

    const targetSectionId = item.targetSectionId;
    if (!targetSectionId) return;

    const target = document.getElementById(targetSectionId);
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const cssVars = {
    "--orbit-header-offset": `${page.hero.headerOffsetPx}px`,
  } as CSSProperties;

  const titleColorsDark = ["#f3d08a", "#ffffff", "#d89f45"];
  const titleColorsLight = ["#8f5d18", "#2a1a0f", "#bf8330"];
  const titleColors = themeMode === "dark" ? titleColorsDark : titleColorsLight;

  const currentStageBg = useMemo(
    () => (themeMode === "dark" ? stageBgDark : stageBgLight),
    [themeMode]
  );

  useEffect(() => {
    const img = new Image();
    img.decoding = "async";
    img.src = themeMode === "dark" ? stageBgLight : stageBgDark;
  }, [themeMode]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] overflow-hidden"
      style={cssVars}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: themeMode === "dark" ? "#080a12" : "#f6f2ee",
        }}
      >
        <img
          key={themeMode}
          src={currentStageBg}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center select-none transition-opacity duration-500"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            themeMode === "dark"
              ? "linear-gradient(to bottom, rgba(6,8,16,0.28), rgba(6,8,16,0.16) 28%, rgba(6,8,16,0.26) 72%, rgba(6,8,16,0.44))"
              : "linear-gradient(to bottom, rgba(255,255,255,0.20), rgba(255,255,255,0.08) 28%, rgba(255,255,255,0.14) 72%, rgba(255,255,255,0.28))",
          transition: "background 700ms ease",
        }}
      />

      {headerOverlay ? (
        <div className="absolute inset-x-0 top-0 z-[80]">{headerOverlay}</div>
      ) : null}

      {/*
        Grid layout — in RTL (dir="rtl" on <html>):
          col 1 = RIGHT column  → text goes here
          col 2 = LEFT  column  → orbit goes here
        DOM order: orbit first (so it renders on the left / top on mobile),
        text second (right on desktop, bottom on mobile).
        We use lg:col-start to pin each to its target column explicitly.
      */}
      <div
        className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1600px] items-center gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,700px)_minmax(380px,680px)] lg:px-10"
        style={{
          paddingTop: "calc(var(--orbit-header-offset) + 16px)",
          paddingBottom: "28px",
        }}
      >
        {/* Orbit wheel — left column in RTL (col-start-2 = physical left) */}
        <div className="relative flex items-center justify-center lg:col-start-2 lg:row-start-1">
          {/*
            Constrain orbit so it always fits within the viewport height.
            Since OrbitWheel is aspect-square, limiting width = limiting height.
          */}
          <div
            className="relative w-full"
            style={{
              maxWidth: "min(700px, calc(100svh - var(--orbit-header-offset, 80px) - 80px))",
            }}
          >
            <OrbitWheel
              items={page.orbit.items}
              rotationDeg={rotationDeg}
              activeItemId={activeItemId}
              themeMode={themeMode}
              onItemEnter={setActiveItemId}
              onItemLeave={clearActiveItem}
              onItemClick={handleItemClick}
            />

            <HeroCenterPresenter
              presenter={presenter}
              activeLook={activeLook}
            />
          </div>
        </div>

        {/* Text — right column in RTL (col-start-1 = physical right) */}
        <div className="flex items-center justify-center lg:col-start-1 lg:row-start-1 lg:justify-self-end">
          <div className="mx-auto w-full max-w-[680px] text-right">
            <h1 className="space-y-2 text-[clamp(2rem,4.1vw,4.35rem)] font-bold leading-[1.08]">
              {page.hero.titleLines.map((line, index) => (
                <span
                  key={index}
                  className="block"
                  style={{
                    color: titleColors[index % titleColors.length],
                    textShadow:
                      themeMode === "dark"
                        ? "0 4px 24px rgba(0,0,0,0.34)"
                        : "0 3px 14px rgba(255,255,255,0.18)",
                    transition: "color 700ms ease, text-shadow 700ms ease",
                  }}
                >
                  {line}
                </span>
              ))}
            </h1>

            <div
              className="mt-6 max-w-[42rem] space-y-3 text-[clamp(1rem,1.45vw,1.2rem)] leading-8"
              style={{
                color:
                  themeMode === "dark"
                    ? "rgba(255,255,255,0.92)"
                    : "rgba(26,26,26,0.82)",
                textShadow:
                  themeMode === "dark"
                    ? "0 4px 18px rgba(0,0,0,0.26)"
                    : "0 2px 10px rgba(255,255,255,0.14)",
                transition: "color 700ms ease, text-shadow 700ms ease",
              }}
            >
              {page.hero.introLines.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
