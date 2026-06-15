import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import stageEmptyDark  from "@/assets/homepage/stage/stage-empty-dark.png";
import stageEmptyLight from "@/assets/homepage/stage/stage-empty-light.png";
import drums     from "@/assets/homepage/characters/drums.png";
import piano     from "@/assets/homepage/characters/piano.png";
import saxophone from "@/assets/homepage/characters/saxophone.png";
import violin    from "@/assets/homepage/characters/violin.png";
import guitar    from "@/assets/homepage/characters/guitar.png";
import flute     from "@/assets/homepage/characters/flute.png";
import presenter from "@/assets/homepage/presenter/presenter.png";

/* ── 7 instruments × 7 pages ────────────────────────────────────────── */
const INSTRUMENTS = [
  {
    key: "presenter",
    img: presenter,
    href: "/contact",
    title: "צור קשר",
    quote: "רוצה לשאול, להתייעץ או להזמין? כאן מתחילים.",
    /* stage position — bottom of stage image ≈ 68% from top */
    left: "10%", width: "9%", delay: 0,
  },
  {
    key: "piano",
    img: piano,
    href: "/students",
    title: "תלמידות",
    quote: "לימוד, תרגול והתקדמות — בקשר אישי ונעים.",
    left: "19%", width: "18%", delay: 80,
  },
  {
    key: "drums",
    img: drums,
    href: "/orchestras",
    title: "תזמורות",
    quote: "הרכבים וסגנונות לכל אירוע — בלי להסתבך.",
    left: "32%", width: "18%", delay: 160,
  },
  {
    key: "saxophone",
    img: saxophone,
    href: "/performances",
    title: "הופעות",
    quote: "יומן הופעות, חוויה מוסיקלית, הזמנה מסודרת.",
    left: "47%", width: "13%", delay: 240,
  },
  {
    key: "guitar",
    img: guitar,
    href: "/sheets",
    title: "תווים",
    quote: "ספריית תווים מסודרת — מהירה ונוחה לעין.",
    left: "60%", width: "14%", delay: 320,
  },
  {
    key: "violin",
    img: violin,
    href: "/blog",
    title: "בלוג",
    quote: "טיפים, מחשבות והשראה מוזיקלית שנעים לחזור אליה.",
    left: "73%", width: "13%", delay: 400,
  },
  {
    key: "flute",
    img: flute,
    href: "/about",
    title: "אודות",
    quote: "הסיפור, הדרך והאני מאמין של Toby Music.",
    left: "86%", width: "9%", delay: 480,
  },
] as const;

