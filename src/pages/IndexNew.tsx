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

// ── Logo from repo ──
import logoWhite from "@/assets/whitelogo.png";
import logoBlack from "@/assets/homepage/brand/logo-black.jpg";

// ── Presenter (floating guide) from repo ──
import presenterImg from "@/assets/homepage/presenter/presenter.png";

// ── Stage background — Drive asset ──
// Dark: public/assets/stage-dark.png
// Light: repo darkstage / lightstage (fallback)
import stageLightFallback from "@/assets/homepage/stage/lightstage.png";

// ── Character images from Drive (public/assets/)
// mix-blend-mode: screen removes the black bg naturally
const CHAR_IMG: Record<string, string> = {
  piano:     "/assets/piano-char.png",
  eguitar:   "/assets/guitar-char.png",
  guitar:    "/assets/guitar-char.png",
  drums:     "/assets/drums-char.png",
  saxophone: "/assets/sax-char.png",
  violin:    "/assets/violin-char.png",
  presenter: "/assets/note-char.png",
};

// ── Fallback to existing repo sign-characters ──
import signPiano  from "@/assets/homepage/characters-signs/piano.png";
import signEgtr   from "@/assets/homepage/characters-signs/eguitar.png";
import signGuitar from "@/assets/homepage/characters-signs/guitar.png";
import signDrums  from "@/assets/homepage/characters-signs/drums.png";
import signSax    from "@/assets/homepage/characters-signs/saxophone.png";
import signViolin from "@/assets/homepage/characters-signs/violin.png";
const FALLBACK: Record<string, string> = {
  piano: signPiano, eguitar: signEgtr, guitar: signGuitar,
  drums: signDrums, saxophone: signSax, violin: signViolin,
  presenter: signPiano,
};

// ── Brand palette ──
const C = {
  bg:      "#0F0F12",
  bgDeep:  "#07050A",
  card:    "#13100F",
  burg:    "#6B1F2A",
  wine:    "#8B2A37",
  gold:    "#C9A961",
  glow:    "#FFE5A0",
  cream:   "#F5F1EA",
  muted:   "rgba(245,241,234,0.6)",
  bgL:     "#F5F1EA",
  cardL:   "#FFFFFF",
  textL:   "#0F0F12",
  borderL: "#C9A961",
  mutedL:  "rgba(15,15,18,0.55)",
};
const FIRE = `linear-gradient(110deg,${C.wine} 0%,${C.gold} 30%,${C.glow} 50%,${C.gold} 70%,${C.burg} 100%)`;

// ── Service cards (per design document — 3 only) ──
const IcoMusic = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 26a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
    <path d="M26 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
    <path d="M16 22V8l10-2v6"/>
  </svg>
);
const IcoSheet = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="3" width="20" height="26" rx="2"/>
    <line x1="11" y1="10" x2="21" y2="10"/>
    <line x1="11" y1="15" x2="21" y2="15"/>
    <line x1="11" y1="20" x2="17" y2="20"/>
    <circle cx="20" cy="24" r="2"/>
    <line x1="22" y1="18" x2="22" y2="24"/>
  </svg>
);
const IcoPeople = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="4"/>
    <path d="M4 26c0-5 3.6-8 8-8s8 3 8 8"/>
    <circle cx="23" cy="10" r="3"/>
    <path d="M21 26c0-3 1.5-5.5 4-6.5"/>
  </svg>
);

const SERVICES = [
  { Icon: IcoMusic,  title: "הופעות",         desc: "אירועים, קונצרטים ומופעים", href: "/performances" },
  { Icon: IcoSheet,  title: "תווים וסדנאות",  desc: "תווים איכותיים וסדנאות מעשירות", href: "/sheets" },
  { Icon: IcoPeople, title: "ליווי אישי",     desc: "הדרכה וחניכה בהתאמה אישית", href: "/students" },
];

// ──────────────────────────────────────────────────────────
type Theme = "dark"|"light";

