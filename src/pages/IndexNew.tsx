import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  STAGE_CHARACTERS,
  HERO_TEXT,
  GUIDE_PRESENTER,
  GUIDE_SECTION_ID,
  HOME_HERO_ID,
  MARQUEE_ITEMS,
} from "@/config/homepage";

// ── Stage background (existing in repo) ──
import stageDark from "@/assets/homepage/stage/darkstage.png";
import stageLight from "@/assets/homepage/stage/lightstage.png";

// ── Logo (existing in repo) ──
import logoWhite from "@/assets/whitelogo.png";
import logoBlack from "@/assets/homepage/brand/logo-black.jpg";

// ── Characters from Drive (uploaded to public/assets/) ──
// These are the NEW Drive characters replacing the sign-holding ones
const DRIVE_CHARS: Record<string, string> = {
  piano:     "/assets/piano-char.png",
  violin:    "/assets/violin-char.png",
  flute:     "/assets/flute-char.png",
  saxophone: "/assets/sax-char.png",
  guitar:    "/assets/guitar-char.png",
  eguitar:   "/assets/guitar-char.png",
  drums:     "/assets/note-char.png",
  presenter: "/assets/note-char.png",
};

// ── Sign characters (existing in repo, fallback) ──
import signPiano    from "@/assets/homepage/characters-signs/piano.png";
import signEguitar  from "@/assets/homepage/characters-signs/eguitar.png";
import signGuitar   from "@/assets/homepage/characters-signs/guitar.png";
import signDrums    from "@/assets/homepage/characters-signs/drums.png";
import signSaxophone from "@/assets/homepage/characters-signs/saxophone.png";
import signViolin   from "@/assets/homepage/characters-signs/violin.png";
import presenterImg from "@/assets/homepage/presenter/presenter.png";
import starsTexture from "@/assets/homepage/textures/stars-dark.png";

// ── Palette ──
const C = {
  bg:       "#0F0F12",
  bgCard:   "#140D10",
  bgCardHover: "#1A1015",
  burgundy: "#6B1F2A",
  wine:     "#8B2A37",
  gold:     "#C9A961",
  glow:     "#FFE5A0",
  cream:    "#F5F1EA",
  muted:    "rgba(245,241,234,0.6)",
  dimmed:   "rgba(245,241,234,0.35)",
  // Light mode
  bgLight:  "#F5F1EA",
  bgCardLight: "#FFFFFF",
  textLight:   "#0F0F12",
  borderLight: "#C9A961",
};

const FIRE = `linear-gradient(110deg, ${C.wine} 0%, ${C.gold} 30%, ${C.glow} 50%, ${C.gold} 70%, ${C.burgundy} 100%)`;

const SIGN_MAP: Record<string, string> = {
  piano: signPiano,
  eguitar: signEguitar,
  guitar: signGuitar,
  drums: signDrums,
  saxophone: signSaxophone,
  violin: signViolin,
  presenter: presenterImg,
};

// ── Types ──
type Theme = "dark" | "light";

