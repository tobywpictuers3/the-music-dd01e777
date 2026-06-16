import { useState, useCallback } from "react";
import { Link } from "react-router-dom";

import stageEmptyDark  from "@/assets/homepage/stage/stage-empty-dark.png";
import stageEmptyLight from "@/assets/homepage/stage/stage-empty-light.png";
import imgPresenter from "@/assets/homepage/presenter/presenter.png";
import imgDrums     from "@/assets/homepage/characters/drums.png";
import imgPiano     from "@/assets/homepage/characters/piano.png";
import imgSaxophone from "@/assets/homepage/characters/saxophone.png";
import imgViolin    from "@/assets/homepage/characters/violin.png";
import imgGuitar    from "@/assets/homepage/characters/guitar.png";
import imgFlute     from "@/assets/homepage/characters/flute.png";

const CARDS = [
  { key:"presenter", img:imgPresenter, href:"/contact",      title:"צור קשר",   quote:"רוצה לשאול, להתייעץ או להזמין? כאן מתחילים שיחה פשוטה ונעימה." },
  { key:"piano",     img:imgPiano,     href:"/students",     title:"תלמידות",   quote:"לימוד, תרגול והתקדמות — בקשר אישי ונעים." },
  { key:"drums",     img:imgDrums,     href:"/orchestras",   title:"תזמורות",   quote:"הרכבים וסגנונות לכל אירוע — בלי להסתבך." },
  { key:"saxophone", img:imgSaxophone, href:"/performances", title:"הופעות",    quote:"יומן הופעות, חוויה מוסיקלית, הזמנה מסודרת." },
  { key:"guitar",    img:imgGuitar,    href:"/sheets",       title:"תווים",     quote:"ספריית תווים מסודרת — מהירה ונוחה לעין." },
  { key:"violin",    img:imgViolin,    href:"/blog",         title:"בלוג",      quote:"טיפים, מחשבות והשראה מוזיקלית שנעים לחזור אליה." },
  { key:"flute",     img:imgFlute,     href:"/about",        title:"אודות",     quote:"הסיפור, הדרך והאני מאמין של Toby Music." },
] as const;
type CardKey = typeof CARDS[number]["key"];

const INSTR_W: Record<string,string> = {
  piano:"22%", drums:"22%", saxophone:"15%",
  guitar:"16%", violin:"15%", flute:"12%", presenter:"14%"
};

