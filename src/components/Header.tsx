import { useEffect, useState, useCallback, useRef } from "react";
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
        /* pill-nav gets fire border via box-shadow trick injected in JSX */

        .hdr-nav-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 5px 10px 7px;
          border-radius: 12px;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          background: transparent;
          transition: background .2s, transform .18s;
          min-width: 54px;
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
          width: clamp(28px, 2.8vw, 42px);
          height: clamp(34px, 3.4vw, 50px);
          object-fit: contain;
          display: block;
          background: transparent !important;
          /* base glow — visible on both light and dark */
          filter:
            drop-shadow(0 0 14px rgba(201,169,97,.90))
            drop-shadow(0 0 28px rgba(232,93,32,.55))
            drop-shadow(0 0 42px rgba(201,169,97,.40))
            drop-shadow(0 4px 10px rgba(0,0,0,0.55));
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
          bottom: -2px; left: 20%; right: 20%; height: 2px;
          background: hsl(var(--primary));
          border-radius: 2px;
        }

        /* ══ JUMPING CHARACTER ══ */
        @keyframes char-jump {
          0%   { opacity:0; transform: translateX(-50%) translateY(-16px) scale(0.55); }
          35%  { opacity:1; transform: translateX(-50%) translateY(80px)  scale(1.06); }
          55%  { transform: translateX(-50%) translateY(72px) scale(0.96); }
          70%  { transform: translateX(-50%) translateY(76px) scale(1.02); }
          100% { opacity:1; transform: translateX(-50%) translateY(74px)  scale(1); }
        }
        .hdr-jump-char {
          position: absolute;
          top: 100%;
          left: 50%;
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

      <header className="fixed inset-x-0 top-0 z-50 py-3 sm:py-4" dir="rtl">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
          <div className="pill-nav flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6"
                  style={{
                    background: "linear-gradient(hsl(var(--background)), hsl(var(--background))) padding-box, linear-gradient(135deg, #C9A961, #E85D20, #C9202A, #E85D20, #C9A961) border-box",
                    backgroundSize: "100% 100%, 300% 300%",
                    border: "1.5px solid transparent",
                    borderRadius: "9999px",
                    animation: "fire-border 4s ease infinite",
                  }}>

            {/* ── Logo ── */}
            <Link to="/" className="flex min-w-0 items-center gap-2 rounded-full focus-visible:outline-none flex-shrink-0">
              <img src={currentLogo} alt="Toby Music"
                   className="h-9 w-auto rounded-md object-contain sm:h-10" />
            </Link>

            {/* ── Desktop nav — character cards ── */}
            <nav className="hidden items-center gap-0.5 md:flex">
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
            <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
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
            <div className="mt-2 animate-fade-in overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-hover md:hidden">
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
