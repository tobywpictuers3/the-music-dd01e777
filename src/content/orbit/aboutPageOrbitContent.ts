import type { OrbitPageContentConfig } from "@/orbit-system/orbit.types";

export const ABOUT_PAGE_ORBIT_CONTENT: OrbitPageContentConfig = {
  presenterId: "electricGuitar",
  hero: {
    titleLines: ["לא עוד בלוק טקסט,", "אלא מסע סביב", "העולמות שלי"],
    introLines: [
      "המוסיקה ואני התחלנו דרך משותפת עם מלאת לי 5 שנים.",
      "מאז — אנחנו יחד. יד־ביד.",
      "לא כתחביב, לא כשלב, לא כמשהו שעושים על הדרך...",
      "אלא כדרך חיים של לימוד, הוראה, במה, יצירה, דיוק, הקשבה והתפתחות מתמדת.",
    ],
  },
  orbit: {
    items: [
      {
        id: "1",
        label: "הוראה",
        eyebrow: "01",
        title: "הוראה",
        spoiler: "דרך העבודה כמורה: שיטה, הקשבה ותהליך שמחזיק תלמידה לאורך זמן.",
        baseAngleDeg: 342,
        targetSectionId: "about-teacher",
      },
      {
        id: "2",
        label: "למידה",
        eyebrow: "02",
        title: "למידה",
        spoiler: "המשך למידה והתפתחות מקצועית כבסיס להוראה אמיתית.",
        baseAngleDeg: 198,
        targetSectionId: "about-student",
      },
      {
        id: "3",
        label: "במה",
        eyebrow: "03",
        title: "במה",
        spoiler: "החיבור שבין תרגול, נוכחות, קהל ורגעים חיים על הבמה.",
        baseAngleDeg: 54,
        targetSectionId: "about-stage",
      },
      {
        id: "4",
        label: "עיבוד",
        eyebrow: "04",
        title: "עיבוד",
        spoiler: "כתיבה, דמיון מוזיקלי ובניית עולם צלילי להרכבים שונים.",
        baseAngleDeg: 126,
        targetSectionId: "about-arrangement",
      },
      {
        id: "5",
        label: "הפקה",
        eyebrow: "05",
        title: "הפקה",
        spoiler: "ניהול חזון מוזיקלי שלם — מהרעיון ועד הרגע האחרון על הבמה.",
        baseAngleDeg: 270,
        targetSectionId: "about-production",
      },
    ],
  },
  stickyGuide: {
    activationRatio: 0.5,
    activationOffsetPx: 0,
    showFromAfterHeroPx: 0,
    bubbles: [
      {
        id: "about-bubble-1",
        text: "דף אודות כאן לא יושב כטקסט ארוך, אלא כמסלול שמקיף תחומי עשייה שונים ומחבר ביניהם.",
        showFromAfterHeroPx: 24,
        hideAfterHeroPx: 700,
      },
      {
        id: "about-bubble-2",
        text: "הכרטיסים כאן נפתחים לעומק, אבל האורביט נותן כבר בהתחלה מבט מרוכז על הוראה, למידה, במה, עיבוד והפקה.",
        showFromAfterHeroPx: 880,
        hideAfterHeroPx: 1800,
      },
    ],
  },
  tickerBanner: {
    enabled: true,
    items: [
      "26 שנות הוראת מוסיקה",
      "9 כלי נגינה ברמה מעולה",
      "מאות תלמידות פרטיות לאורך השנים",
      "אלפי בוגרות קורסים קבוצתיים",
      "5 תזמורות לימודיות עשירות",
      "20 קונצרטים לתלמידות",
      "250+ הופעות בארץ ובעולם",
      "35 שנות למידה רציפה",
    ],
    showFromAfterHeroPx: 0,
  },
};
