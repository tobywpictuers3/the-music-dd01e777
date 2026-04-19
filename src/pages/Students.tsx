import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";
import InnerPageLayout from "@/components/InnerPageLayout";
import OrbitPageShell from "@/orbit-system/OrbitPageShell";
import type { OrbitItemConfig, OrbitItemId } from "@/orbit-system/orbit.types";
import { STUDENTS_PAGE_ORBIT_CONTENT } from "@/content/orbit/studentsPageOrbitContent";
import AppearOnScroll from "@/components/AppearOnScroll";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BadgeDollarSign,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  MessageSquareMore,
  Mic2,
  Music2,
  Quote,
  Smartphone,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";

/* =========================================================
   תמונות
   ========================================================= */
import studentsPresenterMain from "@/assets/students/students-presenter-main.png";
import studentsTestimonialsAnnouncer from "@/assets/students/students-testimonials-announcer.png";
import studentsLearningTouch from "@/assets/students/students-learning-touch.webp";
import studentsStudyMaterials from "@/assets/students/students-study-materials.webp";
import studentsStageAtmosphereWide from "@/assets/students/students-stage-atmosphere-wide.webp";
import studentsDemoSystemPreview from "@/assets/students/students-demo-system-preview.webp";

type StudyCard = {
  key: string;
  title: string;
  subtitle: string;
  Icon: ComponentType<{ className?: string }>;
  bullets: string[];
};

type QuoteItem = {
  key: string;
  quote: string;
  name: string;
  context?: string;
};

type ProcessItem = {
  key: string;
  title: string;
  text: string;
  Icon: ComponentType<{ className?: string }>;
};

