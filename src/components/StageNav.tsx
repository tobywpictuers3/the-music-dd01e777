import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import imgPresenter from "@/assets/homepage/presenter/presenter.png";
import imgDrums     from "@/assets/homepage/characters/drums.png";
import imgPiano     from "@/assets/homepage/characters/piano.png";
import imgSaxophone from "@/assets/homepage/characters/saxophone.png";
import imgViolin    from "@/assets/homepage/characters/violin.png";
import imgGuitar    from "@/assets/homepage/characters/guitar.png";
import imgFlute     from "@/assets/homepage/characters/flute.png";

/* Each instrument = one "act" revealed by scroll */
const ACTS = [
  { key:"orchestras",   id:"stage-orchestras",   img:imgDrums,     href:"/orchestras",
    title:"תזמורות", text:"הרכבים מותאמים לכל אירוע — מהרכב קטן, עד הפקה מלאה עם תאורה והגברה.",
    stageLeft:"32%", stageW:"22%", spotlightX:"41%" },
  { key:"performances", id:"stage-performances", img:imgSaxophone, href:"/performances",
    title:"הופעות",  text:"מופע קיץ, ערב במה אינטימי, אירוע חגיגי — מוזיקה חיה עם התאמה לקהל.",
    stageLeft:"47%", stageW:"15%", spotlightX:"54%" },
  { key:"students",     id:"stage-students",     img:imgPiano,     href:"/students",
    title:"תלמידות", text:"26 שנות הוראה — מסלול שמחזיק תלמידה לאורך זמן, עם ליווי ורגישות.",
    stageLeft:"20%", stageW:"20%", spotlightX:"30%" },
  { key:"about",        id:"stage-about",        img:imgFlute,     href:"/about",
    title:"אודות",   text:"אומנות ואמינות - שני דברים שאני לא מוכנה לוותר עליהם. 35 שנות למידה.",
    stageLeft:"72%", stageW:"16%", spotlightX:"78%" },
  { key:"sheets",       id:"stage-sheets",       img:imgGuitar,    href:"/sheets",
    title:"תווים",   text:"ספריית תווים מסודרת — רפרטואר קלאסי ומגוון, נוח ומהיר לשימוש.",
    stageLeft:"60%", stageW:"15%", spotlightX:"67%" },
  { key:"blog",         id:"stage-blog",         img:imgViolin,    href:"/blog",
    title:"בלוג",    text:"הקשבה, דיוק ורגישות — מחשבות על הוראה, הופעות וחיים מוזיקליים.",
    stageLeft:"82%", stageW:"13%", spotlightX:"88%" },
  { key:"contact",      id:"stage-contact",      img:imgPresenter, href:"/contact",
    title:"צור קשר", text:"שיעורים, הופעה, סדנאות, הפקת תזמורת — מתחילים בפנייה קצרה.",
    stageLeft:"4%",  stageW:"14%", spotlightX:"11%" },
] as const;

type ActKey = typeof ACTS[number]["key"];
type ScrollCardsType = { key: string; stageId: string }[];

interface Props {
  scrollCards?: ScrollCardsType;
}

