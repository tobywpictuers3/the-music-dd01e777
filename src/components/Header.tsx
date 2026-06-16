import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import whitelogo   from "@/assets/whitelogo.png";
import logoBlack   from "@/assets/homepage/brand/logo-black.jpg";

import imgPresenter from "@/assets/homepage/presenter/presenter.png";
import imgDrums     from "@/assets/homepage/characters/drums.png";
import imgPiano     from "@/assets/homepage/characters/piano.png";
import imgSaxophone from "@/assets/homepage/characters/saxophone.png";
import imgViolin    from "@/assets/homepage/characters/violin.png";
import imgGuitar    from "@/assets/homepage/characters/guitar.png";
import imgFlute     from "@/assets/homepage/characters/flute.png";

/* Map nav href → character image */
const CHAR_MAP: Record<string, string> = {
  "/contact":      imgPresenter,
  "/orchestras":   imgDrums,
  "/performances": imgSaxophone,
  "/students":     imgPiano,
  "/sheets":       imgGuitar,
  "/about":        imgFlute,
  "/blog":         imgViolin,
};

/* Quote for each page */
const QUOTE_MAP: Record<string, string> = {
  "/contact":      "רוצה לשאול, להתייעץ או להזמין? כאן מתחילים.",
  "/orchestras":   "הרכבים וסגנונות לכל אירוע — בלי להסתבך.",
  "/performances": "יומן הופעות, חוויה מוסיקלית, הזמנה מסודרת.",
  "/students":     "לימוד, תרגול והתקדמות — בקשר אישי ונעים.",
  "/sheets":       "ספריית תווים מסודרת — מהירה ונוחה לעין.",
  "/about":        "הסיפור, הדרך והאני מאמין של Toby Music.",
  "/blog":         "טיפים, מחשבות והשראה מוזיקלית שנעים לחזור אליה.",
};

const NAV_LINKS = [
  { label: "בית",      href: "/" },
  { label: "תזמורות", href: "/orchestras" },
  { label: "הופעות",  href: "/performances" },
  { label: "תלמידות", href: "/students" },
  { label: "תווים",   href: "/sheets" },
  { label: "אודות",   href: "/about" },
  { label: "בלוג",    href: "/blog" },
];

