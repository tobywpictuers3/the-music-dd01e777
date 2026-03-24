import type { ComponentType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import InnerPageLayout from "@/components/InnerPageLayout";
import InnerPageOrbitHero from "@/components/brand/InnerPageOrbitHero";
import AppearOnScroll from "@/components/AppearOnScroll";
import {
  studentsOrbitItems,
  studentsPresenterAssets,
} from "@/content/orbit/studentsOrbit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  Users,
  Video,
  Volume2,
  X,
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

/* =========================================================
   RED2 במקום RED3
   ========================================================= */
import red2Texture from "@/assets/red2.png";

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
const EDUCATIONAL_ORCHESTRA_HREF = "/educational-orchestra";

/* =========================================================
   כיוון טקסט ההירו
   ========================================================= */
const HERO_COPY_SHIFT_X = "12px";
const HERO_COPY_SHIFT_Y = "-22px";
const HERO_COPY_MAX_WIDTH = "760px";

/* =========================================================
   טקסטים
   ========================================================= */
const HERO_INFO_BANNER_TEXT =
  "מסלול שמחזיק תלמידה לאורך זמן — עם רמה, מסגרת, ליווי ודרך עבודה מסודרת.";

const HERO_PIANO_QUOTE =
  "המסלול כאן לא בנוי כעוד שיעור חד־פעמי, אלא כדרך מוסיקלית שיש בה רצף, מסגרת, דיוק ועומק. מי שנכנסת למסלול מקבלת גם בהירות מקצועית וגם ליווי אנושי — בצורה מסודרת, מזמינה וברורה לעין.";

const FLOATING_BUBBLES_BY_SECTION: Record<string, string> = {
  "studies-section":
    "הוראת מוסיקה עבורי היא לא רק תיקון תווים וצלילים. זו בנייה של יציבות, קריאה, הקשבה, אחריות ויכולת להחזיק תהליך לאורך זמן.",
  "belief-section":
    "מוסיקה עבורי נבנית מתוך עומק והשקעה, לא בקיצורי דרך. יחס אישי אינו סותר דרישות גבוהות — הוא מאפשר אותן.",
  "process-section":
    "כאן כבר רואים איך התהליך מוחזק בפועל: שיעור, תרגול, חומרים, רצף ומעקב — בלי להתפזר.",
  "system-section":
    "המערכת לא מחליפה את הלמידה — היא מחזיקה אותה גם בין השיעורים, בצורה מסודרת, ברורה ונעימה לעין.",
};

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
      "כל השבוע חיכיתי לשיעור פסנתר; היתה אוירה נעימה, זורמת ולא מלחיצה — ממש חוויה.",
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
    Icon: Music2,
    bullets: [
      "עבודה יסודית על טכניקות מגוונות של נגינה",
      "ישיבה נכונה, משקל ויציבה משוחררת",
      "פיתוח יכולת קריאה מהדף — prima vista",
      "פיתוח קואורדינציה מורכבת והבעה מוסיקלית",
      "פינה בשיעור לפיתוח נגינה לפי שמיעה, ליווי שירים ופירוקי פסנתר",
    ],
  },
  {
    key: "flute",
    title: "חליל צד",
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
        "inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/75 text-white ring-1 ring-white/10 transition hover:-translate-y-[1px] hover:bg-black",
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

/* ---------------------------------------------------------
   משטח RED2 אחיד לכל הדף
   עם אותה שכבת על יפה כמו באודות
   --------------------------------------------------------- */
type Red2SurfaceProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  roundedNone?: boolean;
};

