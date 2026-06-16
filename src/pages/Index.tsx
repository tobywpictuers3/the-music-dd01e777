import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppearOnScroll from "@/components/AppearOnScroll";
import GuidePresenter from "@/components/GuidePresenter";

import {
  GUIDE_SECTION_ID,
  HERO_TEXT,
  HOME_HERO_ID,
  MARQUEE_ITEMS,
  STAGE_CHARACTERS,
  type CharacterKey,
} from "@/config/homepage";

import stageBgLight from "@/assets/homepage/stage/lightstage.png";
import stageBgDark from "@/assets/homepage/stage/darkstage.png";

import logoLight from "@/assets/logo-toby.png";
import logoDark from "@/assets/whitelogo.png";

// Characters kept in imports — used in cards section below the hero
import drums from "@/assets/homepage/characters/drums.png";
import piano from "@/assets/homepage/characters/piano.png";
import saxophone from "@/assets/homepage/characters/saxophone.png";
import violin from "@/assets/homepage/characters/violin.png";
import guitarClassic from "@/assets/homepage/characters/guitar.png";
import flute from "@/assets/homepage/characters/flute.png";
import presenterGuide from "@/assets/homepage/presenter/presenter.png";

import texStarsLight from "@/assets/homepage/textures/stars-light.png";
import texStarsDark from "@/assets/homepage/textures/stars-dark.png";
import StageNav from "@/components/StageNav";

const PRESENTER_MAP: Record<CharacterKey, string> = {
  piano,
  flute,
  guitar: guitarClassic,
  drums,
  saxophone,
  violin,
  presenter: presenterGuide,
};

