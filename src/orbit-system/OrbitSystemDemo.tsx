import { useMemo, useRef, useState } from "react";
import Footer from "@/components/Footer";
import OrbitHeroLayout from "./OrbitHeroLayout";
import StickyGuide from "./StickyGuide";
import TickerBanner from "./TickerBanner";
import { orbitDemoPageId, pagesRegistry } from "./pages.registry";
import { presentersRegistry } from "./presenters.registry";
import { useStickyGuideState } from "./useStickyGuideState";
import type { PageId, ThemeMode } from "./orbit.types";

export default function OrbitSystemDemo() {
  const heroRef = useRef<HTMLElement | null>(null);

  const [pageId, setPageId] = useState<PageId>(orbitDemoPageId);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  const page = useMemo(() => pagesRegistry[pageId], [pageId]);
  const presenter = useMemo(
    () => presentersRegistry[page.presenterId],
    [page.presenterId]
  );

  const { stickyVisible, bannerVisible, activeBubble } = useStickyGuideState({
    heroRef,
    bubbles: page.stickyGuide.bubbles,
    headerOffsetPx: page.hero.headerOffsetPx,
  });

  return (
    <div
      dir="rtl"
      className="min-h-screen"
      style={{
        backgroundColor: themeMode === "dark" ? "#090b12" : "#f6f3ef",
        color: themeMode === "dark" ? "#ffffff" : "#171717",
      }}
    >
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[80]">
        <div
          className="mx-auto flex h-24 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10"
          style={{
            background:
              themeMode === "dark"
                ? "linear-gradient(to bottom, rgba(6,8,16,0.55), rgba(6,8,16,0.00))"
                : "linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0.00))",
          }}
        >
          <div className="pointer-events-auto rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm">
            Header Demo
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <select
              value={pageId}
              onChange={(e) => setPageId(e.target.value as PageId)}
              className="rounded-full border bg-black/20 px-3 py-2 text-sm text-white backdrop-blur-sm"
            >
              {Object.keys(pagesRegistry).map((key) => (
                <option key={key} value={key} className="text-black">
                  {key}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setThemeMode("light")}
              className="rounded-full border px-3 py-2 text-sm backdrop-blur-sm"
            >
              light
            </button>

            <button
              type="button"
              onClick={() => setThemeMode("dark")}
              className="rounded-full border px-3 py-2 text-sm backdrop-blur-sm"
            >
              dark
            </button>
          </div>
        </div>
      </div>

      <OrbitHeroLayout
        heroRef={heroRef}
        page={page}
        presenter={presenter}
        themeMode={themeMode}
      />

      <TickerBanner
        themeMode={themeMode}
        config={page.tickerBanner}
        visible={bannerVisible}
      />

      <StickyGuide
        presenter={presenter}
        themeMode={themeMode}
        visible={stickyVisible}
        activeBubble={activeBubble}
        bannerHeightPx={page.tickerBanner.heightPx}
        bannerBottomOffsetPx={page.tickerBanner.bottomOffsetPx}
      />

      <main className="relative z-10 pb-[190px] xl:pl-[240px]">
        {page.orbit.items.map((item) => (
          <section
            key={item.id}
            id={item.targetSectionId}
            className="scroll-mt-32 mx-auto min-h-[72svh] max-w-[1200px] px-4 py-16 sm:px-6 lg:px-10"
          >
            <div
              className="rounded-[32px] border p-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
              style={{
                backgroundColor:
                  themeMode === "dark"
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.74)",
                borderColor:
                  themeMode === "dark"
                    ? "rgba(255,255,255,0.10)"
                    : "rgba(0,0,0,0.06)",
              }}
            >
              <div className="mb-4 text-sm opacity-70">Section {item.label}</div>
              <h2 className="text-3xl font-bold">כותרת תוכן לדוגמה {item.label}</h2>
              <p className="mt-6 max-w-[65ch] text-lg leading-8 opacity-90">
                זהו אזור תוכן לבדיקה. כאן ייכנס בהמשך התוכן האמיתי של הדף,
                וכל חלק יוכל להשתייך לעיגול 1, 2, 3, 4 או 5.
              </p>
            </div>
          </section>
        ))}

        <div className="h-10" />
      </main>

      <Footer />
    </div>
  );
}
