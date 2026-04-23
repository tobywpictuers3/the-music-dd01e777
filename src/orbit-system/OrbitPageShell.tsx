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
import { mergeOrbitPageDesign } from "./orbit.design";
import { pagesRegistry } from "./pages.registry";
import { presentersRegistry } from "./presenters.registry";
import { resolveOrbitPageConfig } from "./resolveOrbitPageConfig";
import { useStickyGuideState } from "./useStickyGuideState";
import type {
  OrbitItemConfig,
  OrbitItemId,
  OrbitPageContentConfig,
  OrbitPageDesignConfig,
  PageId,
  ThemeMode,
} from "./orbit.types";

type OrbitPageShellProps = {
  /**
   * ברירת המחדל:
   * pageId → תוכן פר-דף מתוך orbitContentRegistry → page config resolved
   */
  pageId?: PageId;

  /**
   * override עתידי - אם רוצים לבנות דף בלי רישום קבוע
   */
  content?: OrbitPageContentConfig;
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

export default function OrbitPageShell({
  pageId,
  content,
  design,
  children,
  contentClassName = "",
  onOrbitItemClick,
  controlledActiveItemId,
  disableStickyGuide = false,
}: OrbitPageShellProps) {
  const heroRef = useRef<HTMLElement | null>(null);

  const mergedDesign = useMemo(() => mergeOrbitPageDesign(design), [design]);

  const page = useMemo(() => {
    if (content && pageId) {
      const route = pagesRegistry[pageId]?.route ?? "/";
      return resolveOrbitPageConfig({
        pageId,
        route,
        content,
        design,
      });
    }

    if (pageId) {
      return pagesRegistry[pageId];
    }

    if (content) {
      return resolveOrbitPageConfig({
        pageId: "about",
        route: "/",
        content,
        design,
      });
    }

    throw new Error("OrbitPageShell requires pageId or content.");
  }, [content, design, pageId]);

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

  const contentVars = {
    "--orbit-content-left-offset": `${mergedDesign.layout.contentLeftOffsetPx}px`,
  } as CSSProperties;

  const seamFadeBackground =
    themeMode === "dark"
      ? "linear-gradient(to bottom, rgba(9,11,18,0), rgba(9,11,18,0.16) 38%, rgba(9,11,18,0.72) 100%)"
      : "linear-gradient(to bottom, rgba(246,243,239,0), rgba(246,243,239,0.18) 38%, rgba(246,243,239,0.82) 100%)";

  const stickyGuideEnabled =
    !disableStickyGuide && (content?.stickyGuide?.enabled ?? true);

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

      {/* TickerBanner: ללא dockOffset — הבאנר נשאר קבוע בתחתית גם כשהפוטר מגיע */}
      <TickerBanner
        themeMode={themeMode}
        config={page.tickerBanner}
        visible={bannerVisible}
      />

      {stickyGuideEnabled ? (
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
