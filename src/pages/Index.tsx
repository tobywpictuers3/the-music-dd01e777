import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StageNav from "@/components/StageNav";

import {
  HERO_TEXT,
  HOME_HERO_ID,
  GUIDE_SECTION_ID,
  MARQUEE_ITEMS,
} from "@/config/homepage";

import stageBgLight from "@/assets/homepage/stage/lightstage.png";
import stageBgDark  from "@/assets/homepage/stage/darkstage.png";
import logoLight    from "@/assets/logo-toby.png";
import logoDark     from "@/assets/whitelogo.png";
import imgPresenterHero from "@/assets/homepage/presenter/presenter.png";

import imgDrums     from "@/assets/homepage/characters/drums.png";
import imgPiano     from "@/assets/homepage/characters/piano.png";
import imgSaxophone from "@/assets/homepage/characters/saxophone.png";
import imgViolin    from "@/assets/homepage/characters/violin.png";
import imgGuitar    from "@/assets/homepage/characters/guitar.png";
import imgFlute     from "@/assets/homepage/characters/flute.png";
import imgPresenter from "@/assets/homepage/presenter/presenter.png";

/* ── Cards shown on first scroll (below hero) ── */
const SCROLL_CARDS = [
  {
    key: "orchestras", img: imgDrums,     href: "/orchestras",
    title: "תזמורות",
    text: "הרכבים מותאמים לכל אירוע — מהרכב קטן לקמרי, עד הפקה מלאה עם תאורה והגברה.",
    stageId: "stage-orchestras",
  },
  {
    key: "performances", img: imgSaxophone, href: "/performances",
    title: "הופעות",
    text: "מופע קיץ, ערב במה אינטימי, אירוע חגיגי — מוזיקה חיה עם התאמה לקהל ולאופי.",
    stageId: "stage-performances",
  },
  {
    key: "students", img: imgPiano,     href: "/students",
    title: "תלמידות",
    text: "26 שנות הוראה. מסלול מסודר שמחזיק תלמידה לאורך זמן — עם ליווי, דרישה ורגישות.",
    stageId: "stage-students",
  },
  {
    key: "about", img: imgFlute,     href: "/about",
    title: "אודות",
    text: "אומנות ואמינות — שני דברים שאני לא מוכנה לוותר עליהם. 35 שנות למידה רציפה.",
    stageId: "stage-about",
  },
  {
    key: "contact", img: imgPresenter, href: "/contact",
    title: "צור קשר",
    text: "שיעורים, הופעה, סדנאות, הפקת תזמורת — מתחילים בפנייה קצרה.",
    stageId: "stage-contact",
  },
  {
    key: "sheets", img: imgGuitar,    href: "/sheets",
    title: "תווים",
    text: "ספריית תווים מסודרת — רפרטואר קלאסי, מגוון ומותאם, נוח ומהיר לשימוש.",
    stageId: "stage-sheets",
  },
  {
    key: "blog", img: imgViolin,    href: "/blog",
    title: "בלוג",
    text: "הקשבה, דיוק ורגישות — מחשבות על הוראה, הופעות וחיים מוזיקליים.",
    stageId: "stage-blog",
  },
] as const;

/* scroll phases:
   0 = hero only
   1 = cards visible below hero (hero still full)
   2+ = hero fade-out, stage-nav starts
*/
type Phase = 0 | 1 | 2;

