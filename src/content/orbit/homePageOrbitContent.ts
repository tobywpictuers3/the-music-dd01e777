import type { OrbitPageContentConfig } from "@/orbit-system/orbit.types";

export const HOME_PAGE_ORBIT_CONTENT: OrbitPageContentConfig = {
  presenterId: "avatar",
  hero: {
    titleLines: ["עמוד בית", "תוכן ברירת מחדל"],
    introLines: [
      "העמוד הראשי לא משתמש כרגע במערכת האורביט, אבל נשמר כאן תוכן מינימלי כדי למנוע תלות ברישום קשיח.",
    ],
  },
  orbit: {
    items: [
      { id: "1", label: "1", title: "1", spoiler: "דמה", baseAngleDeg: 0, targetSectionId: "section-1" },
      { id: "2", label: "2", title: "2", spoiler: "דמה", baseAngleDeg: 72, targetSectionId: "section-2" },
      { id: "3", label: "3", title: "3", spoiler: "דמה", baseAngleDeg: 144, targetSectionId: "section-3" },
      { id: "4", label: "4", title: "4", spoiler: "דמה", baseAngleDeg: 216, targetSectionId: "section-4" },
      { id: "5", label: "5", title: "5", spoiler: "דמה", baseAngleDeg: 288, targetSectionId: "section-5" },
    ],
  },
  stickyGuide: {
    enabled: false,
    bubbles: [],
  },
  tickerBanner: {
    enabled: false,
    items: [],
  },
};
