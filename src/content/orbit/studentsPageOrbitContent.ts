import type { OrbitPageContentConfig } from "@/orbit-system/orbit.types";

export const STUDENTS_PAGE_ORBIT_CONTENT: OrbitPageContentConfig = {
  presenterId: "piano",
  hero: {
    titleLines: ["לא רק שיעורי נגינה שבועיים,", "אלא דרך", "מוזיקלית שלמה"],
    introLines: [
      "כאן לומדים מוסיקה מתוך בהירות, הקשבה, דיוק ורצף.",
      "לא כמפגש חד־פעמי, אלא כמסלול שמחזיק תלמידה לאורך זמן — עם רמה, מסגרת, ליווי ודרך עבודה מסודרת.",
    ],
  },
  orbit: {
    items: [
      {
        id: "1",
        label: "מסלול",
        eyebrow: "01",
        title: "מסלול",
        spoiler: "היכרות עם הדרך הכוללת, ההמלצות והמסגרת שמחזיקה לאורך זמן.",
        baseAngleDeg: 342,
        targetSectionId: "track-section",
      },
      {
        id: "2",
        label: "לימוד",
        eyebrow: "02",
        title: "לימוד",
        spoiler: "תחומי הלימוד, המקצועות המשלימים והעומק המקצועי.",
        baseAngleDeg: 54,
        targetSectionId: "studies-section",
      },
      {
        id: "3",
        label: "דרך",
        eyebrow: "03",
        title: "דרך",
        spoiler: "הגישה שמאחורי הלמידה: עומק, עקביות, רגישות וסדר.",
        baseAngleDeg: 126,
        targetSectionId: "belief-section",
      },
      {
        id: "4",
        label: "תהליך",
        eyebrow: "04",
        title: "תהליך",
        spoiler: "שיעור, תרגול, רצף וחומרים שמקדמים בפועל.",
        baseAngleDeg: 198,
        targetSectionId: "process-section",
      },
      {
        id: "5",
        label: "מערכת",
        eyebrow: "05",
        title: "מערכת",
        spoiler: "המערכת שממשיכה את הלמידה גם בין השיעורים.",
        baseAngleDeg: 270,
        targetSectionId: "system-section",
      },
    ],
  },
  stickyGuide: {
    activationRatio: 0.5,
    activationOffsetPx: 0,
    showFromAfterHeroPx: 0,
    bubbles: [
      {
        id: "students-bubble-1",
        text: "כאן תחומי הלימוד מקבלים צורה ברורה: מה מרכזי, מה משלים, ואיך הכל מסתדר למסלול אחד שמחזיק תלמידה לאורך זמן.",
        showFromAfterHeroPx: 40,
        hideAfterHeroPx: 760,
      },
      {
        id: "students-bubble-2",
        text: "מבחינתי מוסיקה לא נבנית מקיצורי דרך. עומק, רגישות ומשמעת יכולים לחיות יחד — וזה מה שמאפשר התקדמות אמיתית.",
        showFromAfterHeroPx: 900,
        hideAfterHeroPx: 1380,
      },
      {
        id: "students-bubble-3",
        text: "כאן כבר רואים את התהליך בפועל: שיעור, תרגול, חומרים ורצף. לא רק השראה — אלא דרך עבודה שמתקדמת באמת.",
        showFromAfterHeroPx: 1420,
        hideAfterHeroPx: 1860,
      },
      {
        id: "students-bubble-4",
        text: "המערכת לא מחליפה את השיעור — היא מחזיקה את הלמידה גם בין המפגשים, בצורה ברורה, נגישה ונעימה לעין.",
        showFromAfterHeroPx: 1900,
        hideAfterHeroPx: 2500,
      },
    ],
  },
  tickerBanner: {
    enabled: true,
    items: [
      "בת שבע — למדתי אצל טובי חליל צד ארבע שנים, ובזכותה ממש התקדמתי בקריאת תווים",
      "מירי — כל שיעור היה חוויה מיוחדת שפתחה שערים לתחומים נוספים במוזיקה",
      "תמר — הרבה מעבר לשיעורי נגינה, עם התקדמות מקצועית בתוך תהליך מובנה וברור",
      "ריקי — שיעורים מעניינים וחווייתיים עם הבנה עמוקה ונרחבת בחומר",
      "נעמי — להיות תלמידה של טובי זה הרבה מעבר לללמוד מוזיקה",
      "קרייני — כל השבוע חיכיתי לשיעור פסנתר, עם אווירה נעימה וזורמת",
      "תמר — מוסרת את השיעור עם כל הלב ועם אכפתיות אמיתית להתקדמות",
      "דסי — כל דקה איתך שווה בשבילי זהב",
    ],
    showFromAfterHeroPx: 0,
  },
};
