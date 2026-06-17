import { useEffect, useState } from "react";
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

const LEFT_CARDS = [
  { key:"orchestras",   img:imgDrums,     href:"/orchestras",   stageId:"stage-orchestras",
    title:"תזמורות", text:"הרכבים מותאמים לכל אירוע -- מהרכב קטן עד הפקה מלאה." },
  { key:"performances", img:imgSaxophone, href:"/performances", stageId:"stage-performances",
    title:"הופעות",  text:"מוזיקה חיה עם התאמה לקהל ולאופי האירוע." },
  { key:"students",     img:imgPiano,     href:"/students",     stageId:"stage-students",
    title:"תלמידות", text:"26 שנות הוראה -- מסלול עם ליווי, דרישה ורגישות." },
  { key:"sheets",       img:imgGuitar,    href:"/sheets",       stageId:"stage-sheets",
    title:"תווים",   text:"ספריית תווים מסודרת -- מהירה ונוחה לשימוש." },
] as const;

const RIGHT_CARDS = [
  { key:"about",   img:imgFlute,     href:"/about",   stageId:"stage-about",
    title:"אודות",    text:"אומנות ואמינות -- שני דברים שאני לא מוכנה לוותר עליהם." },
  { key:"blog",    img:imgViolin,    href:"/blog",    stageId:"stage-blog",
    title:"בלוג",     text:"מחשבות על הוראה, הופעות וחיים מוזיקליים." },
  { key:"contact", img:imgPresenter, href:"/contact", stageId:"stage-contact",
    title:"צור קשר",  text:"שיעורים, הופעה, סדנאות, תזמורת -- מתחילים בפנייה קצרה." },
] as const;

const ALL_CARDS = [...LEFT_CARDS, ...RIGHT_CARDS];

