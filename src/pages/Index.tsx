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

import signPiano from "@/assets/homepage/characters-signs/piano.png";
import signEguitar from "@/assets/homepage/characters-signs/eguitar.png";
import signGuitar from "@/assets/homepage/characters-signs/guitar.png";
import signDrums from "@/assets/homepage/characters-signs/drums.png";
import signSaxophone from "@/assets/homepage/characters-signs/saxophone.png";
import signViolin from "@/assets/homepage/characters-signs/violin.png";
import presenterGuide from "@/assets/homepage/presenter/presenter.png";

import drums from "@/assets/homepage/characters/drums.png";
import piano from "@/assets/homepage/characters/piano.png";
import saxophone from "@/assets/homepage/characters/saxophone.png";
import violin from "@/assets/homepage/characters/violin.png";
import guitarClassic from "@/assets/homepage/characters/guitar.png";
import guitarElectric from "@/assets/homepage/characters/eguitar.png";

import texStarsLight from "@/assets/homepage/textures/stars-light.png";
import texStarsDark from "@/assets/homepage/textures/stars-dark.png";

const SIGN_CHARACTER_MAP: Record<CharacterKey, string> = {
  piano: signPiano,
  eguitar: signEguitar,
  guitar: signGuitar,
  drums: signDrums,
  saxophone: signSaxophone,
  violin: signViolin,
  presenter: presenterGuide,
};

const PRESENTER_MAP: Record<CharacterKey, string> = {
  piano,
  eguitar: guitarElectric,
  guitar: guitarClassic,
  drums,
  saxophone,
  violin,
  presenter: presenterGuide,
};

