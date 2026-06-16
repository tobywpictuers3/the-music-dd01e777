import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import stageEmptyDark  from "@/assets/homepage/stage/stage-empty-dark.png";
import stageEmptyLight from "@/assets/homepage/stage/stage-empty-light.png";
import imgDrums     from "@/assets/homepage/characters/drums.png";
import imgPiano     from "@/assets/homepage/characters/piano.png";
import imgSaxophone from "@/assets/homepage/characters/saxophone.png";
import imgViolin    from "@/assets/homepage/characters/violin.png";
import imgGuitar    from "@/assets/homepage/characters/guitar.png";
import imgFlute     from "@/assets/homepage/characters/flute.png";
import imgPresenter from "@/assets/homepage/presenter/presenter.png";

const CARDS = [
  { key:"presenter", img:imgPresenter, href:"/contact",      title:"צור קשר",   quote:"רוצה לשאול, להתייעץ או להזמין? כאן מתחילים שיחה פשוטה.",  stageLeft:"9%",  stageW:"9%",  delay:0   },
  { key:"piano",     img:imgPiano,     href:"/students",     title:"תלמידות",   quote:"לימוד, תרגול והתקדמות — בקשר אישי ונעים.",                stageLeft:"19%", stageW:"19%", delay:100 },
  { key:"drums",     img:imgDrums,     href:"/orchestras",   title:"תזמורות",   quote:"הרכבים וסגנונות לכל אירוע — בלי להסתבך.",                 stageLeft:"32%", stageW:"20%", delay:200 },
  { key:"saxophone", img:imgSaxophone, href:"/performances", title:"הופעות",    quote:"יומן הופעות, חוויה מוסיקלית, הזמנה מסודרת.",              stageLeft:"47%", stageW:"13%", delay:300 },
  { key:"guitar",    img:imgGuitar,    href:"/sheets",       title:"תווים",     quote:"ספריית תווים מסודרת — מהירה ונוחה לעין.",                  stageLeft:"60%", stageW:"14%", delay:400 },
  { key:"violin",    img:imgViolin,    href:"/blog",         title:"בלוג",      quote:"טיפים, מחשבות והשראה מוזיקלית שנעים לחזור אליה.",         stageLeft:"73%", stageW:"13%", delay:500 },
  { key:"flute",     img:imgFlute,     href:"/about",        title:"אודות",     quote:"הסיפור, הדרך והאני מאמין של Toby Music.",                  stageLeft:"87%", stageW:"9%",  delay:600 },
];