type FeatureItem = {
  key: string;
  title: string;
  text: string;
  Icon: ComponentType<{ className?: string }>;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* =========================================================
   קישורים
   ========================================================= */
const CONTACT_STUDENTS_HREF = "/contact?from=students&topic=lessons_private";
const STUDENTS_APP_HREF = "https://tobymusic.lovable.app";
const STUDENTS_DEMO_HREF = "/students-demo";
const EDUCATIONAL_ORCHESTRA_HREF = "/orchestras";
const ABOUT_TEACHING_HREF = "/about#teaching";

/* =========================================================
   טקסטים
   ========================================================= */
const HERO_PIANO_QUOTE =
  "כאן לא בונים רק שיעור טוב, אלא דרך יציבה ומוזיקלית שנשארת לאורך זמן — עם רמה, רצף, הקשבה וליווי אמיתי.";

const TESTIMONIALS: QuoteItem[] = [
  {
    key: "t1",
    quote:
      "למדתי אצל טובי חליל צד ארבע שנים בערך, ובזכותה ממש התקדמתי בקריאת תווים.",
    name: "בת שבע",
    context: "חליל צד",
  },
  {
    key: "t2",
    quote:
      "טובי מורה מדהימה וסבלנית, מקצוענית במיוחד, וכל שיעור היה חוויה מיוחדת שפתחה שערים לתחומים נוספים במוזיקה.",
    name: "מירי",
    context: "חליל צד ותזמורת",
  },
  {
    key: "t3",
    quote:
      "החוויה הייתה הרבה מעבר לשיעורי נגינה. עברתי התקדמות מקצועית משמעותית בתוך תהליך לימוד מובנה וברור.",
    name: "תמר",
    context: "חליל צד",
  },
  {
    key: "t4",
    quote:
      "השיעורים מונגשים בצורה מעניינת וחווייתית, ומעבר לידע המקצועי מקבלים הבנה עמוקה ונרחבת בחומר.",
    name: "ריקי",
    context: "תאוריה",
  },
  {
    key: "t5",
    quote:
      "להיות תלמידה של טובי זה הרבה מעבר לללמוד מוזיקה. טובי אישיות מיוחדת, נעימה, חכמה וענווה.",
    name: "נעמי",
    context: "חליל צד ותזמורת",
  },
  {
    key: "t6",
    quote:
      "כל השבוע חיכיתי לשיעור פסנתר; הייתה אווירה נעימה, זורמת ולא מלחיצה — ממש חוויה.",
    name: "קרייני",
    context: "פסנתר",
  },
  {
    key: "t7",
    quote:
      "טובי מוסרת את השיעור שלה עם כל הלב, עם אכפתיות להתקדמות ולהבנה שלך, וזה מורגש בכל שלב.",
    name: "תמר",
    context: "חליל צד ותזמורת",
  },
  {
    key: "t8",
    quote:
      "מעל לשלוש שנים שאני זוכה להיות תלמידה שלך, וכל דקה איתך שווה בשבילי זהב.",
    name: "דסי",
    context: "פסנתר",
  },
];

const PRIMARY_STUDIES: StudyCard[] = [
  {
    key: "piano",
    title: "פסנתר",
    subtitle: "קריאה, טכניקה, הבעה ונגינה יציבה לאורך זמן.",
    Icon: Music2,
    bullets: [
      "עבודה יסודית על טכניקות מגוונות של נגינה",
      "ישיבה נכונה, משקל ויציבה משוחררת",
      "פיתוח יכולת קריאה מהדף — prima vista",
      "פיתוח קואורדינציה מורכבת והבעה מוסיקלית",
      "פירוקי פסנתר, ליווי שירים ופיתוח שמיעה מעשית",
    ],
  },
  {
    key: "flute",
    title: "חליל צד",
    subtitle: "צליל נקי, נשימה נכונה ושליטה מדויקת בכלי.",
    Icon: Mic2,
    bullets: [
      "עבודה על איכות הצליל ואמבז'ור מדויק",
      "פיתוח מערכת הנשימה וטווחי נשיפה",
      "דגש על יציבה נכונה והתאמה אנטומית",
      "טכניקות ארטיקולציה, שליטה ודיוק",
      "פיתוח נגינה בטוחה, נקייה ומסודרת",
    ],
  },
];

const SUPPORT_STUDIES = [
  "תיאוריה",
  "פיתוח שמיעה",
  "סולפז׳",
  "קריאת תווים",
  "קצב",
  "הקשבה מוסיקלית",
];

const BELIEF_LINES = [
  "מוסיקה נבנית מתוך עומק והשקעה, לא בקיצורי דרך.",
  "יחס אישי אינו סותר דרישות גבוהות — הוא מאפשר אותן.",
  "התקדמות אמיתית נוצרת מתוך רצף, אימון ותוכנית עבודה.",
  "רגישות, בהירות ומשמעת יכולות ללכת יחד.",
  "אני מחפשת תהליך נכון, לא רושם רגעי.",
];

const HOW_IT_WORKS: ProcessItem[] = [
  {
    key: "lesson",
    title: "שיעור שבועי",
    text: "השיעור נותן כיוון, תיקון ותוכנית עבודה ברורה לשבוע.",
    Icon: GraduationCap,
  },
  {
    key: "practice",
    title: "אימון בין שיעורים",
    text: "ההתקדמות בפועל נבנית באימון המסודר שבין המפגשים.",
    Icon: ClipboardList,
  },
  {
    key: "tracking",
    title: "מעקב ורצף",
    text: "יש מסגרת שמחזיקה את התהליך ולא נותנת לדברים להתפזר.",
    Icon: CalendarRange,
  },
  {
    key: "materials",
    title: "חומרים מסודרים",
    text: "עזרים, משימות ותכנים נגישים לתלמידה במקום אחד.",
    Icon: BookOpen,
  },
  {
    key: "fit",
    title: "התאמה למסלול",
    text: "מתאים למי שמכניסה את הלימוד לסדר היום בקביעות — לא רק כפעילות מזדמנת.",
    Icon: CheckCircle2,
  },
];

const APP_FEATURES: FeatureItem[] = [
  {
    key: "schedule",
    title: "סדר שבועי ברור",
    text: "מה קורה עכשיו, מה לתרגל השבוע ומהו הצעד הבא בתהליך.",
    Icon: CalendarRange,
  },
  {
    key: "practice",
    title: "מעקב אימון והתקדמות",
    text: "התלמידה יודעת מה לתרגל ומה כבר התקדם בפועל.",
    Icon: ClipboardList,
  },
  {
    key: "tools",
    title: "עזרים וחומרי לימוד",
    text: "תרגילים, משימות וכלים שימושיים במקום אחד.",
    Icon: Sparkles,
  },
  {
    key: "communication",
    title: "תקשורת מורה–תלמידה",
    text: "שאלות, הבהרות והמשכיות גם בין השיעורים.",
    Icon: MessageSquareMore,
  },
  {
    key: "payments",
    title: "סדר ותשלומים",
    text: "מעטפת מסודרת, ברורה ונגישה שגם מחזיקה את הצד המנהלי.",
    Icon: BadgeDollarSign,
  },
];

const NUMBERS = [
  { value: "26", label: "שנות הוראת מוסיקה" },
  { value: "9", label: "כלי נגינה ברמה מעולה" },
  { value: "מאות", label: "תלמידות פרטיות לאורך השנים" },
  { value: "אלפי", label: "בוגרות קורסים קבוצתיים" },
  { value: "5", label: "תזמורות לימודיות עשירות" },
  { value: "20", label: "קונצרטים לתלמידות" },
];

const STUDENTS_SECTION_ORBIT_MAP: Array<{
  sectionId: string;
  orbitId: OrbitItemId;
}> = [
  { sectionId: "track-section", orbitId: "1" },
  { sectionId: "studies-section", orbitId: "2" },
  { sectionId: "belief-section", orbitId: "3" },
  { sectionId: "process-section", orbitId: "4" },
  { sectionId: "system-section", orbitId: "5" },
];

/* =========================================================
   רכיבי עזר
   ========================================================= */

type AudioIconButtonProps = {
  speaking: boolean;
  onClick: () => void;
  className?: string;
};

function AudioIconButton({
  speaking,
  onClick,
  className,
}: AudioIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={speaking ? "עצירת השמעה" : "השמעה"}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:-translate-y-[1px] hover:bg-secondary",
        className
      )}
    >
      {speaking ? (
        <Square className="h-4 w-4 text-primary" />
      ) : (
        <Volume2 className="h-5 w-5 text-primary" />
      )}
    </button>
  );
}

