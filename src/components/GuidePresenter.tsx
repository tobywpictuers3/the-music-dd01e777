import { useEffect, useState } from "react";
import {
  GUIDE_PRESENTER,
  GUIDE_SECTION_ID,
  HOME_HERO_ID,
} from "@/config/homepage";
import presenterImg from "@/assets/homepage/presenter/presenter.png";

/**
 * GuidePresenter
 * ==============
 * קומפוננטת המגיש בנויה נכון מההתחלה כך:
 *
 * 1) בתחילת הדף — מוצגת גרסה גדולה מתחת לבמה
 * 2) רק אחרי שיוצאים מאזור ההירו — נפתח launcher קטן בפינה
 * 3) בלחיצה על ה-launcher — בועת העזרה נפתחת / נסגרת
 *
 * חשוב:
 * המעבר ל-floating מבוסס על ההירו (#home-hero),
 * ולא על ה-section של המגיש עצמו.
 *
 * TODO עתידי:
 * כאן אפשר לחבר בהמשך AI / site-search / קול
 * בלי לשנות את ה-UX.
 */
export default function GuidePresenter() {
  const [isFloating, setIsFloating] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById(HOME_HERO_ID);

      /**
       * fallback אם מסיבה כלשהי לא נמצא ההירו
       */
      let threshold = window.innerHeight * 0.9;

      if (hero) {
        /**
         * כל עוד המשתמש עדיין בהירו — לא צפים
         * רק אחרי שעוברים אותו — עוברים לפינה
         */
        threshold = Math.max(hero.offsetHeight - 140, 260);
      }

      const shouldFloat = window.scrollY > threshold;
      setIsFloating(shouldFloat);

      /**
       * כשחוזרים לראש הדף — סוגרים את הבועה הצפה
       */
      if (!shouldFloat) {
        setBubbleOpen(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      {/* ======================================================
          גרסה גדולה — מתחת לבמה
      ====================================================== */}
      <section
        id={GUIDE_SECTION_ID}
        className="relative z-10 px-4 py-12 md:px-8 md:py-16"
        dir="rtl"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          {/* שליטה על גודל המגיש כאן */}
          <img
            src={presenterImg}
            alt="טובי — המדריך שלכם"
            className="w-[190px] drop-shadow-[0_18px_35px_rgba(0,0,0,0.14)] md:w-[250px] lg:w-[290px]"
          />

          {/* בועת הדיבור הראשית */}
          <div className="relative max-w-3xl rounded-[30px] border border-border bg-card p-6 text-card-foreground shadow-lg md:p-8">
            {/* זנב בועה עליון */}
            <div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-l border-t border-border bg-card" />

            <p className="relative z-10 text-base leading-8 md:text-lg">
              {GUIDE_PRESENTER.welcomeText}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          גרסה צפה — רק אחרי שעוברים את ההירו
      ====================================================== */}
      {isFloating && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 md:bottom-6 md:right-6">
          {bubbleOpen && (
            <div
              className="relative mb-2 max-w-[320px] rounded-2xl border border-border bg-card p-4 text-sm leading-7 text-card-foreground shadow-xl"
              dir="rtl"
            >
              <button
                onClick={() => setBubbleOpen(false)}
                className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                aria-label="סגור"
              >
                ✕
              </button>

              {/* זנב בועה תחתון */}
              <div className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 border-r border-b border-border bg-card" />

              <p>{GUIDE_PRESENTER.welcomeText}</p>
            </div>
          )}

          {/* launcher צף */}
          <button
            onClick={() => setBubbleOpen((prev) => !prev)}
            className="group relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/40 bg-card shadow-xl transition hover:scale-110"
            aria-label={GUIDE_PRESENTER.floatingLabel}
          >
            <img
              src={presenterImg}
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </button>

          <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-foreground shadow backdrop-blur">
            {GUIDE_PRESENTER.floatingLabel}
          </span>
        </div>
      )}
    </>
  );
}
