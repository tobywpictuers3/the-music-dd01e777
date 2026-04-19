/**
 * כל הטיפוסים של מערכת האורביט.
 *
 * עיקרון ההפרדה:
 * - תוכן + תיזמונים נשמרים ברמת הדף (OrbitPageContentConfig)
 * - עיצוב + חוקי מערכת נשמרים ברמת העיצוב (OrbitPageDesignConfig)
 * - PageConfig הוא רק ה-shape המיושב שהקומפוננטות הוותיקות כבר יודעות לצרוך
 */

export type ThemeMode = "light" | "dark";

export type PresenterLook =
  | "default"
  | "upperRight"
  | "right"
  | "lowerRight"
  | "lowerLeft"
  | "left"
  | "upperLeft"
  | "stageSign";

export type PresenterId =
  | "avatar"
  | "piano"
  | "saxophone"
  | "drums"
  | "violin"
  | "electricGuitar"
  | "classicalGuitar";

export type PageId =
  | "home"
  | "contact"
  | "students"
  | "blog"
  | "orchestras"
  | "performances"
  | "about"
  | "sheetMusic";

export type OrbitItemId = "1" | "2" | "3" | "4" | "5";

export type PresenterVisual = {
  src: string;
  alt: string;
};

export type PresenterConfig = {
  id: PresenterId;
  label: string;
  looks: Record<PresenterLook, PresenterVisual>;
  sizing: {
    heroWidth: string;
    heroMaxWidth: string;
    stickyWidth: string;
    stickyMaxWidth: string;
    stageWidth: string;
    stageMaxWidth: string;
  };
};

/* =========================================================
   Resolved / runtime types
   ========================================================= */

export type OrbitItemConfig = {
  id: OrbitItemId;
  label: string;
  baseAngleDeg: number;
  targetSectionId?: string;

  /**
   * תוכן עשיר לעיגול.
   * אם לא יישלח - המערכת תציג label רגיל.
   */
  eyebrow?: string;
  title?: string;
  spoiler?: string;

  /**
   * נשארים ברמת המערכת / עיצוב
   */
  maxSpoilerLines?: number;
  minBubbleSizePx?: number;
  maxBubbleSizePx?: number;
  radiusBoostPercent?: number;
};

export type BubbleConfig = {
  id: string;
  text: string;

  /**
   * תיזמון הופעה של הבועה ביחס לגלילה אחרי נקודת ההפעלה
   */
  showFromAfterHeroPx: number;
  hideAfterHeroPx: number;

  /**
   * ערכי עיצוב resolved
   */
  offsetX?: number;
  offsetY?: number;
  maxWidthPx?: number;

  /**
   * animation defaults resolved
   */
  enterMs?: number;
  exitMs?: number;
  holdMs?: number;
  fadeMs?: number;

  dismissible?: boolean;
};

export type StickyGuideConfig = {
  idleLook: "default";
  activationOffsetPx?: number;
  activationRatio?: number;
  showFromAfterHeroPx?: number;
  bubbles: BubbleConfig[];
};

export type TickerBannerConfig = {
  enabled: boolean;
  items: string[];
  heightPx: number;
  bottomOffsetPx: number;
  opacity: number;
  loopDurationSec: number;
  showFromAfterHeroPx?: number;
  enterMs?: number;
  exitMs?: number;
};

export type PageConfig = {
  pageId: PageId;
  route: string;
  presenterId: PresenterId;

  hero: {
    titleLines: string[];
    introLines: string[];
    headerOffsetPx: number;
  };

  orbit: {
    items: OrbitItemConfig[];
    rotationSpeedDegPerSec: number;
    defaultLook: "default";
  };

  stickyGuide: StickyGuideConfig;
  tickerBanner: TickerBannerConfig;
};

/* =========================================================
   Page content layer
   ========================================================= */

export type OrbitPageHeroContentConfig = {
  titleLines: string[];
  introLines: string[];
};

export type OrbitPageOrbitItemContentConfig = Pick<
  OrbitItemConfig,
  "id" | "label" | "baseAngleDeg" | "targetSectionId" | "eyebrow" | "title" | "spoiler"
>;

export type OrbitPageBubbleContentConfig = Pick<
  BubbleConfig,
  "id" | "text" | "showFromAfterHeroPx" | "hideAfterHeroPx"
> & {
  dismissible?: boolean;
};

export type OrbitPageTickerContentConfig = {
  enabled?: boolean;
  items: string[];
  showFromAfterHeroPx?: number;
};

export type OrbitPageStickyGuideContentConfig = {
  enabled?: boolean;
  activationOffsetPx?: number;
  activationRatio?: number;
  showFromAfterHeroPx?: number;
  bubbles: OrbitPageBubbleContentConfig[];
};

export type OrbitPageContentConfig = {
  presenterId: PresenterId;

  hero: OrbitPageHeroContentConfig;

  orbit: {
    items: OrbitPageOrbitItemContentConfig[];
  };

  stickyGuide?: OrbitPageStickyGuideContentConfig;
  tickerBanner?: OrbitPageTickerContentConfig;
};

/* =========================================================
   Design layer
   ========================================================= */

export type OrbitLayoutDesignConfig = {
  contentLeftOffsetPx: number;
};

export type OrbitHeroDesignConfig = {
  headerOffsetPx: number;
};

export type OrbitOrbitDesignConfig = {
  rotationSpeedDegPerSec: number;
  defaultLook: "default";
};

export type OrbitBubbleDesignConfig = {
  maxWidthPx: number;
  offsetX: number;
  offsetY: number;
  enterMs: number;
  exitMs: number;
  holdMs: number;
  fadeMs: number;
  dismissible: boolean;
};

export type OrbitStickyGuideDesignConfig = {
  idleLook: "default";
  activationOffsetPx: number;
  activationRatio: number;
  showFromAfterHeroPx: number;
  bubble: OrbitBubbleDesignConfig;
};

export type OrbitTickerBannerDesignConfig = {
  enabled: boolean;
  heightPx: number;
  bottomOffsetPx: number;
  opacity: number;
  loopDurationSec: number;
  showFromAfterHeroPx: number;
  enterMs: number;
  exitMs: number;
};

export type OrbitPageDesignConfig = {
  layout: OrbitLayoutDesignConfig;
  hero: OrbitHeroDesignConfig;
  orbit: OrbitOrbitDesignConfig;
  stickyGuide: OrbitStickyGuideDesignConfig;
  tickerBanner: OrbitTickerBannerDesignConfig;
};