// ─────────────────────────────────────────────────────────────
export default function IndexNew() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [showMarquee, setShowMarquee] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const isDark = theme === "dark";

  // Persist theme
  useEffect(() => {
    const saved = localStorage.getItem("toby-theme");
    if (saved === "light") setTheme("light");
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("toby-theme", next);
  };

  // Marquee on scroll past hero
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setShowMarquee(!e.isIntersecting),
      { threshold: 0.04 }
    );
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  // Speech bubble on scroll
  useEffect(() => {
    const handler = () => {
      if (!bubbleDismissed && window.scrollY > 60) setShowBubble(true);
      if (window.scrollY < 20) setShowBubble(false);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [bubbleDismissed]);

  // ── Derived colors based on theme ──
  const bg       = isDark ? C.bg      : C.bgLight;
  const cardBg   = isDark ? C.bgCard  : C.bgCardLight;
  const textMain = isDark ? C.cream   : C.textLight;
  const border   = isDark ? C.burgundy: C.borderLight;
  const logo     = isDark ? logoWhite : logoBlack;
  const stageBg  = isDark ? stageDark : stageLight;

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700&family=Heebo:wght@300;400;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: ${bg};
          font-family: 'Heebo', sans-serif;
          direction: rtl;
          overflow-x: hidden;
          transition: background 0.3s;
        }

        /* Marquee */
        @keyframes toby-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .toby-marquee-track {
          animation: toby-marquee 26s linear infinite;
          width: max-content;
        }

        /* Sparkle on "כאן" */
        @keyframes toby-sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          20%       { opacity: 1; transform: scale(1) rotate(30deg); }
          80%       { opacity: 1; transform: scale(0.8) rotate(-20deg); }
        }
        .toby-sparkle {
          position: absolute;
          border-radius: 9999px;
          background: ${C.gold};
          box-shadow: 0 0 6px 2px rgba(201,169,97,0.6);
          animation: toby-sparkle 1.6s ease-in-out infinite;
          pointer-events: none;
        }

        /* Logo entrance */
        @keyframes toby-logo-in {
          0%   { opacity: 0; transform: scale(0.7) translateY(-20px); filter: blur(4px); }
          60%  { opacity: 1; transform: scale(1.04) translateY(2px); filter: blur(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .toby-logo-in { animation: toby-logo-in 1.1s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* Character hover */
        .toby-char {
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), filter 0.35s ease;
          cursor: pointer;
        }
        .toby-char:hover {
          transform: translateY(-14px) scale(1.07);
          filter: drop-shadow(0 0 18px rgba(201,169,97,0.65));
        }

        /* Speech bubble entrance */
        @keyframes toby-bubble-in {
          0%   { opacity: 0; transform: scale(0.7) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .toby-bubble-in { animation: toby-bubble-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* Card hover */
        .toby-card-link {
          text-decoration: none;
          display: block;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s;
        }
        .toby-card-link:hover { transform: translateY(-4px); }

        /* Section enter on scroll */
        @keyframes toby-slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .toby-appear { animation: toby-slide-up 0.55s cubic-bezier(0.22,1,0.36,1) both; }

        /* Spotlight pulse */
        @keyframes toby-spot {
          0%, 100% { opacity: 0.12; }
          50%       { opacity: 0.22; }
        }
      `}</style>

      <div style={{ background: bg, color: textMain, minHeight: "100vh", transition: "background 0.3s, color 0.3s" }}>

        {/* ══════════════════════════════════════════
            MARQUEE BAR — appears on scroll
        ══════════════════════════════════════════ */}
        {showMarquee && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
            background: isDark ? C.burgundy : C.bgCardLight,
            borderBottom: `1px solid ${border}`,
            padding: "10px 0", overflow: "hidden",
          }}>
            <div className="toby-marquee-track" style={{ display: "flex", alignItems: "center", gap: "0", whiteSpace: "nowrap" }}>
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span key={i} style={{
                  fontFamily: "'Heebo', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  letterSpacing: "0.15em",
                  color: isDark ? C.glow : C.burgundy,
                  padding: "0 24px",
                }}>
                  {item}
                  <span style={{ marginRight: "24px", opacity: 0.4 }}>•</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            HEADER / NAV
        ══════════════════════════════════════════ */}
        <header style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          padding: "12px 24px",
          direction: "rtl",
        }}>
          <div style={{
            maxWidth: "1200px", margin: "0 auto",
            background: isDark ? "rgba(15,15,18,0.92)" : "rgba(245,241,234,0.92)",
            backdropFilter: "blur(14px)",
            border: `1px solid ${border}`,
            borderRadius: "9999px",
            padding: "0 20px",
            height: "56px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(107,31,42,0.12)",
          }}>
            {/* Logo */}
            <Link to="/" style={{ display: "flex", alignItems: "center" }}>
              <img src={logo} alt="TOBY music" style={{ height: "36px", width: "auto", objectFit: "contain" }} />
            </Link>

            {/* Nav links */}
            <nav style={{ display: "flex", gap: "4px" }}>
              {[
                { label: "בית",       href: "/" },
                { label: "תזמורות",  href: "/orchestras" },
                { label: "הופעות",   href: "/performances" },
                { label: "תלמידות",  href: "/students" },
                { label: "תווים",    href: "/sheets" },
                { label: "אודות",    href: "/about" },
                { label: "בלוג",     href: "/blog" },
              ].map(link => (
                <Link key={link.href} to={link.href} style={{
                  fontFamily: "'Heebo', sans-serif",
                  fontSize: "14px", fontWeight: 500,
                  color: textMain,
                  textDecoration: "none",
                  padding: "6px 12px", borderRadius: "9999px",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = C.gold;
                  (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(201,169,97,0.1)" : "rgba(107,31,42,0.08)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = textMain;
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: theme toggle + CTA */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={toggleTheme} aria-label={isDark ? "מצב יום" : "מצב לילה"} style={{
                width: "36px", height: "36px", borderRadius: "9999px",
                border: `1px solid ${border}`,
                background: "transparent",
                color: C.gold, fontSize: "16px",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color 0.2s",
              }}>
                {isDark ? "☀" : "🌙"}
              </button>
              <Link to="/contact" style={{
                background: `linear-gradient(110deg, ${C.burgundy}, ${C.wine})`,
                color: "#fff",
                fontFamily: "'Heebo', sans-serif", fontWeight: 700, fontSize: "14px",
                padding: "8px 20px", borderRadius: "9999px",
                textDecoration: "none",
                transition: "filter 0.2s, transform 0.2s",
                boxShadow: "0 2px 12px rgba(107,31,42,0.4)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                צור קשר
              </Link>
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════
            HERO + STAGE
        ══════════════════════════════════════════ */}
        <section
          ref={heroRef}
          id={HOME_HERO_ID}
          style={{ position: "relative", overflow: "hidden", minHeight: "100vh", paddingTop: "80px" }}
        >
          {/* Stage background image — fills the whole section */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img src={stageBg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {/* Gradient overlay: dark top for text, transparent middle for stage, dark bottom for fade */}
            <div style={{
              position: "absolute", inset: 0,
              background: isDark
                ? "linear-gradient(180deg, #0F0F12 0%, rgba(15,15,18,0.7) 28%, rgba(15,15,18,0.1) 55%, rgba(15,15,18,0.0) 68%, #0F0F12 100%)"
                : "linear-gradient(180deg, #F5F1EA 0%, rgba(245,241,234,0.6) 28%, rgba(245,241,234,0.0) 55%, rgba(245,241,234,0.0) 68%, #F5F1EA 100%)",
            }} />
          </div>

          {/* ── Spotlights (decorative) ── */}
          {[
            { left:"18%", rot:-22, delay:"0s",   h:"280px" },
            { left:"31%", rot:-8,  delay:"0.8s", h:"300px" },
            { left:"50%", rot:0,   delay:"1.6s", h:"310px" },
            { left:"69%", rot:8,   delay:"0.8s", h:"300px" },
            { left:"82%", rot:22,  delay:"0s",   h:"280px" },
          ].map((s, i) => (
            <div key={i} aria-hidden="true" style={{
              position: "absolute", top: 0, left: s.left,
              width: "2px", height: s.h,
              transformOrigin: "top center",
              transform: `translateX(-50%) rotate(${s.rot}deg)`,
              background: "linear-gradient(180deg, rgba(201,169,97,0.18) 0%, transparent 100%)",
              animation: `toby-spot 4s ${s.delay} ease-in-out infinite`,
              zIndex: 1, pointerEvents: "none",
            }} />
          ))}

          {/* ── Hero text — sits in dark zone above stage ── */}
          <div style={{
            position: "relative", zIndex: 10,
            textAlign: "center",
            padding: "60px 80px 0",
          }}>
            {/* Animated logo */}
            <img
              src={logo}
              alt="TOBY music"
              className="toby-logo-in"
              style={{
                height: "clamp(70px,10vw,120px)",
                width: "auto",
                objectFit: "contain",
                marginBottom: "24px",
                filter: isDark
                  ? "drop-shadow(0 6px 28px rgba(0,0,0,0.4))"
                  : "drop-shadow(0 4px 16px rgba(107,31,42,0.2))",
              }}
            />

            {/* H1 */}
            <h1 style={{
              fontFamily: "'Frank Ruhl Libre', serif",
              fontSize: "clamp(36px, 5.5vw, 68px)",
              fontWeight: 500,
              color: textMain,
              lineHeight: 1.12,
              marginBottom: "16px",
              filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.3))",
            }}>
              {HERO_TEXT.subtitle}{" "}
              <a href={`#${GUIDE_SECTION_ID}`} style={{
                position: "relative",
                display: "inline-block",
                background: FIRE,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textDecoration: "none",
              }}>
                {HERO_TEXT.linkWord}
                {/* Sparkle dots */}
                {[
                  { top:"-10px", right:"-6px",  w:8, delay:"0s" },
                  { top:"-4px",  left:"-10px",  w:6, delay:"0.4s" },
                  { bottom:"-8px",right:"4px",  w:5, delay:"0.8s" },
                  { top:"2px",   right:"-14px", w:7, delay:"1.2s" },
                ].map((sp, i) => (
                  <span key={i} className="toby-sparkle" aria-hidden="true" style={{
                    ...sp,
                    width: sp.w, height: sp.w,
                    animationDelay: sp.delay,
                  }} />
                ))}
              </a>
            </h1>

            {/* Support line */}
            <p style={{
              fontFamily: "'Heebo', sans-serif",
              fontSize: "clamp(14px, 1.5vw, 20px)",
              color: isDark ? "rgba(245,241,234,0.75)" : "rgba(15,15,18,0.65)",
              background: isDark ? "rgba(245,241,234,0.06)" : "rgba(107,31,42,0.06)",
              backdropFilter: "blur(8px)",
              borderRadius: "9999px",
              display: "inline-block",
              padding: "6px 20px",
              marginBottom: "10px",
            }}>
              {HERO_TEXT.supportLine}
            </p>

            {/* Slogan */}
            <p style={{
              fontFamily: "'Frank Ruhl Libre', serif",
              fontSize: "clamp(16px, 1.8vw, 24px)",
              fontWeight: 700,
              color: textMain,
            }}>
              {HERO_TEXT.sloganPrefix}{" "}
              <span style={{
                background: FIRE,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                {HERO_TEXT.sloganAccent}
              </span>
            </p>
          </div>

          {/* ── Stage characters — positioned on the stage ── */}
          <div style={{
            position: "absolute",
            inset: 0, zIndex: 5,
            pointerEvents: "none",
          }}>
            {STAGE_CHARACTERS.map((char) => {
              // Try Drive character first, fallback to sign character
              const driveImg = DRIVE_CHARS[char.character];
              const signImg  = SIGN_MAP[char.character];

              return (
                <Link
                  key={char.href}
                  to={char.href}
                  className="toby-char"
                  style={{
                    position: "absolute",
                    left: char.stage.left,
                    bottom: char.stage.bottom,
                    width: char.stage.width,
                    zIndex: char.stage.zIndex,
                    transform: "translateX(-50%)",
                    transformOrigin: "bottom center",
                    pointerEvents: "auto",
                    display: "block",
                  }}
                  aria-label={`מעבר לדף ${char.title}`}
                >
                  <div style={{ position: "relative" }}>
                    {/* Try Drive image, fallback to sign image */}
                    <img
                      src={driveImg}
                      alt={char.title}
                      style={{ display: "block", width: "100%" }}
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        if (el.src !== signImg) el.src = signImg;
                      }}
                    />
                    {/* Title label */}
                    {char.labelMode === "badge" ? (
                      <div style={{
                        position: "absolute",
                        bottom: "8%", left: "50%",
                        transform: "translateX(-50%)",
                        background: isDark ? "rgba(15,15,18,0.85)" : "rgba(245,241,234,0.9)",
                        border: `1px solid ${border}`,
                        borderRadius: "9999px",
                        padding: "4px 14px",
                        fontSize: "clamp(10px,0.9vw,14px)",
                        fontWeight: 700,
                        color: isDark ? C.gold : C.burgundy,
                        whiteSpace: "nowrap",
                        backdropFilter: "blur(6px)",
                      }}>
                        {char.title}
                      </div>
                    ) : (
                      <div style={{
                        position: "absolute",
                        top: char.signBox.top,
                        left: char.signBox.left,
                        width: char.signBox.width,
                        height: char.signBox.height,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{
                          fontFamily: "'Frank Ruhl Libre', serif",
                          fontSize: "clamp(11px, 1.3vw, 20px)",
                          fontWeight: 700,
                          color: isDark ? C.cream : C.textLight,
                          textAlign: "center",
                          lineHeight: 1.2,
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
                        }}>
                          {char.title}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}

            {/* Speech bubble from presenter */}
            {showBubble && !bubbleDismissed && (() => {
              const presenter = STAGE_CHARACTERS.find(c => c.character === "presenter");
              if (!presenter) return null;
              return (
                <div
                  className="toby-bubble-in"
                  style={{
                    position: "absolute",
                    left: `calc(${presenter.stage.left} + ${presenter.stage.width} + 0.5%)`,
                    bottom: "72%",
                    zIndex: 30,
                    pointerEvents: "auto",
                    direction: "rtl",
                  }}
                >
                  <div style={{
                    position: "relative",
                    maxWidth: "220px",
                    background: isDark ? "rgba(20,13,16,0.96)" : "rgba(245,241,234,0.96)",
                    border: `1px solid ${border}`,
                    borderRadius: "16px",
                    padding: "12px 14px",
                    fontSize: "13px", fontWeight: 600, lineHeight: 1.6,
                    color: textMain,
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  }}>
                    <span>ברוכים הבאים ל</span>
                    <span style={{ color: C.gold }}>Toby music</span>
                    <div style={{
                      position: "absolute", top: "14px", left: "-7px",
                      width: "13px", height: "13px",
                      transform: "rotate(45deg)",
                      background: isDark ? "rgba(20,13,16,0.96)" : "rgba(245,241,234,0.96)",
                      borderBottom: `1px solid ${border}`,
                      borderLeft: `1px solid ${border}`,
                    }} />
                    <button
                      onClick={() => { setBubbleDismissed(true); setShowBubble(false); }}
                      style={{
                        position: "absolute", top: "-8px", right: "-8px",
                        width: "20px", height: "20px",
                        borderRadius: "9999px",
                        background: isDark ? C.bgCard : "#e0d8d0",
                        border: `1px solid ${border}`,
                        cursor: "pointer", fontSize: "10px",
                        color: textMain, display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}
                      aria-label="סגור"
                    >✕</button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Bottom fade to page bg */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "120px", zIndex: 6,
            background: `linear-gradient(180deg, transparent, ${bg})`,
            pointerEvents: "none",
          }} />
        </section>

        {/* ══════════════════════════════════════════
            GUIDE PRESENTER SECTION
        ══════════════════════════════════════════ */}
        <section
          id={GUIDE_SECTION_ID}
          style={{
            background: bg, padding: "48px 24px 56px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <img
              src={presenterImg}
              alt="טובי — המדריך שלכם"
              style={{
                width: "clamp(160px,18vw,240px)",
                filter: "drop-shadow(0 18px 35px rgba(0,0,0,0.18))",
                marginBottom: "24px",
              }}
            />
            <div style={{
              position: "relative",
              background: cardBg,
              border: `1px solid ${border}`,
              borderRadius: "24px",
              padding: "28px 32px",
              boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(107,31,42,0.1)",
            }}>
              {/* Bubble tail */}
              <div style={{
                position: "absolute", top: "-10px", left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                width: "18px", height: "18px",
                background: cardBg,
                borderTop: `1px solid ${border}`, borderLeft: `1px solid ${border}`,
              }} />
              <p style={{
                fontFamily: "'Heebo', sans-serif",
                fontSize: "clamp(14px,1.4vw,18px)",
                lineHeight: "1.85",
                color: textMain,
              }}>
                {GUIDE_PRESENTER.welcomeText}
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CHARACTER / SERVICE CARDS GRID
        ══════════════════════════════════════════ */}
        <section style={{
          background: isDark ? "rgba(10,8,12,0.98)" : C.bgCardLight,
          borderTop: `1px solid ${border}`,
          borderBottom: `1px solid ${border}`,
          padding: "56px 24px",
        }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
              gap: "20px",
            }}>
              {STAGE_CHARACTERS.map((char) => {
                const driveImg = DRIVE_CHARS[char.character];
                const fallback = SIGN_MAP[char.character];
                return (
                  <Link
                    key={char.href}
                    to={char.href}
                    className="toby-card-link"
                    style={{
                      background: cardBg,
                      border: `1px solid ${border}`,
                      borderRadius: "16px",
                      padding: "28px 20px",
                      textAlign: "center",
                      color: textMain,
                      position: "relative", overflow: "hidden",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = C.gold;
                      (e.currentTarget as HTMLElement).style.boxShadow = isDark
                        ? "0 8px 28px rgba(107,31,42,0.35)"
                        : "0 8px 28px rgba(201,169,97,0.25)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = border;
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Stars texture */}
                    <img src={starsTexture} alt="" aria-hidden="true" style={{
                      position: "absolute", inset: 0, width: "100%", height: "100%",
                      objectFit: "cover", opacity: isDark ? 0.12 : 0.05, pointerEvents: "none",
                    }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <img
                        src={driveImg}
                        alt={char.title}
                        style={{
                          width: char.character === "drums" ? "140px"
                               : char.character === "presenter" ? "110px"
                               : "100px",
                          margin: "0 auto 16px",
                          display: "block",
                          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.18))",
                          transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), filter 0.35s ease",
                        }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback; }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLImageElement).style.transform = "translateY(-10px) scale(1.06)";
                          (e.currentTarget as HTMLImageElement).style.filter = "drop-shadow(0 0 16px rgba(201,169,97,0.55))";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLImageElement).style.transform = "";
                          (e.currentTarget as HTMLImageElement).style.filter = "drop-shadow(0 10px 20px rgba(0,0,0,0.18))";
                        }}
                      />
                      <h3 style={{
                        fontFamily: "'Frank Ruhl Libre', serif",
                        fontSize: "20px", fontWeight: 500,
                        color: C.gold,
                        marginBottom: "10px",
                        transition: "color 0.2s",
                      }}>
                        {char.title}
                      </h3>
                      <p style={{
                        fontFamily: "'Heebo', sans-serif",
                        fontSize: "14px", lineHeight: "1.7",
                        color: isDark ? "rgba(245,241,234,0.6)" : "rgba(15,15,18,0.65)",
                      }}>
                        {char.quote}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FOOTER (re-uses existing Footer component logic)
        ══════════════════════════════════════════ */}
        <footer style={{
          background: isDark ? "#06040A" : C.bgCardLight,
          borderTop: `3px solid transparent`,
          borderImage: `${FIRE} 1`,
          padding: "48px 32px 28px",
          direction: "rtl",
        }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", marginBottom: "32px" }}>
              {/* Brand */}
              <div style={{ minWidth: "260px", flex: "1.4" }}>
                <img src={logoWhite} alt="TOBY music" style={{ height: "80px", width: "auto", objectFit: "contain", marginBottom: "16px" }} />
                <p style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>
                  אומנות ואמינות. זו יצירה.
                </p>
                <p style={{ fontSize: "14px", lineHeight: "1.7", color: "rgba(255,255,255,0.65)", maxWidth: "320px" }}>
                  מוזיקה, יצירה ושירות מקצועי בשפה נקייה, מדויקת ומכובדת.
                </p>
                <Link to="/contact" style={{
                  display: "inline-flex", alignItems: "center",
                  marginTop: "20px",
                  border: `1px solid rgba(201,169,97,0.35)`,
                  borderRadius: "16px", padding: "10px 20px",
                  fontSize: "14px", fontWeight: 500, color: "#fff",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  להצטרף לתפוצה
                </Link>
              </div>

              {/* Nav columns */}
              {[
                { title: "ניווט מהיר", links: [
                  { label: "דף הבית",    href: "/" },
                  { label: "אודות",      href: "/about" },
                  { label: "תזמורות",   href: "/orchestras" },
                  { label: "הופעות",    href: "/performances" },
                  { label: "תלמידות",   href: "/students" },
                  { label: "יצירת קשר", href: "/contact" },
                ]},
                { title: "עוד באתר", links: [
                  { label: "בלוג",    href: "/blog" },
                  { label: "יצירה",   href: "/creativity" },
                  { label: "צמיחה",   href: "/growth" },
                  { label: "נסיעות",  href: "/travel" },
                  { label: "וולנס",   href: "/wellness" },
                  { label: "מחברים",  href: "/authors" },
                ]},
              ].map(col => (
                <div key={col.title} style={{ minWidth: "170px", flex: 1 }}>
                  <h3 style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "16px", color: "#fff", marginBottom: "14px" }}>
                    {col.title}
                  </h3>
                  <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {col.links.map(l => (
                      <Link key={l.href} to={l.href} style={{
                        fontSize: "14px", lineHeight: "2.2",
                        color: "rgba(255,255,255,0.65)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.gold}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "18px",
              display: "flex", flexWrap: "wrap", justifyContent: "space-between",
              alignItems: "center", gap: "12px",
            }}>
              <div style={{ display: "flex", gap: "16px" }}>
                {[{ label: "פרטיות", href: "/privacy" }, { label: "תנאים", href: "/terms" }].map(l => (
                  <Link key={l.href} to={l.href} style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                    {l.label}
                  </Link>
                ))}
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                © {new Date().getFullYear()} Toby Music. כל הזכויות שמורות.
              </p>
            </div>
          </div>
        </footer>

        {/* ══════════════════════════════════════════
            FLOATING GUIDE (after scroll past hero)
        ══════════════════════════════════════════ */}
        {showMarquee && (
          <div style={{
            position: "fixed", bottom: "24px", right: "24px",
            zIndex: 50, display: "flex", flexDirection: "column",
            alignItems: "flex-end", gap: "8px",
          }}>
            {showBubble && !bubbleDismissed && (
              <div className="toby-bubble-in" style={{
                position: "relative",
                maxWidth: "280px",
                background: isDark ? "rgba(20,13,16,0.96)" : "rgba(245,241,234,0.96)",
                border: `1px solid ${border}`,
                borderRadius: "16px",
                padding: "14px 16px",
                fontSize: "13px", lineHeight: "1.7",
                color: textMain,
                backdropFilter: "blur(8px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                direction: "rtl",
              }}>
                <button onClick={() => { setBubbleDismissed(true); setShowBubble(false); }} style={{
                  position: "absolute", top: "-8px", left: "-8px",
                  width: "20px", height: "20px", borderRadius: "9999px",
                  background: isDark ? C.bgCard : "#e0d8d0",
                  border: `1px solid ${border}`,
                  cursor: "pointer", fontSize: "10px", color: textMain,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }} aria-label="סגור">✕</button>
                <div style={{ position: "absolute", bottom: "-7px", right: "28px", width: "13px", height: "13px",
                  transform: "rotate(45deg)", background: isDark ? "rgba(20,13,16,0.96)" : "rgba(245,241,234,0.96)",
                  borderRight: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
                }} />
                {GUIDE_PRESENTER.welcomeText}
              </div>
            )}
            <button
              onClick={() => setShowBubble(p => !p)}
              style={{
                width: "60px", height: "60px", borderRadius: "9999px",
                overflow: "hidden",
                border: `2px solid ${C.gold}`,
                background: cardBg,
                cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ""}
              aria-label={GUIDE_PRESENTER.floatingLabel}
            >
              <img src={presenterImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            </button>
            <span style={{
              background: isDark ? "rgba(20,13,16,0.9)" : "rgba(245,241,234,0.9)",
              border: `1px solid ${border}`,
              borderRadius: "9999px",
              padding: "4px 12px",
              fontSize: "12px", fontWeight: 600, color: textMain,
              backdropFilter: "blur(6px)",
            }}>
              {GUIDE_PRESENTER.floatingLabel}
            </span>
          </div>
        )}

      </div>
    </>
  );
}
