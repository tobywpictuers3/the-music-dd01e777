import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StageNav from "@/components/StageNav";

import { HERO_TEXT, HOME_HERO_ID, MARQUEE_ITEMS } from "@/config/homepage";

import stageBgLight    from "@/assets/homepage/stage/lightstage.png";
import stageBgDark     from "@/assets/homepage/stage/darkstage.png";
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

/* 3 left + 3 right (no contact card -- presenter handles that on hover) */
const LEFT_CARDS = [
  { key:"orchestras",   img:imgDrums,     href:"/orchestras",   stageId:"stage-orchestras",
    title:"תזמורות", text:"הרכבים מותאמים לכל אירוע -- מהרכב קטן עד הפקה מלאה עם תאורה והגברה." },
  { key:"performances", img:imgSaxophone, href:"/performances", stageId:"stage-performances",
    title:"הופעות",  text:"מוזיקה חיה עם התאמה לקהל ולאופי האירוע." },
  { key:"students",     img:imgPiano,     href:"/students",     stageId:"stage-students",
    title:"תלמידות", text:"26 שנות הוראה -- מסלול שמחזיק תלמידה לאורך זמן, עם ליווי ורגישות." },
] as const;

const RIGHT_CARDS = [
  { key:"about",   img:imgFlute,  href:"/about",   stageId:"stage-about",
    title:"אודות",    text:"אומנות ואמינות -- שני דברים שאני לא מוכנה לוותר עליהם. 35 שנות למידה." },
  { key:"blog",    img:imgViolin, href:"/blog",    stageId:"stage-blog",
    title:"בלוג",     text:"מחשבות על הוראה, הופעות וחיים מוזיקליים -- השראה שנעים לחזור אליה." },
  { key:"sheets",  img:imgGuitar, href:"/sheets",  stageId:"stage-sheets",
    title:"תווים",    text:"ספריית תווים מסודרת -- רפרטואר קלאסי ומגוון, נוח ומהיר לשימוש." },
] as const;

/* Presenter "card" data for hover */
const PRESENTER_CARD = {
  key:"contact", img:imgPresenter, href:"/contact", stageId:"stage-contact",
  title:"צור קשר", text:"שיעורים, הופעה, סדנאות, תזמורת -- מתחילים בפנייה קצרה."
};

const ALL_CARDS = [...LEFT_CARDS, ...RIGHT_CARDS];