export default function Index() {
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string|null>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  // Phase thresholds (in px)
  const CARDS_START  = vh * 0.15;   // cards + crossfade begin
  const CARDS_FULL   = vh * 0.70;   // cards fully visible + stage empty
  const SCROLL_END   = vh * 1.20;   // hero section ends, StageNav takes over

  const crossfade    = Math.max(0, Math.min(1, (scrollY - CARDS_START) / (CARDS_FULL - CARDS_START)));
  const instrumentsOp = 1 - crossfade;
  const emptyStageOp  = crossfade;
  const showCards     = scrollY > CARDS_START;
  const cardProgress  = Math.max(0, Math.min(1, (scrollY - CARDS_START) / (CARDS_FULL - CARDS_START)));
  const showMarquee   = crossfade > 0.3;

  // Presenter moves forward when cards show:
  // Fixed in viewport coords so zoom doesn't affect it
  // Base: 4% from left, 28% from bottom of viewport
  // When cards appear: moves to center-left (between cols) -- right of left column
  const presenterLeft   = showCards ? "17vw" : "4vw";
  const presenterBottom = "28vh";    // viewport units -- zoom-invariant
  const presenterWidth  = "12vw";   // viewport units

  const hovCard = ALL_CARDS.find(c => c.key === hoveredCard) ?? null;

  const scrollToStage = (stageId: string) => {
    const el = document.getElementById(stageId);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"center" });
  };

  return (
    <>
      <style>{`
        @keyframes presenter-float {
          0%,100%{ transform:translateY(0); }
          50%    { transform:translateY(-10px); }
        }
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
          transition:filter .3s ease; cursor:pointer;
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
          75%{ transform:scale(.97) translateY(-2px); }
          100%{ opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
        }
        .logo-entrance{ animation:logo-entrance 1.1s cubic-bezier(.16,1,.3,1) forwards; }

        /* SIDE CARDS */
        .side-cards-col{
          position:fixed;
          top:0; bottom:0; width:20vw;
          display:flex; flex-direction:column; justify-content:center;
          gap:16px; z-index:25; padding:80px 8px 60px; pointer-events:none;
        }
        .side-cards-col.left { left:0; }
        .side-cards-col.right{ right:0; }
        .side-cards-col.active{ pointer-events:auto; }
        @keyframes slide-from-left{
          from{ opacity:0; transform:translateX(-52px) scale(.85); }
          to  { opacity:1; transform:translateX(0) scale(1); }
        }
        @keyframes slide-from-right{
          from{ opacity:0; transform:translateX(52px) scale(.85); }
          to  { opacity:1; transform:translateX(0) scale(1); }
        }
        .side-card{
          display:flex; flex-direction:column; align-items:center; gap:8px;
          padding:14px 12px 16px;
          border-radius:18px;
          border:1.5px solid hsl(var(--primary)/.42);
          background:hsl(var(--background)/.65);
          backdrop-filter:blur(12px);
          text-decoration:none; direction:rtl; cursor:pointer;
          transition:border-color .22s, transform .22s, box-shadow .22s, background .22s;
          width:100%;
        }
        .side-card:hover{
          border-color:hsl(var(--primary));
          background:hsl(var(--card)/.92);
          transform:scale(1.04) translateY(-2px);
          box-shadow:0 0 0 1px hsl(var(--primary)/.30),0 0 22px 6px hsl(var(--primary)/.25),0 8px 24px rgba(0,0,0,.28);
        }
        .side-card-img{
          width:clamp(64px,7vw,110px);
          height:clamp(76px,8.5vw,130px);
          object-fit:contain; background:transparent;
          filter:drop-shadow(0 0 14px rgba(201,169,97,.75)) drop-shadow(0 0 28px rgba(232,93,32,.40)) drop-shadow(0 6px 14px rgba(0,0,0,.50));
          transition:filter .28s ease, transform .28s ease;
        }
        .side-card:hover .side-card-img{
          filter:drop-shadow(0 0 22px rgba(201,169,97,1.0)) drop-shadow(0 0 44px rgba(232,93,32,.65)) drop-shadow(0 8px 18px rgba(0,0,0,.55));
          transform:translateY(-7px) scale(1.12);
        }
        .side-card-title{
          font-size:clamp(.72rem,.9vw,.98rem); font-weight:800;
          color:hsl(var(--primary)); white-space:nowrap;
        }

        /* CENTER hover char */
        .center-bubble-wrap{
          position:fixed;
          bottom:30vh; left:50%;
          transform:translateX(-50%);
          z-index:30; pointer-events:none;
          display:flex; flex-direction:column; align-items:center;
        }
        @keyframes char-pop{
          from{ opacity:0; transform:translateY(36px) scale(.70); }
          65% { transform:translateY(-6px) scale(1.07); }
          to  { opacity:1; transform:translateY(0) scale(1); }
        }
        .center-char-img{
          width:clamp(80px,10vw,140px); display:block; background:transparent; margin:0 auto 6px;
          animation:char-pop .48s cubic-bezier(.22,1,.36,1) forwards;
          filter:drop-shadow(0 0 24px rgba(201,169,97,.95)) drop-shadow(0 0 48px rgba(232,93,32,.55)) drop-shadow(0 10px 24px rgba(0,0,0,.55));
        }
        @keyframes bubble-pop{
          from{ opacity:0; transform:translateX(-50%) scale(.84) translateY(14px); }
          65% { transform:translateX(-50%) scale(1.04) translateY(-3px); }
          to  { opacity:1; transform:translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes bubble-glow{
          0%,100%{ box-shadow:0 0 0 1px hsl(var(--primary)/.20),0 0 18px 4px hsl(var(--primary)/.18),0 12px 32px rgba(0,0,0,.30); }
          50%    { box-shadow:0 0 0 1px hsl(var(--primary)/.35),0 0 28px 8px hsl(var(--primary)/.28),0 12px 32px rgba(0,0,0,.30); }
        }
        .center-bubble{
          background:hsl(var(--card)/.95); border:2px solid hsl(var(--primary)/.85);
          border-radius:18px; padding:14px 20px 16px;
          text-align:center; direction:rtl; backdrop-filter:blur(12px);
          min-width:clamp(180px,22vw,300px);
          animation:bubble-pop .36s cubic-bezier(.22,1,.36,1) forwards, bubble-glow 2.8s ease-in-out .36s infinite;
          position:relative; transform:translateX(-50%);
        }
        .center-bubble::before{ content:''; position:absolute; inset:5px; border-radius:14px; border:1px solid hsl(var(--primary)/.22); pointer-events:none; }
        .center-bubble::after{ content:''; position:absolute; bottom:100%; left:50%; transform:translateX(-50%); border:9px solid transparent; border-bottom-color:hsl(var(--primary)/.85); }
        .bubble-title{ font-weight:800; font-size:clamp(.92rem,1.1vw,1.15rem); color:hsl(var(--primary)); margin-bottom:5px; }
        .bubble-quote{ font-size:clamp(.70rem,.82vw,.88rem); color:hsl(var(--foreground)/.76); line-height:1.52; margin-bottom:10px; }
        .bubble-btn{
          display:inline-flex; align-items:center; gap:5px;
          background:hsl(var(--accent)); color:hsl(var(--accent-foreground));
          font-size:.74rem; font-weight:700; padding:6px 18px; border-radius:999px;
          text-decoration:none; pointer-events:auto; transition:opacity .2s,transform .2s;
        }
        .bubble-btn:hover{ opacity:.84; transform:scale(1.04); }

        /* MARQUEE -- fire gradient, 50% opacity */
        @keyframes toby-marquee{ 0%{ transform:translateX(0); } 100%{ transform:translateX(-50%); } }
        .toby-marquee-track{ animation:toby-marquee 26s linear infinite; width:max-content; }
      `}</style>

      <div className="bg-background text-foreground">
        <Header />

        {/* ================================================================
            FIXED STAGE BACKGROUND -- always covers viewport, never scrolls
        ================================================================ */}
        <div className="fixed inset-0 z-0">
          {/* Layer 1: instruments */}
          <div style={{ opacity:instrumentsOp, position:"absolute", inset:0 }}>
            <img src={stageBgLight} alt="" className="block dark:hidden"
              style={{ width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center" }} />
            <img src={stageBgDark}  alt="" className="hidden dark:block"
              style={{ width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center" }} />
          </div>
          {/* Layer 2: empty stage */}
          <div style={{ opacity:emptyStageOp, position:"absolute", inset:0 }}>
            <img src={stageEmptyLight} alt="" className="block dark:hidden"
              style={{ width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center" }} />
            <img src={stageEmptyDark}  alt="" className="hidden dark:block"
              style={{ width:"100vw", height:"100vh", objectFit:"cover", objectPosition:"center" }} />
          </div>
        </div>

        {/* ================================================================
            PRESENTER -- fixed in viewport units, zoom-invariant
        ================================================================ */}
        <div className="fixed z-20" style={{
          left: presenterLeft,
          bottom: presenterBottom,
          width: presenterWidth,
          transition: "left 0.6s cubic-bezier(.22,1,.36,1)",
          filter:"drop-shadow(0 14px 32px rgba(0,0,0,.55))",
          animation:"presenter-float 3.5s ease-in-out infinite",
        }}>
          <img src={imgPresenterHero} alt="" className="w-full block" style={{background:"transparent"}} />
        </div>

        {/* ================================================================
            SCROLL SPACER -- hero section (200vh)
        ================================================================ */}
        <div id={HOME_HERO_ID} style={{ height:"200vh", position:"relative", zIndex:5 }}>

          {/* Hero text -- fades out with instruments */}
          <div className="fixed inset-0 z-10 flex flex-col items-center justify-start pt-20"
            style={{ opacity:instrumentsOp, pointerEvents:instrumentsOp < 0.1 ? "none" : "auto" }}>
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

          {/* SIDE CARDS -- fixed to viewport */}
          <div className={`side-cards-col left${showCards ? " active" : ""}`}
            style={{ opacity:cardProgress, transition:"opacity .4s ease" }}>
            {LEFT_CARDS.map((card, i) => (
              <a key={card.key} className="side-card" href={card.href}
                style={{ animation:showCards ? `slide-from-left .55s ${i*130}ms cubic-bezier(.22,1,.36,1) both` : "none" }}
                onMouseEnter={() => setHoveredCard(card.key)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={(e) => { e.preventDefault(); scrollToStage(card.stageId); }}>
                <img src={card.img} alt={card.title} className="side-card-img" />
                <span className="side-card-title">{card.title}</span>
              </a>
            ))}
          </div>

          <div className={`side-cards-col right${showCards ? " active" : ""}`}
            style={{ opacity:cardProgress, transition:"opacity .4s ease" }}>
            {RIGHT_CARDS.map((card, i) => (
              <a key={card.key} className="side-card" href={card.href}
                style={{ animation:showCards ? `slide-from-right .55s ${i*160}ms cubic-bezier(.22,1,.36,1) both` : "none" }}
                onMouseEnter={() => setHoveredCard(card.key)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={(e) => { e.preventDefault(); scrollToStage(card.stageId); }}>
                <img src={card.img} alt={card.title} className="side-card-img" />
                <span className="side-card-title">{card.title}</span>
              </a>
            ))}
          </div>

          {/* CENTER hover char + bubble */}
          {hovCard && showCards && (
            <div className="center-bubble-wrap" key={hovCard.key}>
              <img src={hovCard.img} alt={hovCard.title} className="center-char-img" />
              <div className="center-bubble">
                <div className="bubble-title">{hovCard.title}</div>
                <div className="bubble-quote">{hovCard.text}</div>
                <Link to={hovCard.href} className="bubble-btn" style={{pointerEvents:"auto"}}>
                  כניסה לדף
                </Link>
              </div>
            </div>
          )}

          {/* MARQUEE -- fire gradient, 50% opacity, appears when empty stage visible */}
          {showMarquee && (
            <div className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden py-3"
              style={{
                background:"linear-gradient(135deg,rgba(139,26,43,.50),rgba(201,32,42,.50),rgba(232,93,32,.50),rgba(201,169,97,.50))",
                backdropFilter:"blur(6px)",
              }}>
              <div className="toby-marquee-track flex items-center gap-8 whitespace-nowrap pr-8 text-white">
                {[...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((item,i) => (
                  <span key={`${item}-${i}`} className="text-sm font-bold tracking-[.20em] sm:text-base">
                    {item}<span className="mx-5 opacity-60">*</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================================================================
            STAGE NAV -- curtain call (scroll reveals instruments)
        ================================================================ */}
        <div style={{ position:"relative", zIndex:10 }}>
          <StageNav />
        </div>

        {/* Bottom marquee (permanent, fire gradient) */}
        <div className="relative overflow-hidden py-4 text-white z-10"
          style={{ background:"linear-gradient(135deg,#8B1A2B,#C9202A,#E85D20,#C9A961)" }}>
          <div className="toby-marquee-track flex items-center gap-8 whitespace-nowrap pr-8">
            {[...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((item,i) => (
              <span key={`${item}-${i}`} className="text-sm font-bold tracking-[.20em] sm:text-base">
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
