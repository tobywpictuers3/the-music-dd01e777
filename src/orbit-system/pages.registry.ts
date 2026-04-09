/**
 * מקור האמת של דפי האורביט.
 * כאן מוגדרים:
 * - טקסטי ההירו
 * - 5 העיגולים
 * - מהירות הסיבוב
 * - הבועות של המגיש הקבוע
 * - הבאנר הנוסע
 */

import type { OrbitItemConfig, PageConfig, PageId } from "./orbit.types";

function createGenericOrbitItems(): OrbitItemConfig[] {
  return [
    { id: "1", label: "1", baseAngleDeg: 0, targetSectionId: "section-1" },
    { id: "2", label: "2", baseAngleDeg: 72, targetSectionId: "section-2" },
    { id: "3", label: "3", baseAngleDeg: 144, targetSectionId: "section-3" },
    { id: "4", label: "4", baseAngleDeg: 216, targetSectionId: "section-4" },
    { id: "5", label: "5", baseAngleDeg: 288, targetSectionId: "section-5" },
  ];
}

function createBasePage(
  pageId: PageId,
  route: string,
  presenterId: PageConfig["presenterId"]
): PageConfig {
  return {
    pageId,
    route,
    presenterId,
    hero: {
      titleLines: ["כותרת ראשית לדף", "עוד שורת כותרת"],
      introLines: [
        "זהו טקסט דמה נעים לקריאה בתוך אזור שני השליש.",
        "אחר כך תוכלי להחליף אותו לתוכן המדויק של הדף.",
      ],
      headerOffsetPx: 96,
    },
    orbit: {
      items: createGenericOrbitItems(),
      rotationSpeedDegPerSec: 1.15,
      defaultLook: "default",
    },
    stickyGuide: {
      idleLook: "default",
      bubbles: [
        {
          id: "bubble-1",
          text: "זו בועת דמה ראשונה. כאן יופיע הטקסט הקבוע שמלווה את תחילת הגלילה.",
          showFromAfterHeroPx: 30,
          hideAfterHeroPx: 620,
          maxWidthPx: 520,
          offsetX: 20,
          offsetY: -2,
          enterMs: 220,
          exitMs: 180,
        },
        {
          id: "bubble-2",
          text: "זו בועת דמה שנייה. אפשר להחליף לכל דף נוסח אחר, בלי לשנות את המבנה.",
          showFromAfterHeroPx: 760,
          hideAfterHeroPx: 1500,
          maxWidthPx: 540,
          offsetX: 26,
          offsetY: 6,
          enterMs: 220,
          exitMs: 180,
        },
      ],
    },
    tickerBanner: {
      enabled: true,
      items: [
        "טקסט נע לדוגמה",
        "כאן יוגדר תוכן שונה לכל דף",
        "הבאנר מופיע כבר בתחילת הגלילה",
      ],
      heightPx: 94,
      bottomOffsetPx: 32,
      opacity: 0.92,
      loopDurationSec: 34,
    },
  };
}

const basePages: Record<PageId, PageConfig> = {
  home: createBasePage("home", "/", "avatar"),
  contact: createBasePage("contact", "/contact", "avatar"),
  students: createBasePage("students", "/students", "piano"),
  blog: createBasePage("blog", "/blog", "saxophone"),
  orchestras: createBasePage("orchestras", "/orchestras", "drums"),
  performances: createBasePage("performances", "/performances", "violin"),
  about: createBasePage("about", "/about", "electricGuitar"),
  sheetMusic: createBasePage("sheetMusic", "/sheet-music", "classicalGuitar"),
};

