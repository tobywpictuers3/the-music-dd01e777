import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppearOnScroll from "@/components/AppearOnScroll";
import GuidePresenter from "@/components/GuidePresenter";

import {
  HERO_TEXT,
  HOME_HERO_ID,
  MARQUEE_ITEMS,
  STAGE_CHARACTERS,
  type CharacterKey,
} from "@/config/homepage";

// רקעי במה
import stageBgLight from "@/assets/homepage/stage/lightstage.png";
import stageBgDark from "@/assets/homepage/stage/darkstage.png";

// לוגו
import logoLight from "@/assets/logo-toby.png";
import logoDark from "@/assets/whitelogo.png";

// דמויות-שלט על הבמה
import signPiano from "@/assets/homepage/characters-signs/piano.png";
import signEguitar from "@/assets/homepage/characters-signs/eguitar.png";
import signGuitar from "@/assets/homepage/characters-signs/guitar.png";
import signDrums from "@/assets/homepage/characters-signs/drums.png";
import signSaxophone from "@/assets/homepage/characters-signs/saxophone.png";
import signViolin from "@/assets/homepage/characters-signs/violin.png";

// דמויות מגישות למקטע התחתון
import drums from "@/assets/homepage/characters/drums.png";
import piano from "@/assets/homepage/characters/piano.png";
import saxophone from "@/assets/homepage/characters/saxophone.png";
import violin from "@/assets/homepage/characters/violin.png";
import guitarClassic from "@/assets/homepage/characters/guitar.png";
import guitarElectric from "@/assets/homepage/characters/eguitar.png";

// טקסטורות לכרטיסים
import texStarsLight from "@/assets/homepage/textures/stars-light.png";
import texStarsDark from "@/assets/homepage/textures/stars-dark.png";

/**
 * =========================================================
 * מפת תמונות — דמויות הבמה
 * =========================================================
 */
const SIGN_CHARACTER_MAP: Record<CharacterKey, string> = {
  piano: signPiano,
  eguitar: signEguitar,
  guitar: signGuitar,
  drums: signDrums,
  saxophone: signSaxophone,
  violin: signViolin,
};

/**
 * =========================================================
 * מפת תמונות — דמוון
 * =========================================================
 */
const PRESENTER_MAP: Record<CharacterKey, string> = {
  piano,
  eguitar: guitarElectric,
  guitar: guitarClassic,
  drums,
  saxophone,
  violin,
};

/**
 * =========================================================
 * הגדרות צל רצפה לכל דמות
 * אפשר לכוון כאן בלי לגעת בלוגיקה
 * =========================================================
 */
const STAGE_SHADOW_MAP: Record<
  CharacterKey,
  {
    width: string;
    height: string;
    blur: number;
    opacity: number;
    bottom: string;
  }
> = {
  piano: {
    width: "44%",
    height: "8.5%",
    blur: 16,
    opacity: 0.24,
    bottom: "2.3%",
  },
  eguitar: {
    width: "28%",
    height: "7%",
    blur: 13,
    opacity: 0.2,
    bottom: "2.2%",
  },
  guitar: {
    width: "28%",
    height: "7%",
    blur: 13,
    opacity: 0.2,
    bottom: "2.2%",
  },
  drums: {
    width: "34%",
    height: "8%",
    blur: 15,
    opacity: 0.22,
    bottom: "2%",
  },
  saxophone: {
    width: "24%",
    height: "6.5%",
    blur: 12,
    opacity: 0.2,
    bottom: "2.2%",
  },
  violin: {
    width: "22%",
    height: "6%",
    blur: 12,
    opacity: 0.2,
    bottom: "2.2%",
  },
};

