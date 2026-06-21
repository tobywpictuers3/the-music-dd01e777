/* v43 */ import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import whitelogo from "@/assets/whitelogo.png";
import logoBlack from "@/assets/homepage/brand/logo-black.jpg";

import imgPresenter from "@/assets/homepage/presenter/presenter.png";
import imgDrums     from "@/assets/homepage/characters/drums.png";
import imgPiano     from "@/assets/homepage/characters/piano.png";
import imgSaxophone from "@/assets/homepage/characters/saxophone.png";
import imgViolin    from "@/assets/homepage/characters/violin.png";
import imgGuitar    from "@/assets/homepage/characters/guitar.png";
import imgFlute     from "@/assets/homepage/characters/flute.png";

const NAV_ITEMS = [
  { label: "בית",      href: "/",            img: null,         quote: null },
  { label: "תזמורות", href: "/orchestras",   img: imgDrums,     quote: "הרכבים מותאמים לכל אירוע — מהרכב קטן עד הפקה מלאה." },
  { label: "הופעות",  href: "/performances", img: imgSaxophone, quote: "מוזיקה חיה עם התאמה לקהל ולאופי האירוע." },
  { label: "תלמידות", href: "/students",     img: imgPiano,     quote: "26 שנות הוראה — מסלול עם ליווי, דרישה ורגישות." },
  { label: "תווים",   href: "/sheets",       img: imgGuitar,    quote: "ספריית תווים מסודרת — מהירה ונוחה לשימוש." },
  { label: "אודות",   href: "/about",        img: imgFlute,     quote: "אומנות ואמינות — 35 שנות למידה רציפה." },
  { label: "בלוג",    href: "/blog",         img: imgViolin,    quote: "מחשבות על הוראה, הופעות וחיים מוזיקליים." },
  { label: "צור קשר", href: "/contact",      img: imgPresenter, quote: "שיעורים, הופעה, סדנאות, תזמורת — מתחילים בפנייה קצרה." },
] as const;

type NavHref = typeof NAV_ITEMS[number]["href"];