export default function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const [showMarquee, setShowMarquee] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setShowMarquee(!entry.isIntersecting); },
      { threshold: 0.04 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes toby-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .toby-marquee-track {
          animation: toby-marquee 26s linear infinite;
          width: max-content;
        }

        /* Sparkle animation for "כאן" */
        @keyframes sparkle-float {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          20%       { opacity: 1; transform: scale(1) rotate(30deg); }
          80%       { opacity: 1; transform: scale(0.8) rotate(-20deg); }
        }
        .sparkle-star {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          background: hsl(var(--primary));
          box-shadow: 0 0 6px 2px hsl(var(--primary) / 0.6);
          animation: sparkle-float 1.6s ease-in-out infinite;
        }

        /* Logo entrance */
        @keyframes logo-entrance {
          0%   { opacity: 0; transform: scale(0.6) translateY(-28px); filter: blur(6px); }
          55%  { opacity: 1; transform: scale(1.07) translateY(4px);  filter: blur(0px); }
          75%  { transform: scale(0.97) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0);       filter: blur(0px); }
        }
        .logo-entrance {
          animation: logo-entrance 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Neon frame glow — dark mode: orange-red neon */
        @keyframes frame-pulse {
          0%, 100% { box-shadow: 0 0 8px 1px rgba(218,130,40,0.35), 0 0 24px 4px rgba(180,60,20,0.18); }
          50%       { box-shadow: 0 0 14px 3px rgba(218,130,40,0.55), 0 0 36px 8px rgba(180,60,20,0.28); }
        }
        /* Light mode: wine/gold elegant glow */
        @keyframes frame-pulse-light {
          0%, 100% { box-shadow: 0 0 0 1px rgba(107,31,42,0.18), 0 4px 24px rgba(107,31,42,0.12), 0 0 0 3px rgba(201,169,97,0.12); }
          50%       { box-shadow: 0 0 0 1px rgba(107,31,42,0.28), 0 6px 32px rgba(107,31,42,0.20), 0 0 0 3px rgba(201,169,97,0.20); }
        }
        .neon-frame {
          border: 2px solid rgba(218, 130, 40, 0.9);
          border-radius: 22px;
          background: rgba(5, 2, 3, 0.72);
          backdrop-filter: blur(6px);
          animation: frame-pulse 3s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }
        /* Light mode overrides */
        :root:not(.dark) .neon-frame {
          border: 1.5px solid rgba(107, 31, 42, 0.55);
          background: rgba(245, 241, 234, 0.82);
          animation: frame-pulse-light 3s ease-in-out infinite;
        }
        .neon-frame::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          border: 1px solid rgba(238, 185, 80, 0.35);
          pointer-events: none;
        }
        :root:not(.dark) .neon-frame::before {
          border: 1px solid rgba(201, 169, 97, 0.30);
        }
        .neon-frame::after {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(218,130,40,0.6), transparent);
          pointer-events: none;
        }
        :root:not(.dark) .neon-frame::after {
          background: linear-gradient(90deg, transparent, rgba(107,31,42,0.35), transparent);
        }

        /* Stage overlays — minimal, image already has curtains */
        @keyframes stage-spotlight {
          0%, 100% { opacity: 0.08; }
          50%       { opacity: 0.14; }
        }
        .spotlight-beam {
          position: absolute; top: 0; width: 2px;
          transform-origin: top center;
          background: linear-gradient(180deg, rgba(201,169,97,0.10) 0%, transparent 100%);
          animation: stage-spotlight 4s ease-in-out infinite;
          pointer-events: none; z-index: 2;
        }
      `}</style>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {showMarquee && (
          <div className="fixed inset-x-0 top-0 z-[60] overflow-hidden border-b border-border bg-accent py-3 text-accent-foreground">
            <div className="toby-marquee-track flex items-center gap-6 whitespace-nowrap pr-6">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="text-base font-semibold tracking-[0.18em] text-accent-foreground/95 md:text-lg"
                >
                  {item}
                  <span className="mx-6 text-accent-foreground/45">•</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <section
          ref={heroRef}
          id={HOME_HERO_ID}
          className="relative isolate overflow-hidden"
        >
          {/* Stage background */}
          <div className="absolute inset-0">
            <img src={stageBgLight} alt="" className="block h-full w-full object-cover dark:hidden" />
            <img src={stageBgDark}  alt="" className="hidden h-full w-full object-cover dark:block" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
            {/* Subtle spotlight beams only — stage image already has curtains */}
            {[-15, 0, 15].map((deg, i) => (
              <div key={i} className="spotlight-beam" aria-hidden="true"
                style={{ left: `${30 + i * 20}%`, height: "200px", transform: `rotate(${deg}deg)`, animationDelay: `${i * 0.8}s` }} />
            ))}
          </div>

          {/* Hero content — logo + headline + neon frame — all above instruments */}
          <div className="relative mx-auto max-w-[1600px] min-h-[900px] px-4 pt-8 md:min-h-[1020px] md:px-8 lg:min-h-[1100px]">
            <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center pt-6 pb-[310px] text-center md:pt-10 md:pb-[390px] lg:pb-[450px]">

              {/* ── LOGO — large, centered, above headline ── */}
              <img
                src={logoLight}
                alt="Toby Music"
                className="logo-entrance mb-4 h-[70px] object-contain drop-shadow-[0_6px_28px_rgba(0,0,0,0.35)] dark:hidden md:h-[95px] lg:h-[110px]"
              />
              <img
                src={logoDark}
                alt="Toby Music"
                className="logo-entrance mb-4 hidden h-[70px] object-contain drop-shadow-[0_6px_28px_rgba(0,0,0,0.35)] dark:block md:h-[95px] lg:h-[110px]"
              />

              {/* ── HEADLINE — "המוזיקה מתחילה כאן" ── */}
              <h1 className="text-[clamp(34px,4.8vw,68px)] font-black leading-tight text-foreground drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                {HERO_TEXT.subtitle}{" "}
                <a
                  href={HERO_TEXT.linkHref}
                  className="relative inline-block cursor-pointer text-accent underline decoration-accent/35 decoration-2 underline-offset-8 transition-colors hover:text-accent/80"
                >
                  {HERO_TEXT.linkWord}
                  {/* Sparkles */}
                  <span className="sparkle-star" style={{ top: "-10px", right: "-6px",  width: 8, height: 8, animationDelay: "0s"   }} aria-hidden="true" />
                  <span className="sparkle-star" style={{ top: "-4px",  left: "-10px", width: 6, height: 6, animationDelay: "0.4s" }} aria-hidden="true" />
                  <span className="sparkle-star" style={{ bottom: "-8px", right: "4px", width: 5, height: 5, animationDelay: "0.8s" }} aria-hidden="true" />
                  <span className="sparkle-star" style={{ top: "2px",   right: "-14px", width: 7, height: 7, animationDelay: "1.2s" }} aria-hidden="true" />
                  <span className="sparkle-star" style={{ bottom: "-6px", left: "-8px", width: 4, height: 4, animationDelay: "0.6s" }} aria-hidden="true" />
                </a>
              </h1>

              {/* ── NEON FRAME — wraps sub-text only ── */}
              <div className="neon-frame mt-5 w-full max-w-[580px] px-7 py-4 md:mt-6 md:max-w-[640px] md:px-9 md:py-5">
                <p className="text-[clamp(13px,1.35vw,20px)] leading-relaxed text-foreground/85">
                  {HERO_TEXT.supportLine}
                </p>
                <div className="mx-auto my-2 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
                <p className="text-[clamp(14px,1.45vw,21px)] font-bold text-foreground/90">
                  {HERO_TEXT.sloganPrefix}{" "}
                  <span className="bg-gradient-to-l from-accent via-primary to-accent bg-clip-text text-transparent">
                    {HERO_TEXT.sloganAccent}
                  </span>
                </p>
              </div>

              {/* Scroll hint */}
              <a
                href={HERO_TEXT.linkHref}
                className="mt-4 text-primary/70 transition-opacity hover:text-primary"
                aria-label="גלול למטה"
              >
                ↓
              </a>

            </div>
          </div>
        </section>

        <GuidePresenter />

        {/* Stage Navigation — instruments on empty stage + bottom cards bar */}
        <StageNav />

        <Footer />
      </div>
    </>
  );
}