export default function Index() {
  const [scrollY, setScrollY]     = useState(0);
  const [hoveredCard, setHovered] = useState<string|null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [fadeClass, setFadeClass]         = useState<""|"fast-fade"|"slow-fade">("");
  const bubbleTimer   = useRef<ReturnType<typeof setTimeout>|null>(null);
  const fadeTimer     = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const CARDS_START   = vh * 0.15;  // cards + crossfade begin
  const CARDS_FULL    = vh * 0.60;  // cards fully visible, stage empty
  const CARDS_FADEOUT = vh * 0.80;  // cards start fading
  const CARDS_GONE    = vh * 1.10;  // cards fully gone, instruments start

  const crossfade    = Math.max(0, Math.min(1, (scrollY - CARDS_START) / (CARDS_FULL - CARDS_START)));
  // Cards opacity: fade in 0.15→0.60, stay full 0.60→0.80, fade out 0.80→1.10
  const cardsFadeIn  = Math.max(0, Math.min(1, (scrollY - CARDS_START) / (CARDS_FULL - CARDS_START)));
  const cardsFadeOut = Math.max(0, Math.min(1, (scrollY - CARDS_FADEOUT) / (CARDS_GONE - CARDS_FADEOUT)));
  const cardsOpacity = cardsFadeIn * (1 - cardsFadeOut);
  const showCards    = scrollY > CARDS_START && cardsOpacity > 0.01;
  const showMarquee  = crossfade > 0.25;
  // Presenter fades out with cards
  const presenterOpacity = Math.max(0, 1 - cardsFadeOut);

  /* Hover handlers with 3s+2s fadeout */
  const handleEnter = (key: string) => {
    /* Clear any pending timers */
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    if (fadeTimer.current)   clearTimeout(fadeTimer.current);
    setHovered(key);
    setBubbleVisible(true);
    setFadeClass("");
    /* After 5s: start slow 2s fadeout */
    bubbleTimer.current = setTimeout(() => {
      setFadeClass("slow-fade");
      fadeTimer.current = setTimeout(() => {
        setBubbleVisible(false);
        setHovered(null);
        setFadeClass("");
      }, 2000);
    }, 5000);
  };
  const handleLeave = () => {
    /* On mouse leave: fast 0.5s fadeout (overrides 5s timer) */
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    if (fadeTimer.current)   clearTimeout(fadeTimer.current);
    setFadeClass("fast-fade");
    fadeTimer.current = setTimeout(() => {
      setBubbleVisible(false);
      setHovered(null);
      setFadeClass("");
    }, 500);
  };
  const handlePresenterEnter = () => handleEnter("contact");

  const scrollToStage = (stageId: string) => {
    const el = document.getElementById(stageId);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"center" });
  };

  const activeCard = hoveredCard === "contact"
    ? PRESENTER_CARD
    : ALL_CARDS.find(c => c.key === hoveredCard) ?? null;

  /* Presenter X position: at stage bottom during hero, between cols during cards */
  const presLeft   = showCards ? "22vw" : "3vw";
  /* Feet at stage rim -- stage rim is at ~67% from top, so bottom = 33vh */
  const presBottom = "2vh";   /* very bottom */
  const presWidth  = "10vw";

  return (
    <>
      <style>{`
        @keyframes sparkle-float {
          0%,100%{ opacity:0; transform:scale(0) rotate(0deg); }
          20%    { opacity:1; transform:scale(1) rotate(30deg); }
          80%    { opacity:1; transform:scale(.8) rotate(-20deg); }
        }
        .sparkle-star {
          position:absolute; border-radius:9999px; pointer-events:none;
          background:hsl(var(--primary));
          box-shadow:0 0 6px 2px hsl(var(--primary)/.6);
          animation:sparkle-float 1.6s ease-in-out infinite;
        }
        .hero-kaan {
          background:linear-gradient(135deg,#C9A961 0%,#E85D20 35%,#C9202A 65%,#8B1A2B 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          filter:drop-shadow(0 0 8px rgba(232,93,32,.35));
          transition:filter .3s; cursor:pointer;
          text-decoration:underline; text-decoration-color:rgba(201,169,97,.35); text-underline-offset:8px;
        }
        .hero-kaan:hover{ filter:drop-shadow(0 0 20px rgba(232,93,32,.80)) drop-shadow(0 0 36px rgba(201,41,42,.60)); }
        .hero-kaan .sparkle-star{ animation-play-state:paused; opacity:0; }
        .hero-kaan:hover .sparkle-star{ animation-play-state:running; }
        @keyframes frame-pulse{
          0%,100%{ box-shadow:0 0 8px 1px rgba(218,130,40,.35),0 0 24px 4px rgba(180,60,20,.18); }
          50%    { box-shadow:0 0 14px 3px rgba(218,130,40,.55),0 0 36px 8px rgba(180,60,20,.28); }
        }
        @keyframes frame-pulse-light{
          0%,100%{ box-shadow:0 0 0 1px rgba(107,31,42,.18),0 4px 24px rgba(107,31,42,.12); }
          50%    { box-shadow:0 0 0 1px rgba(107,31,42,.28),0 6px 32px rgba(107,31,42,.20); }
        }
        .neon-frame{
          border:2px solid rgba(218,130,40,.9); border-radius:22px;
          background:rgba(5,2,3,.72); backdrop-filter:blur(6px);
          animation:frame-pulse 3s ease-in-out infinite; position:relative; overflow:hidden;
        }
        :root:not(.dark) .neon-frame{
          border:1.5px solid rgba(107,31,42,.55); background:rgba(245,241,234,.82);
          animation:frame-pulse-light 3s ease-in-out infinite;
        }
        .neon-frame::before{ content:''; position:absolute; inset:0; border-radius:20px; border:1px solid rgba(238,185,80,.35); pointer-events:none; }
        :root:not(.dark) .neon-frame::before{ border:1px solid rgba(201,169,97,.30); }
        .neon-frame::after{ content:''; position:absolute; top:0; left:10%; right:10%; height:1px; background:linear-gradient(90deg,transparent,rgba(218,130,40,.6),transparent); pointer-events:none; }
        @keyframes logo-entrance{
          0%{ opacity:0; transform:scale(.6) translateY(-28px); filter:blur(6px); }
          55%{ opacity:1; transform:scale(1.07) translateY(4px); filter:blur(0); }
          100%{ opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
        }
        .logo-entrance{ animation:logo-entrance 1.1s cubic-bezier(.16,1,.3,1) forwards; }

        /* SIDE CARDS -- bigger, bolder text */
        .side-cards-col{
          position:fixed; top:0; bottom:0; width:22vw;
          display:flex; flex-direction:column; justify-content:center;
          gap:18px; z-index:25; padding:88px 10px 60px; pointer-events:none;
        }
        .side-cards-col.left { left:0; }
        .side-cards-col.right{ right:0; }
        .side-cards-col.active{ pointer-events:auto; }
        @keyframes slide-from-left{
          from{ opacity:0; transform:translateX(-55px) scale(.88); }
          to  { opacity:1; transform:translateX(0) scale(1); }
        }
        @keyframes slide-from-right{
          from{ opacity:0; transform:translateX(55px) scale(.88); }
          to  { opacity:1; transform:translateX(0) scale(1); }
        }
        .side-card{
          display:flex; flex-direction:column; align-items:center; gap:10px;
          padding:16px 14px 18px;
          border-radius:18px;
          border:1.5px solid hsl(var(--primary)/.42);
          background:hsl(var(--background)/.65);
          backdrop-filter:blur(12px);
          text-decoration:none; direction:rtl; cursor:pointer; width:100%;
          transition:border-color .22s, transform .22s, box-shadow .22s, background .22s;
        }
        .side-card:hover{
          border-color:hsl(var(--primary)); background:hsl(var(--card)/.92);
          transform:scale(1.04) translateY(-2px);
          box-shadow:0 0 0 1px hsl(var(--primary)/.30),0 0 22px 6px hsl(var(--primary)/.25),0 8px 24px rgba(0,0,0,.28);
        }
        .side-card-img{
          width:clamp(72px,8vw,120px); height:clamp(86px,9.5vw,144px);
          object-fit:contain; background:transparent;
          filter:drop-shadow(0 0 16px rgba(201,169,97,.80)) drop-shadow(0 0 32px rgba(232,93,32,.45)) drop-shadow(0 6px 14px rgba(0,0,0,.50));
          transition:filter .28s ease, transform .28s ease;
        }
        .side-card:hover .side-card-img{
          filter:drop-shadow(0 0 24px rgba(201,169,97,1.0)) drop-shadow(0 0 48px rgba(232,93,32,.70)) drop-shadow(0 8px 18px rgba(0,0,0,.55));
          transform:translateY(-8px) scale(1.12);
        }
        .side-card-title{
          font-size:clamp(1rem,1.2vw,1.4rem); font-weight:800;
          color:hsl(var(--primary)); white-space:nowrap;
        }

        @keyframes slow-fadeout{ 0%{ opacity:1; } 100%{ opacity:0; } }
        @keyframes fast-fadeout{ 0%{ opacity:1; } 100%{ opacity:0; } }
        .slow-fade{ animation:slow-fadeout 2s ease forwards; }
        .fast-fade{ animation:fast-fadeout 0.5s ease forwards; }
        @keyframes bubble-pop{
          from{ opacity:0; transform:translateX(-50%) scale(.84) translateY(14px); }
          65% { transform:translateX(-50%) scale(1.04) translateY(-3px); }
          to  { opacity:1; transform:translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes bubble-glow{
          0%,100%{ box-shadow:0 0 0 1px hsl(var(--primary)/.20),0 0 18px 4px hsl(var(--primary)/.18); }
          50%    { box-shadow:0 0 0 1px hsl(var(--primary)/.35),0 0 28px 8px hsl(var(--primary)/.28); }
        }
        /* Bubble only -- appears on card hover, high center, tail DOWN toward cards */
        .card-hover-bubble-wrap {
          position:fixed; top:16vh;
          left:0; right:0;          /* full width */
          display:flex; justify-content:center; align-items:flex-start;
          z-index:35; pointer-events:none;
        }
        .card-bubble {
          background:hsl(var(--card)/.95); border:2px solid hsl(var(--primary)/.85);
          border-radius:18px; padding:22px 30px 24px;
          text-align:center; direction:rtl; backdrop-filter:blur(12px);
          min-width:clamp(320px,38vw,520px); max-width:clamp(320px,38vw,520px);
          animation:bubble-pop .32s cubic-bezier(.22,1,.36,1) forwards, bubble-glow 2.8s ease-in-out .32s infinite;
          position:relative; pointer-events:auto;
        }
        /* tail DOWN toward the card */
        .card-bubble::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:10px solid transparent; border-top-color:hsl(var(--primary)/.85); }
        .card-bubble::before { content:''; position:absolute; inset:5px; border-radius:14px; border:1px solid hsl(var(--primary)/.22); pointer-events:none; }
        /* Large char -- feet at very bottom of stage */
        .center-char-stage {
          position:fixed; bottom:4vh;
          left:0; right:0;
          display:flex; justify-content:center; align-items:flex-end;
          z-index:32; pointer-events:none;
        }
        @keyframes char-pop{
          from{ opacity:0; transform:translateY(50px) scale(.65); }
          60% { transform:translateY(-8px) scale(1.07); }
          to  { opacity:1; transform:translateY(0) scale(1); }
        }
        .center-char-img{
          height:clamp(380px,55vh,700px); width:auto; display:block; background:transparent;
          animation:char-pop .55s cubic-bezier(.22,1,.36,1) forwards;
          filter:drop-shadow(0 0 32px rgba(201,169,97,.95)) drop-shadow(0 0 64px rgba(232,93,32,.65)) drop-shadow(0 14px 32px rgba(0,0,0,.60));
        }
        .bubble-title{ font-weight:800; font-size:clamp(1.4rem,1.8vw,2rem); color:hsl(var(--primary)); margin-bottom:8px; }
        .bubble-quote{ font-size:clamp(1rem,1.2vw,1.3rem); color:hsl(var(--foreground)/.82); line-height:1.58; margin-bottom:16px; }
        .bubble-btn{
          display:inline-flex; align-items:center; gap:5px;
          background:hsl(var(--accent)); color:hsl(var(--accent-foreground));
          font-size:.82rem; font-weight:700; padding:8px 22px; border-radius:999px;
          text-decoration:none; pointer-events:auto; transition:opacity .2s,transform .2s; cursor:pointer;
        }
        .bubble-btn:hover{ opacity:.84; transform:scale(1.04); }

        /* MARQUEE */
        @keyframes toby-marquee{ 0%{ transform:translateX(0); } 100%{ transform:translateX(-50%); } }
        .toby-marquee-track{ animation:toby-marquee 26s linear infinite; width:max-content; }
      `}</style>

      <div className="bg-background text-foreground">
        <Header />

        {/* FIXED STAGE -- never scrolls */}
        <div className="fixed inset-0 z-0" style={{ pointerEvents:"none" }}>
          <div style={{ opacity:1-crossfade, position:"absolute", inset:0, transition:"opacity 0.05s linear" }}>
            <img src={stageBgLight} alt="" className="block dark:hidden"
              style={{ width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center" }} />
            <img src={stageBgDark}  alt="" className="hidden dark:block"
              style={{ width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center" }} />
          </div>
          <div style={{ opacity:crossfade, position:"absolute", inset:0, transition:"opacity 0.05s linear" }}>
            <img src={stageEmptyLight} alt="" className="block dark:hidden"
              style={{ width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center" }} />
            <img src={stageEmptyDark}  alt="" className="hidden dark:block"
              style={{ width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center" }} />
          </div>
        </div>

        {/* PRESENTER -- fixed, feet at stage rim, NO float animation */}
        <div
          className="fixed z-20"
          style={{
            left: presLeft,
            bottom: presBottom,
            width: presWidth,
            opacity: presenterOpacity,
            transition: "left 0.7s cubic-bezier(.22,1,.36,1), opacity 0.15s ease",
            filter:"drop-shadow(0 14px 32px rgba(0,0,0,.55))",
            cursor: presenterOpacity > 0.05 ? "pointer" : "none",
            pointerEvents: presenterOpacity > 0.05 ? "auto" : "none",
          }}
          onMouseEnter={handlePresenterEnter}
          onMouseLeave={handleLeave}
        >
          <img src={imgPresenterHero} alt="" className="w-full block" style={{background:"transparent"}} />
        </div>

        {/* SCROLL SPACER */}
        <div id={HOME_HERO_ID} style={{ height:"115vh", position:"relative", zIndex:5 }}>

          {/* Hero text */}
          <div className="fixed inset-0 z-10 flex flex-col items-center justify-start pt-20"
            style={{ opacity:Math.max(0,1-crossfade*3), pointerEvents:crossfade > 0.33 ? "none" : "auto" }}>
            <img src={logoLight} alt="Toby Music"
              className="logo-entrance mb-4 h-[70px] object-contain drop-shadow-[0_6px_28px_rgba(0,0,0,.35)] dark:hidden md:h-[90px] lg:h-[100px]" />
            <img src={logoDark} alt="Toby Music"
              className="logo-entrance mb-4 hidden h-[70px] object-contain drop-shadow-[0_6px_28px_rgba(0,0,0,.35)] dark:block md:h-[90px] lg:h-[100px]" />
            <h1 className="text-[clamp(32px,4.5vw,64px)] font-black leading-tight text-foreground drop-shadow-[0_4px_20px_rgba(0,0,0,.35)]">
              {HERO_TEXT.subtitle}{" "}
              <a href="#" className="hero-kaan relative inline-block">
                {HERO_TEXT.linkWord}
                <span className="sparkle-star" style={{top:"-10px",right:"-6px",width:8,height:8,animationDelay:"0s"}} />
                <span className="sparkle-star" style={{top:"-4px",left:"-10px",width:6,height:6,animationDelay:".4s"}} />
                <span className="sparkle-star" style={{bottom:"-8px",right:"4px",width:5,height:5,animationDelay:".8s"}} />
                <span className="sparkle-star" style={{top:"2px",right:"-14px",width:7,height:7,animationDelay:"1.2s"}} />
                <span className="sparkle-star" style={{bottom:"-6px",left:"-8px",width:4,height:4,animationDelay:".6s"}} />
              </a>
            </h1>
            <div className="neon-frame mt-5 w-full max-w-[560px] px-7 py-4 md:mt-6 md:px-9 md:py-5">
              <p className="text-[clamp(13px,1.3vw,19px)] leading-relaxed text-foreground/85">{HERO_TEXT.supportLine}</p>
              <div className="mx-auto my-2 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
              <p className="text-[clamp(14px,1.4vw,20px)] font-bold text-foreground/90">
                {HERO_TEXT.sloganPrefix}{" "}
                <span className="bg-gradient-to-l from-accent via-primary to-accent bg-clip-text text-transparent">{HERO_TEXT.sloganAccent}</span>
              </p>
            </div>
          </div>

          {/* LEFT CARDS */}
          <div className={`side-cards-col left${showCards ? " active" : ""}`}
            style={{ opacity:cardsOpacity, transition:"opacity .15s ease" }}>
            {LEFT_CARDS.map((card, i) => (
              <a key={card.key} className="side-card" href={card.href}
                style={{ animation:showCards ? `slide-from-left .55s ${i*140}ms cubic-bezier(.22,1,.36,1) both` : "none" }}
                onMouseEnter={() => handleEnter(card.key)}
                onMouseLeave={handleLeave}
                onClick={(e) => { e.preventDefault(); scrollToStage(card.stageId); }}>
                <img src={card.img} alt={card.title} className="side-card-img" />
                <span className="side-card-title">{card.title}</span>
              </a>
            ))}
          </div>

          {/* RIGHT CARDS */}
          <div className={`side-cards-col right${showCards ? " active" : ""}`}
            style={{ opacity:cardsOpacity, transition:"opacity .15s ease" }}>
            {RIGHT_CARDS.map((card, i) => (
              <a key={card.key} className="side-card" href={card.href}
                style={{ animation:showCards ? `slide-from-right .55s ${i*160}ms cubic-bezier(.22,1,.36,1) both` : "none" }}
                onMouseEnter={() => handleEnter(card.key)}
                onMouseLeave={handleLeave}
                onClick={(e) => { e.preventDefault(); scrollToStage(card.stageId); }}>
                <img src={card.img} alt={card.title} className="side-card-img" />
                <span className="side-card-title">{card.title}</span>
              </a>
            ))}
          </div>

          
          {/* Card hover: BUBBLE ONLY */}
          {hoveredCard && showCards && activeCard && (
            <div className={`card-hover-bubble-wrap ${fadeClass}`} key={`b-${hoveredCard}`}>
              <div className="card-bubble">
                <div className="bubble-title">{activeCard.title}</div>
                <div className="bubble-quote">{activeCard.text}</div>
                <Link to={activeCard.href} className="bubble-btn" style={{pointerEvents:"auto"}}>כניסה לדף</Link>
              </div>
            </div>
          )}
          {/* Large char at floor -- only when bubble is visible */}
          {activeCard && showCards && bubbleVisible && (
            <div className="center-char-stage" key={`c-${activeCard.key}`}>
              <img src={activeCard.img} alt={activeCard.title} className="center-char-img" />
            </div>
          )}
          {activeCard && showCards && cardsOpacity > 0.3 && (
            <div className={`center-bubble-wrap ${fadeClass}`}
              key={activeCard.key}>
              <img src={activeCard.img} alt={activeCard.title} className="center-char-img" />
              <div className="center-bubble">
                <div className="bubble-title">{activeCard.title}</div>
                <div className="bubble-quote">{activeCard.text}</div>
                <Link to={activeCard.href} className="bubble-btn" style={{pointerEvents:"auto"}}>
                  כניסה לדף
                </Link>
              </div>
            </div>
          )}

          {/* MARQUEE fixed bottom, 50% opacity fire */}
          {showMarquee && (
            <div className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden py-3"
              style={{
                background:"linear-gradient(135deg,rgba(139,26,43,.50),rgba(201,32,42,.50),rgba(232,93,32,.50),rgba(201,169,97,.50))",
                backdropFilter:"blur(6px)",
              }}>
              <div className="toby-marquee-track flex items-center gap-8 whitespace-nowrap pr-8 text-white">
                {[...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((item,i) => (
                  <span key={`m${i}`} className="text-sm font-bold tracking-[.20em] sm:text-base">
                    {item}<span className="mx-5 opacity-60">*</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* STAGE NAV -- z-index above fixed bg, below header */}
        <div style={{ position:"relative", zIndex:10 }}>
          <StageNav />
        </div>

        {/* Bottom marquee */}
        <div className="relative overflow-hidden py-4 text-white z-10"
          style={{ background:"linear-gradient(135deg,#8B1A2B,#C9202A,#E85D20,#C9A961)" }}>
          <div className="toby-marquee-track flex items-center gap-8 whitespace-nowrap pr-8">
            {[...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((item,i) => (
              <span key={`b${i}`} className="text-sm font-bold tracking-[.20em] sm:text-base">
                {item}<span className="mx-5 opacity-60">*</span>
              </span>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
