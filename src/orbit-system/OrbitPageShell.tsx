import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import OrbitHeroLayout from "./OrbitHeroLayout";
import StickyGuide from "./StickyGuide";
import TickerBanner from "./TickerBanner";
import { pagesRegistry } from "./pages.registry";
import { presentersRegistry } from "./presenters.registry";
import { useStickyGuideState } from "./useStickyGuideState";
import type { OrbitItemConfig, PageId, ThemeMode } from "./orbit.types";

type OrbitPageShellProps = {
  pageId: PageId;
  children: ReactNode;
  contentClassName?: string;
  onOrbitItemClick?: (item: OrbitItemConfig) => void;
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
  children,
  contentClassName = "",
  onOrbitItemClick,
}: OrbitPageShellProps) {
  const heroRef = useRef<HTMLElement | null>(null);

  const page = useMemo(() => pagesRegistry[pageId], [pageId]);
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
    bubbles: page.stickyGuide.bubbles,
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

  return (
    <div className="relative">
      <OrbitHeroLayout
        heroRef={heroRef}
        page={page}
        presenter={presenter}
        themeMode={themeMode}
        onOrbitItemClick={onOrbitItemClick}
      />

      <TickerBanner
        themeMode={themeMode}
        config={page.tickerBanner}
        visible={bannerVisible}
        dockOffsetPx={footerDockOffsetPx}
        pauseMotion={footerDockActive}
      />

      <StickyGuide
        presenter={presenter}
        themeMode={themeMode}
        visible={stickyVisible}
        activeBubble={activeBubble}
        bannerHeightPx={page.tickerBanner.heightPx}
        bannerBottomOffsetPx={page.tickerBanner.bottomOffsetPx}
        dockOffsetPx={footerDockOffsetPx}
      />

      <div className={cn("relative z-10 xl:pl-[220px]", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
