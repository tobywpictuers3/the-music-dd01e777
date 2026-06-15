export const HOME_HERO_ID = "home-hero";
export const GUIDE_SECTION_ID = "guide-presenter";

export type CharacterKey =
  | "piano"
  | "guitar"
  | "drums"
  | "saxophone"
  | "violin"
  | "flute"
  | "presenter";

export type StagePlacement = {
  left: string;
  bottom: string;
  width: string;
  zIndex: number;
};

export type SignBox = {
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
  labelMode?: "overlay" | "badge";
};

// Stage layout — 7 characters (presenter left + 6 instruments arc on stage)
// Presenter: far left, elevated (floating/hovering position)
// Instruments: arc across stage floor, left→right, rising slightly toward center
export const STAGE_CHARACTERS: StageCharacter[] = [
  {
    title: "צור קשר",
    href: "/contact",
    character: "presenter",
    stage: {
      left: "7%",
      bottom: "38%",
      width: "12.4%",
      zIndex: 14,
    },
    signBox: {
      top: "0%",
      left: "0%",
      width: "100%",
      height: "100%",
    },
    quote:
      "רוצה לשאול, להתייעץ או להזמין? כאן מתחילים שיחה פשוטה ונעימה.",
    labelMode: "badge",
  },
  {
    title: "תלמידות",
    href: "/students",
    character: "piano",
    stage: {
      left: "20%",
      bottom: "40%",
      width: "22%",
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
    labelMode: "overlay",
  },
  {
    title: "תזמורות",
    href: "/orchestras",
    character: "drums",
    stage: {
      left: "34%",
      bottom: "48%",
      width: "22%",
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
    labelMode: "overlay",
  },
  {
    title: "אודות",
    href: "/about",
    character: "saxophone",
    stage: {
      left: "48%",
      bottom: "53%",
      width: "17%",
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
    labelMode: "overlay",
  },
  {
    title: "תווים",
    href: "/sheets",
    character: "guitar",
    stage: {
      left: "62%",
      bottom: "48%",
      width: "17%",
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
    labelMode: "overlay",
  },
  {
    title: "בלוג",
    href: "/blog",
    character: "violin",
    stage: {
      left: "75%",
      bottom: "43%",
      width: "16%",
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
    labelMode: "overlay",
  },
  {
    title: "הופעות",
    href: "/performances",
    character: "flute",
    stage: {
      left: "88%",
      bottom: "38%",
      width: "13%",
      zIndex: 13,
    },
    signBox: {
      top: "4.5%",
      left: "11%",
      width: "78%",
      height: "18%",
    },
    quote:
      "יומן הופעות, חוויה מוסיקלית והזמנה מסודרת — במקום אחד ברור.",
    labelMode: "overlay",
  },
];

export const HERO_TEXT = {
  subtitle: "המוזיקה מתחילה",
  linkWord: "כאן",
  linkHref: `#${GUIDE_SECTION_ID}`,
  supportLine: "הופעות, תזמורות, תלמידות, תווים ותוכן — במקום אחד.",
  sloganPrefix: "אומנות ואמינות —",
  sloganAccent: "זו יצירה",
};

export const GUIDE_PRESENTER = {
  welcomeText:
    "ברוכים הבאים לאתר של טובי. אני אלווה אתכם כאן בסיור באתר. בלחיצה עלי תוכלו לשאול כל מה שתצטרכו אודות הנכתב באתר, אשתדל לענות לכם ככל יכולתי. ניתן גם לבקש הסבר באופן קולי. לשירותכם!",
  floatingLabel: "שאלו את טובי",
};

export const MARQUEE_ITEMS = [
  "הופעות",
  "תזמורות",
  "תלמידות",
  "תווים",
  "בלוג",
  "צור קשר",
  "מוזיקה • תוכן • חוויה",
  "אירועים • לימוד • השראה",
  "Toby Music",
];
