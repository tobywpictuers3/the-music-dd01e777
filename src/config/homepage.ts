/**
 * Homepage configuration
 * ======================
 * זה מקור האמת היחיד של דף הבית.
 *
 * כאן שולטים על:
 * 1) מיפוי דפים ← דמויות
 * 2) מיקומי דמויות על הבמה
 * 3) מיקום הכיתוב בתוך השלט של כל דמות
 * 4) טקסטים כלליים של ההירו והמגיש
 *
 * חשוב:
 * left = נקודת עיגון של מרכז התחתית של הדמות
 * bottom = גובה הבסיס של הדמות מהרצפה
 * width = גודל הדמות
 */

export const HOME_HERO_ID = "home-hero";
export const GUIDE_SECTION_ID = "guide-presenter";

export type CharacterKey =
  | "piano"
  | "eguitar"
  | "guitar"
  | "drums"
  | "saxophone"
  | "violin";

export type StagePlacement = {
  /**
   * עוגן אופקי של מרכז התחתית
   * מזיז ימינה / שמאלה
   */
  left: string;

  /**
   * גובה בסיס הדמות מהרצפה
   * מזיז למעלה / למטה
   */
  bottom: string;

  /**
   * גודל הדמות
   * מגדיל / מקטין
   */
  width: string;

  /**
   * סדר שכבות
   */
  zIndex: number;
};

export type SignBox = {
  /**
   * אזור הכיתוב בתוך השלט
   * top  = למעלה / למטה
   * left = ימינה / שמאלה
   */
  top: string;
  left: string;
  width: string;
  height: string;
};

export type StageCharacter = {
  title: string;
  href: string;
  character: CharacterKey;
  stage: StagePlacement;
  signBox: SignBox;
  quote: string;
};

export const STAGE_CHARACTERS: StageCharacter[] = [
  /**
   * 1 — פסנתר — הכי שמאלי, נמוך
   */
  {
    title: "תלמידות",
    href: "/students",
    character: "piano",
    stage: {
      left: "11.5%",
      bottom: "0.5%",
      width: "18.5%",
      zIndex: 12,
    },
    signBox: {
      top: "5%",
      left: "10%",
      width: "80%",
      height: "16%",
    },
    quote:
      "מרחב שמחבר בין לימוד, תרגול, התקדמות וקשר אישי — בצורה חיה ונעימה.",
  },

  /**
   * 2 — גיטרה חשמלית — שמאל-מרכז
   */
  {
    title: "תזמורות",
    href: "/orchestras",
    character: "eguitar",
    stage: {
      left: "26%",
      bottom: "7.5%",
      width: "10.5%",
      zIndex: 15,
    },
    signBox: {
      top: "4.5%",
      left: "11%",
      width: "78%",
      height: "18%",
    },
    quote:
      "הרכבים, סגנונות ואפשרויות שמתאימים לאירוע שלכם — בלי להסתבך.",
  },

  /**
   * 3 — גיטרה קלאסית — מעט ימינה מ-2, קצת יותר גבוהה
   */
  {
    title: "אודות",
    href: "/about",
    character: "guitar",
    stage: {
      left: "35%",
      bottom: "9.5%",
      width: "10.5%",
      zIndex: 16,
    },
    signBox: {
      top: "4.5%",
      left: "11%",
      width: "78%",
      height: "18%",
    },
    quote:
      "הסיפור, הדרך והאני מאמין של Toby Music — במקום אחד, ברור ומדויק.",
  },

  /**
   * 4 — תופים — במרכז, הכי דומיננטי
   */
  {
    title: "תווים",
    href: "/sheets",
    character: "drums",
    stage: {
      left: "50.5%",
      bottom: "10.5%",
      width: "17.5%",
      zIndex: 11,
    },
    signBox: {
      top: "3.5%",
      left: "9%",
      width: "82%",
      height: "13.5%",
    },
    quote:
      "ספריית תווים מסודרת, נוחה ונעימה לעין — כדי להגיע מהר למה שצריך.",
  },

  /**
   * 5 — סקסופון — ימין-מרכז
   */
  {
    title: "בלוגים",
    href: "/blog",
    character: "saxophone",
    stage: {
      left: "69%",
      bottom: "6.5%",
      width: "9.75%",
      zIndex: 15,
    },
    signBox: {
      top: "4.5%",
      left: "11%",
      width: "78%",
      height: "18%",
    },
    quote:
      "טיפים, מחשבות, רעיונות והשראה מוזיקלית שנעים לחזור אליה שוב.",
  },

  /**
   * 6 — כינור — הכי ימני, נמוך
   */
  {
    title: "צור קשר",
    href: "/contact",
    character: "violin",
    stage: {
      left: "83%",
      bottom: "1%",
      width: "9.25%",
      zIndex: 12,
    },
    signBox: {
      top: "4.5%",
      left: "11%",
      width: "78%",
      height: "18%",
    },
    quote:
      "רוצה לשאול, להתייעץ או להזמין? כאן מתחילים שיחה פשוטה ונעימה.",
  },
];

/**
 * טקסטים של ההירו
 */
export const HERO_TEXT = {
  subtitle: "המוזיקה מתחילה",
  linkWord: "כאן",
  /**
   * יעד הגלילה של "כאן"
   * אם תרצי להעביר למקום אחר — מחליפים רק כאן.
   */
  linkHref: `#${GUIDE_SECTION_ID}`,
  supportLine: "תזמורות, תלמידות, תווים ותוכן — במקום אחד.",
  sloganPrefix: "אומנות ואמינות —",
  sloganAccent: "זו יצירה",
};

/**
 * טקסטים של המגיש
 */
export const GUIDE_PRESENTER = {
  welcomeText:
    "ברוכים הבאים לאתר של טובי. אני אלווה אתכם כאן בסיור באתר. בלחיצה עלי תוכלו לשאול כל מה שתצטרכו אודות הנכתב באתר, אשתדל לענות לכם ככל יכולתי. ניתן גם לבקש הסבר באופן קולי. לשירותכם!",
  floatingLabel: "שאלו את טובי",
};

/**
 * תוכן הבאנר הרץ
 */
export const MARQUEE_ITEMS = [
  "תזמורות",
  "תלמידות",
  "תווים",
  "בלוגים",
  "יצירת קשר",
  "מוזיקה • תוכן • חוויה",
  "אירועים • לימוד • השראה",
  "Toby Music",
];