function Red2Surface({
  children,
  className,
  innerClassName,
  roundedNone = false,
}: Red2SurfaceProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden ring-1 ring-white/8 shadow-[0_18px_50px_rgba(0,0,0,0.20)]",
        roundedNone ? "rounded-none" : "rounded-[2rem]",
        className
      )}
      style={{
        backgroundImage: `url(${red2Texture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#4b0e16",
      }}
    >
      {/* שכבה בהירה למצב בהיר */}
      <div className="absolute inset-0 bg-white/14 dark:hidden" />
      {/* שכבה כהה למצב כהה */}
      <div className="absolute inset-0 hidden bg-black/24 dark:block" />

      {/* שכבת mix-blend-screen כמו באודות */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.07] dark:opacity-[0.14] mix-blend-screen"
        style={{ backgroundImage: `url(${red2Texture})` }}
      />

      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-primary/20 via-primary/8 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-primary/20 via-primary/8 to-transparent" />

      <div className={cn("relative", innerClassName)}>{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------
   בועת דיבור
   --------------------------------------------------------- */
type SpeechBubbleProps = {
  children: ReactNode;
  tail?: "left" | "right";
  className?: string;
  onClose?: () => void;
};

function SpeechBubble({
  children,
  tail = "right",
  className,
  onClose,
}: SpeechBubbleProps) {
  return (
    <Red2Surface className={cn("px-5 py-5 md:px-6 md:py-6", className)}>
      <span
        className={cn(
          "absolute top-1/2 z-10 -translate-y-1/2 border-y-[18px] border-y-transparent",
          tail === "right"
            ? "-right-6 border-l-[34px] border-l-[#5c111b]"
            : "-left-6 border-r-[34px] border-r-[#5c111b]"
        )}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/20 ring-1 ring-white/10">
          <Quote className="h-5 w-5 text-primary" />
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="סגירת בועה"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/10 transition hover:bg-black/65"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="rounded-[1.25rem] bg-black/16 px-4 py-3 backdrop-blur-[1px] dark:bg-black/22">
        <div className="text-base leading-8 text-foreground/95 md:text-lg">
          {children}
        </div>
      </div>
    </Red2Surface>
  );
}

/* ---------------------------------------------------------
   מגיש קטן קבוע
   --------------------------------------------------------- */
type FloatingPresenterProps = {
  visible: boolean;
  bubbleVisible: boolean;
  text: string;
  speaking: boolean;
  onSpeak: () => void;
  onClose: () => void;
};

function FloatingPresenter({
  visible,
  bubbleVisible,
  text,
  speaking,
  onSpeak,
  onClose,
}: FloatingPresenterProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-28 right-5 z-50 hidden transition-all duration-300 xl:block",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <div className="pointer-events-auto flex items-end gap-3">
        <div className="flex flex-col items-center gap-3">
          <AudioIconButton speaking={speaking} onClick={onSpeak} />
          <img
            src={studentsPresenterMain}
            alt="מגישה מלווה"
            className="h-auto w-[118px] object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.24)]"
            loading="lazy"
          />
        </div>

        <div
          className={cn(
            "transition-all duration-500",
            bubbleVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          )}
        >
          <SpeechBubble tail="right" onClose={onClose} className="max-w-[360px]">
            <div className="text-right text-lg">“{text}”</div>
          </SpeechBubble>
        </div>
      </div>
    </div>
  );
}

export default function Students() {
  const [openSmartSystem, setOpenSmartSystem] = useState(false);
  const [openQuestionsChooser, setOpenQuestionsChooser] = useState(false);
  const [tIndex, setTIndex] = useState(0);
  const [activeOrbitId, setActiveOrbitId] = useState("track");
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const [showMiniPresenter, setShowMiniPresenter] = useState(false);
  const [floatingBubbleText, setFloatingBubbleText] = useState("");
  const [floatingBubbleVisible, setFloatingBubbleVisible] = useState(false);

  const testimonialPauseRef = useRef(false);
  const heroPresenterSectionRef = useRef<HTMLElement | null>(null);
  const floatingBubbleTimerRef = useRef<number | null>(null);

  function toggleSpeech(key: string, text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;

    if (speakingKey === key && synth.speaking) {
      synth.cancel();
      setSpeakingKey(null);
      return;
    }

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "he-IL";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onend = () =>
      setSpeakingKey((current) => (current === key ? null : current));
    utterance.onerror = () =>
      setSpeakingKey((current) => (current === key ? null : current));

    setSpeakingKey(key);
    synth.speak(utterance);
  }

  function openFloatingBubble(text: string) {
    setFloatingBubbleText(text);
    setFloatingBubbleVisible(true);

    if (floatingBubbleTimerRef.current) {
      window.clearTimeout(floatingBubbleTimerRef.current);
    }

    floatingBubbleTimerRef.current = window.setTimeout(() => {
      setFloatingBubbleVisible(false);
    }, 25000);
  }

  function closeFloatingBubble() {
    if (floatingBubbleTimerRef.current) {
      window.clearTimeout(floatingBubbleTimerRef.current);
    }
    setFloatingBubbleVisible(false);
  }

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (floatingBubbleTimerRef.current) {
        window.clearTimeout(floatingBubbleTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (testimonialPauseRef.current) return;
      setTIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8500);

    return () => window.clearInterval(id);
  }, []);

  /* המגיש הקטן */
  useEffect(() => {
    function onScroll() {
      setShowMiniPresenter(window.scrollY > 540);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (showMiniPresenter && !floatingBubbleText) {
      openFloatingBubble(FLOATING_BUBBLES_BY_SECTION["studies-section"]);
    }
  }, [showMiniPresenter, floatingBubbleText]);

  useEffect(() => {
    const sectionIds = Object.keys(FLOATING_BUBBLES_BY_SECTION);

    const nodes = sectionIds
      .map((id) => {
        const el = document.getElementById(id);
        return el ? { id, el } : null;
      })
      .filter(Boolean) as Array<{ id: string; el: HTMLElement }>;

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const matched = nodes.find((item) => item.el === visible.target);
        if (!matched) return;

        const text = FLOATING_BUBBLES_BY_SECTION[matched.id];
        if (text && showMiniPresenter) {
          openFloatingBubble(text);
        }
      },
      {
        threshold: 0.34,
        rootMargin: "-8% 0px -18% 0px",
      }
    );

    nodes.forEach((item) => observer.observe(item.el));
    return () => observer.disconnect();
  }, [showMiniPresenter]);

  function scrollToSection(sectionId?: string, orbitId?: string) {
    if (orbitId) setActiveOrbitId(orbitId);
    if (!sectionId) return;

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  useEffect(() => {
    const observableItems = studentsOrbitItems.filter(
      (item) => typeof item.sectionId === "string" && item.sectionId.length > 0
    );

    const elements = observableItems
      .map((item) => {
        const el = document.getElementById(item.sectionId!);
        return el ? { item, el } : null;
      })
      .filter(Boolean) as Array<{
      item: (typeof studentsOrbitItems)[number];
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
          setActiveOrbitId(matched.item.id);
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
  const currentFloatingText =
    floatingBubbleText || FLOATING_BUBBLES_BY_SECTION["studies-section"];

  const heroSupportBlock: ReactNode = null;

  const centerBadge = (
    <div className="flex h-[220px] w-[220px] flex-col items-center justify-center rounded-full border border-primary/20 bg-background/70 px-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm md:h-[280px] md:w-[280px]">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15 md:h-16 md:w-16">
        <Users className="h-7 w-7 text-primary md:h-8 md:w-8" />
      </span>

      <div className="mt-4 text-2xl font-bold leading-tight md:text-3xl">
        תלמידות
      </div>

      <div className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">
        עומק, מסגרת,
        <br />
        ורצף אמיתי
      </div>
    </div>
  );

  return (
    <InnerPageLayout
      title="תלמידות"
      description="מסלול מוסיקלי יסודי, אנושי ומסודר לתלמידות — עם שיעור, תרגול, רצף ומערכת תומכת."
    >
      <main dir="rtl" className="pb-40">
        <style>{`
          @keyframes studentsFadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes studentsTicker {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }

          .students-fade-in {
            animation: studentsFadeIn 420ms ease-out;
          }

          .students-fixed-ticker-track {
            width: max-content;
            animation: studentsTicker 96s linear infinite;
          }

          .students-hero-shell {
            --students-hero-copy-shift-x: ${HERO_COPY_SHIFT_X};
            --students-hero-copy-shift-y: ${HERO_COPY_SHIFT_Y};
            --students-hero-copy-max-width: ${HERO_COPY_MAX_WIDTH};
          }

          @media (min-width: 1024px) {
            .students-hero-shell .grid > :last-child {
              position: relative;
              right: var(--students-hero-copy-shift-x);
              top: var(--students-hero-copy-shift-y);
              max-width: var(--students-hero-copy-max-width);
              margin-inline-start: auto;
            }
          }
        `}</style>

        {/* HERO */}
        <div className="students-hero-shell">
          <InnerPageOrbitHero
            eyebrow="תלמידות"
            title={["לא רק שיעורי נגינה שבועיים,", "אלא דרך", "מוזיקלית שלמה"]}
            intro={[
              "כאן לומדים מוסיקה מתוך בהירות, הקשבה, דיוק ורצף.",
              "לא כמפגש חד־פעמי, אלא כמסלול שמחזיק תלמידה לאורך זמן — עם רמה, מסגרת, ליווי ודרך עבודה מסודרת.",
            ]}
            support={heroSupportBlock}
            orbitItems={studentsOrbitItems}
            presenterAssets={studentsPresenterAssets}
            activeOrbitId={activeOrbitId}
            presenterAlt="מגישת דף תלמידות"
            onOrbitItemClick={(item) =>
              scrollToSection(item.sectionId, item.id)
            }
            center={centerBadge}
          />
        </div>

        <div className="pb-16">
          <div className="mx-auto max-w-6xl space-y-10 px-6 md:space-y-14">
            {/* כפתורים מתחת להירו */}
            <AppearOnScroll delay={24}>
              <section className="-mt-2 md:-mt-3">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      asChild
                      size="lg"
                      className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                    >
                      <a href={CONTACT_STUDENTS_HREF}>לפרטים ולהרשמה</a>
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:min-w-[760px]">
                    <button
                      type="button"
                      onClick={() => setOpenSmartSystem(true)}
                      className="group overflow-hidden rounded-3xl bg-card/82 px-6 py-5 text-right shadow-soft ring-1 ring-border backdrop-blur-sm transition-all duration-300 hover:-translate-y-[2px]"
                    >
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                          <Smartphone className="h-7 w-7 text-primary" />
                        </span>

                        <span className="min-w-0">
                          <span className="block text-lg font-semibold transition-colors group-hover:text-primary">
                            מה יש בתוך המערכת
                          </span>
                          <span className="mt-1 block text-sm text-muted-foreground">
                            מבט מהיר על המעטפת הדיגיטלית שמלווה את התלמידות
                          </span>
                        </span>
                      </div>
                    </button>

                    <a
                      href={STUDENTS_DEMO_HREF}
                      className="group overflow-hidden rounded-3xl bg-card/82 px-6 py-5 shadow-soft ring-1 ring-border backdrop-blur-sm transition-all duration-300 hover:-translate-y-[2px]"
                    >
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                          <Video className="h-7 w-7 text-primary" />
                        </span>

                        <span className="min-w-0">
                          <span className="block text-lg font-semibold transition-colors group-hover:text-primary">
                            דמו מערכת התלמידות
                          </span>
                          <span className="mt-1 block text-sm text-muted-foreground">
                            לצפייה בהדגמות ובצילומי מסך מהמערכת
                          </span>
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </section>
            </AppearOnScroll>

            {/* באנר RED2 לכל הרוחב */}
            <AppearOnScroll delay={30}>
              <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
                <Red2Surface roundedNone className="ring-0 shadow-none">
                  <div className="mx-auto max-w-6xl px-5 py-7 md:px-8 md:py-8">
                    <div className="flex justify-center">
                      <div className="rounded-[1.2rem] bg-black/18 px-8 py-4 text-center text-xl font-bold leading-9 text-foreground md:text-3xl dark:bg-black/26">
                        {HERO_INFO_BANNER_TEXT}
                      </div>
                    </div>
                  </div>
                </Red2Surface>
              </section>
            </AppearOnScroll>

            {/* מגיש ראשי */}
            <AppearOnScroll delay={54}>
              <section ref={heroPresenterSectionRef} className="pt-2">
                <div className="grid items-center gap-8 lg:grid-cols-[1.04fr_0.96fr]">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium ring-1 ring-primary/15 md:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      כך נראה תהליך נכון
                    </div>

                    <h2 className="text-3xl font-bold leading-tight md:text-5xl">
                      צורת העבודה שלי מתאימה למי שמוכנה
                      <span className="mt-2 inline-block shimmer-gold">
                        להתמסר לתהליך אמיתי
                      </span>
                    </h2>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-[1.75rem] bg-card/68 px-5 py-5 ring-1 ring-border/70">
                        <div className="text-base font-semibold md:text-lg">
                          מה חשוב לי במיוחד
                        </div>
                        <div className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                          עומק, עקביות, שקט מקצועי, ובהירות שמאפשרת לתלמידה להתקדם מתוך ביטחון.
                        </div>
                      </div>

                      <div className="rounded-[1.75rem] bg-card/68 px-5 py-5 ring-1 ring-border/70">
                        <div className="text-base font-semibold md:text-lg">
                          מה יוצא מזה בפועל
                        </div>
                        <div className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                          מסלול שמחזיק לאורך זמן, עם רמה, מסגרת, ליווי ודרך עבודה מסודרת.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-center gap-4">
                    <div className="flex flex-col items-center gap-4">
                      <AudioIconButton
                        speaking={speakingKey === "hero-piano"}
                        onClick={() =>
                          toggleSpeech("hero-piano", HERO_PIANO_QUOTE)
                        }
                      />

                      <img
                        src={studentsPresenterMain}
                        alt="מגישת דף התלמידות"
                        className="h-auto w-full max-w-[470px] object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.28)] md:max-w-[550px]"
                        loading="eager"
                      />
                    </div>

                    <SpeechBubble
                      tail="right"
                      className="max-w-[560px] self-center"
                    >
                      <div className="text-right text-lg md:text-xl">
                        “{HERO_PIANO_QUOTE}”
                      </div>
                    </SpeechBubble>
                  </div>
                </div>
              </section>
            </AppearOnScroll>

            {/* TRACK */}
            <AppearOnScroll delay={82}>
              <section
                id="track-section"
                className="scroll-mt-28 pt-2"
                onMouseEnter={() => setActiveOrbitId("track")}
                onMouseLeave={() => {
                  testimonialPauseRef.current = false;
                }}
              >
                <div className="grid items-center gap-8 xl:grid-cols-[1fr_auto_1fr]">
                  <SpeechBubble tail="left" className="mx-auto w-full max-w-[460px]">
                    <div className="space-y-4 text-right">
                      <div className="text-2xl font-bold leading-tight md:text-3xl">
                        מסלול מקצועי, אנושי
                        <span className="mt-2 inline-block shimmer-gold">
                          ועם רף ברור
                        </span>
                      </div>

                      <ul className="space-y-2.5 text-base leading-relaxed text-foreground/95">
                        <li>לתלמידות שמוכנות לתהליך ולא רק להתנסות.</li>
                        <li>למי שמחפשת ליווי, סדר ומסגרת מחזיקה.</li>
                        <li>למי שחשוב לה יחס אישי יחד עם דרישה מקצועית.</li>
                      </ul>

                      <a
                        href={CONTACT_STUDENTS_HREF}
                        className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-[1px] md:text-base"
                      >
                        בדיקת התאמה למסלול
                        <ArrowLeft className="h-4 w-4" />
                      </a>
                    </div>
                  </SpeechBubble>

                  <div className="relative flex flex-col items-center justify-center">
                    <img
                      src={studentsTestimonialsAnnouncer}
                      alt="כרוז אזור ההמלצות"
                      className="h-auto w-full max-w-[300px] object-contain drop-shadow-[0_24px_52px_rgba(0,0,0,0.26)] md:max-w-[340px]"
                      loading="lazy"
                    />
                  </div>

                  <div
                    className="mx-auto w-full max-w-[460px]"
                    onMouseEnter={() => {
                      testimonialPauseRef.current = true;
                      setActiveOrbitId("track");
                    }}
                    onMouseLeave={() => {
                      testimonialPauseRef.current = false;
                    }}
                  >
                    <SpeechBubble tail="right" className="w-full">
                      <div>
                        <div key={currentTestimonial.key} className="students-fade-in">
                          <div className="text-2xl font-semibold leading-relaxed md:text-3xl">
                            “{currentTestimonial.quote}”
                          </div>

                          <div className="mt-5 text-base text-foreground/82">
                            <span className="font-semibold text-foreground">
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

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            {TESTIMONIALS.map((item, i) => (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() => setTIndex(i)}
                                className={cn(
                                  "h-2.5 w-2.5 rounded-full transition-all",
                                  i === tIndex
                                    ? "scale-110 bg-primary"
                                    : "bg-transparent ring-1 ring-primary/35 hover:bg-primary/40"
                                )}
                                aria-label={`המלצה ${i + 1}`}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              className="h-11 rounded-2xl px-4 text-sm"
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
                              className="h-11 rounded-2xl px-4 text-sm"
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
                    </SpeechBubble>
                  </div>
                </div>
              </section>
            </AppearOnScroll>

            {/* STUDIES */}
            <AppearOnScroll delay={110}>
              <section
                id="studies-section"
                className="scroll-mt-28 pt-2"
                onMouseEnter={() => setActiveOrbitId("studies")}
              >
                <div className="grid items-start gap-8 lg:grid-cols-[0.98fr_1.02fr]">
                  <img
                    src={studentsLearningTouch}
                    alt="חוויית למידה ונגינה"
                    className="h-auto min-h-[330px] w-full rounded-[2.25rem] object-cover object-center shadow-[0_22px_60px_rgba(0,0,0,0.18)]"
                    loading="lazy"
                  />

                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium ring-1 ring-primary/15 md:text-sm">
                      <Music2 className="h-4 w-4 text-primary" />
                      מה לומדים כאן
                    </div>

                    <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                      תחומי הלימוד
                    </h2>

                    <div className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
                      השיעורים נבנים מתוך עומק מקצועי, התאמה אישית ומסלול התקדמות ברור. כאן התוכן
                      נשאר ברור, והתמונות רק מלוות אותו — לא חונקות אותו.
                    </div>

                    <div className="mt-8 grid items-start gap-5 md:grid-cols-2">
                      {PRIMARY_STUDIES.map(
                        ({ key, title, subtitle, Icon, bullets }) => (
                          <div
                            key={key}
                            className="flex h-full flex-col rounded-3xl bg-card/66 px-6 py-6 ring-1 ring-border/70 md:px-7 md:py-7"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-2xl font-bold md:text-3xl">{title}</div>
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
                                <li
                                  key={bullet}
                                  className="flex items-start gap-3 text-base"
                                >
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                  <span className="leading-relaxed text-muted-foreground">
                                    {bullet}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-6">
                      <div className="text-xl font-semibold">מקצועות משלימים</div>

                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {SUPPORT_STUDIES.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-card/70 px-3.5 py-2 text-sm ring-1 ring-border/70 md:text-base"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a href={EDUCATIONAL_ORCHESTRA_HREF} className="mt-6 block">
                      <Red2Surface className="px-6 py-5 md:px-7">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="rounded-[1.2rem] bg-black/14 px-4 py-3 dark:bg-black/20">
                            <div className="text-xl font-bold md:text-2xl">
                              תזמורות לימודיות
                            </div>
                            <div className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/95 md:text-base">
                              מסגרת שמפתחת הקשבה, אחריות, קצב ויכולת להשתלב בתוך מרקם מוסיקלי.
                            </div>
                          </div>

                          <div className="inline-flex items-center gap-2 rounded-full bg-black/18 px-4 py-2 text-sm font-medium ring-1 ring-white/10">
                            לעמוד התזמורות
                            <ArrowLeft className="h-4 w-4" />
                          </div>
                        </div>
                      </Red2Surface>
                    </a>
                  </div>
                </div>
              </section>
            </AppearOnScroll>

            {/* BELIEF - רקע רק מתחת לטקסט */}
            <AppearOnScroll delay={130}>
              <section
                id="belief-section"
                className="scroll-mt-28 pt-2"
                onMouseEnter={() => setActiveOrbitId("belief")}
              >
                <div
                  className="relative overflow-hidden rounded-[2.4rem] ring-1 ring-border/70 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
                  style={{
                    backgroundImage: `url(${studentsStageAtmosphereWide})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="relative grid items-start gap-8 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.02fr_0.98fr]">
                    <div className="space-y-5 lg:order-2">
                      <div className="rounded-[1.9rem] bg-background/76 px-6 py-6 ring-1 ring-border/70 backdrop-blur-sm md:px-8 md:py-8 dark:bg-background/82">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                            <Quote className="h-6 w-6 text-primary" />
                          </span>
                          <div className="text-sm font-medium text-foreground/80 md:text-base">
                            הדרך שלי
                          </div>
                        </div>

                        <div className="mt-6 text-3xl font-bold leading-tight md:text-5xl">
                          לא עבודה טכנית,
                          <span className="mt-2 inline-block shimmer-gold">
                            אלא חתימת דרך
                          </span>
                        </div>

                        <div className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                          כאן אין עוד פסקת הסבר מיותרת. הדגש הוא על קו ברור, רמת ציפייה גבוהה,
                          והחזקת תהליך לאורך זמן — בצורה שקטה, נקייה ונעימה יותר לעין.
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {BELIEF_LINES.map((belief, idx) => (
                          <div
                            key={belief}
                            className="flex items-center gap-4 rounded-2xl bg-background/74 px-5 py-4 ring-1 ring-border/70 backdrop-blur-sm dark:bg-background/82"
                          >
                            <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/15">
                              {idx + 1}
                            </div>
                            <div className="text-sm leading-relaxed text-foreground/86 md:text-base">
                              {belief}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="min-h-[500px] lg:order-1" />
                  </div>
                </div>
              </section>
            </AppearOnScroll>

            {/* PROCESS */}
            <AppearOnScroll delay={150}>
              <section
                id="process-section"
                className="scroll-mt-28 pt-2"
                onMouseEnter={() => setActiveOrbitId("process")}
              >
                <div className="grid items-start gap-8 lg:grid-cols-[0.96fr_1.04fr]">
                  <img
                    src={studentsStudyMaterials}
                    alt="חומרי לימוד וסביבת עבודה"
                    className="h-auto min-h-[360px] w-full rounded-[2.25rem] object-cover object-center shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
                    loading="lazy"
                  />

                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium ring-1 ring-primary/15 md:text-sm">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      איך זה עובד בפועל
                    </div>

                    <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                      שיעור, תרגול, רצף ומעקב
                    </h2>

                    <div className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
                      כאן לא לומדים רק בתוך השיעור. השיעור נותן כיוון ברור, והתהליך ממשיך בין
                      המפגשים — עם מסגרת, חומרים, משימות ודרך עבודה שמחזיקה את ההתקדמות.
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {HOW_IT_WORKS.map(({ key, title, text, Icon }) => (
                        <div
                          key={key}
                          className="rounded-[1.75rem] bg-card/62 px-5 py-5 ring-1 ring-border/70 md:px-6 md:py-6"
                        >
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                            <Icon className="h-6 w-6 text-primary" />
                          </span>

                          <div className="mt-4 text-lg font-semibold">{title}</div>
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

            {/* SYSTEM */}
            <AppearOnScroll delay={170}>
              <section
                id="system-section"
                className="scroll-mt-28 pt-2"
                onMouseEnter={() => setActiveOrbitId("system")}
              >
                <div className="grid items-start gap-8 lg:grid-cols-[1.04fr_0.96fr]">
                  <div className="space-y-4">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium ring-1 ring-primary/15 md:text-sm">
                      <Smartphone className="h-4 w-4 text-primary" />
                      מערכת התלמידות
                    </div>

                    <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                      מערכת שממשיכה את הלמידה
                      <span className="mt-2 inline-block shimmer-gold">
                        גם בין השיעורים
                      </span>
                    </h2>

                    <div className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
                      זה האזור הנכון בדף להפנות ממנו לדמו. כאן כבר מבינים מהי המעטפת, ולכן השלב
                      הזה מתאים לתת לראות איך זה נראה בפועל.
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {APP_FEATURES.map(({ key, title, text, Icon }) => (
                        <div
                          key={key}
                          className="flex items-start gap-4 rounded-2xl bg-card/62 px-4 py-4 ring-1 ring-border/70"
                        >
                          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                            <Icon className="h-5 w-5 text-primary" />
                          </span>

                          <span className="min-w-0">
                            <span className="block text-sm font-semibold md:text-base">
                              {title}
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground md:text-base">
                              {text}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        asChild
                        size="lg"
                        className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                      >
                        <a href={STUDENTS_APP_HREF} target="_blank" rel="noreferrer">
                          כניסה לתוכנת התלמידות
                        </a>
                      </Button>

                      <Button
                        asChild
                        variant="secondary"
                        size="lg"
                        className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                      >
                        <a href={STUDENTS_DEMO_HREF}>
                          לצפייה בדמו מערכת התלמידות
                        </a>
                      </Button>
                    </div>
                  </div>

                  <img
                    src={studentsDemoSystemPreview}
                    alt="תצוגה מקדימה של מערכת התלמידות"
                    className="h-auto min-h-[420px] w-full rounded-[2.25rem] object-cover object-center shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
                    loading="lazy"
                  />
                </div>
              </section>
            </AppearOnScroll>

            {/* מספרים */}
            <AppearOnScroll delay={190}>
              <section className="relative overflow-hidden rounded-[2rem] bg-primary/10 px-5 py-5 shadow-soft ring-1 ring-primary/15 md:px-7 md:py-6">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-10">
                  {NUMBERS.map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="inline-block text-2xl font-bold shimmer-gold md:text-4xl">
                        {item.value}
                      </div>
                      <div className="mt-1 text-xs text-foreground/75 md:text-sm">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </AppearOnScroll>

            {/* CTA */}
            <AppearOnScroll delay={220}>
              <section className="flex justify-center">
                <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] bg-card/72 px-6 py-8 shadow-soft ring-1 ring-border backdrop-blur-sm md:px-10 md:py-10">
                  <div className="text-center">
                    <div className="text-2xl font-bold leading-tight md:text-4xl">
                      יש לך שאלות נוספות?
                    </div>

                    <div className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-lg">
                      אפשר לבדוק התאמה לקבלה, לצפות בהדגמה של תוכנת התלמידות, ואם את תלמידה
                      בפועל — להיכנס מכאן לתוכנה באמצעות קוד התלמידה שקיבלת.
                    </div>

                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                      <Button
                        size="lg"
                        className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                        onClick={() => setOpenQuestionsChooser(true)}
                      >
                        לבחור
                      </Button>

                      <Button
                        variant="secondary"
                        size="lg"
                        className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                        asChild
                      >
                        <a href={CONTACT_STUDENTS_HREF}>לבדיקת התאמה למסלול</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </AppearOnScroll>
          </div>
        </div>

        {/* מגיש קטן קבוע */}
        <FloatingPresenter
          visible={showMiniPresenter}
          bubbleVisible={floatingBubbleVisible}
          text={currentFloatingText}
          speaking={speakingKey === "floating-presenter"}
          onSpeak={() =>
            toggleSpeech("floating-presenter", currentFloatingText)
          }
          onClose={closeFloatingBubble}
        />

        {/* טיקר קבוע בתחתית - גבוה, תלת מימדי, בלופ רציף */}
        <div className="fixed bottom-0 left-0 right-0 z-30 overflow-hidden border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.28)]">
          <Red2Surface roundedNone className="ring-0 shadow-none">
            <div className="students-fixed-ticker-track flex items-center gap-8 px-4 py-4 md:py-5">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
                <div
                  key={`${item.key}-${index}`}
                  className="shrink-0 rounded-full border border-white/10 bg-background/84 px-6 py-3 text-xl font-bold text-foreground/95 backdrop-blur md:text-2xl"
                  style={{
                    boxShadow:
                      "0 10px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.10)",
                  }}
                >
                  <span className="font-extrabold text-foreground">
                    {item.name}
                  </span>
                  <span className="mx-3 text-primary">•</span>
                  <span>{item.quote}</span>
                </div>
              ))}
            </div>
          </Red2Surface>
        </div>

        <Dialog open={openSmartSystem} onOpenChange={setOpenSmartSystem}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>מה כוללת מערכת התלמידות</DialogTitle>
              <DialogDescription>
                מעטפת שממשיכה את הלמידה גם בין השיעורים, ומחזיקה את התהליך בצורה מסודרת וברורה.
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
                    <div className="text-sm font-semibold md:text-base">
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

        <Dialog
          open={openQuestionsChooser}
          onOpenChange={setOpenQuestionsChooser}
        >
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>לאן תרצי להמשיך?</DialogTitle>
              <DialogDescription>
                בחרי את הדרך שהכי מתאימה לשלב שבו את נמצאת עכשיו.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 pt-2">
              <a
                href={CONTACT_STUDENTS_HREF}
                className="rounded-2xl border border-border bg-card/70 px-5 py-4 transition-colors hover:bg-card"
              >
                <div className="font-semibold">בדיקת התאמה למסלול</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  יצירת קשר, שאלות ופתיחת תהליך.
                </div>
              </a>

              <a
                href={STUDENTS_APP_HREF}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-border bg-card/70 px-5 py-4 transition-colors hover:bg-card"
              >
                <div className="font-semibold">כניסה לתוכנת התלמידות</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  מעבר ישיר אל המערכת הפעילה.
                </div>
              </a>

              <a
                href={STUDENTS_DEMO_HREF}
                className="rounded-2xl border border-border bg-card/70 px-5 py-4 transition-colors hover:bg-card"
              >
                <div className="font-semibold">דמו מערכת התלמידות</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  לצפייה בהדגמות על ידי צילומי מסך והסבר חזותי.
                </div>
              </a>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </InnerPageLayout>
  );
}
