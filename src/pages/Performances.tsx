import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Music4,
  Sparkles,
  Ticket,
} from "lucide-react";

import InnerPageLayout from "@/components/InnerPageLayout";
import InnerPageOrbitHero from "@/components/brand/InnerPageOrbitHero";
import AppearOnScroll from "@/components/AppearOnScroll";
import {
  performancesFloatingMessages,
  performancesOrbitItems,
  performancesPresenterAssets,
} from "@/content/orbit/performancesOrbit";

const UPCOMING_EVENTS = [
  {
    title: "מופע קיץ — הרכב קאמרי",
    date: "יום שני | 18:30",
    place: "ירושלים",
    note: "תכנית קלילה עם נגיעות קלאסיות ועיבודים מוכרים.",
  },
  {
    title: "ערב במה אינטימי",
    date: "יום רביעי | 20:00",
    place: "מרכז הארץ",
    note: "אירוע קטן עם אווירה חמה ורפרטואר נעים.",
  },
  {
    title: "אירוע חגיגי",
    date: "יום חמישי | 19:45",
    place: "צפון",
    note: "מוזיקה חיה עם התאמה לאופי האירוע והקהל.",
  },
];

const PERFORMANCE_PACKAGES = [
  {
    title: "הרכב קטן",
    text: "מתאים לאירועים אינטימיים, קבלות פנים, מרחב קטן או אווירה קרובה ושקטה יותר.",
  },
  {
    title: "הרכב בינוני",
    text: "איזון טוב בין נוכחות מוזיקלית לבין גמישות. מתאים למרבית האירועים והבמות.",
  },
  {
    title: "מסלול מותאם",
    text: "כשרוצים להתאים את המוזיקה, האורך, הסגנון או ההרכב לאירוע מסוים.",
  },
];

const FAQ = [
  {
    q: "איך מתחילים?",
    a: "מתחילים בפנייה קצרה, מספרים בקווים כלליים על האירוע, ואז מדייקים לפי צורך ותקציב.",
  },
  {
    q: "צריך לדעת כבר הכול?",
    a: "לא. גם אם יש רק כיוון ראשוני — אפשר להתחיל ממנו ולהתקדם יחד.",
  },
  {
    q: "יש התאמה לסוגים שונים של אירועים?",
    a: "כן. הרעיון כאן הוא לבנות התאמה מדויקת ולא לדחוף פתרון קבוע לכולם.",
  },
];