export default function Students() {
  const [openSmartSystem, setOpenSmartSystem] = useState(false);
  const [tIndex, setTIndex] = useState(0);
  const [activeOrbitId, setActiveOrbitId] = useState<OrbitItemId>("1");
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const testimonialPauseRef = useRef(false);

  function stopSpeech() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeakingKey(null);
  }

  function speakText(key: string, text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "he-IL";
    utterance.rate = 0.96;
    utterance.pitch = 1;

    utterance.onend = () =>
      setSpeakingKey((current) => (current === key ? null : current));
    utterance.onerror = () =>
      setSpeakingKey((current) => (current === key ? null : current));

    setSpeakingKey(key);
    synth.speak(utterance);
  }

  function toggleSpeech(key: string, text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    if (speakingKey === key && synth.speaking) {
      stopSpeech();
      return;
    }

    speakText(key, text);
  }

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (testimonialPauseRef.current) return;
      setTIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8500);

    return () => window.clearInterval(id);
  }, []);

  function scrollToSection(sectionId?: string, orbitId?: OrbitItemId) {
    if (orbitId) setActiveOrbitId(orbitId);
    if (!sectionId) return;

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  useEffect(() => {
    const elements = STUDENTS_SECTION_ORBIT_MAP.map((item) => {
      const el = document.getElementById(item.sectionId);
      return el ? { ...item, el } : null;
    }).filter(Boolean) as Array<{
      sectionId: string;
      orbitId: OrbitItemId;
      el: HTMLElement;
    }>;

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const matched = elements.find(({ el }) => el === visible.target);
        if (matched) {
          setActiveOrbitId(matched.orbitId);
        }
      },
      {
        threshold: [0.15, 0.35, 0.6],
        rootMargin: "-28% 0px -42% 0px",
      }
    );

    elements.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const currentTestimonial = TESTIMONIALS[tIndex] ?? TESTIMONIALS[0];

  function handleOrbitItemClick(item: OrbitItemConfig) {
    scrollToSection(item.targetSectionId, item.id);
  }

  return (
    <InnerPageLayout
      title="תלמידות"
      description="מסלול מוסיקלי יסודי, אנושי ומסודר לתלמידות — עם שיעור, תרגול, רצף ומערכת תומכת."
    >
      <main dir="rtl" className="pb-24">
        <OrbitPageShell
          pageId="students"
          content={STUDENTS_PAGE_ORBIT_CONTENT}
          onOrbitItemClick={handleOrbitItemClick}
          controlledActiveItemId={activeOrbitId}
        >
          <div className="pb-16">
            <div className="mx-auto max-w-6xl space-y-12 px-6 md:space-y-16">
              <AppearOnScroll delay={18}>
                <section className="flex justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                  >
                    <a href={CONTACT_STUDENTS_HREF}>לבדיקת התאמה למסלול</a>
                  </Button>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={54}>
                <section
                  id="track-section"
                  className="scroll-mt-28 pt-2"
                  onMouseEnter={() => setActiveOrbitId("1")}
                  onMouseLeave={() => {
                    testimonialPauseRef.current = false;
                  }}
                >
                  <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15 md:text-sm">
                      <Quote className="h-4 w-4" />
                      מה אומרות התלמידות
                    </div>

                    <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
                      שיעור שהופך לדרך,
                      <span className="mt-2 block">ולא לעוד מפגש חולף</span>
                    </h2>

                    <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-xl">
                      ההמלצות לא נועדו רק להרשים — אלא להמחיש איך נראית למידה שיש
                      בה רצף, בהירות, יחס אישי ועומק מקצועי גם יחד.
                    </p>
                  </div>

                  <div className="mt-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                    <div
                      className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-8"
                      onMouseEnter={() => {
                        testimonialPauseRef.current = true;
                      }}
                      onMouseLeave={() => {
                        testimonialPauseRef.current = false;
                      }}
                    >
                      <div key={currentTestimonial.key} className="min-h-[220px]">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                          <Quote className="h-6 w-6" />
                        </div>

                        <div className="mt-5 text-2xl font-semibold leading-relaxed text-foreground md:text-[2rem]">
                          “{currentTestimonial.quote}”
                        </div>

                        <div className="mt-6 text-base text-muted-foreground md:text-lg">
                          <span className="font-black text-primary">
                            {currentTestimonial.name}
                          </span>
                          {currentTestimonial.context && (
                            <>
                              <span className="mx-2 opacity-50">|</span>
                              <span>{currentTestimonial.context}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          {TESTIMONIALS.map((item, i) => (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => setTIndex(i)}
                              className={cn(
                                "h-3.5 w-3.5 rounded-full transition-all",
                                i === tIndex
                                  ? "scale-110 bg-primary"
                                  : "bg-primary/20 hover:bg-primary/40"
                              )}
                              aria-label={`המלצה ${i + 1}`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            className="h-12 rounded-2xl px-5 text-sm font-semibold md:text-base"
                            onClick={() =>
                              setTIndex(
                                (prev) =>
                                  (prev - 1 + TESTIMONIALS.length) %
                                  TESTIMONIALS.length
                              )
                            }
                          >
                            <ChevronRight className="ml-2 h-5 w-5" />
                            הקודם
                          </Button>

                          <Button
                            className="h-12 rounded-2xl px-5 text-sm font-semibold md:text-base"
                            onClick={() =>
                              setTIndex((prev) => (prev + 1) % TESTIMONIALS.length)
                            }
                          >
                            הבא
                            <ChevronLeft className="mr-2 h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="flex justify-center rounded-[2rem] border border-border bg-card p-5 shadow-soft">
                        <img
                          src={studentsTestimonialsAnnouncer}
                          alt="סמל דף התלמידות"
                          className="h-auto w-full max-w-[320px] object-contain md:max-w-[420px]"
                          loading="lazy"
                        />
                      </div>

                      <div className="rounded-[2rem] border border-border bg-secondary p-6 shadow-soft md:p-8">
                        <div className="text-2xl font-black leading-tight text-foreground md:text-3xl">
                          מסלול מקצועי, אנושי
                          <span className="mt-2 block">ועם רף ברור</span>
                        </div>

                        <ul className="mt-5 space-y-2.5 text-base leading-relaxed text-muted-foreground md:text-lg">
                          <li>לתלמידות שמוכנות לתהליך ולא רק להתנסות.</li>
                          <li>למי שמחפשת ליווי, סדר ומסגרת מחזיקה.</li>
                          <li>למי שחשוב לה יחס אישי יחד עם דרישה מקצועית.</li>
                        </ul>

                        <Button
                          asChild
                          className="mt-6 h-12 rounded-2xl px-5 text-sm font-semibold md:text-base"
                        >
                          <a href={CONTACT_STUDENTS_HREF}>
                            בדיקת התאמה למסלול
                            <ArrowLeft className="mr-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={92}>
                <section className="pt-1">
                  <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15 md:text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      כך נראה תהליך נכון
                    </div>

                    <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl text-foreground">
                      צורת העבודה שלי מתאימה למי שמוכנה
                      <span className="mt-2 block">להתמסר לתהליך אמיתי</span>
                    </h2>
                  </div>

                  <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_1.02fr]">
                    <div className="flex flex-col items-center gap-4">
                      <AudioIconButton
                        speaking={speakingKey === "hero-piano"}
                        onClick={() => toggleSpeech("hero-piano", HERO_PIANO_QUOTE)}
                      />

                      <img
                        src={studentsPresenterMain}
                        alt="סמל דף התלמידות"
                        className="h-auto w-full max-w-[420px] object-contain md:max-w-[560px]"
                        loading="eager"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-8">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                          <Quote className="h-6 w-6" />
                        </div>

                        <div className="mt-5 text-lg leading-relaxed text-foreground md:text-2xl">
                          “{HERO_PIANO_QUOTE}”
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-soft md:p-6">
                          <div className="text-base font-bold text-foreground md:text-lg">
                            מה חשוב לי במיוחד
                          </div>
                          <div className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                            עומק, עקביות, שקט מקצועי ובהירות שמאפשרת לתלמידה להתקדם
                            מתוך ביטחון.
                          </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-soft md:p-6">
                          <div className="text-base font-bold text-foreground md:text-lg">
                            מה יוצא מזה בפועל
                          </div>
                          <div className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                            מסלול שמחזיק לאורך זמן, עם רמה, מסגרת, ליווי ודרך עבודה
                            מסודרת.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={110}>
                <section
                  id="studies-section"
                  className="scroll-mt-28 pt-2"
                  onMouseEnter={() => setActiveOrbitId("2")}
                >
                  <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15 md:text-sm">
                      <Music2 className="h-4 w-4" />
                      מה לומדים כאן
                    </div>

                    <h2 className="mt-4 text-3xl font-black text-foreground sm:text-4xl md:text-5xl">
                      תחומי הלימוד
                    </h2>

                    <div className="mt-4 text-base leading-relaxed text-muted-foreground md:text-xl">
                      השיעורים נבנים מתוך עומק מקצועי, התאמה אישית ומסלול התקדמות
                      ברור.
                    </div>
                  </div>

                  <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.02fr_0.98fr]">
                    <div className="space-y-6">
                      <img
                        src={studentsLearningTouch}
                        alt="חוויית למידה ונגינה"
                        className="h-auto min-h-[360px] w-full rounded-[2rem] border border-border object-cover object-center shadow-soft"
                        loading="lazy"
                      />

                      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-7">
                        <div className="text-2xl font-black text-foreground md:text-3xl">
                          מקצועות משלימים
                        </div>

                        <div className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                          תיאוריה, קריאת תווים, סולפז׳, הקשבה, קצב ופיתוח שמיעה —
                          שכבה שמעמיקה את היציבות ואת ההבנה המוסיקלית של התלמידה.
                        </div>

                        <div className="mt-5 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                          {SUPPORT_STUDIES.map((item) => (
                            <span
                              key={item}
                              className="rounded-full bg-secondary px-3.5 py-2 text-sm text-secondary-foreground ring-1 ring-border md:text-base"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid items-start gap-5 md:grid-cols-2">
                      {PRIMARY_STUDIES.map(({ key, title, subtitle, Icon, bullets }) => (
                        <div
                          key={key}
                          className="flex h-full flex-col rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-7"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-2xl font-black text-foreground md:text-3xl">
                                {title}
                              </div>
                              <div className="mt-2 text-base text-muted-foreground">
                                {subtitle}
                              </div>
                            </div>

                            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                              <Icon className="h-7 w-7 text-primary" />
                            </span>
                          </div>

                          <ul className="mt-6 space-y-3">
                            {bullets.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-3 text-base">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span className="leading-relaxed text-muted-foreground">
                                  {bullet}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <a href={EDUCATIONAL_ORCHESTRA_HREF} className="block">
                      <div className="rounded-[2rem] border border-border bg-card px-8 py-8 text-center shadow-soft md:px-10 md:py-10">
                        <div className="text-3xl font-black text-foreground md:text-4xl">
                          תזמורות לימודיות
                        </div>
                        <div className="mx-auto mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-2xl">
                          מסגרת שמפתחת הקשבה, אחריות, קצב ויכולת להשתלב בתוך מרקם
                          מוסיקלי.
                        </div>
                        <div className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-primary md:text-lg">
                          לעמוד התזמורות
                          <ArrowLeft className="h-4 w-4" />
                        </div>
                      </div>
                    </a>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={130}>
                <section
                  id="belief-section"
                  className="scroll-mt-28 pt-2"
                  onMouseEnter={() => setActiveOrbitId("3")}
                >
                  <div className="relative overflow-hidden rounded-[2.2rem] border border-border shadow-soft">
                    <img
                      src={studentsStageAtmosphereWide}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-background/85 dark:bg-background/80" />

                    <div className="relative grid gap-8 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.02fr_0.98fr]">
                      <div className="space-y-4">
                        <div className="rounded-[1.7rem] border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm md:p-8">
                          <div className="inline-flex items-center gap-3">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                              <Quote className="h-6 w-6 text-primary" />
                            </span>
                            <div className="text-sm font-medium text-muted-foreground md:text-base">
                              הדרך שלי
                            </div>
                          </div>

                          <div className="mt-6 text-3xl font-black leading-tight text-foreground md:text-5xl">
                            לא עבודה טכנית,
                            <span className="mt-2 block">אלא חתימת דרך</span>
                          </div>

                          <div className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                            כאן הדגש הוא על קו ברור, רמת ציפייה גבוהה והחזקת תהליך
                            לאורך זמן — עם עומק, בהירות, רגישות וסדר.
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {BELIEF_LINES.map((belief, idx) => (
                          <div
                            key={belief}
                            className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 px-5 py-4 shadow-soft backdrop-blur-sm"
                          >
                            <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/18">
                              {idx + 1}
                            </div>
                            <div className="text-sm leading-relaxed text-foreground md:text-base">
                              {belief}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={150}>
                <section
                  id="process-section"
                  className="scroll-mt-28 pt-2"
                  onMouseEnter={() => setActiveOrbitId("4")}
                >
                  <div className="grid items-start gap-8 lg:grid-cols-[0.96fr_1.04fr]">
                    <img
                      src={studentsStudyMaterials}
                      alt="חומרי לימוד וסביבת עבודה"
                      className="h-auto min-h-[380px] w-full rounded-[2rem] border border-border object-cover object-center shadow-soft"
                      loading="lazy"
                    />

                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15 md:text-sm">
                        <ClipboardList className="h-4 w-4" />
                        איך זה עובד בפועל
                      </div>

                      <h2 className="mt-4 text-3xl font-black text-foreground sm:text-4xl md:text-5xl">
                        שיעור, תרגול, רצף ומעקב
                      </h2>

                      <div className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
                        כאן לא לומדים רק בתוך השיעור. השיעור נותן כיוון ברור,
                        והתהליך ממשיך בין המפגשים — עם מסגרת, חומרים, משימות ודרך
                        עבודה שמחזיקה את ההתקדמות.
                      </div>

                      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {HOW_IT_WORKS.map(({ key, title, text, Icon }) => (
                          <div
                            key={key}
                            className="rounded-[1.5rem] border border-border bg-card p-5 shadow-soft md:p-6"
                          >
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                              <Icon className="h-6 w-6 text-primary" />
                            </span>

                            <div className="mt-4 text-lg font-black text-foreground md:text-xl">
                              {title}
                            </div>
                            <div className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                              {text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={170}>
                <section
                  id="system-section"
                  className="scroll-mt-28 pt-2"
                  onMouseEnter={() => setActiveOrbitId("5")}
                >
                  <div className="grid items-start gap-8 lg:grid-cols-[1.04fr_0.96fr]">
                    <div className="space-y-4">
                      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15 md:text-sm">
                        <Smartphone className="h-4 w-4" />
                        מערכת התלמידות
                      </div>

                      <h2 className="text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
                        מערכת שממשיכה את הלמידה
                        <span className="mt-2 block">גם בין השיעורים</span>
                      </h2>

                      <div className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
                        זה האזור הנכון להפנות ממנו לדמו ולכניסה. כאן כבר מבינים מהי
                        המעטפת, ולכן אפשר לראות איך זה נראה בפועל.
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {APP_FEATURES.map(({ key, title, text, Icon }) => (
                          <div
                            key={key}
                            className="flex items-start gap-4 rounded-2xl border border-border bg-card px-4 py-4 shadow-soft"
                          >
                            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                              <Icon className="h-5 w-5 text-primary" />
                            </span>

                            <span className="min-w-0">
                              <span className="block text-sm font-black text-foreground md:text-base">
                                {title}
                              </span>
                              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground md:text-base">
                                {text}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>

                      <div>
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-12 rounded-2xl px-6 text-sm font-semibold md:text-base"
                          onClick={() => setOpenSmartSystem(true)}
                        >
                          מה כוללת המערכת
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <img
                        src={studentsDemoSystemPreview}
                        alt="תצוגה מקדימה של מערכת התלמידות"
                        className="h-auto min-h-[420px] w-full rounded-[2rem] border border-border object-cover object-center shadow-soft"
                        loading="lazy"
                      />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Button
                          asChild
                          size="lg"
                          className="h-14 rounded-[1.3rem] text-base font-black"
                        >
                          <a href={STUDENTS_DEMO_HREF}>להדגמה</a>
                        </Button>

                        <Button
                          asChild
                          variant="secondary"
                          size="lg"
                          className="h-14 rounded-[1.3rem] text-base font-black"
                        >
                          <a
                            href={STUDENTS_APP_HREF}
                            target="_blank"
                            rel="noreferrer"
                          >
                            לכניסה
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={190}>
                <section>
                  <div className="rounded-[2rem] border border-border bg-card px-5 py-5 shadow-soft md:px-7 md:py-6">
                    <div className="grid grid-cols-2 gap-5 text-center md:grid-cols-3 xl:grid-cols-6">
                      {NUMBERS.map((item) => (
                        <div key={item.label}>
                          <div className="text-2xl font-black text-primary md:text-4xl">
                            {item.value}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground md:text-sm">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={220}>
                <section className="flex justify-center">
                  <div className="w-full max-w-4xl rounded-[2rem] border border-border bg-card px-6 py-8 shadow-soft md:px-10 md:py-10">
                    <div className="text-center">
                      <div className="text-2xl font-black leading-tight text-foreground md:text-4xl">
                        יש לך שאלות?
                      </div>

                      <div className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-lg">
                        אפשר לפנות דרך דף צור קשר, לראות את הדמו של המערכת,
                        להיכנס ישירות לתוכנה, או להכיר גם את צד ההוראה שמאחורי
                        הדרך הזו.
                      </div>

                      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                        <Button
                          asChild
                          size="lg"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                        >
                          <a href={CONTACT_STUDENTS_HREF}>צור קשר</a>
                        </Button>

                        <Button
                          asChild
                          variant="secondary"
                          size="lg"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                        >
                          <a href={STUDENTS_DEMO_HREF}>להדגמה</a>
                        </Button>

                        <Button
                          asChild
                          variant="secondary"
                          size="lg"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                        >
                          <a href={STUDENTS_APP_HREF} target="_blank" rel="noreferrer">
                            לכניסה
                          </a>
                        </Button>

                        <Button
                          asChild
                          variant="secondary"
                          size="lg"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                        >
                          <a href={ABOUT_TEACHING_HREF}>להכיר אותי</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>
            </div>
          </div>
        </OrbitPageShell>

        <Dialog open={openSmartSystem} onOpenChange={setOpenSmartSystem}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>מה כוללת מערכת התלמידות</DialogTitle>
              <DialogDescription>
                מעטפת שממשיכה את הלמידה גם בין השיעורים, ומחזיקה את התהליך בצורה
                מסודרת וברורה.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 pt-2">
              {APP_FEATURES.map(({ key, title, text, Icon }) => (
                <div
                  key={key}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card/60 px-4 py-4"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>

                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground md:text-base">
                      {title}
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button asChild className="rounded-2xl">
                <a href={STUDENTS_APP_HREF} target="_blank" rel="noreferrer">
                  כניסה לתוכנה
                </a>
              </Button>

              <Button asChild variant="secondary" className="rounded-2xl">
                <a href={STUDENTS_DEMO_HREF}>לצפייה בדמו</a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </InnerPageLayout>
  );
}