const QUOTE_MAP: Record<string, string> = {
  "/orchestras":   "הרכבים וסגנונות לכל אירוע — בלי להסתבך.",
  "/performances": "יומן הופעות, חוויה מוסיקלית, הזמנה מסודרת.",
  "/students":     "לימוד, תרגול והתקדמות — בקשר אישי ונעים.",
  "/sheets":       "ספריית תווים מסודרת — מהירה ונוחה לעין.",
  "/about":        "הסיפור, הדרך והאני מאמין של Toby Music.",
  "/blog":         "טיפים, מחשבות והשראה מוזיקלית שנעים לחזור אליה.",
  "/contact":      "רוצה לשאול, להתייעץ או להזמין? כאן מתחילים.",
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark,     setIsDark]     = useState(false);
  const [heroGone,   setHeroGone]   = useState(false);
  const [hovered,    setHovered]    = useState<NavHref | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  /* ── Theme ── */
  useEffect(() => {
    const dark = localStorage.getItem("theme") !== "light";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  /* ── Detect hero scrolled away ── */
  useEffect(() => {
    if (!isHome) { setHeroGone(false); return; }
    const onScroll = () => setHeroGone(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const showJump = isHome && heroGone;
  const currentLogo = isDark ? whitelogo : logoBlack;

  const hovItem = NAV_ITEMS.find(n => n.href === hovered);

  return (
    <>
      <style>{`
        /* ══ HEADER CARD NAV ══ */
        /* fire gradient animated border on pill-nav */
        @keyframes fire-border {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        /* pill-nav: vertical sidebar v2 */
        .pill-nav {
          height: 100% !important;
          flex-direction: column !important;
          border-radius: 20px !important;
        }

        .hdr-nav-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 4px 7px;
          border-radius: 12px;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          background: transparent;
          transition: background .2s, transform .18s;
          width: 100%;
        }
        .hdr-nav-card:hover {
          background: hsl(var(--primary)/0.10);
          transform: translateY(-2px);
        }
        .hdr-nav-card.active {
          background: hsl(var(--primary)/0.12);
        }
        /* Hover tooltip */
        .hdr-nav-card .hdr-tooltip {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: hsl(var(--card)/.96);
          border: 1.5px solid hsl(var(--primary)/.80);
          border-radius: 12px;
          padding: 8px 14px;
          width: max-content;
          max-width: 200px;
          font-size: .72rem;
          color: hsl(var(--foreground)/.78);
          line-height: 1.45;
          text-align: center;
          direction: rtl;
          backdrop-filter: blur(10px);
          pointer-events: none;
          opacity: 0;
          transform: translateX(-50%) translateY(-4px);
          transition: opacity .2s ease, transform .2s ease;
          z-index: 100;
          box-shadow: 0 0 14px 3px hsl(var(--primary)/.20), 0 6px 18px rgba(0,0,0,.28);
          white-space: normal;
        }
        .hdr-nav-card .hdr-tooltip::before {
          content: '';
          position: absolute;
          bottom: 100%; left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-bottom-color: hsl(var(--primary)/.80);
        }
        .hdr-nav-card:hover .hdr-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        /* small char image in header — PNGs are now truly transparent */
        .hdr-char-img {
          width: clamp(36px, 3.6vw, 54px);
          height: clamp(44px, 4.4vw, 64px);
          object-fit: contain;
          display: block;
          background: transparent !important;
          /* base glow — visible on both light and dark */
          filter:
            drop-shadow(0 0 20px rgba(255,210,80,1.0))
            drop-shadow(0 0 40px rgba(232,93,32,.85))
            drop-shadow(0 0 60px rgba(201,169,97,.70))
            drop-shadow(0 0 80px rgba(255,180,30,.50))
            drop-shadow(0 4px 12px rgba(0,0,0,0.60));
          transition: transform .22s ease, filter .22s ease;
        }
        /* stronger glow in dark mode */
        .dark .hdr-char-img {
          filter:
            drop-shadow(0 0 8px rgba(201,169,97,.70))
            drop-shadow(0 0 16px rgba(232,93,32,.30))
            drop-shadow(0 3px 8px rgba(0,0,0,0.55));
        }
        .hdr-nav-card:hover .hdr-char-img {
          transform: translateY(-4px) scale(1.15);
          filter: drop-shadow(0 0 12px hsl(var(--primary)/0.60))
                  drop-shadow(0 4px 8px rgba(0,0,0,0.45));
        }
        .hdr-nav-card.active .hdr-char-img {
          filter: drop-shadow(0 0 8px hsl(var(--primary)/0.45))
                  drop-shadow(0 3px 7px rgba(0,0,0,0.40));
        }
        /* label always visible below icon */
        .hdr-nav-label {
          font-size: clamp(0.58rem, 0.65vw, 0.72rem);
          font-weight: 700;
          color: hsl(var(--muted-foreground));
          white-space: nowrap;
          line-height: 1;
          transition: color .2s;
        }
        .hdr-nav-card:hover .hdr-nav-label,
        .hdr-nav-card.active .hdr-nav-label {
          color: hsl(var(--primary));
        }
        .hdr-nav-card.active::after {
          content: '';
          position: absolute;
          left: -4px; top: 20%; bottom: 20%; width: 3px;
          background: hsl(var(--primary));
          border-radius: 3px;
        }

        /* ══ JUMPING CHARACTER ══ */
        @keyframes char-jump {
          0%   { opacity:0; transform: translateX(0) translateY(-50%) scale(0.55); }
          35%  { opacity:1; transform: translateX(160px) translateY(-50%) scale(1.06); }
          55%  { transform: translateX(150px) translateY(-50%) scale(0.96); }
          70%  { transform: translateX(155px) translateY(-50%) scale(1.02); }
          100% { opacity:1; transform: translateX(154px) translateY(-50%) scale(1); }
        }
        .hdr-jump-char {
          position: absolute;
          top: 50%;
          left: 100%;
          pointer-events: none;
          z-index: 300;
          animation: char-jump 0.52s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .hdr-jump-img {
          /* Large, fully transparent PNG — no background at all */
          width: clamp(70px, 7vw, 110px);
          display: block;
          background: transparent !important;
          filter: drop-shadow(0 16px 32px rgba(0,0,0,0.55))
                  drop-shadow(0 0 20px hsl(var(--primary)/0.50));
        }

        /* ══ SPEECH BUBBLE ══ */
        @keyframes hdr-bubble-in {
          from { opacity:0; transform: translateX(-50%) scale(0.86) translateY(10px); }
          to   { opacity:1; transform: translateX(-50%) scale(1) translateY(0); }
        }
        @keyframes hdr-bubble-glow {
          0%,100% { box-shadow: 0 0 0 1px hsl(var(--primary)/0.18), 0 0 16px 3px hsl(var(--primary)/0.16), 0 10px 26px rgba(0,0,0,0.26); }
          50%     { box-shadow: 0 0 0 1px hsl(var(--primary)/0.32), 0 0 26px 7px hsl(var(--primary)/0.26), 0 10px 26px rgba(0,0,0,0.26); }
        }
        .hdr-bubble {
          position: absolute;
          /* sits below the jumped character */
          top: calc(100% + clamp(72px, 7.5vw, 116px));
          left: 50%;
          transform: translateX(-50%);
          width: clamp(150px, 16vw, 240px);
          background: hsl(var(--card)/0.96);
          border: 2px solid hsl(var(--primary)/0.82);
          border-radius: 16px;
          padding: 12px 16px 14px;
          text-align: center;
          direction: rtl;
          backdrop-filter: blur(12px);
          pointer-events: none;
          z-index: 290;
          animation:
            hdr-bubble-in 0.28s 0.22s ease both,
            hdr-bubble-glow 2.8s 0.5s ease-in-out infinite;
        }
        /* tail pointing UP toward character */
        .hdr-bubble::after {
          content: '';
          position: absolute;
          bottom: 100%; left: 50%; transform: translateX(-50%);
          border: 8px solid transparent;
          border-bottom-color: hsl(var(--primary)/0.82);
        }
        .hdr-bubble::before {
          content: '';
          position: absolute;
          bottom: 100%; left: 50%; transform: translateX(-50%) translateY(2px);
          border: 8px solid transparent;
          border-bottom-color: hsl(var(--card));
          z-index: 1;
        }
        .hdr-bubble-title {
          font-weight: 800;
          font-size: clamp(0.80rem, 0.88vw, 0.98rem);
          color: hsl(var(--primary));
          margin-bottom: 4px;
        }
        .hdr-bubble-quote {
          font-size: clamp(0.66rem, 0.72vw, 0.80rem);
          color: hsl(var(--foreground)/0.74);
          line-height: 1.48;
        }
      `}</style>

      <header className="fixed inset-y-0 left-0 z-50" dir="rtl" style={{width:"88px"}}>
        <div style={{height:"100%", padding:"8px 6px"}}>
          <div className="pill-nav" style={{
                    height:"100%",
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"center",
                    padding:"10px 6px",
                    gap:"6px",
                    /* 50% opacity background */
                    /* 50% opacity, brand-minimal */
                    background: "rgba(8,4,6,0.50)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: "1px solid rgba(201,169,97,0.35)",
                    borderRadius: "20px",
                    /* single subtle gold hairline glow — not heavy */
                    boxShadow: "0 0 12px 2px rgba(201,169,97,0.12), 1px 0 0 0 rgba(201,169,97,0.08)",
                  }}>

            {/* ── Logo ── */}
            <Link to="/" className="flex min-w-0 items-center gap-2 rounded-full focus-visible:outline-none flex-shrink-0">
              <img src={currentLogo} alt="Toby Music"
                   className="w-12 h-auto rounded-md object-contain" />
            </Link>

            {/* ── Desktop nav — character cards ── */}
            <nav className="hidden md:flex" style={{flexDirection:"column", gap:"2px", flex:1, justifyContent:"center", width:"100%"}}>
              {NAV_ITEMS.map((item) => {
                const active  = isActive(item.href);
                const isHov   = hovered === item.href;
                const canJump = showJump && !!item.img;

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setHovered(item.href as NavHref)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <Link
                      to={item.href}
                      className={`hdr-nav-card${active ? " active" : ""}`}
                    >
                      {item.img && (
                        <img
                          src={item.img}
                          alt=""
                          aria-hidden="true"
                          className="hdr-char-img"
                        />
                      )}
                      <span className="hdr-nav-label">{item.label}</span>
                      {(item as any).quote && <span className="hdr-tooltip">{(item as any).quote}</span>}
                    </Link>

                    {/* Jump animation — only on home after hero scroll */}
                    {canJump && isHov && (
                      <>
                        <div className="hdr-jump-char">
                          <img
                            src={item.img!}
                            alt=""
                            className="hdr-jump-img"
                            style={{ background: "transparent" }}
                          />
                        </div>
                        <div className="hdr-bubble">
                          <div className="hdr-bubble-title">{item.label}</div>
                          <div className="hdr-bubble-quote">
                            {QUOTE_MAP[item.href] ?? ""}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* ── Right controls ── */}
            <div className="flex flex-col items-center gap-2" style={{marginBottom:"4px"}}>
              <button
                onClick={toggleTheme}
                aria-label={isDark ? "עבור למצב יום" : "עבור למצב לילה"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-soft hover:bg-secondary"
              >
                {isDark
                  ? <Sun  className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  : <Moon className="h-4 w-4 text-foreground sm:h-5 sm:w-5" />}
              </button>

              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-secondary md:hidden"
                onClick={() => setIsMenuOpen(p => !p)}
                aria-label="תפריט"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="absolute left-full top-0 ml-2 w-48 animate-fade-in overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-hover">
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-primary/15 text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.img && (
                      <img src={item.img} alt="" className="h-7 w-7 object-contain"
                           style={{ background: "transparent" }} />
                    )}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
