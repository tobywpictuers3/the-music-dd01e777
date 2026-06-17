import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StageNav from "@/components/StageNav";

import {
  HERO_TEXT,
  HOME_HERO_ID,
  MARQUEE_ITEMS,
} from "@/config/homepage";

import stageBgLight from "@/assets/homepage/stage/lightstage.png";
import stageBgDark  from "@/assets/homepage/stage/darkstage.png";
import stageEmptyLight from "@/assets/homepage/stage/stage-empty-light.png";
import stageEmptyDark  from "@/assets/homepage/stage/stage-empty-dark.png";
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

/* 7 nav cards — 4 left, 3 right */
const LEFT_CARDS = [
  { key:"orchestras",   img:imgDrums,     href:"/orchestras",   title:"תזמורות", text:"הרכבים מותאמים לכל אירוע — מהרכב קטן עד הפקה מלאה." },
  { key:"performances", img:imgSaxophone, href:"/performances", title:"הופעות",  text:"מוזיקה חיה עם התאמה לקהל ולאופי האירוע." },
  { key:"students",     img:imgPiano,     href:"/students",     title:"תלמידות", text:"26 שנות הוראה — מסלול עם ליווי, דרישה ורגישות." },
  { key:"sheets",       img:imgGuitar,    href:"/sheets",       title:"תווים",   text:"ספריית תווים מסודרת — מהירה ונוחה לשימוש." },
] as const;

const RIGHT_CARDS = [
  { key:"about",   img:imgFlute,     href:"/about",   title:"אודות",    text:"אומנות ואמינות — שני דברים שאני לא מוכנה לוותר עליהם." },
  { key:"blog",    img:imgViolin,    href:"/blog",    title:"בלוג",     text:"מחשבות על הוראה, הופעות וחיים מוזיקליים." },
  { key:"contact", img:imgPresenter, href:"/contact", title:"צור קשר",  text:"שיעורים, הופעה, סדנאות, הפקת תזמורת — מתחילים בפנייה." },
] as const;

const ALL_CARDS = [...LEFT_CARDS, ...RIGHT_CARDS];