export default function StageNav() {
  const [hovered, setHovered] = useState<CardKey|null>(null);
  const enter = useCallback((k:CardKey) => setHovered(k), []);
  const leave = useCallback(() => setHovered(null), []);

  const activeCard = hovered && hovered !== "presenter"
    ? CARDS.find(c => c.key === hovered) : null;

  return (
    <>
      <style>{`
        /* ══ OUTER — creates scroll space so footer comes after ══ */
        .snav-outer {
          position: relative;
          /* stage height = 100vh, we want footer below it */
          height: 100vh;
          z-index: 0;
        }

        /* ══ STICKY STAGE ══ */
        .snav-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }
        .snav-bg {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center bottom;
        }

        /* ── TOP SPOTLIGHT BAR — cards ── */
        .snav-topbar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 28%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 10px;
          gap: clamp(5px, 0.9vw, 12px);
          z-index: 20;
          padding-top: 72px; /* below fixed header */
          background: linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 75%, transparent 100%);
        }

        /* Nav Card */
        .snav-card {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 7px 9px 9px;
          border-radius: 13px;
          border: 1.5px solid hsl(var(--primary)/0.42);
          background: hsl(var(--background)/0.60);
          backdrop-filter: blur(10px);
          cursor: pointer; text-decoration: none;
          min-width: clamp(62px, 7.5vw, 100px);
          transition: border-color .22s, background .22s, transform .22s, box-shadow .22s;
          direction: rtl;
        }
        .snav-card:hover, .snav-card.active {
          border-color: hsl(var(--primary));
          background: hsl(var(--card)/0.92);
          transform: translateY(-3px);
          box-shadow: 0 0 0 1px hsl(var(--primary)/0.32), 0 0 16px 3px hsl(var(--primary)/0.18), 0 8px 22px rgba(0,0,0,0.28);
        }
        .snav-card-img {
          width: clamp(26px,2.8vw,44px); height: clamp(30px,3.4vw,52px);
          object-fit: contain; background: transparent;
          transition: transform .26s ease;
          /* glow so icon is visible on any bg */
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.45));
        }
        .snav-card:hover .snav-card-img, .snav-card.active .snav-card-img {
          transform: translateY(-5px) scale(1.10);
          filter: drop-shadow(0 4px 10px hsl(var(--primary)/0.5)) drop-shadow(0 2px 6px rgba(0,0,0,0.45));
        }
        .snav-card-title {
          font-size: clamp(.62rem,.76vw,.80rem); font-weight:700;
          color: hsl(var(--foreground)/.82); transition: color .2s; white-space:nowrap;
        }
        .snav-card:hover .snav-card-title, .snav-card.active .snav-card-title {
          color: hsl(var(--primary));
        }

        /* ── FLOOR ── */
        .snav-floor {
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 72%;
          z-index: 10;
        }

        /* ── PRESENTER — below stage rim, left ── */
        .snav-presenter {
          position: absolute;
          bottom: -2%;     /* slightly below the stage rim */
          left: 4%;
          width: 16%;
          z-index: 15;
          cursor: pointer;
          filter: drop-shadow(0 14px 32px rgba(0,0,0,0.55));
          animation: presenter-float 3.5s ease-in-out infinite;
        }
        @keyframes presenter-float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-10px); }
        }
        .snav-presenter img { width:100%; display:block; background:transparent; }

        /* Presenter hover bubble */
        .snav-presenter-bubble {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          width: clamp(160px,18vw,250px);
          background: hsl(var(--card)/0.96);
          border: 2px solid hsl(var(--primary)/.82);
          border-radius: 16px;
          padding: 12px 16px 14px;
          text-align: center; direction: rtl;
          backdrop-filter: blur(12px);
          pointer-events: none;
          z-index: 40;
          box-shadow: 0 0 18px 4px hsl(var(--primary)/.18), 0 10px 28px rgba(0,0,0,.28);
          animation: bubble-pop .32s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes bubble-pop {
          from { opacity:0; transform:translateX(-50%) scale(.84) translateY(10px); }
          to   { opacity:1; transform:translateX(-50%) scale(1)   translateY(0);    }
        }
        .snav-presenter-bubble::after {
          content:''; position:absolute;
          top:100%; left:50%; transform:translateX(-50%);
          border:8px solid transparent;
          border-top-color: hsl(var(--primary)/.82);
        }
        .snav-presenter-bubble::before {
          content:''; position:absolute;
          top:100%; left:50%; transform:translateX(-50%) translateY(-2px);
          border:8px solid transparent;
          border-top-color: hsl(var(--card));
          z-index:1;
        }
        .snav-bubble-title { font-weight:800; font-size:clamp(.88rem,1vw,1.08rem); color:hsl(var(--primary)); margin-bottom:5px; }
        .snav-bubble-quote { font-size:clamp(.70rem,.82vw,.86rem); color:hsl(var(--foreground)/.76); line-height:1.52; margin-bottom:10px; }
        .snav-bubble-btn {
          display:inline-flex; align-items:center; gap:4px;
          background:hsl(var(--accent)); color:hsl(var(--accent-foreground));
          font-size:.74rem; font-weight:700; padding:5px 16px; border-radius:999px;
          text-decoration:none; pointer-events:auto;
          transition:opacity .2s,transform .2s;
        }
        .snav-bubble-btn:hover { opacity:.84; transform:scale(1.04); }

        /* ── ACTIVE INSTRUMENT centre stage ── */
        @keyframes instr-enter {
          0%  { opacity:0; transform:translateX(-50%) translateY(35%) scale(.72); }
          55% { transform:translateX(-50%) translateY(-4%) scale(1.05); }
          100%{ opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
        }
        .snav-instrument {
          position:absolute;
          bottom:18%; left:50%;
          transform:translateX(-50%);
          z-index:16;
          animation:instr-enter .45s cubic-bezier(.22,1,.36,1) forwards;
          filter:drop-shadow(0 0 24px hsl(var(--primary)/.55)) drop-shadow(0 14px 32px rgba(0,0,0,.45));
        }
        .snav-instrument img { display:block; background:transparent; }

        /* Instrument neon bubble */
        @keyframes instr-bubble-in {
          from { opacity:0; transform:translateX(-50%) scale(.82) translateY(14px); }
          65%  { transform:translateX(-50%) scale(1.04) translateY(-3px); }
          to   { opacity:1; transform:translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes bubble-glow {
          0%,100%{ box-shadow:0 0 0 1px hsl(var(--primary)/.20),0 0 18px 4px hsl(var(--primary)/.18),0 12px 32px rgba(0,0,0,.30); }
          50%    { box-shadow:0 0 0 1px hsl(var(--primary)/.35),0 0 26px 8px hsl(var(--primary)/.28),0 12px 32px rgba(0,0,0,.30); }
        }
        .snav-bubble {
          position:absolute;
          bottom:calc(100% + 8px); left:50%;
          transform:translateX(-50%);
          width:clamp(170px,21vw,290px);
          background:hsl(var(--card)/.95);
          border:2px solid hsl(var(--primary)/.85);
          border-radius:18px;
          padding:14px 18px 16px;
          text-align:center; direction:rtl;
          backdrop-filter:blur(12px);
          pointer-events:none;
          animation:instr-bubble-in .36s cubic-bezier(.22,1,.36,1) forwards, bubble-glow 2.8s ease-in-out .36s infinite;
          z-index:30;
        }
        .snav-bubble::before {
          content:''; position:absolute; inset:4px;
          border-radius:14px; border:1px solid hsl(var(--primary)/.22); pointer-events:none;
        }
        .snav-bubble::after {
          content:''; position:absolute;
          top:0; left:12%; right:12%; height:1px;
          background:linear-gradient(90deg,transparent,hsl(var(--primary)/.52),transparent);
        }
        .snav-bubble-tail {
          position:absolute; top:100%; left:50%; transform:translateX(-50%);
          width:0; height:0;
          border-left:10px solid transparent; border-right:10px solid transparent;
          border-top:10px solid hsl(var(--primary)/.85);
        }
        .snav-bubble-tail::after {
          content:''; position:absolute;
          top:-12px; left:-8px;
          width:0; height:0;
          border-left:8px solid transparent; border-right:8px solid transparent;
          border-top:8px solid hsl(var(--card));
        }
      `}</style>

      <div className="snav-outer">
        <div className="snav-sticky" dir="rtl">

          {/* Stage backgrounds */}
          <img src={stageEmptyLight} alt="" aria-hidden className="snav-bg block dark:hidden" />
          <img src={stageEmptyDark}  alt="" aria-hidden className="snav-bg hidden dark:block" />

          {/* ── TOP BAR — cards ── */}
          <div className="snav-topbar">
            {CARDS.map(card => (
              <Link
                key={card.key}
                to={card.href}
                className={`snav-card${hovered===card.key?" active":""}`}
                onMouseEnter={() => enter(card.key)}
                onMouseLeave={leave}
              >
                <img src={card.img} alt={card.title} className="snav-card-img" />
                <span className="snav-card-title">{card.title}</span>
              </Link>
            ))}
          </div>

          {/* ── FLOOR ── */}
          <div className="snav-floor">

            {/* Presenter — always left, below stage rim */}
            <div
              className="snav-presenter"
              onMouseEnter={() => enter("presenter")}
              onMouseLeave={leave}
            >
              {hovered==="presenter" && (
                <div className="snav-presenter-bubble">
                  <div className="snav-bubble-title">צור קשר</div>
                  <div className="snav-bubble-quote">
                    רוצה לשאול, להתייעץ או להזמין? כאן מתחילים שיחה פשוטה ונעימה.
                  </div>
                  <Link to="/contact" className="snav-bubble-btn">כניסה לדף ←</Link>
                </div>
              )}
              <Link to="/contact" aria-label="צור קשר">
                <img src={imgPresenter} alt="מגיש" />
              </Link>
            </div>

            {/* Active instrument + bubble — centre stage */}
            {activeCard && (
              <div key={activeCard.key} className="snav-instrument"
                   style={{ width: INSTR_W[activeCard.key] }}>
                <div className="snav-bubble">
                  <div className="snav-bubble-title">{activeCard.title}</div>
                  <div className="snav-bubble-quote">{activeCard.quote}</div>
                  <Link to={activeCard.href} className="snav-bubble-btn" style={{pointerEvents:"auto"}}>
                    כניסה לדף ←
                  </Link>
                  <div className="snav-bubble-tail" />
                </div>
                <Link to={activeCard.href} aria-label={`דף ${activeCard.title}`}>
                  <img src={activeCard.img} alt={activeCard.title} />
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
