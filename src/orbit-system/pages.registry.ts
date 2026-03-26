/**
 * מקור האמת של כל הדפים.
 * כאן מגדירים:
 * - איזו דמות שייכת לכל דף
 * - טקסטי ההירו
 * - 5 העיגולים
 * - בועות
 * - באנר נוסע
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
      rotationSpeedDegPerSec: 10,
      defaultLook: "default",
    },
    stickyGuide: {
      idleLook: "default",
      bubbles: [
        {
          id: "bubble-1",
          text: "זו בועת דמה ראשונה. כאן אחר כך ייכנס הטקסט של הדף.",
          showFromAfterHeroPx: 0,
          hideAfterHeroPx: 460,
          maxWidthPx: 320,
          offsetX: 18,
          offsetY: -8,
          enterMs: 180,
          exitMs: 160,
        },
        {
          id: "bubble-2",
          text: "זו בועת דמה שנייה. אפשר להגדיר לכל דף זמנים אחרים לגמרי.",
          showFromAfterHeroPx: 760,
          hideAfterHeroPx: 1320,
          maxWidthPx: 340,
          offsetX: 24,
          offsetY: 0,
          enterMs: 180,
          exitMs: 160,
        },
      ],
    },
    tickerBanner: {
      enabled: true,
      items: [
        "טקסט נע לדוגמה",
        "כאן יוגדר תוכן שונה לכל דף",
        "הבאנר מופיע יחד עם המגיש הקבוע",
      ],
      heightPx: 84,
      bottomOffsetPx: 18,
      opacity: 0.88,
      loopDurationSec: 28,
    },
  };
}

export const pagesRegistry: Record<PageId, PageConfig> = {
  home: createBasePage("home", "/", "avatar"),
  contact: createBasePage("contact", "/contact", "avatar"),
  students: createBasePage("students", "/students", "piano"),
  blogs: createBasePage("blogs", "/blogs", "saxophone"),
  orchestras: createBasePage("orchestras", "/orchestras", "drums"),
  performances: createBasePage("performances", "/performances", "violin"),
  about: createBasePage("about", "/about", "electricGuitar"),
  sheetMusic: createBasePage("sheetMusic", "/sheet-music", "classicalGuitar"),
};

/**
 * דף הדמו המחובר הראשון.
 * אפשר להחליף אחר כך לעמוד אחר.
 */
export const orbitDemoPageId: PageId = "about";