export default function Index() {
  const [scrollRatio, setScrollRatio] = useState(0); // 0..1 continuous
  const [showMarquee, setShowMarquee] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string|null>(null);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      // scrollRatio: 0=top, 1=fully transitioned
      setScrollRatio(Math.min(1, sy / (vh * 1.2)));
      setShowMarquee(sy > vh * 0.9);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Phase thresholds
  const showCards  = scrollRatio > 0.18;  // cards appear
  const transition = scrollRatio > 0.55;  // bg crossfade starts
  const fullStage  = scrollRatio > 0.85;  // empty stage fully visible

  // Crossfade opacity values
  const instrumentsOpacity = Math.max(0, 1 - (scrollRatio - 0.55) / 0.30);
  const emptyStageOpacity  = Math.max(0, (scrollRatio - 0.55) / 0.30);
  const cardsOpacity       = showCards
    ? (transition ? Math.max(0, 1 - (scrollRatio - 0.55) / 0.25) : 1)
    : 0;

  const hoveredCardData = ALL_CARDS.find(c => c.key === hoveredCard) ?? null;

  return (
    <>
      <style>{`
        @keyframes presenter-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
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
        /* fire gradient כאן */
        .hero-kaan {
          background: linear-gradient(135deg, #C9A961 0%, #E85D20 35%, #C9202A 65%, #8B1A2B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(232,93,32,.35));
          transition: filter 0.3s ease;
          cursor: pointer;
          text-decoration: underline;
          text-decoration-color: rgba(201,169,97,.35);
          text-underline-offset: 8px;
        }
        .hero-kaan:hover { filter: drop-shadow(0 0 20px rgba(232,93,32,.80)) drop-shadow(0 0 36px rgba(201,41,42,.60)); }
        .hero-kaan .sparkle-star { animation-play-state:paused; opacity:0; }
        .hero-kaan:hover .sparkle-star { animation-play-state:running; }

        /* neon frame */
        @keyframes frame-pulse {
          0%,100%{ box-shadow:0 0 8px 1px rgba(218,130,40,.35),0 0 24px 4px rgba(180,60,20,.18); }
          50%    { box-shadow:0 0 14px 3px rgba(218,130,40,.55),0 0 36px 8px rgba(180,60,20,.28); }
        }
        @keyframes frame-pulse-light {
          0%,100%{ box-shadow:0 0 0 1px rgba(107,31,42,.18),0 4px 24px rgba(107,31,42,.12); }
          50%    { box-shadow:0 0 0 1px rgba(107,31,42,.28),0 6px 32px rgba(107,31,42,.20); }
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

        /* logo entrance */
        @keyframes logo-entrance {
          0%  { opacity:0; transform:scale(.6) translateY(-28px); filter:blur(6px); }
          55% { opacity:1; transform:scale(1.07) translateY(4px); filter:blur(0); }
          75% { transform:scale(.97) translateY(-2px); }
          100%{ opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
        }
        .logo-entrance { animation:logo-entrance 1.1s cubic-bezier(.16,1,.3,1) forwards; }

        /* marquee */
        @keyframes toby-marquee {
          0%  { transform:translateX(0); }
          100%{ transform:translateX(-50%); }
        }
        .toby-marquee-track { animation:toby-marquee 26s linear infinite; width:max-content; }

        /* === SIDE CARDS === */
        .side-cards-col {
          position: absolute;
          top: 0; bottom: 0;
          width: 13%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          z-index: 25;
          padding: 80px 0 60px;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .side-cards-col.left  { left: 1.5%; }
        .side-cards-col.right { right: 1.5%; }
        .side-cards-col.visible { pointer-events: auto; }

        @keyframes card-slide-in-left {
          from { opacity:0; transform: translateX(-28px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes card-slide-in-right {
          from { opacity:0; transform: translateX(28px); }
          to   { opacity:1; transform: translateX(0); }
        }

        .side-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 8px 8px 10px;
          border-radius: 14px;
          border: 1.5px solid hsl(var(--primary)/.38);
          background: hsl(var(--background)/.60);
          backdrop-filter: blur(10px);
          text-decoration: none;
          direction: rtl;
          cursor: pointer;
          transition: border-color .22s, transform .22s, box-shadow .22s, background .22s;
        }
        .side-card:hover {
          border-color: hsl(var(--primary));
          background: hsl(var(--card)/.90);
          transform: scale(1.04);
          box-shadow:
            0 0 0 1px hsl(var(--primary)/.30),
            0 0 18px 4px hsl(var(--primary)/.22),
            0 8px 22px rgba(0,0,0,.25);
        }
        .side-card-img {
          width: clamp(32px, 3.5vw, 52px);
          height: clamp(38px, 4.2vw, 62px);
          object-fit: contain;
          background: transparent;
          /* instrument glow */
          filter:
            drop-shadow(0 0 6px rgba(201,169,97,.55))
            drop-shadow(0 4px 10px rgba(0,0,0,.40));
          transition: filter .28s ease, transform .28s ease;
        }
        .side-card:hover .side-card-img {
          filter:
            drop-shadow(0 0 14px rgba(201,169,97,.85))
            drop-shadow(0 0 28px rgba(232,93,32,.45))
            drop-shadow(0 6px 12px rgba(0,0,0,.45));
          transform: translateY(-4px) scale(1.08);
        }
        .side-card-title {
          font-size: clamp(.60rem,.72vw,.80rem);
          font-weight: 800;
          color: hsl(var(--primary));
          white-space: nowrap;
        }

        /* center hover bubble */
        .center-bubble-wrap {
          position: absolute;
          bottom: 30%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        @keyframes bubble-pop {
          from { opacity:0; transform:translateX(-50%) scale(.84) translateY(14px); }
          65%  { transform:translateX(-50%) scale(1.04) translateY(-3px); }
          to   { opacity:1; transform:translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes bubble-glow {
          0%,100%{ box-shadow:0 0 0 1px hsl(var(--primary)/.20),0 0 18px 4px hsl(var(--primary)/.18),0 12px 32px rgba(0,0,0,.30); }
          50%    { box-shadow:0 0 0 1px hsl(var(--primary)/.35),0 0 28px 8px hsl(var(--primary)/.28),0 12px 32px rgba(0,0,0,.30); }
        }
        .center-bubble {
          background: hsl(var(--card)/.95);
          border: 2px solid hsl(var(--primary)/.85);
          border-radius: 18px;
          padding: 14px 20px 16px;
          text-align: center; direction: rtl;
          backdrop-filter: blur(12px);
          min-width: clamp(180px,22vw,300px);
          animation:
            bubble-pop .36s cubic-bezier(.22,1,.36,1) forwards,
            bubble-glow 2.8s ease-in-out .36s infinite;
          position: relative;
        }
        .center-bubble::before {
          content:''; position:absolute; inset:5px;
          border-radius:14px; border:1px solid hsl(var(--primary)/.22); pointer-events:none;
        }
        .center-bubble::after {
          content:''; position:absolute;
          bottom: 100%; left:50%; transform:translateX(-50%);
          border:9px solid transparent;
          border-bottom-color: hsl(var(--primary)/.85);
        }
        .center-char-img {
          width: clamp(60px, 8vw, 110px);
          margin: 0 auto 8px;
          display: block;
          background: transparent;
          filter:
            drop-shadow(0 0 20px rgba(201,169,97,.80))
            drop-shadow(0 8px 20px rgba(0,0,0,.50));
          animation: char-pop .45s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes char-pop {
          from { opacity:0; transform:translateY(30px) scale(.72); }
          65%  { transform:translateY(-5px) scale(1.06); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .bubble-title {
          font-weight:800; font-size:clamp(.92rem,1.1vw,1.15rem);
          color:hsl(var(--primary)); margin-bottom:5px;
        }
        .bubble-quote {
          font-size:clamp(.70rem,.82vw,.88rem);
          color:hsl(var(--foreground)/.76); line-height:1.52; margin-bottom:10px;
        }
        .bubble-btn {
          display:inline-flex; align-items:center; gap:5px;
          background:hsl(var(--accent)); color:hsl(var(--accent-foreground));
          font-size:.74rem; font-weight:700; padding:6px 18px; border-radius:999px;
          text-decoration:none; pointer-events:auto;
          transition:opacity .2s,transform .2s;
        }
        .bubble-btn:hover { opacity:.84; transform:scale(1.04); }

        /* header char glow in dark mode */
        .hdr-char-glow {
          filter:
            drop-shadow(0 0 6px rgba(201,169,97,.55))
            drop-shadow(0 3px 8px rgba(0,0,0,.45));
        }
        .dark .hdr-char-glow {
          filter:
            drop-shadow(0 0 8px rgba(201,169,97,.75))
            drop-shadow(0 0 16px rgba(232,93,32,.35))
            drop-shadow(0 4px 10px rgba(0,0,0,.55));
        }
      `}</style>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {showMarquee && (
          <div className="fixed inset-x-0 top-0 z-[60] overflow-hidden border-b border-border bg-accent py-3 text-accent-foreground">
            <div className="toby-marquee-track flex items-center gap-6 whitespace-nowrap pr-6">
              {[...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((item,i) => (
                <span key={`${item}-${i}`} className="text-base font-semibold tracking-[.18em] text-accent-foreground/95 md:text-lg">
                  {item}<span className="mx-6 text-accent-foreground/45">•</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            HERO — sticky wrapper so stage never disappears
        ===================================================== */}
        <div
          id={HOME_HERO_ID}
          style={{ height: "220vh" }}   /* scroll space */
          className="relative"
        >
          {/* STICKY container — stays in viewport during scroll */}
          <div className="sticky top-0 h-screen overflow-hidden">

            {/* === LAYER 1: stage WITH instruments (fades out) === */}
            <div
              className="absolute inset-0"
              style={{ opacity: instrumentsOpacity, transition: "opacity 0.05s linear", zIndex: 1 }}
            >
              <img src={stageBgLight} alt="" className="block dark:hidden"
                style={{ position:"absolute", inset:0, width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center center", maxWidth:"none" }} />
              <img src={stageBgDark}  alt="" className="hidden dark:block"
                style={{ position:"absolute", inset:0, width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center center", maxWidth:"none" }} />
            </div>

            {/* === LAYER 2: empty stage (fades in) === */}
            <div
              className="absolute inset-0"
              style={{ opacity: emptyStageOpacity, transition: "opacity 0.05s linear", zIndex: 2 }}
            >
              <img src={stageEmptyLight} alt="" className="block dark:hidden"
                style={{ position:"absolute", inset:0, width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center center", maxWidth:"none" }} />
              <img src={stageEmptyDark}  alt="" className="hidden dark:block"
                style={{ position:"absolute", inset:0, width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center center", maxWidth:"none" }} />
            </div>

            {/* === PRESENTER — always same position, z above both layers === */}
            <div
              className="absolute z-20"
              style={{
                left: "4%",
                /* bottom of stage platform ~= 67% from top of image */
                bottom: "28%",
                width: "14%",
                filter: "drop-shadow(0 14px 32px rgba(0,0,0,.55))",
                animation: "presenter-float 3.5s ease-in-out infinite",
              }}
            >
              <img src={imgPresenterHero} alt="" className="w-full block" style={{ background:"transparent" }} />
            </div>

            {/* === HERO CONTENT (logo + headline + frame) — fades out with instruments === */}
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-20"
              style={{ opacity: instrumentsOpacity, transition: "opacity 0.05s linear", pointerEvents: instrumentsOpacity < 0.1 ? "none" : "auto" }}
            >
              {/* Logo */}
              <img src={logoLight} alt="Toby Music"
                className="logo-entrance mb-4 h-[70px] object-contain drop-shadow-[0_6px_28px_rgba(0,0,0,.35)] dark:hidden md:h-[90px] lg:h-[100px]" />
              <img src={logoDark} alt="Toby Music"
                className="logo-entrance mb-4 hidden h-[70px] object-contain drop-shadow-[0_6px_28px_rgba(0,0,0,.35)] dark:block md:h-[90px] lg:h-[100px]" />

              {/* Headline */}
              <h1 className="text-[clamp(32px,4.5vw,64px)] font-black leading-tight text-foreground drop-shadow-[0_4px_20px_rgba(0,0,0,.35)]">
                {HERO_TEXT.subtitle}{" "}
                <a href="#scroll" className="hero-kaan relative inline-block">
                  {HERO_TEXT.linkWord}
                  <span className="sparkle-star" style={{top:"-10px",right:"-6px",width:8,height:8,animationDelay:"0s"}} />
                  <span className="sparkle-star" style={{top:"-4px",left:"-10px",width:6,height:6,animationDelay:".4s"}} />
                  <span className="sparkle-star" style={{bottom:"-8px",right:"4px",width:5,height:5,animationDelay:".8s"}} />
                  <span className="sparkle-star" style={{top:"2px",right:"-14px",width:7,height:7,animationDelay:"1.2s"}} />
                  <span className="sparkle-star" style={{bottom:"-6px",left:"-8px",width:4,height:4,animationDelay:".6s"}} />
                </a>
              </h1>

              {/* Neon frame */}
              <div className="neon-frame mt-5 w-full max-w-[560px] px-7 py-4 md:mt-6 md:px-9 md:py-5">
                <p className="text-[clamp(13px,1.3vw,19px)] leading-relaxed text-foreground/85">
                  {HERO_TEXT.supportLine}
                </p>
                <div className="mx-auto my-2 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
                <p className="text-[clamp(14px,1.4vw,20px)] font-bold text-foreground/90">
                  {HERO_TEXT.sloganPrefix}{" "}
                  <span className="bg-gradient-to-l from-accent via-primary to-accent bg-clip-text text-transparent">
                    {HERO_TEXT.sloganAccent}
                  </span>
                </p>
              </div>

              <div className="mt-4 text-primary/60 text-sm">&#x2193;</div>
            </div>

            {/* === SIDE CARDS — appear alongside curtains === */}
            {/* LEFT column */}
            <div
              className={`side-cards-col left${showCards ? " visible" : ""}`}
              style={{ opacity: cardsOpacity, transition: "opacity 0.3s ease" }}
            >
              {LEFT_CARDS.map((card, i) => (
                <a
                  key={card.key}
                  href={card.href}
                  className="side-card"
                  style={{ animationDelay: `${i * 70}ms`, animation: showCards ? `card-slide-in-left .45s ${i*70}ms cubic-bezier(.22,1,.36,1) both` : "none" }}
                  onMouseEnter={() => setHoveredCard(card.key)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={(e) => { e.preventDefault(); window.location.href = card.href; }}
                >
                  <img src={card.img} alt={card.title} className="side-card-img" />
                  <span className="side-card-title">{card.title}</span>
                </a>
              ))}
            </div>

            {/* RIGHT column */}
            <div
              className={`side-cards-col right${showCards ? " visible" : ""}`}
              style={{ opacity: cardsOpacity, transition: "opacity 0.3s ease" }}
            >
              {RIGHT_CARDS.map((card, i) => (
                <a
                  key={card.key}
                  href={card.href}
                  className="side-card"
                  style={{ animation: showCards ? `card-slide-in-right .45s ${i*80}ms cubic-bezier(.22,1,.36,1) both` : "none" }}
                  onMouseEnter={() => setHoveredCard(card.key)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={(e) => { e.preventDefault(); window.location.href = card.href; }}
                >
                  <img src={card.img} alt={card.title} className="side-card-img" />
                  <span className="side-card-title">{card.title}</span>
                </a>
              ))}
            </div>

            {/* === CENTER HOVER BUBBLE === */}
            {hoveredCardData && showCards && (
              <div className="center-bubble-wrap" key={hoveredCardData.key}>
                <img src={hoveredCardData.img} alt={hoveredCardData.title} className="center-char-img" />
                <div className="center-bubble">
                  <div className="bubble-title">{hoveredCardData.title}</div>
                  <div className="bubble-quote">{hoveredCardData.text}</div>
                  <Link to={hoveredCardData.href} className="bubble-btn">כניסה לדף &#x2190;</Link>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* =====================================================
            STAGE NAV — curtain call (after hero scroll)
        ===================================================== */}
        <StageNav />

        <Footer />
      </div>
    </>
  );
}