export default function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const [showMarquee, setShowMarquee] = useState(false);

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

        {/* ======================================================
            HERO / STAGE
            במה אחת עם יחס נעול:
            - רקע
            - טקסט
            - דמויות
            כולם באותו קונטיינר
        ====================================================== */}
        <section
          ref={heroRef}
          id={HOME_HERO_ID}
          className="relative isolate overflow-hidden"
        >
          <div className="relative mx-auto max-w-[1600px] px-4 pt-8 md:px-8">
            {/* 
              יחס מדויק לפי קבצי הבמה:
              2048 / 1365
            */}
            <div
              className="relative mx-auto w-full overflow-hidden"
              style={{ aspectRatio: "2048 / 1365" }}
            >
              {/* רקע במה */}
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

                {/* מעבר עדין לתוכן שמתחת */}
                <div className="absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-b from-transparent to-background/90" />
              </div>

              {/* ==================================================
                  שכבת טקסט ההירו
                  בתוך אותה הבמה
              ================================================== */}
              <div className="absolute inset-x-0 top-0 z-20 flex h-[42%] flex-col items-center px-4 pt-[4.5%] text-center sm:px-6 md:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
                  {/* לוגו במצב בהיר */}
                  <img
                    src={logoLight}
                    alt="Toby Music"
                    className="mb-3 h-[clamp(42px,5vw,98px)] object-contain drop-shadow-lg dark:hidden"
                  />

                  {/* לוגו במצב כהה */}
                  <img
                    src={logoDark}
                    alt="Toby Music"
                    className="mb-3 hidden h-[clamp(42px,5vw,98px)] object-contain drop-shadow-lg dark:block"
                  />

                  {/* כותרת */}
                  <h1 className="text-[clamp(24px,4vw,72px)] font-black leading-tight text-foreground drop-shadow-[0_4px_20px_rgba(0,0,0,0.22)]">
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

                  {/* שורת תמיכה */}
                  <p className="mt-3 rounded-full bg-foreground/7 px-4 py-2 text-[clamp(11px,1.25vw,22px)] text-foreground/85 backdrop-blur-sm sm:px-6">
                    {HERO_TEXT.supportLine}
                  </p>

                  {/* סלוגן */}
                  <p className="mt-3 text-[clamp(12px,1.45vw,26px)] font-bold text-foreground/90">
                    {HERO_TEXT.sloganPrefix}{" "}
                    <span className="bg-gradient-to-l from-accent via-primary to-accent bg-clip-text text-transparent">
                      {HERO_TEXT.sloganAccent}
                    </span>
                  </p>
                </div>
              </div>

              {/* ==================================================
                  שכבת הדמויות
                  חשובה מאוד:
                  - יושבת בתוך הבמה עצמה
                  - גובה יחסי, לא px
                  - לכן נשמר יחס עם הרקע
              ================================================== */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[48%] sm:h-[49%] md:h-[50%] lg:h-[51%]">
                {STAGE_CHARACTERS.map((char) => {
                  const shadow = STAGE_SHADOW_MAP[char.character];

                  return (
                    <Link
                      key={char.character}
                      to={char.href}
                      className="pointer-events-auto group absolute -translate-x-1/2 origin-bottom transition-transform duration-300 hover:scale-[1.03]"
                      style={{
                        left: char.stage.left,
                        bottom: char.stage.bottom,
                        width: char.stage.width,
                        zIndex: char.stage.zIndex,
                      }}
                      aria-label={`מעבר לדף ${char.title}`}
                    >
                      <div className="relative">
                        {/* צל רצפה רחב */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full"
                          style={{
                            bottom: shadow.bottom,
                            width: shadow.width,
                            height: shadow.height,
                            background: `rgba(25, 16, 8, ${shadow.opacity})`,
                            filter: `blur(${shadow.blur}px)`,
                            zIndex: 0,
                          }}
                        />

                        {/* צל חם קטן יותר, ל"ישיבה" על הבמה */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full"
                          style={{
                            bottom: "3%",
                            width: `calc(${shadow.width} * 0.62)`,
                            height: `calc(${shadow.height} * 0.65)`,
                            background: "rgba(120, 72, 24, 0.12)",
                            filter: "blur(8px)",
                            zIndex: 0,
                          }}
                        />

                        {/* דמות */}
                        <img
                          src={SIGN_CHARACTER_MAP[char.character]}
                          alt={char.title}
                          className="relative z-10 block w-full"
                          style={{
                            filter:
                              "drop-shadow(0 16px 24px rgba(0,0,0,0.20)) drop-shadow(0 6px 10px rgba(76,42,14,0.16))",
                          }}
                        />

                        {/* טקסט על השלט */}
                        <div
                          className="absolute z-20 flex items-center justify-center"
                          style={{
                            top: char.signBox.top,
                            left: char.signBox.left,
                            width: char.signBox.width,
                            height: char.signBox.height,
                          }}
                        >
                          <span className="text-center text-[clamp(9px,0.95vw,16px)] font-bold leading-tight text-foreground drop-shadow-sm transition-colors group-hover:text-accent">
                            {char.title}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <GuidePresenter />

        <AppearOnScroll>
          <section className="px-4 py-12 md:px-8 md:py-20" dir="rtl">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {STAGE_CHARACTERS.map((char) => (
                  <Link
                    key={char.character}
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
