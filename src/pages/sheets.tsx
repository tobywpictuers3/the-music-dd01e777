import { useMemo, useState } from "react";
import InnerPageLayout from "@/components/InnerPageLayout";
import OrbitPageShell from "@/orbit-system/OrbitPageShell";
import AppearOnScroll from "@/components/AppearOnScroll";
import { Button } from "@/components/ui/button";
import type { OrbitItemConfig } from "@/orbit-system/orbit.types";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FileMusic,
  Layers3,
  Music2,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from "lucide-react";

type ScoreItem = {
  id: string;
  title: string;
  artist?: string;
  instrument: string;
  level: string;
  keySignature: string;
  style: string;
  format: string;
  price: number;
  availability: "מוכן" | "בהזמנה";
};

const CONTACT_SCORES_HREF = "/contact?from=scores&topic=custom_arrangement";

const MOCK_SCORES: ScoreItem[] = [
  {
    id: "1",
    title: "אבני אור",
    artist: "שרה לוין",
    instrument: "כינור",
    level: "בינוני",
    keySignature: "Dm",
    style: "קלאסי",
    format: "סולו + אקורדים",
    price: 59,
    availability: "מוכן",
  },
  {
    id: "2",
    title: "רוח של ערב",
    artist: "מיכל ברק",
    instrument: "פסנתר",
    level: "מתחילות",
    keySignature: "C",
    style: "שירה",
    format: "אקורדים + מילים",
    price: 45,
    availability: "מוכן",
  },
  {
    id: "3",
    title: "מעגלי זהב",
    artist: "תמר שלו",
    instrument: "חליל",
    level: "מתקדמות",
    keySignature: "G",
    style: "קונצרטי",
    format: "סולו",
    price: 64,
    availability: "מוכן",
  },
  {
    id: "4",
    title: "ניגון לשני קולות",
    artist: "רבקה הדר",
    instrument: "שירה",
    level: "בינוני",
    keySignature: "F",
    style: "הרכב",
    format: "שני קולות",
    price: 72,
    availability: "מוכן",
  },
  {
    id: "5",
    title: "שערי מנגינה",
    artist: "חני רוזן",
    instrument: "תזמורת",
    level: "מתקדמות",
    keySignature: "Am",
    style: "עיבוד",
    format: "עיבוד תזמורתי",
    price: 120,
    availability: "מוכן",
  },
  {
    id: "6",
    title: "מחרוזת אביב",
    artist: "לאה בן דוד",
    instrument: "גיטרה",
    level: "מתחילות",
    keySignature: "G",
    style: "ליווי",
    format: "אקורדים",
    price: 39,
    availability: "מוכן",
  },
];

const SERVICES = [
  {
    key: "write",
    title: "כתיבת תווים מאפס",
    text: "לשיר שאין לו תווים בכלל או לשיר מקורי שצריך כתיבה מקצועית ומסודרת.",
    icon: Wand2,
  },
  {
    key: "instrument",
    title: "התאמה לכלי אחר",
    text: "יש כבר עיבוד? אפשר להתאים אותו לכלי אחר, לצמד כלים או להרכב אחר.",
    icon: Layers3,
  },
  {
    key: "level",
    title: "שינוי רמה / סולם",
    text: "אותו שיר, אבל לרמה פשוטה יותר, מתקדמת יותר או בסולם אחר.",
    icon: Music2,
  },
  {
    key: "ensemble",
    title: "שני קולות / הרכב / תזמורת",
    text: "עיבודים לקבוצות, שני קולות, שני כלים או למסגרת תזמורתית רחבה יותר.",
    icon: FileMusic,
  },
];

const HOW_IT_WORKS = [
  "שולחות בקשה עם שם השיר או הצורך המדויק",
  "מקבלות הערכת מחיר ומקדמה לפתיחת עבודה",
  "אני כותבת או מעבדת לפי הכלי, הרמה והסולם הרצויים",
  "משלימות תשלום ומקבלות את הקובץ הסופי",
];