basePages.about = {
  pageId: "about",
  route: "/about",
  presenterId: "electricGuitar",
  hero: {
    titleLines: ["לא עוד בלוק טקסט,", "אלא מסע סביב", "העולמות שלי"],
    introLines: [
      "המוסיקה ואני התחלנו דרך משותפת עם מלאת לי 5 שנים.",
      "מאז — אנחנו יחד. יד־ביד.",
      "לא כתחביב, לא כשלב, לא כמשהו שעושים על הדרך...",
      "אלא כדרך חיים של לימוד, הוראה, במה, יצירה, דיוק, הקשבה והתפתחות מתמדת.",
    ],
    headerOffsetPx: 96,
  },
  orbit: {
    items: [
      {
        id: "1",
        label: "הוראה",
        baseAngleDeg: 342,
        targetSectionId: "about-teacher",
      },
      {
        id: "2",
        label: "למידה",
        baseAngleDeg: 198,
        targetSectionId: "about-student",
      },
      {
        id: "3",
        label: "במה",
        baseAngleDeg: 54,
        targetSectionId: "about-stage",
      },
      {
        id: "4",
        label: "עיבוד",
        baseAngleDeg: 126,
        targetSectionId: "about-arrangement",
      },
      {
        id: "5",
        label: "הפקה",
        baseAngleDeg: 270,
        targetSectionId: "about-production",
      },
    ],
    rotationSpeedDegPerSec: 1.05,
    defaultLook: "default",
  },
  stickyGuide: {
    idleLook: "default",
    bubbles: [
      {
        id: "about-bubble-1",
        text: "דף אודות כאן לא יושב כטקסט ארוך, אלא כמסלול שמקיף תחומי עשייה שונים ומחבר ביניהם.",
        showFromAfterHeroPx: 24,
        hideAfterHeroPx: 700,
        maxWidthPx: 580,
        offsetX: 18,
        offsetY: -4,
        enterMs: 240,
        exitMs: 180,
      },
      {
        id: "about-bubble-2",
        text: "הכרטיסים כאן נפתחים לעומק, אבל האורביט נותן כבר בהתחלה מבט מרוכז על הוראה, למידה, במה, עיבוד והפקה.",
        showFromAfterHeroPx: 880,
        hideAfterHeroPx: 1800,
        maxWidthPx: 620,
        offsetX: 22,
        offsetY: 2,
        enterMs: 240,
        exitMs: 180,
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
    heightPx: 96,
    bottomOffsetPx: 34,
    opacity: 0.92,
    loopDurationSec: 40,
  },
};

basePages.blog = {
  pageId: "blog",
  route: "/blog",
  presenterId: "saxophone",
  hero: {
    titleLines: ["במה חיה", "לתוכן, שאלות,", "וקשר עם הקוראות"],
    introLines: [
      "במקום בלוג שבלוני — דף שנכנסים אליו כמו למסלול.",
      "יש כאן מאמרים, שאלות קצרות, קולות מהקהילה, ורעיונות שנולדים מהשיח עם הקוראות.",
    ],
    headerOffsetPx: 96,
  },
  orbit: {
    items: [
      {
        id: "1",
        label: "מוביל",
        baseAngleDeg: 270,
        targetSectionId: "featured",
      },
      {
        id: "2",
        label: "מאמרים",
        baseAngleDeg: 338,
        targetSectionId: "articles",
      },
      {
        id: "3",
        label: "שאלות",
        baseAngleDeg: 52,
        targetSectionId: "quick-questions",
      },
      {
        id: "4",
        label: "קהילה",
        baseAngleDeg: 126,
        targetSectionId: "community",
      },
      {
        id: "5",
        label: "נושאים",
        baseAngleDeg: 202,
        targetSectionId: "requested-topics",
      },
    ],
    rotationSpeedDegPerSec: 1.05,
    defaultLook: "default",
  },
  stickyGuide: {
    idleLook: "default",
    bubbles: [
      {
        id: "blog-bubble-1",
        text: "כאן הבלוג לא נפתח כפיד שטוח, אלא כשער כניסה: קודם במה, אחר כך מסלול קריאה ברור.",
        showFromAfterHeroPx: 40,
        hideAfterHeroPx: 760,
        maxWidthPx: 560,
        offsetX: 18,
        offsetY: -6,
        enterMs: 240,
        exitMs: 180,
      },
      {
        id: "blog-bubble-2",
        text: "בהמשך הדף השאלות, הקהילה והנושאים המבוקשים ממשיכים את המאמרים, ולא יושבים בצד כאזור נפרד.",
        showFromAfterHeroPx: 920,
        hideAfterHeroPx: 1900,
        maxWidthPx: 610,
        offsetX: 22,
        offsetY: 2,
        enterMs: 240,
        exitMs: 180,
      },
    ],
  },
  tickerBanner: {
    enabled: true,
    items: [
      "מאמרים חדשים",
      "שאלות קצרות",
      "קולות מהקהילה",
      "נושאים שביקשו שאכתוב",
      "רשימת התפוצה",
    ],
    heightPx: 96,
    bottomOffsetPx: 34,
    opacity: 0.92,
    loopDurationSec: 36,
  },
};

basePages.orchestras = {
  pageId: "orchestras",
  route: "/orchestras",
  presenterId: "drums",
  hero: {
    titleLines: ["לא רק מחיר,", "אלא מסלול", "להזמנת הופעה"],
    introLines: [
      "כאן אפשר להבין מה מתאים לך, לבנות הצעת מחיר, לבדוק תקציב, ולראות הופעות קרובות.",
      "הדף הזה מחבר בין בחירה מעשית לבין חוויית דף ברורה, עם ניווט מעגלי כמו בשאר האתר.",
    ],
    headerOffsetPx: 96,
  },
  orbit: {
    items: [
      {
        id: "1",
        label: "סקירה",
        baseAngleDeg: 270,
        targetSectionId: "overview-section",
      },
      {
        id: "2",
        label: "הצעה",
        baseAngleDeg: 338,
        targetSectionId: "pricing-section",
      },
      {
        id: "3",
        label: "תקציב",
        baseAngleDeg: 52,
        targetSectionId: "pricing-section",
      },
      {
        id: "4",
        label: "הופעות",
        baseAngleDeg: 126,
        targetSectionId: "events-section",
      },
      {
        id: "5",
        label: "קשר",
        baseAngleDeg: 202,
        targetSectionId: "contact-section",
      },
    ],
    rotationSpeedDegPerSec: 1.05,
    defaultLook: "default",
  },
  stickyGuide: {
    idleLook: "default",
    bubbles: [
      {
        id: "orchestras-bubble-1",
        text: "כאן הדף לא מתחיל בטופס, אלא בסקירה ברורה: מה אפשר להזמין, איך בונים הצעה, ואיך להתקדם בלי ללכת לאיבוד.",
        showFromAfterHeroPx: 40,
        hideAfterHeroPx: 760,
        maxWidthPx: 580,
        offsetX: 18,
        offsetY: -6,
        enterMs: 240,
        exitMs: 180,
      },
      {
        id: "orchestras-bubble-2",
        text: "באזור המחיר אפשר לעבוד בשני מסלולים: לבנות הצעת מחיר ידנית, או להתחיל מתקציב ולקבל כיוון מותאם.",
        showFromAfterHeroPx: 900,
        hideAfterHeroPx: 1900,
        maxWidthPx: 620,
        offsetX: 22,
        offsetY: 2,
        enterMs: 240,
        exitMs: 180,
      },
    ],
  },
  tickerBanner: {
    enabled: true,
    items: [
      "הצעת מחיר מותאמת",
      "בדיקת תקציב",
      "חבילות ותוספות",
      "הופעות קרובות",
      "יצירת קשר",
    ],
    heightPx: 96,
    bottomOffsetPx: 34,
    opacity: 0.92,
    loopDurationSec: 38,
  },
};

basePages.performances = {
  pageId: "performances",
  route: "/performances",
  presenterId: "violin",
  hero: {
    titleLines: ["לא רק לוח זמנים", "אלא מסלול", "להזמנת הופעה"],
    introLines: [
      "כאן אפשר לקבל מבט על עולם ההופעות, להבין איזה מסלול יכול להתאים לאירוע, ולפתוח שיחה מסודרת.",
      "המטרה היא לחבר בין חוויה מוזיקלית לבין בהירות: מה מתאים, מה שואלים, ואיך ממשיכים.",
    ],
    headerOffsetPx: 96,
  },
  orbit: {
    items: [
      {
        id: "1",
        label: "סקירה",
        baseAngleDeg: 270,
        targetSectionId: "performances-overview-section",
      },
      {
        id: "2",
        label: "מסלולים",
        baseAngleDeg: 338,
        targetSectionId: "performances-packages-section",
      },
      {
        id: "3",
        label: "יומן",
        baseAngleDeg: 52,
        targetSectionId: "performances-calendar-section",
      },
      {
        id: "4",
        label: "שאלות",
        baseAngleDeg: 126,
        targetSectionId: "performances-faq-section",
      },
      {
        id: "5",
        label: "קשר",
        baseAngleDeg: 202,
        targetSectionId: "performances-contact-section",
      },
    ],
    rotationSpeedDegPerSec: 1.05,
    defaultLook: "default",
  },
  stickyGuide: {
    idleLook: "default",
    bubbles: [
      {
        id: "performances-bubble-1",
        text: "דף ההופעות כאן נועד לעשות סדר: לא רק להראות שיש הופעות, אלא לעזור להבין איזה כיוון מתאים לאירוע ואיך ניגשים לזה.",
        showFromAfterHeroPx: 40,
        hideAfterHeroPx: 760,
        maxWidthPx: 580,
        offsetX: 18,
        offsetY: -6,
        enterMs: 240,
        exitMs: 180,
      },
      {
        id: "performances-bubble-2",
        text: "אחרי הסקירה מגיעים למסלולים, ליומן, ולשאלות החשובות לפני פנייה — כך שהקשר נפתח ממקום הרבה יותר ברור.",
        showFromAfterHeroPx: 900,
        hideAfterHeroPx: 1900,
        maxWidthPx: 620,
        offsetX: 22,
        offsetY: 2,
        enterMs: 240,
        exitMs: 180,
      },
    ],
  },
  tickerBanner: {
    enabled: true,
    items: [
      "מסלולי הופעה",
      "יומן אירועים",
      "שאלות נפוצות",
      "פנייה מסודרת",
      "התאמה לאירוע",
    ],
    heightPx: 96,
    bottomOffsetPx: 34,
    opacity: 0.92,
    loopDurationSec: 38,
  },
};

basePages.sheetMusic = {
  pageId: "sheetMusic",
  route: "/sheet-music",
  presenterId: "classicalGuitar",
  hero: {
    titleLines: ["תווים, עיבודים", "וכתיבה מוזיקלית", "בהזמנה"],
    introLines: [
      "כאן אפשר גם לעיין במאגר של תווים קיימים, וגם להזמין כתיבה או עיבוד מותאם.",
      "המטרה היא לחבר בין מאגר קיים לבין מסלול ברור להזמנה אישית: לכלי, לרמה, לסולם, להרכב או לתזמורת.",
    ],
    headerOffsetPx: 96,
  },
  orbit: {
    items: [
      {
        id: "1",
        label: "שירותים",
        baseAngleDeg: 270,
        targetSectionId: "services-section",
      },
      {
        id: "2",
        label: "מאגר",
        baseAngleDeg: 338,
        targetSectionId: "catalog",
      },
      {
        id: "3",
        label: "הזמנה",
        baseAngleDeg: 52,
        targetSectionId: "custom-order",
      },
      {
        id: "4",
        label: "טופס",
        baseAngleDeg: 126,
        targetSectionId: "request-form",
      },
      {
        id: "5",
        label: "שאלות",
        baseAngleDeg: 202,
        targetSectionId: "faq-section",
      },
    ],
    rotationSpeedDegPerSec: 1.05,
    defaultLook: "default",
  },
  stickyGuide: {
    idleLook: "default",
    bubbles: [
      {
        id: "sheetmusic-bubble-1",
        text: "הדף הזה לא רק מציג תווים מוכנים, אלא עושה סדר בין שני מסלולים: חיפוש במאגר, או הזמנה אישית של כתיבה והתאמה.",
        showFromAfterHeroPx: 40,
        hideAfterHeroPx: 760,
        maxWidthPx: 600,
        offsetX: 18,
        offsetY: -6,
        enterMs: 240,
        exitMs: 180,
      },
      {
        id: "sheetmusic-bubble-2",
        text: "השלב הבא אחרי העיון הוא בקשה מסודרת: מה השיר, לאיזה כלי, באיזו רמה, ובאיזו צורת עיבוד צריך אותו.",
        showFromAfterHeroPx: 920,
        hideAfterHeroPx: 1900,
        maxWidthPx: 620,
        offsetX: 22,
        offsetY: 2,
        enterMs: 240,
        exitMs: 180,
      },
    ],
  },
  tickerBanner: {
    enabled: true,
    items: [
      "מאגר תווים",
      "התאמה לכלי",
      "שינוי רמה",
      "שינוי סולם",
      "שני קולות והרכב",
      "כתיבה בהזמנה",
    ],
    heightPx: 96,
    bottomOffsetPx: 34,
    opacity: 0.92,
    loopDurationSec: 38,
  },
};

export const pagesRegistry: Record<PageId, PageConfig> = basePages;

/**
 * דף הדמו המחובר הראשון.
 */
export const orbitDemoPageId: PageId = "about";