export default function StageNav() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const [entered,    setEntered]    = useState(false);
  const [activeKey,  setActiveKey]  = useState<string | null>(null);
  const [scrollStep, setScrollStep] = useState(0); // 0..6 — how many instruments revealed

  /* ── Intersection: trigger entrance when section visible ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setEntered(true); },
      { threshold: 0.10 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Scroll inside section → reveal instruments one by one ── */
  useEffect(() => {
    if (!entered) return;
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect   = section.getBoundingClientRect();
      const total  = section.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      // Each instrument reveals after scrolling ~120px
      const step = Math.min(CARDS.length - 1, Math.floor(scrolled / 120));
      setScrollStep(step);
      // Set active based on which card is most centered
      const cardIdx = Math.min(CARDS.length - 1, Math.round(scrolled / 120));
      setActiveKey(CARDS[cardIdx].key);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [entered]);

  const handleCardHover = useCallback((key: string) => {
    setActiveKey(key);
  }, []);

  return (
    <>
      <style>{`
        /* ─── STAGE WRAPPER ─── */
        .snav-outer {
          position: relative;
          /* tall enough for scroll-reveal: 7 instruments × 120px + viewport */
          height: calc(100vh + ${CARDS.length * 120}px);
        }

        /* ─── STICKY STAGE ─── */
        .snav-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }
        .snav-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center bottom;
        }

        /* ─── INSTRUMENTS ON STAGE ─── */
        .snav-instrument {
          position: absolute;
          bottom: 20%;          /* floor of stage */
          transform: translateY(110%) scale(0.85);
          opacity: 0;
          transition:
            transform 0.65s cubic-bezier(0.22,1,0.36,1),
            opacity   0.50s ease,
            filter    0.3s ease;
          cursor: pointer;
          z-index: 10;
        }
        .snav-instrument.visible {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        .snav-instrument.active .snav-img {
          filter: drop-shadow(0 0 18px rgba(201,169,97,0.85))
                  drop-shadow(0 8px 24px rgba(0,0,0,0.4));
          transform: scale(1.10) translateY(-8px);
        }
        .snav-instrument:not(.active) .snav-img {
          filter: drop-shadow(0 8px 18px rgba(0,0,0,0.3));
          opacity: 0.72;
        }
        .snav-img {
          width: 100%;
          display: block;
          transition: transform 0.35s ease, filter 0.35s ease, opacity 0.35s ease;
          /* PNG transparency — no background */
          background: transparent;
        }

        /* ─── SPEECH BUBBLE ─── */
        @keyframes bubble-pop {
          0%   { opacity:0; transform: translateX(-50%) translateY(14px) scale(0.88); }
          60%  { transform: translateX(-50%) translateY(-3px) scale(1.03); }
          100% { opacity:1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        .snav-bubble {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          width: max(160px, 130%);
          max-width: 240px;
          background: hsl(var(--card) / 0.96);
          border: 1.5px solid hsl(var(--primary) / 0.7);
          border-radius: 16px;
          padding: 12px 16px 14px;
          text-align: center;
          direction: rtl;
          backdrop-filter: blur(10px);
          box-shadow:
            0 0 0 1px hsl(var(--primary) / 0.15),
            0 12px 32px rgba(0,0,0,0.28);
          animation: bubble-pop 0.32s cubic-bezier(0.22,1,0.36,1) forwards;
          z-index: 40;
          pointer-events: none;
        }
        /* Tail pointing down toward instrument */
        .snav-bubble::after {
          content: '';
          position: absolute;
          top: 100%; left: 50%;
          transform: translateX(-50%);
          border: 8px solid transparent;
          border-top-color: hsl(var(--primary) / 0.7);
        }
        .snav-bubble::before {
          content: '';
          position: absolute;
          top: 100%; left: 50%;
          transform: translateX(-50%) translateY(-2px);
          border: 8px solid transparent;
          border-top-color: hsl(var(--card));
          z-index: 1;
        }
        .snav-bubble-title {
          font-weight: 800;
          font-size: 1rem;
          color: hsl(var(--primary));
          margin-bottom: 5px;
        }
        .snav-bubble-quote {
          font-size: 0.76rem;
          color: hsl(var(--foreground) / 0.78);
          line-height: 1.5;
          margin-bottom: 10px;
        }
        .snav-bubble-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
          font-size: 0.74rem;
          font-weight: 700;
          padding: 5px 16px;
          border-radius: 999px;
          text-decoration: none;
          pointer-events: auto;
          transition: opacity 0.2s, transform 0.2s;
        }
        .snav-bubble-btn:hover { opacity: 0.85; transform: scale(1.04); }

        /* ─── LABEL BELOW INSTRUMENT ─── */
        .snav-label {
          text-align: center;
          font-size: clamp(9px, 0.85vw, 13px);
          font-weight: 700;
          color: hsl(var(--primary));
          margin-top: 4px;
          text-shadow: 0 1px 6px rgba(0,0,0,0.5);
          transition: opacity 0.3s;
        }
        .snav-instrument:not(.active) .snav-label {
          opacity: 0.55;
        }

        /* ─── BOTTOM CARDS BAR (always visible at bottom of sticky viewport) ─── */
        .snav-cards-bar {
          position: absolute;
          bottom: 0;
          left: 0; right: 0;
          height: auto;
          background: linear-gradient(
            to top,
            hsl(var(--background) / 0.97) 0%,
            hsl(var(--background) / 0.90) 70%,
            transparent 100%
          );
          padding: 16px 24px 20px;
          z-index: 20;
        }
        .snav-cards-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          justify-content: center;
          flex-wrap: wrap;
        }
        .snav-cards-row::-webkit-scrollbar { display: none; }

        .snav-card {
          flex: 0 0 auto;
          min-width: 100px;
          max-width: 130px;
          border-radius: 14px;
          border: 1.5px solid hsl(var(--border) / 0.6);
          background: hsl(var(--card) / 0.88);
          backdrop-filter: blur(8px);
          padding: 10px 10px 8px;
          text-align: center;
          direction: rtl;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .snav-card:hover,
        .snav-card.active {
          border-color: hsl(var(--primary));
          background: hsl(var(--card));
          transform: translateY(-3px);
          box-shadow:
            0 0 0 1px hsl(var(--primary) / 0.3),
            0 8px 24px rgba(0,0,0,0.18);
        }
        .snav-card-img {
          width: 48px;
          height: 56px;
          object-fit: contain;
          display: block;
          margin: 0 auto 6px;
          /* PNG transparency — no background */
          background: transparent;
        }
        .snav-card-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          transition: color 0.2s;
        }
        .snav-card:hover .snav-card-title,
        .snav-card.active .snav-card-title {
          color: hsl(var(--primary));
        }
      `}</style>

      <div ref={sectionRef} className="snav-outer" dir="rtl">
        <div className="snav-sticky">

          {/* ── EMPTY STAGE BACKGROUNDS ── */}
          <img src={stageEmptyLight} alt="" aria-hidden="true"
               className="snav-bg block dark:hidden" />
          <img src={stageEmptyDark}  alt="" aria-hidden="true"
               className="snav-bg hidden dark:block" />

          {/* ── INSTRUMENTS ── */}
          {CARDS.map((card, idx) => {
            const isVisible = entered && idx <= scrollStep;
            const isActive  = activeKey === card.key;
            return (
              <div
                key={card.key}
                className={`snav-instrument${isVisible ? " visible" : ""}${isActive ? " active" : ""}`}
                style={{
                  left: card.stageLeft,
                  width: card.stageW,
                  transitionDelay: isVisible ? `${card.delay}ms` : "0ms",
                }}
                onMouseEnter={() => setActiveKey(card.key)}
                onMouseLeave={() => setActiveKey(null)}
              >
                {/* Speech bubble — shown on active */}
                {isActive && (
                  <div className="snav-bubble">
                    <div className="snav-bubble-title">{card.title}</div>
                    <div className="snav-bubble-quote">{card.quote}</div>
                    <Link to={card.href} className="snav-bubble-btn">
                      כניסה לדף ←
                    </Link>
                  </div>
                )}

                {/* Instrument image — clickable */}
                <Link to={card.href} aria-label={`מעבר לדף ${card.title}`}>
                  <img src={card.img} alt={card.title} className="snav-img" />
                </Link>

                <div className="snav-label">{card.title}</div>
              </div>
            );
          })}

          {/* ── BOTTOM CARDS BAR ── */}
          <div className="snav-cards-bar">
            <div className="snav-cards-row">
              {CARDS.map((card) => (
                <Link
                  key={card.key}
                  to={card.href}
                  className={`snav-card${activeKey === card.key ? " active" : ""}`}
                  onMouseEnter={() => setActiveKey(card.key)}
                  onMouseLeave={() => setActiveKey(null)}
                >
                  <img src={card.img} alt={card.title} className="snav-card-img" />
                  <div className="snav-card-title">{card.title}</div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