export default function Index() {
  const heroRef   = useRef<HTMLDivElement>(null);
  const cardsRef  = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>(0);
  const [showMarquee, setShowMarquee] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      if (sy < vh * 0.25)      setPhase(0);
      else if (sy < vh * 0.75) setPhase(1);
      else                      setPhase(2);
      setShowMarquee(sy > vh * 0.9);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        /* ── presenter float ── */
        @keyframes presenter-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }

        /* ── sparkle animation for כאן ── */
        @keyframes sparkle-float {
          0%,100% { opacity:0; transform:scale(0) rotate(0deg); }
          20%     { opacity:1; transform:scale(1) rotate(30deg); }
          80%     { opacity:1; transform:scale(.8) rotate(-20deg); }
        }
        .sparkle-star {
          position:absolute; border-radius:9999px; pointer-events:none;
          background:hsl(var(--primary));
          box-shadow:0 0 6px 2px hsl(var(--primary)/.6);
          animation:sparkle-float 1.6s ease-in-out infinite;
        }

        /* ── hero text "כאן" — fire gradient, subtle glow at rest ── */
        .hero-kaan {
          background: linear-gradient(135deg, #C9A961 0%, #E85D20 35%, #C9202A 65%, #8B1A2B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(232,93,32,0.35));
          transition: filter 0.3s ease;
          cursor: pointer;
          text-decoration: underline;
          text-decoration-color: rgba(201,169,97,0.35);
          text-underline-offset: 8px;
        }
        .hero-kaan:hover {
          filter: drop-shadow(0 0 18px rgba(232,93,32,0.75)) drop-shadow(0 0 32px rgba(201,41,42,0.55));
        }
        /* sparkles only on hover */
        .hero-kaan .sparkle-star { animation-play-state: paused; opacity:0; }
        .hero-kaan:hover .sparkle-star { animation-play-state: running; }

        /* ── Neon frame ── */
        @keyframes frame-pulse {
          0%,100% { box-shadow:0 0 8px 1px rgba(218,130,40,.35),0 0 24px 4px rgba(180,60,20,.18); }
          50%     { box-shadow:0 0 14px 3px rgba(218,130,40,.55),0 0 36px 8px rgba(180,60,20,.28); }
        }
        @keyframes frame-pulse-light {
          0%,100% { box-shadow:0 0 0 1px rgba(107,31,42,.18),0 4px 24px rgba(107,31,42,.12); }
          50%     { box-shadow:0 0 0 1px rgba(107,31,42,.28),0 6px 32px rgba(107,31,42,.20); }
        }
        .neon-frame {
          border:2px solid rgba(218,130,40,.9); border-radius:22px;
          background:rgba(5,2,3,.72); backdrop-filter:blur(6px);
          animation:frame-pulse 3s ease-in-out infinite;
          position:relative; overflow:hidden;
        }
        :root:not(.dark) .neon-frame {
          border:1.5px solid rgba(107,31,42,.55);
          background:rgba(245,241,234,.82);
          animation:frame-pulse-light 3s ease-in-out infinite;
        }
        .neon-frame::before {
          content:''; position:absolute; inset:0; border-radius:20px;
          border:1px solid rgba(238,185,80,.35); pointer-events:none;
        }
        :root:not(.dark) .neon-frame::before { border:1px solid rgba(201,169,97,.30); }
        .neon-frame::after {
          content:''; position:absolute;
          top:0; left:10%; right:10%; height:1px;
          background:linear-gradient(90deg,transparent,rgba(218,130,40,.6),transparent);
          pointer-events:none;
        }
        :root:not(.dark) .neon-frame::after {
          background:linear-gradient(90deg,transparent,rgba(107,31,42,.35),transparent);
        }

        /* ── SCROLL CARDS (phase 1) ── */
        @keyframes cards-up {
          from { opacity:0; transform:translateY(60px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes cards-out {
          from { opacity:1; transform:translateY(0); }
          to   { opacity:0; transform:translateY(-50px); }
        }
        .scroll-cards-wrap {
          display:flex; flex-wrap:wrap; gap:12px;
          justify-content:center;
          padding:20px 24px 28px;
        }
        .scroll-card-enter { animation:cards-up .45s cubic-bezier(.22,1,.36,1) both; }
        .scroll-card-exit  { animation:cards-out .35s ease forwards; }
        .scroll-card {
          display:flex; flex-direction:column; align-items:center; gap:8px;
          padding:14px 16px 16px;
          border-radius:18px;
          border:1.5px solid hsl(var(--primary)/.38);
          background:hsl(var(--card)/.88);
          backdrop-filter:blur(10px);
          text-decoration:none; direction:rtl;
          min-width:130px; max-width:160px;
          cursor:pointer;
          transition:border-color .22s, transform .22s, box-shadow .22s;
        }
        .scroll-card:hover {
          border-color:hsl(var(--primary));
          transform:translateY(-4px);
          box-shadow:0 0 0 1px hsl(var(--primary)/.28),0 0 18px 4px hsl(var(--primary)/.18),0 8px 22px rgba(0,0,0,.25);
        }
        .scroll-card-img {
          width:52px; height:60px; object-fit:contain; background:transparent;
          filter:drop-shadow(0 4px 8px rgba(0,0,0,.4));
          transition:transform .28s ease;
        }
        .scroll-card:hover .scroll-card-img { transform:translateY(-5px) scale(1.10); }
        .scroll-card-title {
          font-size:.85rem; font-weight:800;
          color:hsl(var(--primary)); white-space:nowrap;
        }
        .scroll-card-text {
          font-size:.70rem; color:hsl(var(--foreground)/.70);
          line-height:1.45; text-align:center;
        }

        /* ── LOGO entrance ── */
        @keyframes logo-entrance {
          0%  { opacity:0; transform:scale(.6) translateY(-28px); filter:blur(6px); }
          55% { opacity:1; transform:scale(1.07) translateY(4px); filter:blur(0); }
          75% { transform:scale(.97) translateY(-2px); }
          100%{ opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
        }
        .logo-entrance { animation:logo-entrance 1.1s cubic-bezier(.16,1,.3,1) forwards; }

        /* ── MARQUEE ── */
        @keyframes toby-marquee {
          0%  { transform:translateX(0); }
          100%{ transform:translateX(-50%); }
        }
        .toby-marquee-track {
          animation:toby-marquee 26s linear infinite;
          width:max-content;
        }

        /* ── Hero fade phases ── */
        .hero-phase-0 { opacity:1; transition:opacity .6s ease; }
        .hero-phase-2 { opacity:0; transition:opacity .6s ease; }
      `}</style>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* Marquee */}
        {showMarquee && (
          <div className="fixed inset-x-0 top-0 z-[60] overflow-hidden border-b border-border bg-accent py-3 text-accent-foreground">
            <div className="toby-marquee-track flex items-center gap-6 whitespace-nowrap pr-6">
              {[...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((item,i) => (
                <span key={`${item}-${i}`}
                  className="text-base font-semibold tracking-[.18em] text-accent-foreground/95 md:text-lg">
                  {item}<span className="mx-6 text-accent-foreground/45">•</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════ */}
        <section
          id={HOME_HERO_ID}
          ref={heroRef}
          className={`relative isolate overflow-hidden ${phase === 2 ? "hero-phase-2" : "hero-phase-0"}`}
        >
          {/* Stage background */}
          <div className="absolute inset-0">
            <img src={stageBgLight} alt="" className="block h-full w-full object-cover dark:hidden" />
            <img src={stageBgDark}  alt="" className="hidden h-full w-full object-cover dark:block" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
            {[−15, 0, 15].map((deg,i) => (
              <div key={i} aria-hidden="true"
                className="absolute top-0 w-0.5 pointer-events-none z-[2]"
                style={{
                  left:`${30+i*20}%`, height:"200px",
                  transform:`rotate(${deg}deg)`,
                  transformOrigin:"top center",
                  background:"linear-gradient(180deg,rgba(201,169,97,.10) 0%,transparent 100%)",
                  animationDelay:`${i*.8}s`
                }} />
            ))}
          </div>

          {/* Presenter — same position as StageNav */}
          <div aria-hidden="true" className="absolute z-20"
            style={{
              left:"4%", bottom:"2%", width:"16%",
              filter:"drop-shadow(0 14px 32px rgba(0,0,0,.55))",
              animation:"presenter-float 3.5s ease-in-out infinite",
            }}>
            <img src={imgPresenterHero} alt="" className="w-full block" style={{background:"transparent"}} />
          </div>

          {/* Hero content */}
          <div className="relative mx-auto max-w-[1600px] min-h-[900px] px-4 pt-8 md:min-h-[1020px] md:px-8 lg:min-h-[1100px]">
            <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center pt-6 pb-[280px] text-center md:pt-10 md:pb-[360px] lg:pb-[420px]">

              {/* Logo */}
              <img src={logoLight} alt="Toby Music"
                className="logo-entrance mb-4 h-[70px] object-contain drop-shadow-[0_6px_28px_rgba(0,0,0,.35)] dark:hidden md:h-[95px] lg:h-[110px]" />
              <img src={logoDark}  alt="Toby Music"
                className="logo-entrance mb-4 hidden h-[70px] object-contain drop-shadow-[0_6px_28px_rgba(0,0,0,.35)] dark:block md:h-[95px] lg:h-[110px]" />

              {/* Headline */}
              <h1 className="text-[clamp(34px,4.8vw,68px)] font-black leading-tight text-foreground drop-shadow-[0_4px_20px_rgba(0,0,0,.35)]">
                {HERO_TEXT.subtitle}{" "}
                <a href={HERO_TEXT.linkHref} className="hero-kaan relative inline-block">
                  {HERO_TEXT.linkWord}
                  <span className="sparkle-star" style={{top:"-10px",right:"-6px",  width:8,height:8,animationDelay:"0s"  }} />
                  <span className="sparkle-star" style={{top:"-4px", left:"-10px", width:6,height:6,animationDelay:".4s"}} />
                  <span className="sparkle-star" style={{bottom:"-8px",right:"4px", width:5,height:5,animationDelay:".8s"}} />
                  <span className="sparkle-star" style={{top:"2px",  right:"-14px",width:7,height:7,animationDelay:"1.2s"}} />
                  <span className="sparkle-star" style={{bottom:"-6px",left:"-8px", width:4,height:4,animationDelay:".6s"}} />
                </a>
              </h1>

              {/* Neon frame */}
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
              <a href={`#scroll-cards`} className="mt-4 text-primary/70 transition-opacity hover:text-primary" aria-label="גלול למטה">↓</a>

            </div>
          </div>

          {/* ── PHASE 1 CARDS — appear below hero on first scroll ── */}
          <div
            id="scroll-cards"
            className={`relative z-30 ${phase >= 1 ? "scroll-card-enter" : "opacity-0"} ${phase >= 2 ? "scroll-card-exit" : ""}`}
          >
            <div className="scroll-cards-wrap">
              {SCROLL_CARDS.map((card, i) => (
                <a
                  key={card.key}
                  href={`#${card.stageId}`}
                  className="scroll-card"
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(card.stageId);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <img src={card.img} alt={card.title} className="scroll-card-img" />
                  <div className="scroll-card-title">{card.title}</div>
                  <div className="scroll-card-text">{card.text}</div>
                </a>
              ))}
            </div>
          </div>

        </section>

        {/* ══════════════════════════════════════════
            STAGE NAV (phase 2+) — sticky empty stage
            instruments revealed one by one
        ══════════════════════════════════════════ */}
        <StageNav scrollCards={SCROLL_CARDS} />

        <Footer />
      </div>
    </>
  );
}