const FAQ = [
  {
    q: "איך קונים תווים שכבר קיימים?",
    a: "בוחרים מתוך המאגר, שולחים בקשת רכישה, ובהמשך אפשר לחבר זאת גם לסליקה מלאה.",
  },
  {
    q: "אפשר להזמין שיר שלא קיים בכלל?",
    a: "כן. זה אחד השירותים המרכזיים בדף הזה.",
  },
  {
    q: "אפשר לבקש כלי אחר, רמה אחרת או סולם אחר?",
    a: "כן. אפשר להזמין התאמה לפי כלי, רמה, סולם, מספר קולות וסוג הרכב.",
  },
  {
    q: "למה מוצג רק עמוד ראשון לתצוגה?",
    a: "כדי להציג את אופי החומר בלי לחשוף את הקובץ המלא.",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("he-IL").format(price);
}

function unique(values: string[]) {
  return [
    "הכל",
    ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "he")),
  ];
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function FakePreview({
  title,
  instrument,
}: {
  title: string;
  instrument: string;
}) {
  return (
    <div className="relative h-64 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,rgba(38,30,22,0.96),rgba(16,13,10,0.96))] shadow-[0_18px_50px_rgba(0,0,0,0.24)] ring-1 ring-white/6">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_35%)]" />
      <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white">
        <div className="space-y-2">
          <div className="text-xs tracking-[0.25em] text-white/45">PREVIEW</div>
          <div className="text-xl font-bold">{title}</div>
          <div className="text-sm text-white/65">{instrument}</div>
        </div>

        <div className="text-center text-2xl font-black tracking-[0.35em] text-white/10">
          WATERMARK
        </div>

        <div className="text-xs text-white/45">עמוד ראשון לתצוגה בלבד</div>
      </div>
    </div>
  );
}