export default function StageNav({ scrollCards }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [hovered, setHovered] = useState<ActKey | null>(null);
  
  /* Reveal instruments one-by-one as user scrolls */
  useEffect(() => {
    const onScroll = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect  = el.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const count = Math.min(ACTS.length, Math.floor(scrolled / 160));
      setRevealedCount(count);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeAct = hovered ? ACTS.find(a => a.key === hovered) : null;

  return (
    <>
      <style>{`
        /* ══ OUTER — tall so scroll reveals each act ══ */
        .snav5-outer {
          position: relative;
          height: calc(100vh + ${ACTS.length * 160}px);
          z-index: 0;
        }

        /* ══ STICKY STAGE ══ */
        .snav5-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: visible;
          background: transparent !important;
        }
        /* snav5-bg removed -- stage bg handled by fixed layer in Index.tsx */
        .snav5-bg { display: none !important; }

        /* ── Spotlight beam per act ── */
        @keyframes spotlight-sweep {
          0%   { opacity:0; transform:scaleY(0) rotate(var(--rot)); transform-origin:top; }
          15%  { opacity:.55; transform:scaleY(1) rotate(var(--rot)); transform-origin:top; }
          100% { opacity:.30; transform:scaleY(1) rotate(var(--rot)); transform-origin:top; }
        }
        .act-spotlight {
          position: absolute;
          top: 0;
          width: 3px;
          height: 75%;
          transform-origin: top center;
          background: linear-gradient(180deg, rgba(201,169,97,.55) 0%, rgba(201,169,97,.10) 60%, transparent 100%);
          animation: spotlight-sweep .7s ease forwards;
          pointer-events: none;
          z-index: 8;
        }

        /* ── Instrument ── */
        @keyframes act-enter {
          0%  { opacity:0; transform:translateY(50%) scale(.72); }
          55% { transform:translateY(-4%) scale(1.06); }
          100%{ opacity:1; transform:translateY(0) scale(1); }
        }
        .snav5-act {
          position: absolute;
          bottom: 19%;
          z-index: 12;
          cursor: pointer;
          animation: act-enter .55s cubic-bezier(.22,1,.36,1) forwards;
          transition: filter .3s ease;
        }
        .snav5-act.active {
          filter: drop-shadow(0 0 28px rgba(255,215,80,.90))
                  drop-shadow(0 0 50px rgba(232,93,32,.60))
                  drop-shadow(0 14px 32px rgba(0,0,0,.45));
          z-index: 14;
        }
        .snav5-act:not(.active) {
          filter: drop-shadow(0 0 10px rgba(201,169,97,.40))
                  drop-shadow(0 8px 18px rgba(0,0,0,.30));
          opacity: .90;
        }
        .snav5-act img {
          width: 100%; display: block; background: transparent;
          transition: transform .3s ease;
        }
        .snav5-act.active img { transform: scale(1.08) translateY(-6px); }

        /* act label */
        .act-label {
          text-align: center; margin-top: 6px;
          font-size: clamp(14px,1.4vw,20px); font-weight:800;
          color: hsl(var(--primary));
          text-shadow: 0 2px 10px rgba(0,0,0,.6), 0 0 20px rgba(201,169,97,.4);
          opacity: .80;
          transition: opacity .2s;
          letter-spacing: .04em;
        }
        .snav5-act.active .act-label { opacity:1; }

        /* ── Presenter (left) ── */
        .snav5-presenter {
          position: absolute;
          bottom: 2%; left: 4%; width: 16%;
          z-index: 15; cursor: pointer;
          filter: drop-shadow(0 14px 32px rgba(0,0,0,.55));
          animation: presenter-float 3.5s ease-in-out infinite;
        }
        @keyframes presenter-float {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-10px); }
        }
        .snav5-presenter img { width:100%; display:block; background:transparent; }

        /* ── Neon bubble ── */
        @keyframes bubble-pop {
          from { opacity:0; transform:translateX(-50%) scale(.84) translateY(12px); }
          65%  { transform:translateX(-50%) scale(1.04) translateY(-3px); }
          to   { opacity:1; transform:translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes bubble-glow {
          0%,100%{ box-shadow:0 0 0 1px hsl(var(--primary)/.20),0 0 18px 4px hsl(var(--primary)/.18),0 12px 32px rgba(0,0,0,.30); }
          50%    { box-shadow:0 0 0 1px hsl(var(--primary)/.35),0 0 28px 8px hsl(var(--primary)/.28),0 12px 32px rgba(0,0,0,.30); }
        }
        .snav5-bubble {
          position: absolute;
          bottom: calc(100% + 10px); left: 50%;
          transform: translateX(-50%);
          width: clamp(170px,21vw,290px);
          background: hsl(var(--card)/.95);
          border: 2px solid hsl(var(--primary)/.85);
          border-radius: 18px;
          padding: 14px 18px 16px;
          text-align: center; direction: rtl;
          backdrop-filter: blur(12px);
          pointer-events: none; /* allow btn inside */
          animation:
            bubble-pop .36s cubic-bezier(.22,1,.36,1) forwards,
            bubble-glow 2.8s ease-in-out .36s infinite;
          z-index: 30;
        }
        .snav5-bubble::before {
          content:''; position:absolute; inset:4px;
          border-radius:14px; border:1px solid hsl(var(--primary)/.22); pointer-events:none;
        }
        .snav5-bubble::after {
          content:''; position:absolute;
          top:0; left:12%; right:12%; height:1px;
          background:linear-gradient(90deg,transparent,hsl(var(--primary)/.52),transparent);
        }
        .snav5-bubble-tail {
          position:absolute; top:100%; left:50%; transform:translateX(-50%);
          border:10px solid transparent;
          border-top-color:hsl(var(--primary)/.85);
        }
        .snav5-bubble-tail::after {
          content:''; position:absolute;
          top:-12px; left:-8px;
          border:8px solid transparent;
          border-top-color:hsl(var(--card));
        }
        .snav5-bubble-title { font-weight:800; font-size:clamp(1.05rem,1.25vw,1.35rem); color:hsl(var(--primary)); margin-bottom:6px; }
        .snav5-bubble-quote { font-size:clamp(.82rem,.95vw,1.02rem); color:hsl(var(--foreground)/.80); line-height:1.55; margin-bottom:12px; }
        .snav5-bubble-btn {
          display:inline-flex; align-items:center; gap:5px;
          background:hsl(var(--accent)); color:hsl(var(--accent-foreground));
          font-size:.74rem; font-weight:700; padding:6px 18px; border-radius:999px;
          text-decoration:none; pointer-events:auto;
          transition:opacity .2s,transform .2s;
        }
        .snav5-bubble-btn:hover{ opacity:.84; transform:scale(1.04); }
      `}</style>

      <div ref={outerRef} className="snav5-outer">
        <div className="snav5-sticky" dir="rtl">

          {/* Stage bg handled by Index.tsx fixed layer -- no bg here */}

          {/* Presenter — always left */}
   
          {/* Presenter arrives as last ACT (contact) via ACTS scroll reveal */}

          {/* Acts — revealed by scroll */}
          {ACTS.map((act, idx) => {
            const revealed = idx < revealedCount;
            const isActive = hovered === act.key;
            if (!revealed) return null;
            return (
              <div
                key={act.key}
                id={act.id}
                className={`snav5-act${isActive ? " active" : ""}`}
                style={{ left: act.stageLeft, width: act.stageW }}
                onMouseEnter={() => {
                  if (hoverTimer.current) clearTimeout(hoverTimer.current);
                  setHovered(act.key as ActKey);
                  hoverTimer.current = setTimeout(() => setHovered(null), 3000);
                }}
                onMouseLeave={() => { /* let timer handle it */ }}
              >
                {/* Spotlight */}
                <div className="act-spotlight" aria-hidden
                  style={{ left: act.spotlightX, "--rot": `${idx % 2 === 0 ? 2 : -2}deg` } as React.CSSProperties} />

                {/* Bubble */}
                {isActive && (
                  <div className="snav5-bubble">
                    <div className="snav5-bubble-title">{act.title}</div>
                    <div className="snav5-bubble-quote">{act.text}</div>
                    <Link to={act.href} className="snav5-bubble-btn" style={{pointerEvents:"auto"}}>
                      כניסה לדף ←
                    </Link>
                    <div className="snav5-bubble-tail" />
                  </div>
                )}

                <Link to={act.href} aria-label={`דף ${act.title}`}>
                  <img src={act.img} alt={act.title} />
                </Link>
                <div className="act-label">{act.title}</div>
              </div>
            );
          })}

        </div>
      </div>
    </>
  );
}
