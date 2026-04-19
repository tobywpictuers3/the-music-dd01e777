import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import OrbitHeroLayout from "./OrbitHeroLayout";
import StickyGuide from "./StickyGuide";
import TickerBanner from "./TickerBanner";
import { pagesRegistry } from "./pages.registry";
import { presentersRegistry } from "./presenters.registry";
import { useStickyGuideState } from "./useStickyGuideState";
import { mergeOrbitPageDesign } from "./orbit.design";
import type {
  BubbleConfig,
  OrbitItemConfig,
  OrbitItemId,
  OrbitPageContentConfig,
  OrbitPageDesignConfig,
  PageConfig,
  PageId,
  ThemeMode,
} from "./orbit.types";

type OrbitPageShellProps = {
  /**
   * מצב חדש:
   * הדף מעביר content משלו,
   * והמערכת בונה מזה page resolved פנימי.
   */
  content?: OrbitPageContentConfig;

  /**
   * מצב ישן:
   * fallback לדפים שעדיין לא הומרו.
   */
  pageId?: PageId;

  /**
   * override עיצובי גלובלי לדף,
   * בלי לערב תוכן.
   */
  design?: Partial<OrbitPageDesignConfig>;

  children: ReactNode;
  contentClassName?: string;
  onOrbitItemClick?: (item: OrbitItemConfig) => void;
  controlledActiveItemId?: OrbitItemId | null;
  disableStickyGuide?: boolean;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getThemeModeFromDom(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function buildResolvedBubble(
  bubble: OrbitPageContentConfig["stickyGuide"] extends infer T
    ? T extends { bubbles: infer B }
      ? B extends Array<infer Item>
        ? Item
        : never
      : never
    : never,
  design: OrbitPageDesignConfig
): BubbleConfig {
  return {
    id: bubble.id,
    text: bubble.text,
    showFromAfterHeroPx: bubble.showFromAfterHeroPx,
    hideAfterHeroPx: bubble.hideAfterHeroPx,
    dismissible:
      bubble.dismissible ?? design.stickyGuide.bubble.dismissible,
    maxWidthPx: design.stickyGuide.bubble.maxWidthPx,
    offsetX: design.stickyGuide.bubble.offsetX,
    offsetY: design.stickyGuide.bubble.offsetY,
    enterMs: design.stickyGuide.bubble.enterMs,
    exitMs: design.stickyGuide.bubble.exitMs,
    holdMs: design.stickyGuide.bubble.holdMs,
    fadeMs: design.stickyGuide.bubble.fadeMs,
  };
}

function resolvePageFromContent(
  content: OrbitPageContentConfig,
  design: OrbitPageDesignConfig,
  pageId?: PageId,
  route?: string
): PageConfig {
  const resolvedOrbitItems: OrbitItemConfig[] = content.orbit.items.map((item) => ({
    ...item,
  }));

  const stickyGuideContent = content.stickyGuide;
  const tickerBannerContent = content.tickerBanner;

  return {
    pageId: pageId ?? "about",
    route: route ?? "/",
    presenterId: content.presenterId,

    hero: {
      titleLines: content.hero.titleLines,
      introLines: content.hero.introLines,
      headerOffsetPx: design.hero.headerOffsetPx,
    },

    orbit: {
      items: resolvedOrbitItems,
      rotationSpeedDegPerSec: design.orbit.rotationSpeedDegPerSec,
      defaultLook: design.orbit.defaultLook,
    },

    stickyGuide: {
      idleLook: design.stickyGuide.idleLook,
      activationOffsetPx:
        stickyGuideContent?.activationOffsetPx ??
        design.stickyGuide.activationOffsetPx,
      activationRatio:
        stickyGuideContent?.activationRatio ??
        design.stickyGuide.activationRatio,
      showFromAfterHeroPx:
        stickyGuideContent?.showFromAfterHeroPx ??
        design.stickyGuide.showFromAfterHeroPx,
      bubbles: (stickyGuideContent?.bubbles ?? []).map((bubble) =>
        buildResolvedBubble(bubble, design)
      ),
    },

    tickerBanner: {
      enabled:
        tickerBannerContent?.enabled ?? design.tickerBanner.enabled,
      items: tickerBannerContent?.items ?? [],
      heightPx: design.tickerBanner.heightPx,
      bottomOffsetPx: design.tickerBanner.bottomOffsetPx,
      opacity: design.tickerBanner.opacity,
      loopDurationSec: design.tickerBanner.loopDurationSec,
      showFromAfterHeroPx:
        tickerBannerContent?.showFromAfterHeroPx ??
        design.tickerBanner.showFromAfterHeroPx,
      enterMs: design.tickerBanner.enterMs,
      exitMs: design.tickerBanner.exitMs,
    },
  };
}

export default function OrbitPageShell({
  content,
  pageId,
  design,
  children,
  contentClassName = "",
  onOrbitItemClick,
  controlledActiveItemId,
  disableStickyGuide = false,
}: OrbitPageShellProps) {
  const heroRef = useRef<HTMLElement | null>(null);

  const mergedDesign = useMemo(
    () => mergeOrbitPageDesign(design),
    [design]
  );

  const fallbackPage = useMemo(
    () => (pageId ? pagesRegistry[pageId] : null),
    [pageId]
  );

  const page = useMemo<PageConfig>(() => {
    if (content) {
      return resolvePageFromContent(
        content,
        mergedDesign,
        pageId,
        fallbackPage?.route
      );
    }

    if (fallbackPage) {
      return fallbackPage;
    }

    throw new Error(
      "OrbitPageShell requires either `content` or `pageId`."
    );
  }, [content, mergedDesign, pageId, fallbackPage]);

  const presenter = useMemo(
    () => presentersRegistry[page.presenterId],
    [page.presenterId]
  );

  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    getThemeModeFromDom()
  );
  const [footerDockOffsetPx, setFooterDockOffsetPx] = useState(0);

  const { stickyVisible, bannerVisible, activeBubble } = useStickyGuideState({
    heroRef,
    stickyGuide: page.stickyGuide,
    tickerBanner: page.tickerBanner,
    headerOffsetPx: page.hero.headerOffsetPx,
  });

  useEffect(() => {
    const applyTheme = () => {
      setThemeMode(getThemeModeFromDom());
    };

    applyTheme();

    const observer = new MutationObserver(() => {
      applyTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateFooterDock = () => {
      const footerEl = document.querySelector("footer");
      if (!footerEl) {
        setFooterDockOffsetPx(0);
        return;
      }

      const rect = footerEl.getBoundingClientRect();
      const overlap = Math.max(window.innerHeight - rect.top, 0);

      setFooterDockOffsetPx(overlap);
    };

    updateFooterDock();
    window.addEventListener("scroll", updateFooterDock, { passive: true });
    window.addEventListener("resize", updateFooterDock);

    return () => {
      window.removeEventListener("scroll", updateFooterDock);
      window.removeEventListener("resize", updateFooterDock);
    };
  }, []);

  const footerDockActive = footerDockOffsetPx > 0;

  const contentVars = {
    "--orbit-content-left-offset": `${mergedDesign.layout.contentLeftOffsetPx}px`,
  } as CSSProperties;

  const seamFadeBackground =
    themeMode === "dark"
      ? "linear-gradient(to bottom, rgba(9,11,18,0), rgba(9,11,18,0.16) 38%, rgba(9,11,18,0.72) 100%)"
      : "linear-gradient(to bottom, rgba(246,243,239,0), rgba(246,243,239,0.18) 38%, rgba(246,243,239,0.82) 100%)";

  const stickyGuideEnabledFromContent = content
    ? content.stickyGuide?.enabled ?? true
    : true;

  const renderStickyGuide =
    !disableStickyGuide && stickyGuideEnabledFromContent;

  return (
    <div className="orbit-page-shell relative">
      <OrbitHeroLayout
        heroRef={heroRef}
        page={page}
        presenter={presenter}
        themeMode={themeMode}
        onOrbitItemClick={onOrbitItemClick}
        controlledActiveItemId={controlledActiveItemId}
      />

      <TickerBanner
        themeMode={themeMode}
        config={page.tickerBanner}
        visible={bannerVisible}
        dockOffsetPx={footerDockOffsetPx}
        pauseMotion={footerDockActive}
      />

      {renderStickyGuide ? (
        <StickyGuide
          presenter={presenter}
          themeMode={themeMode}
          visible={stickyVisible}
          activeBubble={activeBubble}
          bannerHeightPx={page.tickerBanner.heightPx}
          bannerBottomOffsetPx={page.tickerBanner.bottomOffsetPx}
          dockOffsetPx={footerDockOffsetPx}
        />
      ) : null}

      <div
        className="pointer-events-none relative z-[11] -mt-5 h-14 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.62), rgba(0,0,0,1))",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.62), rgba(0,0,0,1))",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: seamFadeBackground,
          }}
        />
      </div>

      <div
        className={cn(
          "relative z-10 -mt-6 pt-6 transition-[padding-left] duration-300 xl:pl-[var(--orbit-content-left-offset)]",
          contentClassName
        )}
        style={contentVars}
      >
        {children}
      </div>
    </div>
  );
}