const Header = () => {
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);
  const [isDark,      setIsDark]      = useState(false);
  const [heroGone,    setHeroGone]    = useState(false); // true once hero scrolled away
  const [hoveredNav,  setHoveredNav]  = useState<string | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  /* ── Theme init ── */
  useEffect(() => {
    const shouldBeDark = localStorage.getItem("theme") !== "light";
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  /* ── Detect hero scrolled away (only on home) ── */
  useEffect(() => {
    if (!isHome) { setHeroGone(false); return; }
    const onScroll = () => {
      // hero is ~100vh; once we've scrolled past it, heroGone = true
      setHeroGone(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const currentLogo = isDark ? whitelogo : logoBlack;

  /* Show jumping character only on home + after hero scrolled */
  const showJump = isHome && heroGone;
  const jumpChar = hoveredNav ? CHAR_MAP[hoveredNav] : null;
  const jumpQuote = hoveredNav ? QUOTE_MAP[hoveredNav] : null;
  const jumpTitle = hoveredNav
    ? NAV_LINKS.find(l => l.href === hoveredNav)?.label ?? ""
    : "";

  return (
    <>
      <style>{`
        /* ── Jumping character from header ── */
        @keyframes char-jump-down {
          0%   { opacity:0; transform: translateX(-50%) translateY(-20px) scale(0.6); }
          40%  { opacity:1; transform: translateX(-50%) translateY(60px)  scale(1.08); }
          65%  { transform: translateX(-50%) translateY(50px) scale(0.96); }
          80%  { transform: translateX(-50%) translateY(56px) scale(1.02); }
          100% { opacity:1; transform: translateX(-50%) translateY(54px)  scale(1); }
        }
        .nav-char-wrap {
          position: absolute;
          top: 100%;
          /* horizontal position set inline */
          pointer-events: none;
          z-index: 200;
          animation: char-jump-down 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .nav-char-img {
          width: clamp(52px, 5.5vw, 80px);
          display: block;
          background: transparent;
          filter: drop-shadow(0 12px 24px rgba(0,0,0,0.55))
                  drop-shadow(0 0 16px hsl(var(--primary)/0.45));
        }

        /* ── Speech bubble from nav char ── */
        @keyframes nav-bubble-in {
          from { opacity:0; transform: translateX(-50%) translateY(8px) scale(0.88); }
          to   { opacity:1; transform: translateX(-50%) translateY(0)   scale(1);   }
        }
        .nav-bubble {
          position: absolute;
          top: calc(100% + clamp(60px,6.5vw,92px)); /* just below the character */
          left: 50%;
          transform: translateX(-50%);
          width: clamp(160px, 18vw, 260px);
          background: hsl(var(--card)/0.96);
          border: 2px solid hsl(var(--primary)/0.80);
          border-radius: 16px;
          padding: 12px 16px 14px;
          text-align: center;
          direction: rtl;
          backdrop-filter: blur(12px);
          pointer-events: none;
          animation: nav-bubble-in 0.3s 0.25s ease both;
          box-shadow:
            0 0 0 1px hsl(var(--primary)/0.18),
            0 0 18px 4px hsl(var(--primary)/0.18),
            0 0 36px 8px rgba(180,60,20,0.10),
            0 10px 28px rgba(0,0,0,0.28);
        }
        @keyframes nav-bubble-glow {
          0%,100% { box-shadow: 0 0 0 1px hsl(var(--primary)/0.18), 0 0 18px 4px hsl(var(--primary)/0.18), 0 10px 28px rgba(0,0,0,0.28); }
          50%     { box-shadow: 0 0 0 1px hsl(var(--primary)/0.30), 0 0 28px 8px hsl(var(--primary)/0.26), 0 10px 28px rgba(0,0,0,0.28); }
        }
        .nav-bubble { animation: nav-bubble-in 0.3s 0.25s ease both, nav-bubble-glow 2.8s 0.55s ease-in-out infinite; }
        .nav-bubble::after {
          content:''; position:absolute;
          bottom:100%; left:50%; transform:translateX(-50%);
          border:8px solid transparent;
          border-bottom-color: hsl(var(--primary)/0.80);
        }
        .nav-bubble::before {
          content:''; position:absolute;
          bottom:100%; left:50%; transform:translateX(-50%) translateY(2px);
          border:8px solid transparent;
          border-bottom-color: hsl(var(--card));
          z-index:1;
        }
        .nav-bubble-title {
          font-weight:800;
          font-size: clamp(0.82rem,0.9vw,1rem);
          color: hsl(var(--primary));
          margin-bottom:5px;
        }
        .nav-bubble-quote {
          font-size: clamp(0.68rem,0.75vw,0.82rem);
          color: hsl(var(--foreground)/0.75);
          line-height:1.5;
        }

        /* ── Nav link wrapper (relative for char positioning) ── */
        .nav-link-wrap { position: relative; }
      `}</style>

      <header className="fixed inset-x-0 top-0 z-50 py-3 sm:py-4" dir="rtl">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
          <div className="pill-nav flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">

            {/* Logo */}
            <Link to="/" className="flex min-w-0 items-center gap-2 rounded-full focus-visible:outline-none">
              <img src={currentLogo} alt="Toby Music"
                   className="h-9 w-auto rounded-md object-contain sm:h-10" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => {
                const active   = isActive(link.href);
                const isHov    = hoveredNav === link.href;
                const hasChar  = showJump && CHAR_MAP[link.href];

                return (
                  <div
                    key={link.href}
                    className="nav-link-wrap"
                    onMouseEnter={() => showJump && setHoveredNav(link.href)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    <Link
                      to={link.href}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        active
                          ? "bg-primary/15 text-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>

                    {/* Character jumps down from this nav item */}
                    {hasChar && isHov && (
                      <>
                        <div className="nav-char-wrap" style={{ left: "50%" }}>
                          <img src={CHAR_MAP[link.href]!} alt="" className="nav-char-img" />
                        </div>
                        <div className="nav-bubble">
                          <div className="nav-bubble-title">{jumpTitle}</div>
                          <div className="nav-bubble-quote">{jumpQuote}</div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right controls */}
            <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
              <button onClick={toggleTheme}
                aria-label={isDark ? "עבור למצב יום" : "עבור למצב לילה"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-soft hover:bg-secondary"
              >
                {isDark
                  ? <Sun  className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  : <Moon className="h-4 w-4 text-foreground sm:h-5 sm:w-5" />}
              </button>

              <Button asChild variant="wine" className="hidden md:flex">
                <Link to="/contact">צור קשר</Link>
              </Button>

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
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-primary/15 text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild variant="wine" className="mt-2 w-full">
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>צור קשר</Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
