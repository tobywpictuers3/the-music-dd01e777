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
import logoWhite from "@/assets/whitelogo.png";
import logoBlack from "@/assets/homepage/brand/logo-black.jpg";
import stageDark  from "@/assets/homepage/stage/darkstage.png";
import stageLight from "@/assets/homepage/stage/lightstage.png";
import presenterImg from "@/assets/homepage/presenter/presenter.png";

// Drive characters — uploaded to public/assets/
// Fallback to existing repo characters
import signPiano    from "@/assets/homepage/characters-signs/piano.png";
import signEguitar  from "@/assets/homepage/characters-signs/eguitar.png";
import signGuitar   from "@/assets/homepage/characters-signs/guitar.png";
import signDrums    from "@/assets/homepage/characters-signs/drums.png";
import signSax      from "@/assets/homepage/characters-signs/saxophone.png";
import signViolin   from "@/assets/homepage/characters-signs/violin.png";

const DRIVE: Record<string, string> = {
  piano: "/assets/piano-char.png",
  eguitar: "/assets/guitar-char.png",
  guitar: "/assets/guitar-char.png",
  drums: "/assets/note-char.png",
  saxophone: "/assets/sax-char.png",
  violin: "/assets/violin-char.png",
  presenter: "/assets/note-char.png",
};
const FALLBACK: Record<string, string> = {
  piano: signPiano, eguitar: signEguitar, guitar: signGuitar,
  drums: signDrums, saxophone: signSax, violin: signViolin,
  presenter: presenterImg,
};

// ── Palette ──────────────────────────────────────────────────
const P = {
  bg:       "#0F0F12",
  bgDeep:   "#08060A",
  card:     "#140D10",
  cardHov:  "#1C1015",
  burg:     "#6B1F2A",
  wine:     "#8B2A37",
  gold:     "#C9A961",
  glow:     "#FFE5A0",
  cream:    "#F5F1EA",
  muted:    "rgba(245,241,234,0.58)",
  // light mode overrides
  bgL:      "#F5F1EA",
  cardL:    "#FFFFFF",
  textL:    "#0F0F12",
  borderL:  "#C9A961",
  mutedL:   "rgba(15,15,18,0.55)",
};
const FIRE = `linear-gradient(110deg,${P.wine} 0%,${P.gold} 30%,${P.glow} 50%,${P.gold} 70%,${P.burg} 100%)`;

// ── Service cards (3 כרטיסיות לפי מסמך ההסכמות) ─────────────
// אייקוני SVG קוויים — דו-ממדיים, זהב מט, ללא נפח
const IcoPerformances = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="18" cy="22" rx="12" ry="5"/>
    <line x1="18" y1="17" x2="18" y2="6"/>
    <path d="M14 9 Q18 5 22 9"/>
    <circle cx="18" cy="22" r="2" fill="currentColor" stroke="none"/>
  </svg>
);
const IcoSheets = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="4" width="22" height="28" rx="2"/>
    <line x1="12" y1="11" x2="24" y2="11"/>
    <line x1="12" y1="16" x2="24" y2="16"/>
    <line x1="12" y1="21" x2="19" y2="21"/>
    <circle cx="22" cy="26" r="2"/>
    <line x1="24" y1="20" x2="24" y2="26"/>
  </svg>
);
const IcoStudents = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 L32 12 L18 18 L4 12 Z"/>
    <path d="M8 14 L8 24 Q18 30 28 24 L28 14"/>
    <line x1="32" y1="12" x2="32" y2="22"/>
  </svg>
);

const SERVICE_CARDS = [
  {
    icon: <IcoPerformances />,
    title: "הופעות",
    desc: "אירועים, קונצרטים ומופעים",
    href: "/performances",
  },
  {
    icon: <IcoSheets />,
    title: "תווים וסדנאות",
    desc: "תווים איכותיים וסדנאות מעשירות",
    href: "/sheets",
  },
  {
    icon: <IcoStudents />,
    title: "ליווי אישי",
    desc: "הדרכה וחניכה בהתאמה אישית",
    href: "/students",
  },
];

// ─────────────────────────────────────────────────────────────
type Theme = "dark" | "light";