export default function StageNav() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const [visible,  setVisible]  = useState(false);
  const [hovered,  setHovered]  = useState<string | null>(null);

  /* Trigger instrument entrance when section enters viewport */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── Stage section ── */
        .stage-nav-wrap {
          position: relative;
          width: 100%;
          /* tall enough to show stage + bubbles above */
          min-height: 92vh;
          overflow: hidden;
        }
        .stage-nav-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center bottom;
        }
        /* Fade-in overlay: hero fades out → empty stage fades in */
        @keyframes stage-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .stage-nav-bg { animation: stage-fadein 0.7s ease forwards; }

        /* ── Instruments ── */
        .instr-wrap {
          position: absolute;
          bottom: 18%;          /* sit on stage floor */
          transform: translateY(120%);
          opacity: 0;
          transition: transform 0.65s cubic-bezier(0.22,1,0.36,1),
                      opacity   0.55s ease;
          cursor: pointer;
          z-index: 10;
        }
        .instr-wrap.in {
          transform: translateY(0);
          opacity: 1;
        }
        .instr-wrap:hover .instr-img {
          transform: scale(1.09) translateY(-6px);
          filter: drop-shadow(0 16px 32px rgba(0,0,0,0.45));
        }
        .instr-img {
          width: 100%;
          display: block;
          transition: transform 0.3s ease, filter 0.3s ease;
          filter: drop-shadow(0 10px 22px rgba(0,0,0,0.35));
        }

        /* ── Speech bubble ── */
        @keyframes bubble-in {
          from { opacity:0; transform: translateY(10px) scale(0.92); }
          to   { opacity:1; transform: translateY(0)    scale(1);    }
        }
        .speech-bubble {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          width: max(140px, 100%);
          max-width: 220px;
          background: hsl(var(--card) / 0.96);
          border: 1px solid hsl(var(--border));
          border-radius: 14px;
          padding: 10px 14px 12px;
          text-align: center;
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.22);
          animation: bubble-in 0.28s ease forwards;
          z-index: 30;
          pointer-events: none;
        }
        .speech-bubble::after {
          content: '';
          position: absolute;
          top: 100%; left: 50%;
          transform: translateX(-50%);
          border: 7px solid transparent;
          border-top-color: hsl(var(--card));
        }
        .speech-bubble-title {
          font-weight: 800;
          font-size: 0.95rem;
          color: hsl(var(--accent));
          margin-bottom: 4px;
        }
        .speech-bubble-quote {
          font-size: 0.75rem;
          color: hsl(var(--foreground) / 0.75);
          line-height: 1.45;
          margin-bottom: 8px;
        }
        .speech-bubble-btn {
          display: inline-block;
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 14px;
          border-radius: 999px;
          text-decoration: none;
          transition: opacity 0.2s;
          pointer-events: auto;
        }
        .speech-bubble-btn:hover { opacity: 0.85; }

        /* ── Nav dots bar (always visible) ── */
        .nav-dots-bar {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 20;
          background: hsl(var(--background) / 0.72);
          backdrop-filter: blur(10px);
          border: 1px solid hsl(var(--border) / 0.5);
          border-radius: 999px;
          padding: 8px 20px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 90vw;
        }
        .nav-dot-link {
          font-size: 0.8rem;
          font-weight: 600;
          color: hsl(var(--foreground) / 0.70);
          text-decoration: none;
          padding: 3px 10px;
          border-radius: 999px;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .nav-dot-link:hover,
        .nav-dot-link.active {
          background: hsl(var(--primary) / 0.15);
          color: hsl(var(--primary));
        }
      `}</style>

      <div ref={sectionRef} className="stage-nav-wrap" dir="rtl">

        {/* Empty stage background */}
        <img
          src={stageEmptyLight}
          alt=""
          aria-hidden="true"
          className="stage-nav-bg block dark:hidden"
        />
        <img
          src={stageEmptyDark}
          alt=""
          aria-hidden="true"
          className="stage-nav-bg hidden dark:block"
        />

        {/* ── Always-visible nav dots bar ── */}
        <nav className="nav-dots-bar" aria-label="ניווט ראשי">
          {INSTRUMENTS.map((inst) => (
            <Link
              key={inst.key}
              to={inst.href}
              className="nav-dot-link"
            >
              {inst.title}
            </Link>
          ))}
        </nav>

        {/* ── Instruments ── */}
        {INSTRUMENTS.map((inst) => (
          <div
            key={inst.key}
            className={`instr-wrap${visible ? " in" : ""}`}
            style={{
              left: inst.left,
              width: inst.width,
              transitionDelay: visible ? `${inst.delay}ms` : "0ms",
            }}
            onMouseEnter={() => setHovered(inst.key)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Speech bubble on hover */}
            {hovered === inst.key && (
              <div className="speech-bubble">
                <div className="speech-bubble-title">{inst.title}</div>
                <div className="speech-bubble-quote">{inst.quote}</div>
                <Link to={inst.href} className="speech-bubble-btn">
                  כניסה לדף ←
                </Link>
              </div>
            )}

            {/* Instrument image — clickable */}
            <Link to={inst.href} aria-label={`מעבר לדף ${inst.title}`}>
              <img
                src={inst.img}
                alt={inst.title}
                className="instr-img"
              />
            </Link>

            {/* Title label below instrument */}
            <div
              className="mt-1 text-center text-[clamp(10px,0.9vw,14px)] font-bold"
              style={{ color: "hsl(var(--primary))" }}
            >
              {inst.title}
            </div>
          </div>
        ))}

      </div>
    </>
  );
}