export default function Scores() {
  const [items] = useState<ScoreItem[]>(MOCK_SCORES);
  const [query, setQuery] = useState("");
  const [instrument, setInstrument] = useState("הכל");
  const [level, setLevel] = useState("הכל");
  const [style, setStyle] = useState("הכל");
  const [keySignature, setKeySignature] = useState("הכל");

  const [submitted, setSubmitted] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: "",
    contact: "",
    requestType: "",
    songName: "",
    details: "",
  });

  const instrumentOptions = useMemo(
    () => unique(items.map((item) => item.instrument)),
    [items]
  );
  const levelOptions = useMemo(
    () => unique(items.map((item) => item.level)),
    [items]
  );
  const styleOptions = useMemo(
    () => unique(items.map((item) => item.style)),
    [items]
  );
  const keyOptions = useMemo(
    () => unique(items.map((item) => item.keySignature)),
    [items]
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesText =
        !q ||
        [
          item.title,
          item.artist || "",
          item.instrument,
          item.level,
          item.style,
          item.format,
          item.keySignature,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesInstrument =
        instrument === "הכל" || item.instrument === instrument;
      const matchesLevel = level === "הכל" || item.level === level;
      const matchesStyle = style === "הכל" || item.style === style;
      const matchesKey =
        keySignature === "הכל" || item.keySignature === keySignature;

      return (
        matchesText &&
        matchesInstrument &&
        matchesLevel &&
        matchesStyle &&
        matchesKey
      );
    });
  }, [items, instrument, keySignature, level, query, style]);

  function prefillPurchase(item: ScoreItem) {
    setSubmitted(false);
    setRequestForm({
      name: "",
      contact: "",
      requestType: "רכישת תווים קיימים",
      songName: item.title,
      details: `שלום, אני מעוניינת לרכוש את "${item.title}" עבור ${item.instrument}, ברמה ${item.level}, בסולם ${item.keySignature}.`,
    });
    scrollToId("request-form");
  }

  function prefillCustom(text: string) {
    setSubmitted(false);
    setRequestForm({
      name: "",
      contact: "",
      requestType: "הזמנה אישית",
      songName: "",
      details: text,
    });
    scrollToId("request-form");
  }

  function updateField(field: keyof typeof requestForm, value: string) {
    setRequestForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleOrbitItemClick(item: OrbitItemConfig) {
    scrollToId(item.targetSectionId ?? "");
  }

  return (
    <InnerPageLayout
      title="תווים"
      description="מאגר תווים, עיבודים וכתיבה מוזיקלית בהזמנה אישית — לקנייה מיידית או לבקשה מותאמת."
    >
      <OrbitPageShell pageId="sheetMusic" onOrbitItemClick={handleOrbitItemClick}>
        <main dir="rtl">
          <div className="pb-16">
            <div className="mx-auto max-w-6xl space-y-10 px-6 md:space-y-14">
              <AppearOnScroll delay={24}>
                <section className="-mt-2 md:-mt-3">
                  <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-5">
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium ring-1 ring-primary/15 md:text-sm">
                        <FileMusic className="h-4 w-4 text-primary" />
                        דף תווים • מאגר + כתיבה לפי הזמנה
                      </div>

                      <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                        תווים, עיבודים וכתיבה מוזיקלית
                        <span className="mt-2 inline-block shimmer-gold">
                          לקנייה מיידית או להזמנה אישית
                        </span>
                      </h1>

                      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-lg">
                        כאן אפשר גם לעיין במאגר של תווים קיימים, וגם להזמין ממני
                        כתיבה או עיבוד מותאם: לכלי אחר, לרמה אחרת, לסולם אחר, לשני
                        קולות, להרכב או לתזמורת.
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          size="lg"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                          onClick={() => scrollToId("custom-order")}
                        >
                          להזמנה אישית
                        </Button>

                        <Button
                          variant="secondary"
                          size="lg"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                          onClick={() => scrollToId("catalog")}
                        >
                          לעיון במאגר
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {[
                          "תווים מוכנים",
                          "שינוי סולם",
                          "התאמה לכלי",
                          "שני קולות",
                          "עיבוד לתזמורת",
                          "שירי מקור",
                        ].map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-card/68 px-3.5 py-2 text-sm ring-1 ring-border/70"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="rounded-[2rem] bg-card/72 px-6 py-6 shadow-soft ring-1 ring-border backdrop-blur-sm md:px-7 md:py-7">
                        <div className="text-sm font-medium text-muted-foreground">
                          המסר המרכזי
                        </div>
                        <div className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
                          אם זה כבר קיים —
                          <span className="mt-1 block">אפשר לקנות.</span>
                        </div>
                        <div className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                          ואם זה עדיין לא קיים, או לא מתאים בדיוק לצורך —
                          אפשר להזמין ממני התאמה או כתיבה חדשה.
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-card/72 px-5 py-5 ring-1 ring-border/70">
                          <div className="text-sm text-muted-foreground">
                            מוצרים במאגר
                          </div>
                          <div className="mt-2 text-3xl font-bold">
                            {items.length}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-card/72 px-5 py-5 ring-1 ring-border/70">
                          <div className="text-sm text-muted-foreground">
                            מסלול אישי
                          </div>
                          <div className="mt-2 text-3xl font-bold">1:1</div>
                        </div>

                        <div className="rounded-2xl bg-card/72 px-5 py-5 ring-1 ring-border/70">
                          <div className="text-sm text-muted-foreground">
                            פתיחת עבודה
                          </div>
                          <div className="mt-2 text-3xl font-bold">מקדמה</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={50}>
                <section id="services-section">
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium ring-1 ring-primary/15 md:text-sm">
                      <Sparkles className="h-4 w-4 text-primary" />
                      מה אפשר לקבל כאן
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {SERVICES.map((service) => {
                      const Icon = service.icon;
                      return (
                        <div
                          key={service.key}
                          className="rounded-[1.75rem] bg-card/66 px-6 py-6 ring-1 ring-border/70 md:px-7 md:py-7"
                        >
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                            <Icon className="h-6 w-6 text-primary" />
                          </span>

                          <div className="mt-4 text-lg font-semibold md:text-xl">
                            {service.title}
                          </div>
                          <div className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                            {service.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={80}>
                <section id="catalog" className="scroll-mt-28">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium ring-1 ring-primary/15 md:text-sm">
                        <Search className="h-4 w-4 text-primary" />
                        מאגר התווים
                      </div>

                      <h2 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
                        לחיפוש לפי מה שנוח לך
                      </h2>

                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-lg">
                        כרגע זה דמו עם שמות דמה. בהמשך אפשר לחבר כאן את מאגר
                        ה־Drive האמיתי שלך.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-card/66 px-4 py-2 text-sm ring-1 ring-border/70">
                      {filteredItems.length} תוצאות
                    </div>
                  </div>

                  <div className="mt-8 rounded-[2rem] bg-card/62 px-5 py-5 ring-1 ring-border/70 md:px-6 md:py-6">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                      <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Search className="h-4 w-4" />
                          חיפוש
                        </span>
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="שם שיר, כלי, סגנון..."
                          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <SlidersHorizontal className="h-4 w-4" />
                          כלי
                        </span>
                        <select
                          value={instrument}
                          onChange={(e) => setInstrument(e.target.value)}
                          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                        >
                          {instrumentOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-2 text-sm text-muted-foreground">
                          רמה
                        </span>
                        <select
                          value={level}
                          onChange={(e) => setLevel(e.target.value)}
                          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                        >
                          {levelOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-2 text-sm text-muted-foreground">
                          סגנון
                        </span>
                        <select
                          value={style}
                          onChange={(e) => setStyle(e.target.value)}
                          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                        >
                          {styleOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-2 text-sm text-muted-foreground">
                          סולם
                        </span>
                        <select
                          value={keySignature}
                          onChange={(e) => setKeySignature(e.target.value)}
                          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                        >
                          {keyOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredItems.map((item) => (
                      <article
                        key={item.id}
                        className="overflow-hidden rounded-[2rem] bg-card/72 shadow-soft ring-1 ring-border backdrop-blur-sm transition hover:-translate-y-[2px]"
                      >
                        <div className="p-5">
                          <FakePreview
                            title={item.title}
                            instrument={item.instrument}
                          />
                        </div>

                        <div className="px-5 pb-5">
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-background/70 px-3 py-1 text-xs ring-1 ring-border/70">
                              {item.instrument}
                            </span>
                            <span className="rounded-full bg-background/70 px-3 py-1 text-xs ring-1 ring-border/70">
                              {item.level}
                            </span>
                            <span className="rounded-full bg-background/70 px-3 py-1 text-xs ring-1 ring-border/70">
                              {item.keySignature}
                            </span>
                            <span className="rounded-full bg-background/70 px-3 py-1 text-xs ring-1 ring-border/70">
                              {item.style}
                            </span>
                          </div>

                          <h3 className="mt-4 text-2xl font-bold">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm text-muted-foreground">
                            {item.artist ? `${item.artist} • ` : ""}
                            {item.format}
                          </p>

                          <div className="mt-5 flex items-center justify-between">
                            <div>
                              <div className="text-sm text-muted-foreground">
                                מחיר התחלתי
                              </div>
                              <div className="text-2xl font-bold">
                                ₪{formatPrice(item.price)}
                              </div>
                            </div>

                            <div className="text-sm text-primary">
                              {item.availability}
                            </div>
                          </div>

                          <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <button
                              type="button"
                              onClick={() => prefillPurchase(item)}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-[1px]"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              לבקשת רכישה
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                prefillCustom(
                                  `שלום, ראיתי את "${item.title}" ואני רוצה התאמה אישית: כלי אחר / סולם אחר / רמה אחרת / עיבוד נוסף.`
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold transition hover:-translate-y-[1px]"
                            >
                              <Wand2 className="h-4 w-4" />
                              התאמה אישית
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={110}>
                <section
                  id="custom-order"
                  className="scroll-mt-28 grid gap-6 lg:grid-cols-[1fr_0.95fr]"
                >
                  <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(38,30,22,0.96),rgba(16,13,10,0.96))] px-6 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.24)] ring-1 ring-white/6 md:px-8 md:py-8">
                    <div className="text-sm font-medium text-white/60">
                      המסלול המרכזי
                    </div>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl">
                      לא מצאת בדיוק מה שאת צריכה?
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-lg">
                      זה בדיוק המקום שבו השירות האישי נכנס: כתיבה מאפס, התאמות,
                      עיבוד לכלי אחר, שינוי רמה, שינוי סולם, שני קולות, הרכב,
                      תזמורת או שיר מקורי.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      {[
                        "יש לי שיר, אין לי תווים",
                        "יש תווים, אני צריכה לכלי אחר",
                        "אני צריכה רמה נמוכה יותר",
                        "אני צריכה סולם אחר",
                        "אני צריכה שני קולות",
                        "אני צריכה עיבוד לתזמורת",
                      ].map((request) => (
                        <button
                          key={request}
                          type="button"
                          onClick={() =>
                            prefillCustom(
                              `שלום, אני מעוניינת בבקשה מהסוג הבא: ${request}.`
                            )
                          }
                          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
                        >
                          {request}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[2rem] bg-card/72 px-6 py-7 shadow-soft ring-1 ring-border backdrop-blur-sm md:px-8 md:py-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium ring-1 ring-primary/15 md:text-sm">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      איך זה עובד
                    </div>

                    <div className="mt-6 space-y-5">
                      {HOW_IT_WORKS.map((step, index) => (
                        <div key={step} className="flex items-start gap-4">
                          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15 font-bold text-primary">
                            {index + 1}
                          </span>

                          <span className="min-w-0 text-sm leading-relaxed text-muted-foreground md:text-base">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={140}>
                <section
                  id="request-form"
                  className="scroll-mt-28 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]"
                >
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium ring-1 ring-primary/15 md:text-sm">
                      <ArrowLeft className="h-4 w-4 text-primary" />
                      טופס בקשה
                    </div>

                    <h2 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
                      שליחת בקשה מסודרת
                    </h2>

                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-lg">
                      כרגע זה טופס דמו. בשלב הבא אפשר לחבר אותו למייל, backend או
                      סליקה.
                    </p>

                    <form
                      className="mt-8 space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSubmitted(true);
                      }}
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <input
                          value={requestForm.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="שם מלא"
                          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                        />
                        <input
                          value={requestForm.contact}
                          onChange={(e) =>
                            updateField("contact", e.target.value)
                          }
                          placeholder="מייל / טלפון"
                          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                        />
                      </div>

                      <input
                        value={requestForm.requestType}
                        onChange={(e) =>
                          updateField("requestType", e.target.value)
                        }
                        placeholder="סוג הבקשה"
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                      />

                      <input
                        value={requestForm.songName}
                        onChange={(e) =>
                          updateField("songName", e.target.value)
                        }
                        placeholder="שם השיר"
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                      />

                      <textarea
                        value={requestForm.details}
                        onChange={(e) =>
                          updateField("details", e.target.value)
                        }
                        placeholder="מה בדיוק צריך?"
                        rows={7}
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
                      />

                      <div className="flex flex-wrap gap-3">
                        <Button
                          type="submit"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                        >
                          שליחת בקשה
                        </Button>

                        <Button
                          type="button"
                          variant="secondary"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                          onClick={() =>
                            setRequestForm({
                              name: "",
                              contact: "",
                              requestType: "",
                              songName: "",
                              details: "",
                            })
                          }
                        >
                          ניקוי טופס
                        </Button>
                      </div>

                      {submitted && (
                        <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm text-foreground ring-1 ring-primary/15">
                          הדף עובד. בשלב הבא נחבר את הטופס לשליחה אמיתית.
                        </div>
                      )}
                    </form>
                  </div>

                  <div className="space-y-5">
                    <div className="rounded-[2rem] bg-card/72 px-6 py-7 shadow-soft ring-1 ring-border backdrop-blur-sm md:px-7 md:py-7">
                      <h3 className="text-2xl font-bold">
                        מה כדאי לצרף לבקשה?
                      </h3>

                      <div className="mt-5 space-y-4">
                        {[
                          "שם השיר או קישור לביצוע",
                          "הכלי או הכלים המבוקשים",
                          "הרמה הרצויה",
                          "הסולם הרצוי",
                          "סוג העיבוד: סולו / אקורדים / שני קולות / תזמורת",
                          "כל הערה מיוחדת שחשובה לביצוע",
                        ].map((line) => (
                          <div key={line} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div className="text-sm leading-relaxed text-muted-foreground md:text-base">
                              {line}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-7">
                        <a
                          href={CONTACT_SCORES_HREF}
                          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:-translate-y-[1px] md:text-base"
                        >
                          ליצירת קשר מסודרת
                          <ArrowLeft className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <div
                      id="faq-section"
                      className="rounded-[2rem] bg-card/72 px-6 py-7 shadow-soft ring-1 ring-border backdrop-blur-sm md:px-7 md:py-7"
                    >
                      <h3 className="text-2xl font-bold">שאלות נפוצות</h3>

                      <div className="mt-5 space-y-4">
                        {FAQ.map((item) => (
                          <details
                            key={item.q}
                            className="rounded-2xl bg-background/70 px-4 py-4 ring-1 ring-border/70"
                          >
                            <summary className="cursor-pointer text-base font-semibold md:text-lg">
                              {item.q}
                            </summary>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                              {item.a}
                            </p>
                          </details>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>
            </div>
          </div>
        </main>
      </OrbitPageShell>
    </InnerPageLayout>
  );
}