export default function IndexNew() {
  const [theme, setTheme]           = useState<Theme>("dark");
  const [marquee, setMarquee]       = useState(false);
  const [bubble, setBubble]         = useState(false);
  const [bubbleDone, setBubbleDone] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const dk = theme === "dark";

  // Load saved theme — default dark
  useEffect(() => {
    if (localStorage.getItem("toby-theme") === "light") setTheme("light");
  }, []);

  const toggleTheme = () => {
    const next: Theme = dk ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("toby-theme", next);
  };

  // Marquee / bubble on scroll
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

  // ── Derived ──────────────────────────────────────────────────
  const bg      = dk ? P.bg   : P.bgL;
  const cardBg  = dk ? P.card : P.cardL;
  const text    = dk ? P.cream : P.textL;
  const border  = dk ? P.burg : P.borderL;
  const muted   = dk ? P.muted : P.mutedL;
  const logo    = dk ? logoWhite : logoBlack;
  const stageSrc = dk ? stageDark : stageLight;

  // ── Inline image fallback ─────────────────────────────────────
  const imgSrc = (key: string) => DRIVE[key] ?? FALLBACK[key];
  const onErr  = (key: string) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    if (el.src !== FALLBACK[key]) el.src = FALLBACK[key];
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700&family=Heebo:wght@300;400;500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${bg};font-family:'Heebo',sans-serif;direction:rtl;overflow-x:hidden;transition:background .35s}

        @keyframes tm-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .tm-mq{animation:tm-marquee 26s linear infinite;display:flex;align-items:center;width:max-content;white-space:nowrap}

        @keyframes tm-sparkle{0%,100%{opacity:0;transform:scale(0) rotate(0deg)}20%{opacity:1;transform:scale(1) rotate(30deg)}80%{opacity:1;transform:scale(.8) rotate(-20deg)}}
        .tm-spark{position:absolute;border-radius:9999px;background:${P.gold};box-shadow:0 0 6px 2px rgba(201,169,97,.55);animation:tm-sparkle 1.6s ease-in-out infinite;pointer-events:none}

        @keyframes tm-logo{0%{opacity:0;transform:scale(.7) translateY(-18px);filter:blur(4px)}60%{opacity:1;transform:scale(1.04) translateY(2px);filter:blur(0)}100%{opacity:1;transform:scale(1) translateY(0)}}
        .tm-logo-in{animation:tm-logo 1.1s cubic-bezier(.16,1,.3,1) forwards}

        @keyframes tm-bubble{0%{opacity:0;transform:scale(.7) translateY(10px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        .tm-bubble-in{animation:tm-bubble .4s cubic-bezier(.16,1,.3,1) forwards}

        .tm-char{transition:transform .35s cubic-bezier(.16,1,.3,1),filter .35s ease;cursor:pointer}
        .tm-char:hover{transform:translateY(-14px) scale(1.07)!important;filter:drop-shadow(0 0 18px rgba(201,169,97,.65))!important}

        .tm-card{text-decoration:none;display:block;transition:transform .25s ease,box-shadow .25s ease,border-color .2s}
        .tm-card:hover{transform:translateY(-4px)}

        @keyframes tm-spot{0%,100%{opacity:.11}50%{opacity:.22}}
        .tm-spot{animation:tm-spot 4s ease-in-out infinite}

        @keyframes tm-slide-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        .tm-appear{animation:tm-slide-up .55s cubic-bezier(.22,1,.36,1) both}
      `}</style>

      <div style={{background:bg,color:text,minHeight:"100vh",transition:"background .35s,color .35s"}}>

        {/* ══ MARQUEE ════════════════════════════════════════════ */}
        {marquee && (
          <div style={{position:"fixed",top:0,left:0,right:0,zIndex:60,
            background: dk ? P.burg : P.cardL,
            borderBottom:`1px solid ${border}`,
            padding:"9px 0",overflow:"hidden"}}>
            <div className="tm-mq">
              {[...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((item,i)=>(
                <span key={i} style={{fontFamily:"'Heebo',sans-serif",fontWeight:600,fontSize:"13px",
                  letterSpacing:".15em",color: dk ? P.glow : P.burg,padding:"0 20px"}}>
                  {item}<span style={{marginRight:"20px",opacity:.4}}>•</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ══ NAV ════════════════════════════════════════════════ */}
        <header style={{position:"fixed",top:0,left:0,right:0,zIndex:50,padding:"10px 20px",direction:"rtl"}}>
          <div style={{maxWidth:"1200px",margin:"0 auto",
            background: dk ? "rgba(15,15,18,.93)" : "rgba(245,241,234,.93)",
            backdropFilter:"blur(14px)",
            border:`1px solid ${border}`,
            borderRadius:"9999px",height:"54px",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"0 18px",
            boxShadow: dk ? "0 4px 24px rgba(0,0,0,.45)" : "0 4px 24px rgba(107,31,42,.12)"}}>

            {/* Logo */}
            <Link to="/" style={{display:"flex",alignItems:"center",flexShrink:0}}>
              <img src={logo} alt="TOBY music" style={{height:"34px",width:"auto",objectFit:"contain"}}/>
            </Link>

            {/* Nav links */}
            <nav style={{display:"flex",gap:"2px",flex:1,justifyContent:"center"}}>
              {[
                {label:"בית",href:"/"},
                {label:"תזמורות",href:"/orchestras"},
                {label:"הופעות",href:"/performances"},
                {label:"תלמידות",href:"/students"},
                {label:"תווים",href:"/sheets"},
                {label:"אודות",href:"/about"},
                {label:"בלוג",href:"/blog"},
              ].map(l=>(
                <Link key={l.href} to={l.href}
                  style={{fontFamily:"'Heebo',sans-serif",fontSize:"14px",fontWeight:500,
                    color:text,textDecoration:"none",padding:"6px 11px",borderRadius:"9999px",
                    transition:"background .18s,color .18s"}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.color=P.gold;el.style.background=dk?"rgba(201,169,97,.1)":"rgba(107,31,42,.07)"}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.color=text;el.style.background="transparent"}}
                >{l.label}</Link>
              ))}
            </nav>

            {/* Right */}
            <div style={{display:"flex",alignItems:"center",gap:"8px",flexShrink:0}}>
              {/* Theme toggle */}
              <button onClick={toggleTheme}
                aria-label={dk?"מצב יום":"מצב לילה"}
                style={{width:"34px",height:"34px",borderRadius:"9999px",
                  border:`1px solid ${border}`,background:"transparent",
                  color:P.gold,fontSize:"15px",cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color .2s"}}>
                {dk?"☀":"🌙"}
              </button>
              {/* CTA */}
              <Link to="/contact"
                style={{background:`linear-gradient(110deg,${P.burg},${P.wine})`,
                  color:"#fff",fontFamily:"'Heebo',sans-serif",fontWeight:700,fontSize:"14px",
                  padding:"8px 18px",borderRadius:"9999px",textDecoration:"none",
                  boxShadow:"0 2px 10px rgba(107,31,42,.4)",transition:"filter .2s,transform .2s"}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.filter="brightness(1.12)";el.style.transform="translateY(-1px)"}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.filter="";el.style.transform=""}}
              >צור קשר</Link>
            </div>
          </div>
        </header>

        {/* ══ HERO + STAGE ═══════════════════════════════════════ */}
        <section ref={heroRef} id={HOME_HERO_ID}
          style={{position:"relative",overflow:"hidden",minHeight:"100vh",paddingTop:"74px"}}>

          {/* Stage background */}
          <div style={{position:"absolute",inset:0,zIndex:0}}>
            <img src={stageSrc} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            {/* Dark zones: top for text legibility, bottom for fade */}
            <div style={{position:"absolute",inset:0,
              background: dk
                ? "linear-gradient(180deg,#0F0F12 0%,rgba(15,15,18,.72) 26%,rgba(15,15,18,.06) 52%,rgba(15,15,18,0) 66%,#0F0F12 100%)"
                : "linear-gradient(180deg,#F5F1EA 0%,rgba(245,241,234,.65) 26%,rgba(245,241,234,0) 52%,rgba(245,241,234,0) 66%,#F5F1EA 100%)"}}/>
          </div>

          {/* Graphic curtains — 2D, not 3D */}
          {/* Left curtain */}
          <div aria-hidden="true" style={{position:"absolute",top:0,left:0,width:"10%",height:"100%",
            background:"linear-gradient(90deg,#3D0A0A 0%,#6B1010 50%,transparent 100%)",zIndex:2,pointerEvents:"none"}}/>
          <div aria-hidden="true" style={{position:"absolute",top:0,left:0,width:"8%",height:"58%",
            background:"linear-gradient(135deg,#8B1A1A 0%,#6B1010 100%)",
            clipPath:"ellipse(100% 100% at 0% 0%)",zIndex:3,pointerEvents:"none"}}/>
          <div aria-hidden="true" style={{position:"absolute",top:0,left:"8%",width:"1.5px",height:"58%",
            background:`linear-gradient(180deg,${P.gold} 0%,${P.burg} 100%)`,zIndex:4,pointerEvents:"none"}}/>
          {/* Right curtain */}
          <div aria-hidden="true" style={{position:"absolute",top:0,right:0,width:"10%",height:"100%",
            background:"linear-gradient(-90deg,#3D0A0A 0%,#6B1010 50%,transparent 100%)",zIndex:2,pointerEvents:"none"}}/>
          <div aria-hidden="true" style={{position:"absolute",top:0,right:0,width:"8%",height:"58%",
            background:"linear-gradient(-135deg,#8B1A1A 0%,#6B1010 100%)",
            clipPath:"ellipse(100% 100% at 100% 0%)",zIndex:3,pointerEvents:"none"}}/>
          <div aria-hidden="true" style={{position:"absolute",top:0,right:"8%",width:"1.5px",height:"58%",
            background:`linear-gradient(180deg,${P.gold} 0%,${P.burg} 100%)`,zIndex:4,pointerEvents:"none"}}/>

          {/* Spotlight beams */}
          {[{l:"18%",r:-22,d:"0s",h:"275px"},{l:"32%",r:-8,d:".8s",h:"295px"},{l:"50%",r:0,d:"1.6s",h:"305px"},{l:"68%",r:8,d:".8s",h:"295px"},{l:"82%",r:22,d:"0s",h:"275px"}]
            .map((s,i)=>(
              <div key={i} className="tm-spot" aria-hidden="true" style={{
                position:"absolute",top:0,left:s.l,width:"2px",height:s.h,
                transformOrigin:"top center",transform:`translateX(-50%) rotate(${s.r}deg)`,
                background:"linear-gradient(180deg,rgba(201,169,97,.17) 0%,transparent 100%)",
                animationDelay:s.d,zIndex:1,pointerEvents:"none"}}/>
            ))}

          {/* ── HERO TEXT — sits above the stage in the dark zone ── */}
          <div style={{position:"relative",zIndex:10,textAlign:"center",padding:"56px 80px 0"}}>
            {/* Animated logo */}
            <img src={logo} alt="TOBY music" className="tm-logo-in"
              style={{height:"clamp(64px,9vw,115px)",width:"auto",objectFit:"contain",marginBottom:"22px",
                filter: dk ? "drop-shadow(0 6px 28px rgba(0,0,0,.45))" : "drop-shadow(0 4px 16px rgba(107,31,42,.2))"}}/>

            {/* H1 */}
            <h1 style={{fontFamily:"'Frank Ruhl Libre',serif",
              fontSize:"clamp(34px,5.2vw,66px)",fontWeight:500,color:text,lineHeight:1.12,marginBottom:"14px",
              filter:"drop-shadow(0 2px 14px rgba(0,0,0,.35))"}}>
              {HERO_TEXT.subtitle}{" "}
              <a href={`#${GUIDE_SECTION_ID}`} style={{position:"relative",display:"inline-block",
                background:FIRE,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                backgroundClip:"text",textDecoration:"none"}}>
                {HERO_TEXT.linkWord}
                {[
                  {top:"-9px",right:"-6px",w:8,d:"0s"},
                  {top:"-3px",left:"-9px",w:6,d:".4s"},
                  {bottom:"-7px",right:"3px",w:5,d:".8s"},
                  {top:"2px",right:"-13px",w:7,d:"1.2s"},
                ].map((sp,i)=>(
                  <span key={i} className="tm-spark" aria-hidden="true"
                    style={{...sp,width:sp.w,height:sp.w,animationDelay:sp.d}}/>
                ))}
              </a>
            </h1>

            {/* Support line */}
            <p style={{fontFamily:"'Heebo',sans-serif",fontSize:"clamp(13px,1.4vw,19px)",
              color: dk ? "rgba(245,241,234,.72)" : "rgba(15,15,18,.62)",
              background: dk ? "rgba(245,241,234,.06)" : "rgba(107,31,42,.06)",
              backdropFilter:"blur(8px)",borderRadius:"9999px",
              display:"inline-block",padding:"6px 20px",marginBottom:"9px"}}>
              {HERO_TEXT.supportLine}
            </p>

            {/* Slogan */}
            <p style={{fontFamily:"'Frank Ruhl Libre',serif",
              fontSize:"clamp(15px,1.7vw,23px)",fontWeight:700,color:text}}>
              {HERO_TEXT.sloganPrefix}{" "}
              <span style={{background:FIRE,WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                {HERO_TEXT.sloganAccent}
              </span>
            </p>
          </div>

          {/* ── STAGE CHARACTERS — positioned on stage ── */}
          <div style={{position:"absolute",inset:0,zIndex:5,pointerEvents:"none"}}>
            {STAGE_CHARACTERS.map(char=>(
              <Link key={char.href} to={char.href} className="tm-char"
                style={{position:"absolute",left:char.stage.left,bottom:char.stage.bottom,
                  width:char.stage.width,zIndex:char.stage.zIndex,
                  transform:"translateX(-50%)",transformOrigin:"bottom center",
                  pointerEvents:"auto",display:"block"}}
                aria-label={`מעבר לדף ${char.title}`}>
                <div style={{position:"relative"}}>
                  <img src={imgSrc(char.character)} alt={char.title}
                    style={{display:"block",width:"100%"}}
                    onError={onErr(char.character)}/>
                  {char.labelMode==="badge" ? (
                    <div style={{position:"absolute",bottom:"8%",left:"50%",
                      transform:"translateX(-50%)",
                      background: dk ? "rgba(15,15,18,.88)" : "rgba(245,241,234,.92)",
                      border:`1px solid ${border}`,borderRadius:"9999px",
                      padding:"4px 13px",fontSize:"clamp(10px,.9vw,13px)",fontWeight:700,
                      color: dk ? P.gold : P.burg,whiteSpace:"nowrap",backdropFilter:"blur(6px)"}}>
                      {char.title}
                    </div>
                  ) : (
                    <div style={{position:"absolute",top:char.signBox.top,left:char.signBox.left,
                      width:char.signBox.width,height:char.signBox.height,
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontFamily:"'Frank Ruhl Libre',serif",
                        fontSize:"clamp(11px,1.3vw,20px)",fontWeight:700,color:P.cream,
                        textAlign:"center",lineHeight:1.2,
                        filter:"drop-shadow(0 1px 3px rgba(0,0,0,.7))"}}>
                        {char.title}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}

            {/* Speech bubble */}
            {bubble && !bubbleDone && (()=>{
              const p = STAGE_CHARACTERS.find(c=>c.character==="presenter");
              if(!p) return null;
              return (
                <div className="tm-bubble-in" style={{position:"absolute",
                  left:`calc(${p.stage.left} + ${p.stage.width} + 0.5%)`,
                  bottom:"72%",zIndex:30,pointerEvents:"auto",direction:"rtl"}}>
                  <div style={{position:"relative",maxWidth:"215px",
                    background: dk?"rgba(20,13,16,.96)":"rgba(245,241,234,.96)",
                    border:`1px solid ${border}`,borderRadius:"15px",
                    padding:"11px 14px",fontSize:"13px",fontWeight:600,lineHeight:1.6,
                    color:text,backdropFilter:"blur(8px)",
                    boxShadow:"0 8px 24px rgba(0,0,0,.32)"}}>
                    <span>ברוכים הבאים ל</span>
                    <span style={{color:P.gold}}>Toby music</span>
                    <div style={{position:"absolute",top:"13px",left:"-7px",
                      width:"12px",height:"12px",transform:"rotate(45deg)",
                      background: dk?"rgba(20,13,16,.96)":"rgba(245,241,234,.96)",
                      borderBottom:`1px solid ${border}`,borderLeft:`1px solid ${border}`}}/>
                    <button onClick={()=>{setBubbleDone(true);setBubble(false)}}
                      aria-label="סגור"
                      style={{position:"absolute",top:"-7px",right:"-7px",
                        width:"19px",height:"19px",borderRadius:"9999px",
                        background: dk?P.card:"#e0d8d0",
                        border:`1px solid ${border}`,cursor:"pointer",fontSize:"10px",
                        color:text,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Bottom fade */}
          <div aria-hidden="true" style={{position:"absolute",bottom:0,left:0,right:0,
            height:"100px",zIndex:6,pointerEvents:"none",
            background:`linear-gradient(180deg,transparent,${bg})`}}/>
        </section>

        {/* ══ GUIDE PRESENTER ════════════════════════════════════ */}
        <section id={GUIDE_SECTION_ID}
          style={{background:bg,padding:"52px 24px 60px",textAlign:"center"}}>
          <div style={{maxWidth:"720px",margin:"0 auto"}}>
            <img src={presenterImg} alt="טובי — המדריך שלכם"
              style={{width:"clamp(150px,17vw,230px)",
                filter:"drop-shadow(0 18px 32px rgba(0,0,0,.18))",marginBottom:"24px"}}/>
            <div style={{position:"relative",background:cardBg,border:`1px solid ${border}`,
              borderRadius:"22px",padding:"26px 30px",
              boxShadow: dk?"0 8px 32px rgba(0,0,0,.4)":"0 8px 32px rgba(107,31,42,.1)"}}>
              <div style={{position:"absolute",top:"-9px",left:"50%",transform:"translateX(-50%) rotate(45deg)",
                width:"16px",height:"16px",background:cardBg,
                borderTop:`1px solid ${border}`,borderLeft:`1px solid ${border}`}}/>
              <p style={{fontFamily:"'Heebo',sans-serif",fontSize:"clamp(14px,1.4vw,18px)",
                lineHeight:"1.9",color:text}}>
                {GUIDE_PRESENTER.welcomeText}
              </p>
            </div>
          </div>
        </section>

        {/* ══ THREE SERVICE CARDS (per design document) ══════════ */}
        <section style={{background: dk?"rgba(8,6,10,.98)":P.cardL,
          borderTop:`1px solid ${border}`,borderBottom:`1px solid ${border}`,
          padding:"60px 24px"}}>
          <div style={{maxWidth:"1000px",margin:"0 auto"}}>
            <div style={{display:"grid",
              gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"22px"}}>
              {SERVICE_CARDS.map(card=>(
                <Link key={card.href} to={card.href} className="tm-card"
                  style={{background:cardBg,border:`1px solid ${border}`,
                    borderRadius:"14px",padding:"36px 28px",textAlign:"center",
                    color:text,position:"relative",overflow:"hidden"}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;
                    el.style.borderColor=P.gold;
                    el.style.boxShadow=dk?"0 8px 28px rgba(107,31,42,.35)":"0 8px 28px rgba(201,169,97,.22)"}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;
                    el.style.borderColor=border;el.style.boxShadow="none"}}>
                  {/* Gold top accent line on hover — via pseudo using ::before workaround */}
                  <div aria-hidden="true" style={{position:"absolute",top:0,left:0,right:0,height:"2px",
                    background:`linear-gradient(90deg,${P.burg},${P.gold},${P.burg})`,opacity:0,
                    transition:"opacity .2s"}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.opacity="1"}/>

                  {/* Icon — 2D line, gold */}
                  <div style={{color:P.gold,marginBottom:"16px",display:"flex",
                    justifyContent:"center",opacity:.9}}>
                    {card.icon}
                  </div>

                  <h3 style={{fontFamily:"'Frank Ruhl Libre',serif",fontSize:"22px",fontWeight:500,
                    color:P.gold,marginBottom:"10px"}}>
                    {card.title}
                  </h3>
                  <p style={{fontFamily:"'Heebo',sans-serif",fontSize:"15px",lineHeight:"1.7",
                    color:muted}}>
                    {card.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* ══ CHARACTER SHOWCASE — each instrument presents its page ══ */}
        <section style={{
          background: bg,
          padding: "72px 24px 80px",
        }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

            {/* Section heading */}
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={{
                fontFamily: "'Heebo', sans-serif",
                fontSize: "12px", fontWeight: 600,
                letterSpacing: ".18em", color: P.gold,
                opacity: .8, marginBottom: "10px",
                textTransform: "uppercase",
              }}>גלי את העולם שלנו</p>
              <h2 style={{
                fontFamily: "'Frank Ruhl Libre', serif",
                fontSize: "clamp(26px, 3.5vw, 42px)",
                fontWeight: 500, color: text, lineHeight: 1.15,
              }}>
                כל כלי מספר{" "}
                <span style={{
                  background: FIRE,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>סיפור אחר</span>
              </h2>
              {/* Gold divider line */}
              <div style={{
                width: "60px", height: "2px",
                background: FIRE,
                margin: "16px auto 0",
                borderRadius: "1px",
              }} />
            </div>

            {/* Cards grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}>
              {STAGE_CHARACTERS.map((char) => {
                const driveImg = DRIVE[char.character];
                const fallbackImg = FALLBACK[char.character];
                return (
                  <Link
                    key={char.href}
                    to={char.href}
                    className="tm-card"
                    style={{
                      background: cardBg,
                      border: `1px solid ${border}`,
                      borderRadius: "16px",
                      padding: "28px 24px 24px",
                      textDecoration: "none",
                      color: text,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: "0",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = P.gold;
                      el.style.boxShadow = dk
                        ? "0 10px 32px rgba(107,31,42,.4)"
                        : "0 10px 32px rgba(201,169,97,.22)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = border;
                      el.style.boxShadow = "none";
                    }}
                  >
                    {/* Top accent line */}
                    <div aria-hidden="true" style={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      height: "2px",
                      background: `linear-gradient(90deg, ${P.burg}, ${P.gold}, ${P.burg})`,
                      opacity: 0,
                      transition: "opacity .2s",
                    }} />

                    {/* Character image */}
                    <div style={{
                      width: "clamp(90px, 12vw, 140px)",
                      marginBottom: "18px",
                      flexShrink: 0,
                      filter: "drop-shadow(0 10px 22px rgba(0,0,0,.28))",
                      transition: "transform .35s cubic-bezier(.16,1,.3,1), filter .35s ease",
                    }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(-10px) scale(1.06)";
                        el.style.filter = "drop-shadow(0 0 18px rgba(201,169,97,.6))";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "";
                        el.style.filter = "drop-shadow(0 10px 22px rgba(0,0,0,.28))";
                      }}
                    >
                      <img
                        src={driveImg}
                        alt={char.title}
                        style={{ width: "100%", display: "block" }}
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          if (el.src !== fallbackImg) el.src = fallbackImg;
                        }}
                      />
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: "'Frank Ruhl Libre', serif",
                      fontSize: "clamp(18px, 2vw, 22px)",
                      fontWeight: 500,
                      color: P.gold,
                      marginBottom: "10px",
                      transition: "color .2s",
                    }}>
                      {char.title}
                    </h3>

                    {/* Quote — exact original text */}
                    <p style={{
                      fontFamily: "'Heebo', sans-serif",
                      fontSize: "14px",
                      lineHeight: "1.75",
                      color: muted,
                      flexGrow: 1,
                      marginBottom: "20px",
                    }}>
                      {char.quote}
                    </p>

                    {/* CTA arrow link */}
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: P.gold,
                      fontFamily: "'Heebo', sans-serif",
                      padding: "7px 16px",
                      border: `1px solid ${P.burg}`,
                      borderRadius: "9999px",
                      transition: "border-color .2s, background .2s",
                    }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = P.gold;
                        el.style.background = dk
                          ? "rgba(201,169,97,.08)"
                          : "rgba(107,31,42,.06)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = P.burg;
                        el.style.background = "transparent";
                      }}
                    >
                      לדף {char.title}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: "rotate(180deg)" }}>
                        <line x1="11" y1="7" x2="3" y2="7" />
                        <polyline points="6,4 3,7 6,10" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ FOOTER ═════════════════════════════════════════════ */}
        <footer dir="rtl" style={{background:"#06040A",
          borderTop:"3px solid transparent",
          borderImage:`${FIRE} 1`,
          padding:"48px 32px 28px",
          backgroundImage:`radial-gradient(circle at top right,rgba(201,169,97,.12),transparent 28%),radial-gradient(circle at top left,rgba(107,31,42,.18),transparent 26%)`}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"28px",marginBottom:"28px"}}>
              {/* Brand */}
              <div style={{minWidth:"260px",flex:"1.4",textAlign:"right"}}>
                <img src={logoWhite} alt="TOBY music" style={{height:"76px",width:"auto",objectFit:"contain",marginBottom:"14px"}}/>
                <p style={{fontFamily:"'Frank Ruhl Libre',serif",fontSize:"19px",fontWeight:600,color:"#fff",marginBottom:"10px"}}>
                  אומנות ואמינות. זו יצירה.
                </p>
                <p style={{fontSize:"14px",lineHeight:"1.7",color:"rgba(255,255,255,.6)",maxWidth:"300px"}}>
                  מוזיקה, יצירה ושירות מקצועי בשפה נקייה, מדויקת ומכובדת.
                </p>
                <Link to="/contact" style={{display:"inline-flex",alignItems:"center",
                  marginTop:"18px",border:"1px solid rgba(201,169,97,.35)",
                  borderRadius:"14px",padding:"9px 20px",fontSize:"14px",fontWeight:500,
                  color:"#fff",textDecoration:"none",transition:"background .2s"}}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.08)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                  להצטרף לתפוצה
                </Link>
              </div>

              {/* Nav sections */}
              {[
                {title:"ניווט מהיר",links:[
                  {l:"דף הבית",h:"/"},{l:"אודות",h:"/about"},
                  {l:"תזמורות",h:"/orchestras"},{l:"הופעות",h:"/performances"},
                  {l:"תלמידות",h:"/students"},{l:"יצירת קשר",h:"/contact"},
                ]},
                {title:"עוד באתר",links:[
                  {l:"בלוג",h:"/blog"},{l:"יצירה",h:"/creativity"},
                  {l:"צמיחה",h:"/growth"},{l:"נסיעות",h:"/travel"},
                  {l:"וולנס",h:"/wellness"},{l:"מחברים",h:"/authors"},
                ]},
              ].map(col=>(
                <div key={col.title} style={{minWidth:"160px",flex:1,textAlign:"right"}}>
                  <h3 style={{fontFamily:"'Frank Ruhl Libre',serif",fontSize:"15px",color:"#fff",marginBottom:"12px"}}>
                    {col.title}
                  </h3>
                  <nav style={{display:"flex",flexDirection:"column",gap:"1px"}}>
                    {col.links.map(link=>(
                      <Link key={link.h} to={link.h}
                        style={{fontSize:"14px",lineHeight:"2.2",color:"rgba(255,255,255,.6)",textDecoration:"none",transition:"color .2s"}}
                        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color=P.gold}
                        onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.6)"}>
                        {link.l}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            <div style={{borderTop:"1px solid rgba(255,255,255,.09)",paddingTop:"16px",
              display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",gap:"10px"}}>
              <div style={{display:"flex",gap:"14px"}}>
                {[{l:"פרטיות",h:"/privacy"},{l:"תנאים",h:"/terms"}].map(link=>(
                  <Link key={link.h} to={link.h}
                    style={{fontSize:"12px",color:"rgba(255,255,255,.38)",textDecoration:"none"}}>
                    {link.l}
                  </Link>
                ))}
              </div>
              <p style={{fontSize:"12px",color:"rgba(255,255,255,.28)"}}>
                © {new Date().getFullYear()} Toby Music. כל הזכויות שמורות.
              </p>
            </div>
          </div>
        </footer>

        {/* ══ FLOATING GUIDE ═════════════════════════════════════ */}
        {marquee && (
          <div style={{position:"fixed",bottom:"22px",right:"22px",zIndex:50,
            display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"7px"}}>
            {bubble && !bubbleDone && (
              <div className="tm-bubble-in" style={{position:"relative",maxWidth:"270px",
                background: dk?"rgba(20,13,16,.96)":"rgba(245,241,234,.96)",
                border:`1px solid ${border}`,borderRadius:"14px",
                padding:"13px 15px",fontSize:"13px",lineHeight:"1.7",color:text,
                backdropFilter:"blur(8px)",boxShadow:"0 8px 24px rgba(0,0,0,.3)",direction:"rtl"}}>
                <button onClick={()=>{setBubbleDone(true);setBubble(false)}} aria-label="סגור"
                  style={{position:"absolute",top:"-7px",left:"-7px",width:"19px",height:"19px",
                    borderRadius:"9999px",background: dk?P.card:"#e0d8d0",
                    border:`1px solid ${border}`,cursor:"pointer",fontSize:"10px",
                    color:text,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                <div style={{position:"absolute",bottom:"-6px",right:"26px",width:"12px",height:"12px",
                  transform:"rotate(45deg)",background: dk?"rgba(20,13,16,.96)":"rgba(245,241,234,.96)",
                  borderRight:`1px solid ${border}`,borderBottom:`1px solid ${border}`}}/>
                {GUIDE_PRESENTER.welcomeText}
              </div>
            )}
            <button onClick={()=>setBubble(p=>!p)}
              style={{width:"56px",height:"56px",borderRadius:"9999px",overflow:"hidden",
                border:`2px solid ${P.gold}`,background:dk?P.card:P.cardL,
                cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,.3)",transition:"transform .2s"}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform="scale(1.1)"}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform=""}
              aria-label={GUIDE_PRESENTER.floatingLabel}>
              <img src={presenterImg} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}}/>
            </button>
            <span style={{background: dk?"rgba(20,13,16,.9)":"rgba(245,241,234,.9)",
              border:`1px solid ${border}`,borderRadius:"9999px",
              padding:"3px 11px",fontSize:"12px",fontWeight:600,color:text,backdropFilter:"blur(6px)"}}>
              {GUIDE_PRESENTER.floatingLabel}
            </span>
          </div>
        )}

      </div>
    </>
  );
}
