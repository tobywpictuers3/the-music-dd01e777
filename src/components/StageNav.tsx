import { useRef, useState, useCallback } from "react";
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

/* ── 7 navigable pages ─────────────────────────────────────── */
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

/* Instrument sizes on stage — proportional to stage */
const INSTR_SIZE: Record<string, string> = {
  presenter: "11%",
  piano:     "22%",
  drums:     "22%",
  saxophone: "15%",
  guitar:    "16%",
  violin:    "15%",
  flute:     "11%",
};

export default function StageNav() {
  const [hovered, setHovered] = useState<CardKey | null>(null);

  const enter = useCallback((k: CardKey) => setHovered(k), []);
  const leave = useCallback(() => setHovered(null), []);

  /* Active card (not presenter — it's always shown) */
  const activeCard = hovered && hovered !== "presenter"
    ? CARDS.find(c => c.key === hovered)
    : null;

  return (
    <>
      <style>{`
        /* ══ STAGE WRAPPER — 100vh sticky ══ */
        .snav-wrap {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          z-index: 1;
        }

        /* ── Stage backgrounds ── */
        .snav-bg {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center bottom;
        }

        /* ══ TOP BAR — cards in spotlight area ══ */
        .snav-topbar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 30%;          /* spotlight / upper stage area */
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 12px;
          gap: clamp(6px, 1vw, 14px);
          z-index: 20;
          /* subtle dark gradient so cards are readable */
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.55) 0%,
            rgba(0,0,0,0.20) 70%,
            transparent 100%
          );
        }

        /* ── Nav Card ── */
        .snav-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 10px 10px;
          border-radius: 14px;
          border: 1.5px solid hsl(var(--primary) / 0.45);
          background: hsl(var(--background) / 0.62);
          backdrop-filter: blur(10px);
          cursor: pointer;
          text-decoration: none;
          min-width: clamp(70px, 8vw, 110px);
          transition:
            border-color 0.22s ease,
            background   0.22s ease,
            transform    0.22s ease,
            box-shadow   0.22s ease;
          direction: rtl;
        }
        .snav-card:hover,
        .snav-card.active {
          border-color: hsl(var(--primary));
          background: hsl(var(--card) / 0.90);
          transform: translateY(-4px);
          box-shadow:
            0 0 0 1px hsl(var(--primary) / 0.35),
            0 0 18px 3px hsl(var(--primary) / 0.20),
            0 8px 24px rgba(0,0,0,0.30);
        }
        .snav-card-img {
          width: clamp(28px, 3.2vw, 48px);
          height: clamp(34px, 3.8vw, 56px);
          object-fit: contain;
          background: transparent;
          transition: transform 0.28s ease;
        }
        .snav-card:hover .snav-card-img,
        .snav-card.active .snav-card-img {
          transform: translateY(-6px) scale(1.12);
        }
        .snav-card-title {
          font-size: clamp(0.65rem, 0.8vw, 0.82rem);
          font-weight: 700;
          color: hsl(var(--foreground) / 0.85);
          transition: color 0.2s;
          white-space: nowrap;
        }
        .snav-card:hover .snav-card-title,
        .snav-card.active .snav-card-title {
          color: hsl(var(--primary));
        }

        /* ══ STAGE FLOOR — lower 70% ══ */
        .snav-floor {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 70%;
          z-index: 10;
        }

        /* ── Presenter — fixed left, always visible ── */
        .snav-presenter {
          position: absolute;
          bottom: 22%;
          left: 5%;
          width: 11%;
          z-index: 15;
          filter: drop-shadow(0 12px 28px rgba(0,0,0,0.5));
          /* subtle floating animation */
          animation: presenter-float 3.5s ease-in-out infinite;
        }
        @keyframes presenter-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        .snav-presenter img {
          width: 100%;
          display: block;
          background: transparent;
        }

        /* ── Active Instrument — center stage ── */
        @keyframes instr-enter {
          0%   { opacity:0; transform: translateY(40%) scale(0.7); }
          60%  { transform: translateY(-5%) scale(1.04); }
          100% { opacity:1; transform: translateY(0) scale(1); }
        }
        .snav-instrument {
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 16;
          animation: instr-enter 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
          filter: drop-shadow(0 0 22px hsl(var(--primary) / 0.55))
                  drop-shadow(0 14px 32px rgba(0,0,0,0.45));
        }
        .snav-instrument img {
          display: block;
          background: transparent;
        }

        /* ── Speech Bubble ── */
        @keyframes bubble-pop {
          0%   { opacity:0; transform: translateX(-50%) scale(0.82) translateY(12px); }
          65%  { transform: translateX(-50%) scale(1.04) translateY(-3px); }
          100% { opacity:1; transform: translateX(-50%) scale(1) translateY(0); }
        }
        .snav-bubble {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          width: clamp(180px, 22vw, 300px);
          background: hsl(var(--card) / 0.95);
          /* neon border matching brand frame */
          border: 2px solid hsl(var(--primary) / 0.85);
          border-radius: 18px;
          padding: 14px 18px 16px;
          text-align: center;
          direction: rtl;
          backdrop-filter: blur(12px);
          animation: bubble-pop 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
          z-index: 30;
          pointer-events: none;
          /* neon glow */
          box-shadow:
            0 0 0 1px hsl(var(--primary) / 0.20),
            0 0 16px 4px hsl(var(--primary) / 0.18),
            0 0 36px 8px rgba(180,60,20,0.12),
            0 12px 32px rgba(0,0,0,0.30);
        }
        /* pulse glow on bubble */
        @keyframes bubble-glow {
          0%,100% { box-shadow: 0 0 0 1px hsl(var(--primary)/0.20), 0 0 16px 4px hsl(var(--primary)/0.18), 0 0 36px 8px rgba(180,60,20,0.12), 0 12px 32px rgba(0,0,0,0.30); }
          50%     { box-shadow: 0 0 0 1px hsl(var(--primary)/0.35), 0 0 24px 8px hsl(var(--primary)/0.28), 0 0 48px 12px rgba(180,60,20,0.20), 0 12px 32px rgba(0,0,0,0.30); }
        }
        .snav-bubble { animation: bubble-pop 0.35s cubic-bezier(0.22,1,0.36,1) forwards, bubble-glow 2.8s ease-in-out 0.35s infinite; }

        /* inner border accent */
        .snav-bubble::before {
          content: '';
          position: absolute;
          inset: 4px;
          border-radius: 14px;
          border: 1px solid hsl(var(--primary) / 0.25);
          pointer-events: none;
        }
        /* top shimmer */
        .snav-bubble::after {
          content: '';
          position: absolute;
          top: 0; left: 12%; right: 12%; height: 1px;
          background: linear-gradient(90deg, transparent, hsl(var(--primary) / 0.55), transparent);
        }
        /* tail */
        .snav-bubble-tail {
          position: absolute;
          top: 100%; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid hsl(var(--primary) / 0.85);
        }
        .snav-bubble-tail::after {
          content: '';
          position: absolute;
          top: -12px; left: -8px;
          width: 0; height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid hsl(var(--card));
        }
        .snav-bubble-title {
          font-weight: 800;
          font-size: clamp(0.9rem, 1.1vw, 1.15rem);
          color: hsl(var(--primary));
          margin-bottom: 6px;
        }
        .snav-bubble-quote {
          font-size: clamp(0.72rem, 0.85vw, 0.88rem);
          color: hsl(var(--foreground) / 0.78);
          line-height: 1.55;
          margin-bottom: 12px;
        }
        .snav-bubble-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
          font-size: 0.76rem;
          font-weight: 700;
          padding: 6px 18px;
          border-radius: 999px;
          text-decoration: none;
          pointer-events: auto;
          transition: opacity 0.2s, transform 0.2s;
        }
        .snav-bubble-btn:hover { opacity: 0.85; transform: scale(1.05); }

        /* ── Scroll hint at bottom ── */
        .snav-scroll-hint {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.7rem;
          color: hsl(var(--foreground) / 0.4);
          z-index: 25;
          letter-spacing: 0.05em;
          pointer-events: none;
        }
      `}</style>

      <div className="snav-wrap" dir="rtl">

        {/* ── Stage backgrounds ── */}
        <img src={stageEmptyLight} alt="" aria-hidden="true"
             className="snav-bg block dark:hidden" />
        <img src={stageEmptyDark}  alt="" aria-hidden="true"
             className="snav-bg hidden dark:block" />

        {/* ══ TOP BAR — 7 nav cards in spotlight area ══ */}
        <div className="snav-topbar">
          {CARDS.map((card) => (
            <Link
              key={card.key}
              to={card.href}
              className={`snav-card${hovered === card.key ? " active" : ""}`}
              onMouseEnter={() => enter(card.key)}
              onMouseLeave={leave}
            >
              <img src={card.img} alt={card.title} className="snav-card-img" />
              <span className="snav-card-title">{card.title}</span>
            </Link>
          ))}
        </div>

        {/* ══ STAGE FLOOR ══ */}
        <div className="snav-floor">

          {/* ── Presenter — always visible, left side ── */}
          <div className="snav-presenter">
            <img src={imgPresenter} alt="מגיש" />
          </div>

          {/* ── Active Instrument + Bubble — center stage ── */}
          {activeCard && (
            <div
              key={activeCard.key}
              className="snav-instrument"
              style={{ width: INSTR_SIZE[activeCard.key] }}
            >
              {/* Speech bubble above */}
              <div className="snav-bubble">
                <div className="snav-bubble-title">{activeCard.title}</div>
                <div className="snav-bubble-quote">{activeCard.quote}</div>
                <Link to={activeCard.href} className="snav-bubble-btn">
                  כניסה לדף ←
                </Link>
                <div className="snav-bubble-tail" />
              </div>

              <Link to={activeCard.href} aria-label={`מעבר לדף ${activeCard.title}`}>
                <img src={activeCard.img} alt={activeCard.title} />
              </Link>
            </div>
          )}

        </div>

        {/* Scroll hint */}
        <div className="snav-scroll-hint">גלול להמשך ↓</div>

      </div>
    </>
  );
}