export default function IndexNew() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [marquee, setMarquee] = useState(false);
  const [bubble, setBubble]   = useState(false);
  const [bubbleDone, setBubbleDone] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const dk = theme === "dark";

  useEffect(() => {
    if (localStorage.getItem("toby-theme") === "light") setTheme("light");
  }, []);

  const toggleTheme = () => {
    const n: Theme = dk ? "light" : "dark";
    setTheme(n);
    localStorage.setItem("toby-theme", n);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setMarquee(!e.isIntersecting), { threshold: 0.04 }
    );
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const fn = () => {
      if (!bubbleDone && window.scrollY > 60) setBubble(true);
      if (window.scrollY < 20) setBubble(false);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [bubbleDone]);

  const bg     = dk ? C.bg    : C.bgL;
  const cardBg = dk ? C.card  : C.cardL;
  const text   = dk ? C.cream : C.textL;
  const border = dk ? C.burg  : C.borderL;
  const muted  = dk ? C.muted : C.mutedL;
  const logo   = dk ? logoWhite : logoBlack;
  const stageSrc = dk ? "/assets/stage-dark.png" : stageLightFallback;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700&family=Heebo:wght@300;400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${bg}; font-family: 'Heebo', sans-serif;
          direction: rtl; overflow-x: hidden; transition: background .3s; }

        @keyframes tm-mq { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        .tm-mq { animation: tm-mq 26s linear infinite;
          display: flex; align-items: center; width: max-content; white-space: nowrap; }

        @keyframes tm-spark {
          0%,100% { opacity:0; transform:scale(0) rotate(0deg) }
          20%     { opacity:1; transform:scale(1) rotate(30deg) }
          80%     { opacity:1; transform:scale(.8) rotate(-20deg) }
        }
        .tm-spark { position:absolute; border-radius:9999px; background:${C.gold};
          box-shadow:0 0 6px 2px rgba(201,169,97,.5);
          animation:tm-spark 1.6s ease-in-out infinite; pointer-events:none; }

        @keyframes tm-logo {
          0%  { opacity:0; transform:scale(.7) translateY(-16px); filter:blur(4px) }
          60% { opacity:1; transform:scale(1.04) translateY(2px); filter:blur(0) }
          100%{ opacity:1; transform:scale(1) translateY(0) }
        }
        .tm-logo { animation:tm-logo 1.1s cubic-bezier(.16,1,.3,1) forwards; }

        @keyframes tm-bubble {
          0%  { opacity:0; transform:scale(.7) translateY(8px) }
          100%{ opacity:1; transform:scale(1) translateY(0) }
        }
        .tm-bub { animation:tm-bubble .4s cubic-bezier(.16,1,.3,1) forwards; }

        .tm-char { cursor:pointer;
          transition:transform .35s cubic-bezier(.16,1,.3,1), filter .35s ease; }
        .tm-char:hover { transform:translateY(-14px) scale(1.07) !important;
          filter:drop-shadow(0 0 20px rgba(201,169,97,.7)) !important; }

        .tm-card { text-decoration:none; display:block;
          transition:transform .25s ease, box-shadow .25s ease, border-color .2s; }
        .tm-card:hover { transform:translateY(-4px); }

        @keyframes tm-spot { 0%,100%{opacity:.1} 50%{opacity:.2} }

        @keyframes tm-star { 0%,100%{opacity:.15} 50%{opacity:.55} }

        @keyframes tm-fade-up {
          from { opacity:0; transform:translateY(24px) }
          to   { opacity:1; transform:translateY(0) }
        }
        .tm-up { animation:tm-fade-up .6s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <div style={{ background:bg, color:text, minHeight:"100vh",
        transition:"background .3s, color .3s" }}>

        {/* ═══ MARQUEE ═══════════════════════════════════════ */}
        {marquee && (
          <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:60,
            background: dk ? C.burg : C.cardL,
            borderBottom:`1px solid ${border}`, padding:"9px 0", overflow:"hidden" }}>
            <div className="tm-mq">
              {[...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((item,i) => (
                <span key={i} style={{ fontFamily:"'Heebo',sans-serif", fontWeight:600,
                  fontSize:"13px", letterSpacing:".15em",
                  color: dk ? C.glow : C.burg, padding:"0 20px" }}>
                  {item}<span style={{ marginRight:"20px", opacity:.35 }}>•</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ═══ NAV ════════════════════════════════════════════ */}
        <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:50,
          padding:"10px 20px", direction:"rtl" }}>
          <div style={{
            maxWidth:"1200px", margin:"0 auto",
            background: dk ? "rgba(15,15,18,.94)" : "rgba(245,241,234,.94)",
            backdropFilter:"blur(16px)",
            border:`1px solid ${border}`,
            borderRadius:"9999px", height:"54px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"0 20px",
            boxShadow: dk ? "0 4px 28px rgba(0,0,0,.5)" : "0 4px 28px rgba(107,31,42,.14)",
          }}>
            <Link to="/" style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
              <img src={logo} alt="TOBY music"
                style={{ height:"34px", width:"auto", objectFit:"contain" }}/>
            </Link>

            <nav style={{ display:"flex", gap:"2px", flex:1, justifyContent:"center" }}>
              {[
                { label:"בית",      href:"/" },
                { label:"תזמורות", href:"/orchestras" },
                { label:"הופעות",  href:"/performances" },
                { label:"תלמידות", href:"/students" },
                { label:"תווים",   href:"/sheets" },
                { label:"אודות",   href:"/about" },
                { label:"בלוג",    href:"/blog" },
              ].map(l => (
                <Link key={l.href} to={l.href} style={{
                  fontFamily:"'Heebo',sans-serif", fontSize:"14px", fontWeight:500,
                  color:text, textDecoration:"none", padding:"6px 11px",
                  borderRadius:"9999px", transition:"background .18s, color .18s",
                }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLElement;
                  el.style.color=C.gold;
                  el.style.background=dk?"rgba(201,169,97,.1)":"rgba(107,31,42,.07)"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLElement;
                  el.style.color=text; el.style.background="transparent"; }}>
                  {l.label}
                </Link>
              ))}
            </nav>

            <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
              <button onClick={toggleTheme}
                aria-label={dk?"מצב יום":"מצב לילה"}
                style={{ width:"34px", height:"34px", borderRadius:"9999px",
                  border:`1px solid ${border}`, background:"transparent",
                  color:C.gold, fontSize:"15px", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                {dk ? "☀" : "🌙"}
              </button>
              <Link to="/contact" style={{
                background:`linear-gradient(110deg,${C.burg},${C.wine})`,
                color:"#fff", fontFamily:"'Heebo',sans-serif",
                fontWeight:700, fontSize:"14px",
                padding:"8px 18px", borderRadius:"9999px", textDecoration:"none",
                boxShadow:"0 2px 12px rgba(107,31,42,.45)",
                transition:"filter .2s, transform .2s",
              }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement;
                el.style.filter="brightness(1.12)"; el.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement;
                el.style.filter=""; el.style.transform=""; }}>
                צור קשר
              </Link>
            </div>
          </div>
        </header>

        {/* ═══ HERO — fixed height, viewport fill ════════════════
            הבמה קבועה — הכרטיסים גוללים מעליה
        ════════════════════════════════════════════════════════ */}
        <section ref={heroRef} id={HOME_HERO_ID} style={{
          position:"sticky", top:0, zIndex:0,
          width:"100%", height:"100vh", overflow:"hidden",
        }}>
          {/* ── Stage background image — fills fully ── */}
          <img src={stageSrc} alt=""
            onError={e => { (e.currentTarget as HTMLImageElement).src = stageLightFallback; }}
            style={{ position:"absolute", inset:0, width:"100%", height:"100%",
              objectFit:"cover", objectPosition:"center bottom" }}/>

          {/* ── Darkness gradient: heavy top for text, transparent middle for stage ── */}
          <div style={{ position:"absolute", inset:0,
            background:"linear-gradient(180deg, #0F0F12 0%, rgba(15,15,18,.78) 22%, rgba(15,15,18,.08) 50%, rgba(15,15,18,0) 65%, rgba(15,15,18,.15) 85%, #0F0F12 100%)",
          }}/>

          {/* ── Stars texture overlay ── */}
          <div style={{ position:"absolute", inset:0, overflow:"hidden", zIndex:1, pointerEvents:"none" }}>
            {Array.from({length:40}).map((_,i) => (
              <div key={i} style={{
                position:"absolute",
                left:`${(i*37+13)%97}%`,
                top:`${(i*53+7)%62}%`,
                width: i%5===0 ? "3px" : "2px",
                height: i%5===0 ? "3px" : "2px",
                borderRadius:"9999px",
                background:C.gold,
                opacity: .1 + (i%6)*.05,
                animation:`tm-star ${2.5+(i%3)*.8}s ${(i%4)*.6}s ease-in-out infinite`,
              }}/>
            ))}
          </div>

          {/* ── Curtains — 2D graphic, as in mockup ── */}
          {/* Left curtain body */}
          <div aria-hidden="true" style={{ position:"absolute", top:0, left:0,
            width:"13%", height:"100%", zIndex:2, pointerEvents:"none",
            background:"linear-gradient(90deg,rgba(45,8,8,.98) 0%,rgba(75,12,18,.92) 55%,transparent 100%)" }}/>
          {/* Left arch */}
          <div aria-hidden="true" style={{ position:"absolute", top:0, left:0,
            width:"10%", height:"62%", zIndex:3, pointerEvents:"none",
            background:"linear-gradient(160deg,#8B1A1A 0%,#5A1010 100%)",
            clipPath:"ellipse(100% 100% at 0% 0%)" }}/>
          {/* Left gold trim line */}
          <div aria-hidden="true" style={{ position:"absolute", top:0, left:"10%",
            width:"1.5px", height:"62%", zIndex:4, pointerEvents:"none",
            background:`linear-gradient(180deg,${C.gold} 0%,rgba(201,169,97,.2) 100%)` }}/>
          {/* Right curtain body */}
          <div aria-hidden="true" style={{ position:"absolute", top:0, right:0,
            width:"13%", height:"100%", zIndex:2, pointerEvents:"none",
            background:"linear-gradient(-90deg,rgba(45,8,8,.98) 0%,rgba(75,12,18,.92) 55%,transparent 100%)" }}/>
          {/* Right arch */}
          <div aria-hidden="true" style={{ position:"absolute", top:0, right:0,
            width:"10%", height:"62%", zIndex:3, pointerEvents:"none",
            background:"linear-gradient(-160deg,#8B1A1A 0%,#5A1010 100%)",
            clipPath:"ellipse(100% 100% at 100% 0%)" }}/>
          {/* Right gold trim line */}
          <div aria-hidden="true" style={{ position:"absolute", top:0, right:"10%",
            width:"1.5px", height:"62%", zIndex:4, pointerEvents:"none",
            background:`linear-gradient(180deg,${C.gold} 0%,rgba(201,169,97,.2) 100%)` }}/>

          {/* ── Spotlight beams ── */}
          {[
            { l:"20%", r:-20, d:"0s",   h:"55%" },
            { l:"34%", r:-7,  d:".9s",  h:"60%" },
            { l:"50%", r:0,   d:"1.8s", h:"62%" },
            { l:"66%", r:7,   d:".9s",  h:"60%" },
            { l:"80%", r:20,  d:"0s",   h:"55%" },
          ].map((s,i) => (
            <div key={i} aria-hidden="true" style={{
              position:"absolute", top:0, left:s.l, zIndex:1, pointerEvents:"none",
              width:"2px", height:s.h,
              transformOrigin:"top center",
              transform:`translateX(-50%) rotate(${s.r}deg)`,
              background:"linear-gradient(180deg,rgba(201,169,97,.18) 0%,transparent 100%)",
              animation:`tm-spot 4s ${s.d} ease-in-out infinite`,
            }}/>
          ))}

          {/* ═══ HERO TEXT — in dark upper zone ═══ */}
          <div style={{ position:"absolute", top:"8%", left:0, right:0,
            zIndex:10, textAlign:"center", padding:"0 80px" }}>

            {/* Decorative note + lines */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
              gap:"12px", marginBottom:"14px" }}>
              <div style={{ height:"1px", width:"80px",
                background:`linear-gradient(90deg,transparent,${C.burg})` }}/>
              <span style={{ color:C.gold, fontSize:"20px", opacity:.8 }}>♪</span>
              <div style={{ height:"1px", width:"80px",
                background:`linear-gradient(-90deg,transparent,${C.burg})` }}/>
            </div>

            {/* Logo animated */}
            <img src={logo} alt="TOBY music" className="tm-logo"
              style={{ height:"clamp(60px,8.5vw,110px)", width:"auto",
                objectFit:"contain", marginBottom:"20px",
                filter:"drop-shadow(0 6px 28px rgba(0,0,0,.5))" }}/>

            {/* H1 */}
            <h1 style={{ fontFamily:"'Frank Ruhl Libre',serif",
              fontSize:"clamp(32px,5vw,64px)", fontWeight:500,
              color:C.cream, lineHeight:1.12, marginBottom:"14px",
              filter:"drop-shadow(0 2px 16px rgba(0,0,0,.4))" }}>
              {HERO_TEXT.subtitle}{" "}
              <a href={`#${GUIDE_SECTION_ID}`} style={{
                position:"relative", display:"inline-block",
                background:FIRE,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                backgroundClip:"text", textDecoration:"none",
              }}>
                {HERO_TEXT.linkWord}
                {[
                  {top:"-9px",  right:"-6px",  w:8, d:"0s"  },
                  {top:"-3px",  left:"-9px",   w:6, d:".4s" },
                  {bottom:"-7px",right:"3px",  w:5, d:".8s" },
                  {top:"2px",   right:"-13px", w:7, d:"1.2s"},
                ].map((sp,i) => (
                  <span key={i} className="tm-spark" aria-hidden="true"
                    style={{...sp, width:sp.w, height:sp.w, animationDelay:sp.d}}/>
                ))}
              </a>
            </h1>

            {/* Support line */}
            <p style={{ fontFamily:"'Heebo',sans-serif",
              fontSize:"clamp(13px,1.35vw,18px)",
              color:"rgba(245,241,234,.72)",
              background:"rgba(245,241,234,.06)", backdropFilter:"blur(8px)",
              borderRadius:"9999px", display:"inline-block",
              padding:"6px 20px", marginBottom:"8px" }}>
              {HERO_TEXT.supportLine}
            </p>

            {/* Slogan */}
            <p style={{ fontFamily:"'Frank Ruhl Libre',serif",
              fontSize:"clamp(14px,1.6vw,22px)", fontWeight:700, color:C.cream }}>
              {HERO_TEXT.sloganPrefix}{" "}
              <span style={{ background:FIRE,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                backgroundClip:"text" }}>
                {HERO_TEXT.sloganAccent}
              </span>
            </p>
          </div>

          {/* ═══ STAGE CHARACTERS — positioned per mockup ═══════
              mix-blend-mode: screen removes the black bg cleanly
              Positions match mockup: piano leftmost, violin rightmost
          ═════════════════════════════════════════════════════ */}
          <div style={{ position:"absolute", inset:0, zIndex:5, pointerEvents:"none" }}>
            {STAGE_CHARACTERS.map(char => (
              <Link key={char.href} to={char.href}
                className="tm-char"
                aria-label={`מעבר לדף ${char.title}`}
                style={{
                  position:"absolute",
                  left: char.stage.left,
                  bottom: char.stage.bottom,
                  width: char.stage.width,
                  zIndex: char.stage.zIndex,
                  transform:"translateX(-50%)",
                  transformOrigin:"bottom center",
                  pointerEvents:"auto",
                  display:"block",
                }}>
                <img
                  src={CHAR_IMG[char.character]}
                  alt={char.title}
                  onError={e => {
                    const el = e.currentTarget as HTMLImageElement;
                    if (el.src !== FALLBACK[char.character])
                      el.src = FALLBACK[char.character];
                  }}
                  style={{
                    display:"block", width:"100%",
                    // KEY: screen blend removes black bg, reveals character on stage
                    mixBlendMode:"screen",
                    filter:"drop-shadow(0 12px 24px rgba(0,0,0,.3))",
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Speech bubble */}
          {bubble && !bubbleDone && (() => {
            const p = STAGE_CHARACTERS.find(c => c.character === "presenter");
            if (!p) return null;
            return (
              <div className="tm-bub" style={{
                position:"absolute",
                left:`calc(${p.stage.left} + ${p.stage.width} + 0.5%)`,
                bottom:"72%", zIndex:30, pointerEvents:"auto", direction:"rtl",
              }}>
                <div style={{
                  position:"relative", maxWidth:"215px",
                  background:"rgba(20,13,16,.96)",
                  border:`1px solid ${C.burg}`,
                  borderRadius:"15px", padding:"11px 14px",
                  fontSize:"13px", fontWeight:600, lineHeight:1.6, color:C.cream,
                  backdropFilter:"blur(8px)",
                  boxShadow:"0 8px 24px rgba(0,0,0,.35)",
                }}>
                  <span>ברוכים הבאים ל</span>
                  <span style={{color:C.gold}}>Toby music</span>
                  <div style={{
                    position:"absolute", top:"13px", left:"-7px",
                    width:"12px", height:"12px", transform:"rotate(45deg)",
                    background:"rgba(20,13,16,.96)",
                    borderBottom:`1px solid ${C.burg}`,
                    borderLeft:`1px solid ${C.burg}`,
                  }}/>
                  <button onClick={() => { setBubbleDone(true); setBubble(false); }}
                    aria-label="סגור"
                    style={{
                      position:"absolute", top:"-7px", right:"-7px",
                      width:"19px", height:"19px", borderRadius:"9999px",
                      background:C.card, border:`1px solid ${C.burg}`,
                      cursor:"pointer", fontSize:"10px", color:C.cream,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>✕</button>
                </div>
              </div>
            );
          })()}

          {/* Scroll cue */}
          <div style={{
            position:"absolute", bottom:"28px", left:"50%",
            transform:"translateX(-50%)", zIndex:10,
            display:"flex", flexDirection:"column", alignItems:"center", gap:"6px",
          }}>
            <span style={{ fontFamily:"'Heebo',sans-serif", fontSize:"11px",
              color:"rgba(201,169,97,.6)", letterSpacing:".12em" }}>גלגלי למטה</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              stroke="rgba(201,169,97,.5)" strokeWidth="1.5" strokeLinecap="round">
              <polyline points="2,5 8,11 14,5"/>
            </svg>
          </div>
        </section>

        {/* ═══ SCROLLABLE CONTENT — floats above fixed stage ══ */}
        <div style={{ position:"relative", zIndex:10 }}>

          {/* ── Guide presenter section ── */}
          <section id={GUIDE_SECTION_ID} style={{
            background:bg, padding:"60px 24px 68px", textAlign:"center",
          }}>
            <div style={{ maxWidth:"720px", margin:"0 auto" }}>
              <img src={presenterImg} alt="טובי — המדריך שלכם"
                style={{ width:"clamp(140px,16vw,220px)",
                  filter:"drop-shadow(0 18px 30px rgba(0,0,0,.2))",
                  marginBottom:"22px" }}/>
              <div style={{
                position:"relative",
                background:cardBg, border:`1px solid ${border}`,
                borderRadius:"22px", padding:"26px 30px",
                boxShadow: dk ? "0 8px 32px rgba(0,0,0,.45)" : "0 8px 32px rgba(107,31,42,.1)",
              }}>
                <div style={{
                  position:"absolute", top:"-9px", left:"50%",
                  transform:"translateX(-50%) rotate(45deg)",
                  width:"16px", height:"16px", background:cardBg,
                  borderTop:`1px solid ${border}`, borderLeft:`1px solid ${border}`,
                }}/>
                <p style={{ fontFamily:"'Heebo',sans-serif",
                  fontSize:"clamp(14px,1.4vw,18px)", lineHeight:"1.9", color:text }}>
                  {GUIDE_PRESENTER.welcomeText}
                </p>
              </div>
            </div>
          </section>

          {/* ── 3 Service cards ── */}
          <section style={{
            background: dk ? "rgba(8,5,10,.98)" : C.cardL,
            borderTop:`1px solid ${border}`, borderBottom:`1px solid ${border}`,
            padding:"64px 24px",
          }}>
            <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
              <div style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
                gap:"22px",
              }}>
                {SERVICES.map((svc,i) => (
                  <Link key={svc.href} to={svc.href} className="tm-card tm-up"
                    style={{
                      background:cardBg, border:`1px solid ${border}`,
                      borderRadius:"16px", padding:"36px 28px",
                      textAlign:"center", color:text,
                      animationDelay:`${i*.1}s`,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = C.gold;
                      el.style.boxShadow = dk
                        ? "0 10px 32px rgba(107,31,42,.4)"
                        : "0 10px 32px rgba(201,169,97,.22)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = border;
                      el.style.boxShadow = "none";
                    }}>
                    <div style={{ color:C.gold, marginBottom:"16px",
                      display:"flex", justifyContent:"center" }}>
                      <svc.Icon/>
                    </div>
                    <h3 style={{ fontFamily:"'Frank Ruhl Libre',serif",
                      fontSize:"22px", fontWeight:500, color:C.gold, marginBottom:"10px" }}>
                      {svc.title}
                    </h3>
                    <p style={{ fontFamily:"'Heebo',sans-serif",
                      fontSize:"15px", lineHeight:"1.7", color:muted }}>
                      {svc.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── Character showcase — each instrument presents its page ── */}
          <section style={{ background:bg, padding:"72px 24px 80px" }}>
            <div style={{ maxWidth:"1100px", margin:"0 auto" }}>

              {/* Section header */}
              <div style={{ textAlign:"center", marginBottom:"52px" }}>
                <p style={{ fontFamily:"'Heebo',sans-serif", fontSize:"11px",
                  fontWeight:600, letterSpacing:".18em", color:C.gold,
                  opacity:.8, marginBottom:"10px", textTransform:"uppercase" }}>
                  גלי את העולם שלנו
                </p>
                <h2 style={{ fontFamily:"'Frank Ruhl Libre',serif",
                  fontSize:"clamp(24px,3.2vw,40px)", fontWeight:500,
                  color:text, lineHeight:1.18 }}>
                  כל כלי מספר{" "}
                  <span style={{ background:FIRE,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                    backgroundClip:"text" }}>
                    סיפור אחר
                  </span>
                </h2>
                <div style={{ width:"56px", height:"2px", background:FIRE,
                  margin:"14px auto 0", borderRadius:"1px" }}/>
              </div>

              {/* Cards */}
              <div style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",
                gap:"18px",
              }}>
                {STAGE_CHARACTERS.map((char, i) => (
                  <Link key={char.href} to={char.href} className="tm-card tm-up"
                    style={{
                      background:cardBg, border:`1px solid ${border}`,
                      borderRadius:"16px", padding:"28px 22px 22px",
                      color:text, textDecoration:"none",
                      display:"flex", flexDirection:"column",
                      alignItems:"center", textAlign:"center",
                      animationDelay:`${i*.07}s`,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = C.gold;
                      el.style.boxShadow = dk
                        ? "0 10px 32px rgba(107,31,42,.4)"
                        : "0 10px 32px rgba(201,169,97,.22)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = border;
                      el.style.boxShadow = "none";
                    }}>

                    {/* Character image with screen blend */}
                    <div style={{
                      width:"clamp(80px,11vw,130px)",
                      marginBottom:"16px", flexShrink:0,
                      transition:"transform .35s cubic-bezier(.16,1,.3,1), filter .35s ease",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "translateY(-10px) scale(1.06)";
                      el.style.filter = "drop-shadow(0 0 16px rgba(201,169,97,.6))";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = "";
                      el.style.filter = "";
                    }}>
                      <img
                        src={CHAR_IMG[char.character]}
                        alt={char.title}
                        onError={e => {
                          const el = e.currentTarget as HTMLImageElement;
                          if (el.src !== FALLBACK[char.character])
                            el.src = FALLBACK[char.character];
                        }}
                        style={{
                          width:"100%", display:"block",
                          // Cards have dark bg so screen blend works here too
                          mixBlendMode:"screen",
                        }}
                      />
                    </div>

                    <h3 style={{ fontFamily:"'Frank Ruhl Libre',serif",
                      fontSize:"clamp(17px,1.9vw,21px)", fontWeight:500,
                      color:C.gold, marginBottom:"9px" }}>
                      {char.title}
                    </h3>
                    <p style={{ fontFamily:"'Heebo',sans-serif",
                      fontSize:"14px", lineHeight:"1.75", color:muted,
                      flexGrow:1, marginBottom:"18px" }}>
                      {char.quote}
                    </p>
                    <div style={{
                      display:"inline-flex", alignItems:"center", gap:"5px",
                      fontSize:"13px", fontWeight:600, color:C.gold,
                      fontFamily:"'Heebo',sans-serif",
                      padding:"6px 14px",
                      border:`1px solid ${C.burg}`,
                      borderRadius:"9999px",
                      transition:"border-color .2s, background .2s",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = C.gold;
                      el.style.background = dk
                        ? "rgba(201,169,97,.08)" : "rgba(107,31,42,.06)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = C.burg;
                      el.style.background = "transparent";
                    }}>
                      לדף {char.title}
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                        stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform:"rotate(180deg)" }}>
                        <line x1="10" y1="6.5" x2="3" y2="6.5"/>
                        <polyline points="6,3 3,6.5 6,10"/>
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ FOOTER ═══════════════════════════════════════════ */}
          <footer dir="rtl" style={{
            background:"#06040A",
            borderTop:"3px solid transparent",
            borderImage:`${FIRE} 1`,
            padding:"48px 32px 28px",
          }}>
            <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"28px", marginBottom:"28px" }}>

                {/* Brand */}
                <div style={{ minWidth:"260px", flex:"1.4", textAlign:"right" }}>
                  <img src={logoWhite} alt="TOBY music"
                    style={{ height:"72px", width:"auto", objectFit:"contain", marginBottom:"14px" }}/>
                  <p style={{ fontFamily:"'Frank Ruhl Libre',serif",
                    fontSize:"19px", fontWeight:600, color:"#fff", marginBottom:"10px" }}>
                    אומנות ואמינות. זו יצירה.
                  </p>
                  <p style={{ fontSize:"14px", lineHeight:"1.7",
                    color:"rgba(255,255,255,.6)", maxWidth:"300px" }}>
                    מוזיקה, יצירה ושירות מקצועי בשפה נקייה, מדויקת ומכובדת.
                  </p>
                  <Link to="/contact" style={{
                    display:"inline-flex", alignItems:"center",
                    marginTop:"18px",
                    border:"1px solid rgba(201,169,97,.35)",
                    borderRadius:"14px", padding:"9px 20px",
                    fontSize:"14px", fontWeight:500, color:"#fff",
                    textDecoration:"none", transition:"background .2s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.08)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background="transparent"}>
                    להצטרף לתפוצה
                  </Link>
                </div>

                {/* Nav columns */}
                {[
                  { title:"ניווט מהיר", links:[
                    {l:"דף הבית",    h:"/"            },
                    {l:"אודות",      h:"/about"       },
                    {l:"תזמורות",   h:"/orchestras"  },
                    {l:"הופעות",    h:"/performances" },
                    {l:"תלמידות",   h:"/students"    },
                    {l:"יצירת קשר", h:"/contact"     },
                  ]},
                  { title:"עוד באתר", links:[
                    {l:"בלוג",   h:"/blog"       },
                    {l:"יצירה",  h:"/creativity" },
                    {l:"צמיחה",  h:"/growth"     },
                    {l:"נסיעות", h:"/travel"     },
                    {l:"וולנס",  h:"/wellness"   },
                    {l:"מחברים", h:"/authors"    },
                  ]},
                ].map(col => (
                  <div key={col.title} style={{ minWidth:"160px", flex:1, textAlign:"right" }}>
                    <h3 style={{ fontFamily:"'Frank Ruhl Libre',serif",
                      fontSize:"15px", color:"#fff", marginBottom:"12px" }}>
                      {col.title}
                    </h3>
                    <nav style={{ display:"flex", flexDirection:"column", gap:"1px" }}>
                      {col.links.map(link => (
                        <Link key={link.h} to={link.h} style={{
                          fontSize:"14px", lineHeight:"2.2",
                          color:"rgba(255,255,255,.6)", textDecoration:"none",
                          transition:"color .2s",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color=C.gold}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.6)"}>
                          {link.l}
                        </Link>
                      ))}
                    </nav>
                  </div>
                ))}
              </div>

              <div style={{
                borderTop:"1px solid rgba(255,255,255,.09)", paddingTop:"16px",
                display:"flex", flexWrap:"wrap", justifyContent:"space-between",
                alignItems:"center", gap:"10px",
              }}>
                <div style={{ display:"flex", gap:"14px" }}>
                  {[{l:"פרטיות",h:"/privacy"},{l:"תנאים",h:"/terms"}].map(link => (
                    <Link key={link.h} to={link.h} style={{
                      fontSize:"12px", color:"rgba(255,255,255,.38)", textDecoration:"none" }}>
                      {link.l}
                    </Link>
                  ))}
                </div>
                <p style={{ fontSize:"12px", color:"rgba(255,255,255,.28)" }}>
                  © {new Date().getFullYear()} Toby Music. כל הזכויות שמורות.
                </p>
              </div>
            </div>
          </footer>
        </div>

        {/* ═══ FLOATING GUIDE ════════════════════════════════════ */}
        {marquee && (
          <div style={{ position:"fixed", bottom:"22px", right:"22px", zIndex:50,
            display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"7px" }}>
            {bubble && !bubbleDone && (
              <div className="tm-bub" style={{
                position:"relative", maxWidth:"270px",
                background:"rgba(20,13,16,.96)",
                border:`1px solid ${C.burg}`, borderRadius:"14px",
                padding:"13px 15px", fontSize:"13px", lineHeight:"1.7",
                color:C.cream, backdropFilter:"blur(8px)",
                boxShadow:"0 8px 24px rgba(0,0,0,.3)", direction:"rtl",
              }}>
                <button onClick={() => { setBubbleDone(true); setBubble(false); }}
                  aria-label="סגור"
                  style={{ position:"absolute", top:"-7px", left:"-7px",
                    width:"19px", height:"19px", borderRadius:"9999px",
                    background:C.card, border:`1px solid ${C.burg}`,
                    cursor:"pointer", fontSize:"10px", color:C.cream,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                <div style={{ position:"absolute", bottom:"-6px", right:"26px",
                  width:"12px", height:"12px", transform:"rotate(45deg)",
                  background:"rgba(20,13,16,.96)",
                  borderRight:`1px solid ${C.burg}`, borderBottom:`1px solid ${C.burg}` }}/>
                {GUIDE_PRESENTER.welcomeText}
              </div>
            )}
            <button onClick={() => setBubble(p => !p)}
              style={{ width:"56px", height:"56px", borderRadius:"9999px",
                overflow:"hidden", border:`2px solid ${C.gold}`,
                background:C.card, cursor:"pointer",
                boxShadow:"0 4px 16px rgba(0,0,0,.3)", transition:"transform .2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform="scale(1.1)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform=""}
              aria-label={GUIDE_PRESENTER.floatingLabel}>
              <img src={presenterImg} alt=""
                style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }}/>
            </button>
            <span style={{
              background:"rgba(20,13,16,.9)", border:`1px solid ${C.burg}`,
              borderRadius:"9999px", padding:"3px 11px",
              fontSize:"12px", fontWeight:600, color:C.cream, backdropFilter:"blur(6px)" }}>
              {GUIDE_PRESENTER.floatingLabel}
            </span>
          </div>
        )}

      </div>
    </>
  );
}