export default function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const [showMarquee, setShowMarquee] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMarquee(!entry.isIntersecting);
      },
      {
        threshold: 0.04,
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!bubbleDismissed && window.scrollY > 60) {
        setShowSpeechBubble(true);
      }
      if (window.scrollY < 20) {
        setShowSpeechBubble(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [bubbleDismissed]);

  const presenterChar = STAGE_CHARACTERS.find((c) => c.character === "presenter");

  return (
    <>
      <style>{`
        @keyframes toby-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .toby-marquee-track {
          animation: toby-marquee 26s linear infinite;
          width: max-content;
        }

        @keyframes sparkle-float {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: scale(1) rotate(30deg);
          }
          80% {
            opacity: 1;
            transform: scale(0.8) rotate(-20deg);
          }
        }

        .sparkle-star {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          background: hsl(var(--primary));
          box-shadow: 0 0 6px 2px hsl(var(--primary) / 0.6);
          animation: sparkle-float 1.6s ease-in-out infinite;
        }

        @keyframes logo-entrance {
          0% {
            opacity: 0;
            transform: scale(0.6) translateY(-28px);
            filter: blur(6px);
          }
          55% {
            opacity: 1;
            transform: scale(1.07) translateY(4px);
            filter: blur(0px);
          }
          75% {
            transform: scale(0.97) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }

        .logo-entrance {
          animation: logo-entrance 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes speech-bubble-in {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .speech-bubble-in {
          animation: speech-bubble-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {showMarquee && (
          <div className="fixed inset-x-0 top-0 z-[60] overflow-hidden border-b border-border bg-accent py-3 text-accent-foreground">
            <div className="toby-marquee-track flex items-center gap-6 whitespace-nowrap pr-6">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
                (item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className="text-base font-semibold tracking-[0.18em] text-accent-foreground/95 md:text-lg"
                  >
                    {item}
                    <span className="mx-6 text-accent-foreground/45">•</span>
                  </span>
                )
              )}
            </div>
          </div>
        )}

        <section
          ref={heroRef}
          id={HOME_HERO_ID}
          className="relative isolate overflow-hidden"
        >
          <div className="absolute inset-0">
            <img
              src={stageBgLight}
              alt=""
              className="block h-full w-full object-cover dark:hidden"
            />
            <img
              src={stageBgDark}
              alt=""
              className="hidden h-full w-full object-cover dark:block"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
          </div>

          <div className="relative mx-auto max-w-[1600px] min-h-[900px] px-4 pt-8 md:min-h-[1020px] md:px-8 lg:min-h-[1100px]">
            {/* Logo + hero text — centered prominent */}
            <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center pt-6 pb-[310px] text-center md:pt-10 md:pb-[390px] lg:pb-[450px]">
              <img
                src={logoLight}
                alt="Toby Music"
                className="logo-entrance mb-6 h-[80px] object-contain drop-shadow-[0_6px_28px_rgba(0,0,0,0.30)] dark:hidden md:h-[110px] lg:h-[130px]"
              />

              <img
                src={logoDark}
                alt="Toby Music"
                className="logo-entrance mb-6 hidden h-[80px] object-contain drop-shadow-[0_6px_28px_rgba(0,0,0,0.30)] dark:block md:h-[110px] lg:h-[130px]"
              />

              <h1 className="text-[clamp(36px,5vw,72px)] font-black leading-tight text-foreground drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
                {HERO_TEXT.subtitle}{" "}
                <a
                  href={HERO_TEXT.linkHref}
                  className="relative inline-block cursor-pointer text-accent underline decoration-accent/35 decoration-2 underline-offset-8 transition-colors hover:text-accent/80"
                >
                  {HERO_TEXT.linkWord}

                  <span
                    className="sparkle-star"
                    style={{
                      top: "-10px",
                      right: "-6px",
                      width: 8,
                      height: 8,
                      animationDelay: "0s",
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="sparkle-star"
                    style={{
                      top: "-4px",
                      left: "-10px",
                      width: 6,
                      height: 6,
                      animationDelay: "0.4s",
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="sparkle-star"
                    style={{
                      bottom: "-8px",
                      right: "4px",
                      width: 5,
                      height: 5,
                      animationDelay: "0.8s",
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="sparkle-star"
                    style={{
                      top: "2px",
                      right: "-14px",
                      width: 7,
                      height: 7,
                      animationDelay: "1.2s",
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="sparkle-star"
                    style={{
                      bottom: "-6px",
                      left: "-8px",
                      width: 4,
                      height: 4,
                      animationDelay: "0.6s",
                    }}
                    aria-hidden="true"
                  />
                </a>
              </h1>

              <p className="mt-4 rounded-full bg-foreground/5 px-6 py-2 text-[clamp(14px,1.4vw,22px)] text-foreground/80 backdrop-blur-sm">
                {HERO_TEXT.supportLine}
              </p>

              <p className="mt-3 text-[clamp(16px,1.6vw,26px)] font-bold text-foreground/90">
                {HERO_TEXT.sloganPrefix}{" "}
                <span className="bg-gradient-to-l from-accent via-primary to-accent bg-clip-text text-transparent">
                  {HERO_TEXT.sloganAccent}
                </span>
              </p>
            </div>

            {/* Stage characters */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[360px] md:h-[470px] lg:h-[560px]">
              {STAGE_CHARACTERS.map((char) => (
                <Link
                  key={char.href}
                  to={char.href}
                  className="pointer-events-auto group absolute -translate-x-1/2 origin-bottom transition-transform duration-300 hover:scale-105"
                  style={{
                    left: char.stage.left,
                    bottom: char.stage.bottom,
                    width: char.stage.width,
                    zIndex: char.stage.zIndex,
                  }}
                  aria-label={`מעבר לדף ${char.title}`}
                >
                  <div className="relative">
                    <img
                      src={SIGN_CHARACTER_MAP[char.character]}
                      alt={char.title}
                      className="block w-full"
                      style={{
                        filter:
                          "drop-shadow(0 22px 48px rgba(0,0,0,0.52)) drop-shadow(0 6px 14px rgba(0,0,0,0.36)) drop-shadow(0 2px 4px rgba(0,0,0,0.22))",
                      }}
                    />

                    {char.labelMode === "badge" ? (
                      <div className="absolute inset-x-[10%] bottom-[8%] flex justify-center">
                        <span className="rounded-full bg-background/78 px-4 py-2 text-center text-[clamp(11px,1vw,17px)] font-bold leading-tight text-foreground shadow-lg ring-1 ring-border backdrop-blur-sm transition-colors group-hover:text-accent">
                          {char.title}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="absolute flex items-center justify-center"
                        style={{
                          top: char.signBox.top,
                          left: char.signBox.left,
                          width: char.signBox.width,
                          height: char.signBox.height,
                        }}
                      >
                        <span className="text-center font-black leading-tight text-foreground drop-shadow-sm transition-colors group-hover:text-accent"
                          style={{ fontSize: "clamp(13px,1.45vw,23px)" }}
                        >
                          {char.title}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}

              {/* Speech bubble from presenter on scroll */}
              {showSpeechBubble && !bubbleDismissed && presenterChar && (
                <div
                  className="speech-bubble-in pointer-events-auto absolute z-30"
                  style={{
                    left: `calc(${presenterChar.stage.left} + ${presenterChar.stage.width} + 0.5%)`,
                    bottom: "72%",
                  }}
                  dir="rtl"
                >
                  <div className="relative max-w-[210px] rounded-2xl border border-border/70 bg-card/95 px-4 py-3 text-sm font-semibold leading-6 text-card-foreground shadow-2xl backdrop-blur-sm md:max-w-[260px] md:text-base">
                    <span>ברוכים הבאים ל</span>
                    <span className="text-accent">Toby music</span>
                    {/* Tail pointing left toward presenter */}
                    <div
                      className="absolute top-4 h-3 w-3 rotate-45 border-b border-l border-border/70 bg-card/95"
                      style={{ left: "-7px" }}
                    />
                    <button
                      onClick={() => {
                        setBubbleDismissed(true);
                        setShowSpeechBubble(false);
                      }}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      aria-label="סגור"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <GuidePresenter />

        <AppearOnScroll>
          <section className="px-4 py-12 md:px-8 md:py-20" dir="rtl">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
                {STAGE_CHARACTERS.map((char) => (
                  <Link
                    key={char.href}
                    to={char.href}
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl md:p-8"
                  >
                    <img
                      src={texStarsLight}
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] dark:hidden"
                    />

                    <img
                      src={texStarsDark}
                      alt=""
                      className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover opacity-[0.15] dark:block"
                    />

                    <div className="relative z-10">
                      <img
                        src={PRESENTER_MAP[char.character]}
                        alt={char.title}
                        className={`mx-auto mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] ${
                          char.character === "drums"
                            ? "w-36 md:w-44 xl:w-52"
                            : char.character === "presenter"
                            ? "w-28 md:w-32 xl:w-36"
                            : "w-24 md:w-28 xl:w-32"
                        }`}
                      />

                      <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-accent">
                        {char.title}
                      </h3>

                      <p className="text-sm leading-7 text-muted-foreground">
                        {char.quote}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </AppearOnScroll>

        <Footer />
      </div>
    </>
  );
}