export default function Performances() {
  const [activeOrbitId, setActiveOrbitId] = useState("overview");

  const heroSupport = (
    <div className="flex flex-wrap gap-3 pt-2">
      <a
        href="#performances-packages-section"
        className="inline-flex items-center justify-center rounded-full border border-border bg-background/80 px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
      >
        למסלולים
      </a>
      <a
        href="#performances-contact-section"
        className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-primary/10 px-5 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
      >
        להזמנה / בירור
      </a>
    </div>
  );

  const scrollToSection = (sectionId?: string, orbitId?: string) => {
    if (orbitId) setActiveOrbitId(orbitId);
    if (!sectionId) return;

    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <InnerPageLayout
      title="הופעות"
      description="עמוד הופעות עם מבט כללי, מסלולים, יומן אירועים ודרך מסודרת לפנייה."
    >
      <div dir="rtl">
        <InnerPageOrbitHero
          heroId="performances-hero"
          eyebrow="הופעות"
          title={["לא רק לוח זמנים", "אלא מסלול", "להזמנת הופעה"]}
          intro={[
            "כאן אפשר לקבל מבט על עולם ההופעות, להבין איזה מסלול יכול להתאים לאירוע, ולפתוח שיחה מסודרת.",
            "המטרה היא לחבר בין חוויה מוזיקלית לבין בהירות: מה מתאים, מה שואלים, ואיך ממשיכים.",
          ]}
          support={heroSupport}
          orbitItems={performancesOrbitItems}
          presenterAssets={performancesPresenterAssets}
          activeOrbitId={activeOrbitId}
          presenterAlt="מגישת דף הופעות"
          onOrbitItemClick={(item) => scrollToSection(item.sectionId, item.id)}
          compactLabel="הופעות"
          floatingMessages={performancesFloatingMessages}
        />

        <section
          id="performances-overview-section"
          className="scroll-mt-28 py-12 md:py-16"
          onMouseEnter={() => setActiveOrbitId("overview")}
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "בהירות",
                  text: "העמוד בנוי כך שאפשר להבין מהר מה מתאים לאירוע, בלי ללכת לאיבוד.",
                  Icon: Sparkles,
                },
                {
                  title: "גמישות",
                  text: "יש מסלול כללי, אבל גם מקום להתאמה לפי אופי האירוע והקהל.",
                  Icon: Music4,
                },
                {
                  title: "המשך מסודר",
                  text: "גם אם עוד אין החלטה מלאה, אפשר להשאיר פנייה ולהמשיך משם נכון.",
                  Icon: Ticket,
                },
              ].map((card) => (
                <AppearOnScroll key={card.title}>
                  <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-soft backdrop-blur-sm">
                    <card.Icon className="mb-4 h-6 w-6 text-primary" />
                    <div className="text-xl font-bold">{card.title}</div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {card.text}
                    </p>
                  </div>
                </AppearOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section
          id="performances-packages-section"
          className="scroll-mt-28 bg-muted/30 py-12 md:py-16"
          onMouseEnter={() => setActiveOrbitId("packages")}
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8">
              <div className="text-sm font-medium tracking-[0.30em] text-primary/80">
                מסלולים
              </div>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">אפשרויות נפוצות</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {PERFORMANCE_PACKAGES.map((item) => (
                <AppearOnScroll key={item.title}>
                  <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                    <div className="text-xl font-bold">{item.title}</div>
                    <p className="mt-3 text-base leading-8 text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </AppearOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section
          id="performances-calendar-section"
          className="scroll-mt-28 py-12 md:py-16"
          onMouseEnter={() => setActiveOrbitId("calendar")}
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8">
              <div className="text-sm font-medium tracking-[0.30em] text-primary/80">
                יומן
              </div>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">מועדים קרובים</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {UPCOMING_EVENTS.map((event) => (
                <AppearOnScroll key={event.title}>
                  <article className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                    <div className="text-xl font-bold">{event.title}</div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {event.date}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {event.place}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4 text-primary" />
                      זמן משוער לפי אופי האירוע
                    </div>

                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                      {event.note}
                    </p>
                  </article>
                </AppearOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section
          id="performances-faq-section"
          className="scroll-mt-28 bg-muted/30 py-12 md:py-16"
          onMouseEnter={() => setActiveOrbitId("faq")}
        >
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-8">
              <div className="text-sm font-medium tracking-[0.30em] text-primary/80">
                שאלות
              </div>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">לפני שממשיכים</h2>
            </div>

            <div className="space-y-4">
              {FAQ.map((item) => (
                <AppearOnScroll key={item.q}>
                  <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                    <div className="text-xl font-bold">{item.q}</div>
                    <p className="mt-3 text-base leading-8 text-muted-foreground">
                      {item.a}
                    </p>
                  </div>
                </AppearOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section
          id="performances-contact-section"
          className="scroll-mt-28 py-12 md:py-20"
          onMouseEnter={() => setActiveOrbitId("contact")}
        >
          <div className="mx-auto max-w-4xl px-6 text-center">
            <AppearOnScroll>
              <div className="rounded-[2rem] border border-border bg-card p-8 shadow-soft md:p-10">
                <div className="text-sm font-medium tracking-[0.30em] text-primary/80">
                  יצירת קשר
                </div>
                <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                  רוצים לבדוק התאמה לאירוע?
                </h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
                  אפשר להתחיל מפנייה קצרה, לציין תאריך/סגנון/מיקום בקווים כלליים,
                  ומשם להמשיך בצורה מסודרת.
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/contact?topic=performing"
                    className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
                  >
                    לפתיחת פנייה
                  </Link>
                  <Link
                    to="/orchestras"
                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition hover:bg-muted"
                  >
                    לעמוד תזמורות
                  </Link>
                </div>
              </div>
            </AppearOnScroll>
          </div>
        </section>
      </div>
    </InnerPageLayout>
  );
}
