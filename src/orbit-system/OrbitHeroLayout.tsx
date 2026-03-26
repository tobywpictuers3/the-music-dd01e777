import type { CSSProperties, ReactNode, RefObject } from "react";
import HeroCenterPresenter from "./HeroCenterPresenter";
import OrbitWheel from "./OrbitWheel";
import { useOrbitHeroState } from "./useOrbitHeroState";
import { getThemeAssets } from "./theme.assets";
import type { PageConfig, PresenterConfig, ThemeMode } from "./orbit.types";

type OrbitHeroLayoutProps = {
  page: PageConfig;
  presenter: PresenterConfig;
  themeMode: ThemeMode;
  heroRef: RefObject<HTMLElement | null>;
  headerOverlay?: ReactNode;
};

export default function OrbitHeroLayout({
  page,
  presenter,
  themeMode,
  heroRef,
  headerOverlay,
}: OrbitHeroLayoutProps) {
  const assets = getThemeAssets(themeMode);

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
  });

  function handleItemClick(targetSectionId?: string) {
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

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] overflow-hidden"
      style={cssVars}
    >
      {/* הרקע מתחיל ממש מלמעלה */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: themeMode === "dark" ? "#080a12" : "#f6f2ee",
        }}
      >
        {/* במה כ-img אמיתי כדי לא לחתוך */}
        <img
          src={assets.stageBg}
          alt=""
          fetchPriority="high"
          className="h-full w-full object-contain object-center"
          aria-hidden="true"
        />
      </div>

      {/* שכבת עומק קלה לקריאות */}
      <div
        className="absolute inset-0"
        style={{
          background:
            themeMode === "dark"
              ? "linear-gradient(to bottom, rgba(6,8,16,0.18), rgba(6,8,16,0.34))"
              : "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.20))",
        }}
      />

      {headerOverlay ? (
        <div className="absolute inset-x-0 top-0 z-[80]">{headerOverlay}</div>
      ) : null}

      <div
        className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1600px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_2fr] lg:px-10"
        style={{
          paddingTop: "calc(var(--orbit-header-offset) + 16px)",
          paddingBottom: "20px",
        }}
      >
        {/* שליש שמאל */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-[600px]">
            <OrbitWheel
              items={page.orbit.items}
              rotationDeg={rotationDeg}
              activeItemId={activeItemId}
              themeMode={themeMode}
              onItemEnter={setActiveItemId}
              onItemLeave={clearActiveItem}
              onItemClick={(item) => handleItemClick(item.targetSectionId)}
            />

            <HeroCenterPresenter
              presenter={presenter}
              activeLook={activeLook}
            />
          </div>
        </div>

        {/* שני שליש ימין */}
        <div className="flex items-center justify-center">
          <div className="mx-auto w-full max-w-[760px] text-center">
            <h1
              className="space-y-2 text-[clamp(2rem,4.1vw,4.25rem)] font-bold leading-[1.08]"
              style={{
                color: themeMode === "dark" ? "#ffffff" : "#1a1a1a",
              }}
            >
              {page.hero.titleLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div
              className="mx-auto mt-6 max-w-[42rem] space-y-3 text-[clamp(1rem,1.45vw,1.2rem)] leading-8"
              style={{
                color:
                  themeMode === "dark"
                    ? "rgba(255,255,255,0.92)"
                    : "rgba(26,26,26,0.86)",
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
