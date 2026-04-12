import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import InnerPageLayout from "@/components/InnerPageLayout";
import Section from "@/components/Section";
import ArticlePreview from "@/components/ArticlePreview";
import NewsletterSignupForm from "@/components/newsletter/NewsletterSignupForm";
import { useToast } from "@/components/ui/use-toast";

import OrbitPageShell from "@/orbit-system/OrbitPageShell";
import { pagesRegistry } from "@/orbit-system/pages.registry";

import blog1 from "@/assets/blog-1.avif";
import blog2 from "@/assets/blog-2.avif";
import blog3 from "@/assets/blog-3.avif";
import blog4 from "@/assets/blog-4.avif";
import blog5 from "@/assets/blog-5.avif";
import blog6 from "@/assets/blog-6.avif";
import blog7 from "@/assets/blog-7.avif";
import blog8 from "@/assets/blog-8.avif";
import blog9 from "@/assets/blog-9.avif";
import blog10 from "@/assets/blog-10.avif";

const WORKER_BASE = "https://toby-mailing-list.w0504124161.workers.dev";

type NewsletterIssue = {
  title: string;
  dateLabel: string;
  teaser: string;
  slug: string;
};

type TopicSuggestion = {
  title: string;
  hint?: string;
};

type CommunityVoice = {
  title: string;
  question: string;
  reply: string;
  linkLabel: string;
  slug: string;
};

type RequestedTopic = {
  title: string;
  status: "requested" | "in-progress" | "published";
};

type SubscriberTeaser = {
  title: string;
  teaser: string;
};

type SessionSubscriber = {
  id: string;
  email: string;
  name: string;
  status: string;
  source: string;
  newsletterOptIn: boolean;
  createdAt: string;
  approvedAt: string | null;
  lastLoginAt: string | null;
};

type SessionMeResponse = {
  ok: boolean;
  authenticated: boolean;
  subscriber?: SessionSubscriber;
  error?: string;
};

function articleHref(slug: string) {
  return `/article/${slug}`;
}

const Blog = () => {
  const animatedRef = useRef<(HTMLElement | null)[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("הכל");
  const [activeSectionId, setActiveSectionId] = useState<string>("featured");

  const [qaQuestion, setQaQuestion] = useState("");
  const [topic, setTopic] = useState("");

  const [sessionSubscriber, setSessionSubscriber] =
    useState<SessionSubscriber | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [signInEmail, setSignInEmail] = useState("");
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { toast } = useToast();
  const orbitNavItems = pagesRegistry.blog.orbit.items;

  const isSubscriber = !!sessionSubscriber;

  const refreshSession = async () => {
    try {
      const response = await fetch(`${WORKER_BASE}/session_me`, {
        method: "GET",
        credentials: "include",
      });

      const data: SessionMeResponse = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "session_me_failed");
      }

      if (data.authenticated && data.subscriber) {
        setSessionSubscriber(data.subscriber);
      } else {
        setSessionSubscriber(null);
      }
    } catch {
      setSessionSubscriber(null);
    } finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = signInEmail.trim().toLowerCase();
    if (!email) return;

    setIsSendingMagicLink(true);

    try {
      const response = await fetch(`${WORKER_BASE}/send_magic_link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "send_magic_link_failed");
      }

      toast({
        title: "אם הכתובת מאושרת, נשלח אלייך קישור",
        description:
          "בדקי את תיבת המייל. אם את כבר מאושרת במערכת, יחכה לך שם קישור כניסה.",
      });
    } catch (error) {
      toast({
        title: "לא הצלחנו לשלוח קישור כרגע",
        description:
          error instanceof Error
            ? error.message
            : "נסי שוב בעוד רגע.",
        variant: "destructive",
      });
    } finally {
      setIsSendingMagicLink(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch(`${WORKER_BASE}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "logout_failed");
      }

      setSessionSubscriber(null);

      toast({
        title: "יצאת בהצלחה",
        description: "אזור המנויות נסגר במכשיר הזה.",
      });
    } catch (error) {
      toast({
        title: "לא הצלחנו לנתק כרגע",
        description:
          error instanceof Error ? error.message : "נסי שוב בעוד רגע.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const newsletterIssues: NewsletterIssue[] = useMemo(
    () => [
      {
        title: "הניוזלטר האחרון: מאחורי הקלעים של יצירה",
        dateLabel: "ינואר 2026",
        teaser:
          "כמה מחשבות קצרות, כלים פרקטיים, ודברים שלא תמיד נכנסים למאמר מסודר — אבל כן שווים מייל.",
        slug: "newsletter-latest",
      },
      {
        title: "הניוזלטר: למה בכלל ניוזלטר?",
        dateLabel: "דצמבר 2025",
        teaser: "מכתב קצר שמגיע כשיש משהו טוב באמת. לא רעש. לא ספאם.",
        slug: "newsletter-why",
      },
      {
        title: "הניוזלטר: טיפים קטנים לפני שמתחילים",
        dateLabel: "נובמבר 2025",
        teaser: "רגע לפני — שלושה דברים שעושים סדר בראש ובאוזן.",
        slug: "newsletter-tips",
      },
    ],
    []
  );

  const latestNewsletter = newsletterIssues[0];
  const archiveNewsletters = newsletterIssues.slice(1);

  const highlights = useMemo(
    () => [
      {
        title: "איך מתרגלים כשאין זמן",
        description: "תרגול קצר, חכם, ועקבי — שמייצר תוצאות.",
        image: blog2,
        tag: "תרגול",
        slug: "practice-when-no-time",
      },
      {
        title: "להוציא רעיון לפועל בלי להישרף",
        description: "תהליך עבודה: סדר, גבולות, ומינימום דרמה.",
        image: blog3,
        tag: "תהליך",
        slug: "ship-without-burnout",
      },
      {
        title: "במה: מה קורה רגע לפני שעולים",
        description: "איך מכינים גוף+ראש, ומה לא לעשות בדקה האחרונה.",
        image: blog4,
        tag: "במה",
        slug: "before-stage",
      },
    ],
    []
  );

  const allArticles = useMemo(
    () => [
      {
        title: "איך בונים שגרת תרגול שעובדת",
        description: "בלי קיצורי דרך — אבל גם בלי להעמיס.",
        image: blog5,
        tag: "תרגול",
        slug: "practice-routine",
      },
      {
        title: "מתי לדעת שצריך מורה, ומתי פשוט עוד יום",
        description: "תכלס: איך מזהים תקיעות אמיתית.",
        image: blog6,
        tag: "למידה",
        slug: "need-teacher-or-just-a-day",
      },
      {
        title: "למה חימום הוא החלק הכי מוזנח (והכי חשוב)",
        description: "חמש דקות שמצילות רבע שעה.",
        image: blog7,
        tag: "תרגול",
        slug: "warmup-matters",
      },
      {
        title: "איך לבחור רפרטואר בלי ללכת לאיבוד",
        description: "בחירה שמכבדת אותך ואת הקהל.",
        image: blog8,
        tag: "יצירה",
        slug: "choose-repertoire",
      },
      {
        title: "איך מתאמנים על נוכחות ולא רק על תווים",
        description: "להיות 'שם' גם כשקשה.",
        image: blog9,
        tag: "במה",
        slug: "stage-presence",
      },
      {
        title: "מתי 'מספיק טוב' הוא הדבר הכי מקצועי",
        description: "סטנדרטים גבוהים בלי לשלם עליהם בבריאות.",
        image: blog10,
        tag: "תהליך",
        slug: "good-enough-is-pro",
      },
    ],
    []
  );

  const communityVoices: CommunityVoice[] = useMemo(
    () => [
      {
        title: "משאלה קצרה למאמר",
        question: "איך נשארים עקביות גם כשהשבוע מתפרק?",
        reply:
          "במקום לבנות שגרה מושלמת, בונים שגרה שיש לה גרסת חירום. ברגע שיש 'מסלול קטן' קבוע, לא נופלים לאפס.",
        linkLabel: "לקריאת המאמר שנולד מזה",
        slug: "practice-routine",
      },
      {
        title: "תגובה שקיבלה המשך",
        question: "אני מרגישה שאני לומדת, אבל לא מצליחה להעביר את זה לבמה.",
        reply:
          "הרבה פעמים חסר תרגול של נוכחות ולא רק של חומר. לכן בדף הזה יש גם אזור תוכן שעוסק בהעברה לבמה, לא רק באימון טכני.",
        linkLabel: "למאמר על נוכחות בבמה",
        slug: "stage-presence",
      },
      {
        title: "שאלה מהקהילה",
        question: "איך מחליטים על מה לכתוב כשיש יותר מדי רעיונות?",
        reply:
          "מקשיבים לחזרה שחוזרת אצל הקוראות. כשהמון שאלות מצטברות סביב אותו ציר — זה סימן למאמר שצריך להיכתב.",
        linkLabel: "למאמר על תהליך עבודה",
        slug: "ship-without-burnout",
      },
    ],
    []
  );

  const requestedTopicsBoard: RequestedTopic[] = useMemo(
    () => [
      { title: "איך להתאמן כשיש עומס רגשי", status: "requested" },
      { title: "איך להכין הופעה בלי להישחק", status: "in-progress" },
      { title: "מה עושים עם בלוק יצירתי", status: "published" },
    ],
    []
  );

  const subscriberTeasers: SubscriberTeaser[] = useMemo(
    () => [
      {
        title: "מכתב פנימי: מה אני עושה כשאני בעצמי לא בעקביות",
        teaser: "פוסט אישי קצר לרשומות בלבד — בלי פילטרים ובלי במה.",
      },
      {
        title: "מאחורי הקלעים של בחירת נושאים",
        teaser:
          "איך אני מחליטה אילו שאלות נשארות Q&A ואילו הופכות למאמר מלא.",
      },
      {
        title: "רשימת קריאה קטנה לחודש הקרוב",
        teaser:
          "המלצות, כיווני חשיבה, ותזכורות קטנות שלא נכנסות לפיד הציבורי.",
      },
    ],
    []
  );

  const categories = useMemo(
    () => ["הכל", "תרגול", "במה", "תהליך", "יצירה", "למידה"],
    []
  );

  const topicSuggestions: TopicSuggestion[] = useMemo(
    () => [
      {
        title: "איך בונים תוכנית תרגול שבועית?",
        hint: "דוגמה למסגרת שעובדת בפועל.",
      },
      {
        title: "מה עושים כשיש 'בלוק' יצירתי?",
        hint: "כלים קטנים לשחרור.",
      },
      {
        title: "איך נרגעים לפני הופעה?",
        hint: "גוף, נשימה, ואוזן.",
      },
      {
        title: "איך הופכים 'אני לא עקבית' להרגל?",
        hint: "בלי שיפוט עצמי.",
      },
    ],
    []
  );

  const filteredArticles = allArticles.filter(
    (article) =>
      selectedCategory === "הכל" || article.tag === selectedCategory
  );

  const featuredArticle = {
    title: "איך להפוך בלוג לדף שהוא גם במה, גם קהילה, וגם שער לתוכן",
    description:
      "המאמר המוביל בדמו הזה מדגים את הכיוון: פחות 'רשימת פוסטים', יותר מבנה חי שמחבר בין מאמרים, שאלות, והמשך מסלול.",
    image: blog1,
    tag: "מוביל",
    slug: "blog-stage-manifesto",
  };

  useEffect(() => {
    const els = animatedRef.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.18 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const sectionMap = orbitNavItems
      .map((item) => {
        const id = item.targetSectionId ?? "";
        const el = document.getElementById(id);
        return el ? { id, el } : null;
      })
      .filter(Boolean) as Array<{ id: string; el: HTMLElement }>;

    if (!sectionMap.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible?.target?.id) return;
        setActiveSectionId(visible.target.id);
      },
      {
        threshold: [0.2, 0.35, 0.55],
        rootMargin: "-18% 0px -45% 0px",
      }
    );

    sectionMap.forEach(({ el }) => io.observe(el));
    return () => io.disconnect();
  }, [orbitNavItems]);

  const scrollToSection = (id?: string) => {
    if (!id) return;
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const SectionTitle = ({
    children,
    eyebrow,
    subtitle,
    align = "center",
  }: {
    children: ReactNode;
    eyebrow?: string;
    subtitle?: string;
    align?: "center" | "right";
  }) => (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl text-right"
      }
    >
      {eyebrow ? (
        <div className="mb-3 text-[1.1rem] uppercase tracking-[0.32rem] text-[#FE2C55]">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-[2.5rem] font-semibold leading-[1.08] md:text-[3.2rem]">
        {children}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-[1.45rem] leading-[1.8] opacity-80 md:text-[1.6rem]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );

  const StickySectionNav = () => (
    <div
      className="sticky top-[72px] z-20 w-screen border-y border-white/10 bg-[rgba(11,11,14,0.72)] backdrop-blur-xl"
      style={{
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
      }}
    >
      <div className="mx-auto flex max-w-[110rem] gap-3 overflow-x-auto px-4 py-3 md:px-8">
        {orbitNavItems.map((item) => {
          const isActive = activeSectionId === item.targetSectionId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.targetSectionId)}
              className={[
                "whitespace-nowrap rounded-full border px-4 py-2 text-[1.05rem] uppercase tracking-[0.18rem] transition-all duration-300",
                isActive
                  ? "border-[#FE2C55]/40 bg-[rgba(254,44,85,0.16)] text-[#FE2C55]"
                  : "border-white/10 bg-[rgba(255,255,255,0.04)] hover:border-white/20",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const FeaturedSection = () => (
    <Section>
      <div id="featured" className="scroll-mt-32 md:scroll-mt-36" />
      <SectionTitle
        eyebrow="Featured Entry"
        subtitle="אזור הפתיחה שאמור למשוך את הקוראת קדימה ולא לזרוק אותה מיד לגריד אחיד."
      >
        שער הכניסה לדף
      </SectionTitle>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Link
          to={articleHref(featuredArticle.slug)}
          className="group relative min-h-[30rem] overflow-hidden rounded-[2rem] border border-white/10"
        >
          <img
            src={featuredArticle.image}
            alt={featuredArticle.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,12,0.1),rgba(9,9,12,0.86))]" />
          <div className="relative flex h-full flex-col justify-end p-7 text-right md:p-10">
            <div className="w-fit rounded-full border border-white/15 bg-[rgba(255,255,255,0.08)] px-4 py-2 text-[1rem] uppercase tracking-[0.24rem]">
              {featuredArticle.tag}
            </div>
            <h3 className="mt-5 max-w-[36rem] text-[2.4rem] font-semibold leading-[1.05] md:text-[3.3rem]">
              {featuredArticle.title}
            </h3>
            <p className="mt-4 max-w-[40rem] text-[1.45rem] leading-[1.8] opacity-90 md:text-[1.65rem]">
              {featuredArticle.description}
            </p>
            <div className="mt-6 text-[1.1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
              Read article
            </div>
          </div>
        </Link>

        <div className="grid gap-5">
          {highlights.map((item, index) => (
            <Link
              key={item.slug}
              to={articleHref(item.slug)}
              ref={(el) => (animatedRef.current[index] = el)}
              className="blog-feed__item rounded-[1.6rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 transition-colors hover:border-white/20"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-24 w-24 rounded-[1rem] object-cover md:h-28 md:w-28"
                />
                <div className="min-w-0 flex-1 text-right">
                  <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
                    {item.tag}
                  </div>
                  <div className="mt-2 text-[1.7rem] font-semibold leading-[1.18]">
                    {item.title}
                  </div>
                  <div className="mt-2 text-[1.35rem] leading-[1.7] opacity-80">
                    {item.description}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );

  const ArticlesSection = () => (
    <Section>
      <div id="articles" className="scroll-mt-32 md:scroll-mt-36" />
      <SectionTitle
        eyebrow="Articles Flow"
        subtitle="כאן הדף מפסיק להיות 'רשימה' ומתחיל לעבוד בקצב: מאמרים, בלוקי מעבר, וסינון דביק."
      >
        פיד מאמרים חי
      </SectionTitle>

      <div
        className="mt-8 flex flex-wrap justify-center gap-3 border-y border-white/10 bg-background/90 py-4 backdrop-blur-xl"
        style={{
          position: "sticky",
          top: "126px",
          zIndex: 10,
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full border px-4 py-2 text-[1.05rem] uppercase tracking-[0.18rem] transition-all duration-300 ${
              selectedCategory === category
                ? "border-[rgba(254,44,85,0.38)] bg-[rgba(254,44,85,0.15)] text-[#FE2C55]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="grid gap-6">
          {filteredArticles[0] ? (
            <div
              ref={(el) => (animatedRef.current[100] = el)}
              className="blog-feed__item rounded-[1.9rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 md:p-7"
            >
              <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-center">
                <img
                  src={filteredArticles[0].image}
                  alt={filteredArticles[0].title}
                  className="h-full min-h-[16rem] w-full rounded-[1.4rem] object-cover"
                />
                <div className="text-right">
                  <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
                    {filteredArticles[0].tag}
                  </div>
                  <h3 className="mt-3 text-[2.2rem] font-semibold leading-[1.08] md:text-[2.8rem]">
                    {filteredArticles[0].title}
                  </h3>
                  <p className="mt-4 text-[1.45rem] leading-[1.8] opacity-80">
                    {filteredArticles[0].description}
                  </p>
                  <div className="mt-6 flex flex-wrap justify-end gap-3 text-[1rem] uppercase tracking-[0.18rem] opacity-70">
                    <span>7 min read</span>
                    <span>•</span>
                    <span>reader favorite</span>
                  </div>
                  <Link
                    to={articleHref(filteredArticles[0].slug)}
                    className="mt-6 inline-flex items-center justify-center rounded-[0.95rem] border border-white/10 bg-[rgba(255,255,255,0.06)] px-5 py-3 text-[1.2rem] transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    לקריאה
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            {filteredArticles.slice(1).map((article, index) => (
              <div
                key={article.slug}
                ref={(el) => (animatedRef.current[110 + index] = el)}
                className="blog-feed__item"
              >
                <ArticlePreview
                  title={article.title}
                  slug={article.slug}
                  image={article.image}
                  imageAlt={article.title}
                  category={article.tag}
                  categorySlug={article.tag}
                  teaser={article.description}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[1.7rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 text-right">
            <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
              Concept block
            </div>
            <div className="mt-3 text-[2rem] font-semibold leading-[1.12]">
              מושג מקצועי בפשטות
            </div>
            <p className="mt-4 text-[1.4rem] leading-[1.8] opacity-80">
              כל כמה כרטיסים מגיע בלוק קצר ש"שובר" את הזרם. זה בדיוק מה שמונע
              מהעמוד להרגיש כמו גריד אוטומטי.
            </p>
          </div>

          <div className="rounded-[1.7rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 text-right">
            <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
              Mini Q&A
            </div>
            <div className="mt-3 text-[1.9rem] font-semibold leading-[1.18]">
              “מה עושים כשאין שבוע מסודר?”
            </div>
            <p className="mt-3 text-[1.35rem] leading-[1.8] opacity-80">
              מחליפים תוכנית מושלמת בתבנית קצרה של 12 דקות. זה מספיק כדי לא לאבד
              רצף.
            </p>
          </div>

          <div className="rounded-[1.7rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 text-right">
            <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
              Keep reading
            </div>
            <p className="mt-3 text-[1.35rem] leading-[1.8] opacity-80">
              כאן אפשר בהמשך להוסיף “הכי נקרא”, “הכי מדובר”, או “מאמרי פתיחה
              מומלצים”.
            </p>
            <a
              href="#subscribers"
              className="mt-5 inline-flex items-center justify-center rounded-[0.95rem] bg-[rgba(254,44,85,0.14)] px-4 py-2 text-[1.05rem] text-[#FE2C55] transition-colors hover:bg-[rgba(254,44,85,0.22)]"
            >
              להצטרפות לרשימת התפוצה
            </a>
          </div>
        </div>
      </div>
    </Section>
  );

  const QuickQuestionsSection = () => (
    <Section>
      <div id="quick-questions" className="scroll-mt-32 md:scroll-mt-36" />
      <SectionTitle
        eyebrow="Quick Questions"
        subtitle="המסלול הקליל של הדף: שאלה קצרה, תשובה קצרה, ולעיתים גם מאמר שלם שנולד מזה."
      >
        שאלות קצרות
      </SectionTitle>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-5">
          {communityVoices.slice(0, 2).map((item) => (
            <div
              key={item.slug}
              className="rounded-[1.6rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 text-right"
            >
              <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
                {item.title}
              </div>
              <div className="mt-3 text-[1.7rem] font-semibold leading-[1.25]">
                {item.question}
              </div>
              <div className="mt-3 text-[1.35rem] leading-[1.8] opacity-80">
                {item.reply}
              </div>
              <Link
                to={articleHref(item.slug)}
                className="mt-5 inline-flex items-center justify-center rounded-[0.95rem] border border-white/10 bg-[rgba(255,255,255,0.05)] px-4 py-2 text-[1.05rem] transition-colors hover:bg-[rgba(255,255,255,0.09)]"
              >
                {item.linkLabel}
              </Link>
            </div>
          ))}
        </div>

        {!isSubscriber ? (
          <div className="rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 text-center md:p-10">
            <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
              Members only
            </div>
            <div className="mt-4 text-[2.2rem] font-semibold">
              האזור הזה פתוח למנויות בלבד
            </div>
            <p className="mt-4 text-[1.45rem] leading-[1.8] opacity-80">
              כדי לשאול שאלה ולקבל תשובה — מצטרפים קודם לרשימת התפוצה או נכנסים
              דרך קישור שנשלח למייל.
            </p>
            <a
              href="#subscribers"
              className="mt-6 inline-flex items-center justify-center rounded-[1rem] bg-[rgba(254,44,85,0.16)] px-6 py-3 text-[1.2rem] text-[#FE2C55] transition-colors hover:bg-[rgba(254,44,85,0.22)]"
            >
              להצטרפות או כניסה
            </a>
          </div>
        ) : (
          <div className="rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 md:p-10">
            <div className="text-right">
              <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
                Ask here
              </div>
              <div className="mt-3 text-[2.2rem] font-semibold">
                מה היית רוצה לשאול?
              </div>
              <p className="mt-3 text-[1.35rem] leading-[1.8] opacity-80">
                כרגע הגישה נפתחה לפי ההתחברות שלך. חיבור שליחת השאלה עצמה לשרת
                יהיה השלב הבא.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast({
                  title: "השלב הבא כבר קרוב",
                  description:
                    "אזור המנויות פתוח עבורך, אבל שליחת השאלה לשרת עדיין לא חוברה.",
                });
              }}
              className="mt-6 grid gap-4"
            >
              <textarea
                value={qaQuestion}
                onChange={(e) => setQaQuestion(e.target.value)}
                rows={6}
                placeholder="כתבי כאן את השאלה…"
                className="w-full rounded-[1.1rem] border border-white/10 bg-[rgba(0,0,0,0.25)] px-5 py-4 text-[1.35rem] outline-none focus:border-white/20"
              />
              <button
                type="submit"
                className="rounded-[0.95rem] border border-white/10 bg-[rgba(255,255,255,0.06)] px-6 py-3 text-[1.15rem] transition-colors hover:bg-[rgba(255,255,255,0.1)]"
              >
                שליחה
              </button>
            </form>
          </div>
        )}
      </div>
    </Section>
  );

  const CommunitySection = () => (
    <Section>
      <div id="community" className="scroll-mt-32 md:scroll-mt-36" />
      <SectionTitle
        eyebrow="Community Voices"
        subtitle="זה הסקשן שמראה לעין את האינטראקציה. לא רק תגובות מתחת לפוסט — אלא דיאלוג מוצג."
      >
        קולות מהקהילה
      </SectionTitle>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {communityVoices.map((item) => (
          <div
            key={item.slug}
            className="rounded-[1.7rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 text-right"
          >
            <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
              {item.title}
            </div>
            <div className="mt-4 rounded-[1.1rem] border border-white/10 bg-[rgba(0,0,0,0.18)] p-4 text-[1.28rem] leading-[1.75]">
              {item.question}
            </div>
            <div className="mt-4 text-[1.35rem] leading-[1.8] opacity-80">
              {item.reply}
            </div>
            <Link
              to={articleHref(item.slug)}
              className="mt-5 inline-flex items-center justify-center rounded-[0.95rem] bg-[rgba(255,255,255,0.06)] px-4 py-2 text-[1.05rem] transition-colors hover:bg-[rgba(255,255,255,0.1)]"
            >
              {item.linkLabel}
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );

  const RequestedTopicsSection = () => (
    <Section>
      <div id="requested-topics" className="scroll-mt-32 md:scroll-mt-36" />
      <SectionTitle
        eyebrow="Requested Topics"
        subtitle="כאן רואים שהשאלות לא נעלמות. הן יכולות להתאסף, להיכנס לעבודה, ולהפוך לפוסטים."
      >
        נושאים שביקשו
      </SectionTitle>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 md:p-10">
          <div className="text-right">
            <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
              Request an article
            </div>
            <div className="mt-3 text-[2.2rem] font-semibold">
              יש נושא שבא לך שאכתוב עליו?
            </div>
            <p className="mt-3 text-[1.35rem] leading-[1.8] opacity-80">
              זה לא “טופס צור קשר”, אלא מסלול אמיתי להזמנת תוכן. בהמשך אפשר
              לחבר את זה לטבלת ניהול ולסטטוסים.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast({
                title: "השלב הבא כבר מוכן בתור",
                description:
                  "כרגע הטופס עדיין לא מחובר לשרת, אבל ההתחברות למנויות כבר חיה.",
              });
            }}
            className="mt-6 grid gap-4"
          >
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="נושא למאמר…"
              className="w-full rounded-[1.1rem] border border-white/10 bg-[rgba(0,0,0,0.25)] px-5 py-4 text-[1.35rem] outline-none focus:border-white/20"
            />
            <button
              type="submit"
              className="rounded-[0.95rem] border border-white/10 bg-[rgba(255,255,255,0.06)] px-6 py-3 text-[1.15rem] transition-colors hover:bg-[rgba(255,255,255,0.1)]"
            >
              שליחה
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="text-right text-[1rem] uppercase tracking-[0.24rem] opacity-70">
              רעיונות להתחלה
            </div>
            <div className="mt-5 grid gap-4">
              {topicSuggestions.map((suggestion) => (
                <button
                  key={suggestion.title}
                  type="button"
                  onClick={() => setTopic(suggestion.title)}
                  className="rounded-[1.1rem] border border-white/10 bg-[rgba(0,0,0,0.15)] p-5 text-right transition-colors hover:border-white/20"
                >
                  <div className="text-[1.5rem] font-semibold">
                    {suggestion.title}
                  </div>
                  {suggestion.hint ? (
                    <div className="mt-1 text-[1.2rem] leading-[1.7] opacity-70">
                      {suggestion.hint}
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          {requestedTopicsBoard.map((item) => {
            const statusLabel =
              item.status === "requested"
                ? "requested"
                : item.status === "in-progress"
                  ? "in progress"
                  : "published";

            const statusClass =
              item.status === "requested"
                ? "bg-[rgba(255,255,255,0.08)] text-white"
                : item.status === "in-progress"
                  ? "bg-[rgba(254,44,85,0.14)] text-[#FE2C55]"
                  : "bg-[rgba(60,179,113,0.16)] text-[#8fe6b0]";

            return (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 text-right"
              >
                <div className="flex items-center justify-between gap-4">
                  <div
                    className={`rounded-full px-3 py-2 text-[0.95rem] uppercase tracking-[0.18rem] ${statusClass}`}
                  >
                    {statusLabel}
                  </div>
                  <div className="text-[1.55rem] font-semibold">
                    {item.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );

  const SubscribersSection = () => (
    <Section>
      <div id="subscribers" className="scroll-mt-32 md:scroll-mt-36" />
      <SectionTitle
        eyebrow="For Subscribers"
        subtitle="השכבה שמחברת בין הבלוג לבין רשימת התפוצה: הצטרפות, כניסה, ארכיון קצר, וטיזרים נעולים."
      >
        לרשומות
      </SectionTitle>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <div className="rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 text-right md:p-10">
          <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
            Mailing list
          </div>
          <div className="mt-3 text-[2.2rem] font-semibold">
            מכתב קצר. כשיש משהו שווה באמת.
          </div>

          {sessionLoading ? (
            <div className="mt-5 rounded-[1rem] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[1.05rem] opacity-75">
              בודקת אם כבר יש חיבור פעיל למנויה…
            </div>
          ) : isSubscriber ? (
            <div className="mt-5 rounded-[1.2rem] border border-[rgba(254,44,85,0.24)] bg-[rgba(254,44,85,0.08)] p-5">
              <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
                Signed in
              </div>
              <div className="mt-3 text-[1.7rem] font-semibold">
                את כבר מחוברת כאזור מנויה
              </div>
              <p className="mt-3 text-[1.2rem] leading-[1.8] opacity-80">
                {sessionSubscriber?.email}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-5 rounded-[0.95rem] border border-white/10 bg-[rgba(255,255,255,0.06)] px-5 py-3 text-[1.05rem] transition-colors hover:bg-[rgba(255,255,255,0.1)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? "מנתקת..." : "יציאה מאזור המנויות"}
              </button>
            </div>
          ) : (
            <>
              <p className="mt-4 text-[1.35rem] leading-[1.8] opacity-80">
                כאן מצטרפים לרשימת התפוצה. ההרשמה נשלחת לשרת, נשמרת, ומועברת
                לאישור לפני פתיחת גישת מנויים.
              </p>

              <div className="mt-6">
                <NewsletterSignupForm
                  source="blog-subscribers-section"
                  onSuccess={() => undefined}
                />
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
                  Already subscribed?
                </div>
                <div className="mt-3 text-[1.7rem] font-semibold">
                  כבר אושרת? כניסה דרך המייל
                </div>
                <p className="mt-3 text-[1.2rem] leading-[1.8] opacity-80">
                  מזינים כאן את המייל, ואם הכתובת כבר מאושרת — נשלח אלייך קישור
                  כניסה אישי.
                </p>

                <form onSubmit={handleSendMagicLink} className="mt-5 grid gap-3">
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="כתובת מייל…"
                    required
                    className="w-full rounded-xl border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
                    dir="rtl"
                  />

                  <button
                    type="submit"
                    disabled={isSendingMagicLink}
                    className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSendingMagicLink ? "שולחת..." : "שלחי לי קישור כניסה"}
                  </button>
                </form>
              </div>

              <div className="mt-4 text-[1.15rem] leading-[1.8] opacity-70">
                אחרי הרשמה תקבלי אישור מסודר, ואחרי אישור תוכלי להיכנס מכאן
                לאזור המנויות.
              </div>
            </>
          )}
        </div>

        <div className="grid gap-5">
          <div className="rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 text-right">
            <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
              Latest newsletter
            </div>
            <h3 className="mt-3 text-[2rem] font-semibold leading-[1.12]">
              {latestNewsletter.title}
            </h3>
            <div className="mt-2 text-[1.1rem] opacity-65">
              {latestNewsletter.dateLabel}
            </div>
            <p className="mt-4 text-[1.3rem] leading-[1.8] opacity-80">
              {latestNewsletter.teaser}
            </p>
            <Link
              to={articleHref(latestNewsletter.slug)}
              className="mt-5 inline-flex items-center justify-center rounded-[0.95rem] border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-2 text-[1.05rem] transition-colors hover:bg-[rgba(255,255,255,0.1)]"
            >
              לקריאה
            </Link>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 text-right">
            <div className="text-[1rem] uppercase tracking-[0.24rem] text-[#FE2C55]">
              Newsletter archive
            </div>
            <div className="mt-5 grid gap-4">
              {archiveNewsletters.map((issue) => (
                <Link
                  key={issue.slug}
                  to={articleHref(issue.slug)}
                  className="rounded-[1.1rem] border border-white/10 bg-[rgba(0,0,0,0.16)] p-4 transition-colors hover:border-white/20"
                >
                  <div className="text-[1.35rem] font-semibold leading-[1.3]">
                    {issue.title}
                  </div>
                  <div className="mt-1 text-[1.05rem] opacity-65">
                    {issue.dateLabel}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          {subscriberTeasers.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.6rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 text-right"
            >
              <div className="w-fit rounded-full border border-white/10 bg-[rgba(255,255,255,0.05)] px-3 py-1 text-[0.95rem] uppercase tracking-[0.18rem]">
                {isSubscriber ? "open" : "locked"}
              </div>
              <div className="mt-4 text-[1.55rem] font-semibold leading-[1.25]">
                {item.title}
              </div>
              <div className="mt-3 text-[1.25rem] leading-[1.8] opacity-80">
                {item.teaser}
              </div>
              <div className="mt-4 text-[1.05rem] leading-[1.8] opacity-70">
                {isSubscriber
                  ? "האזור הזה כבר נפתח עבורך כמנויה מחוברת. חיבור הפוסטים הסגורים עצמם הוא השלב הבא."
                  : "הפוסט המלא ייפתח אחרי כניסה למנויות."}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );

  const BottomCta = () => (
    <Section className="pb-20 md:pb-24">
      <div className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(254,44,85,0.14),transparent_40%),rgba(255,255,255,0.04)] px-6 py-10 text-center md:px-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="text-[1rem] uppercase tracking-[0.28rem] text-[#FE2C55]">
            Stay close
          </div>
          <h2 className="mt-4 text-[2.7rem] font-semibold leading-[1.06] md:text-[3.8rem]">
            לסגור את המסלול
            <br />
            עם פעולה אחת ברורה
          </h2>
          <p className="mt-5 text-[1.45rem] leading-[1.8] opacity-80 md:text-[1.6rem]">
            אם הדף הזה הצליח לגרום לרצות להמשיך — זה בדיוק המקום להצטרף,
            להתחבר, או לחזור לתחנה הכי רלוונטית עבורך.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#subscribers"
              className="inline-flex items-center justify-center rounded-[1rem] bg-[rgba(254,44,85,0.16)] px-6 py-3 text-[1.2rem] text-[#FE2C55] transition-colors hover:bg-[rgba(254,44,85,0.22)]"
            >
              {isSubscriber ? "לאזור המנויות" : "להצטרפות או כניסה"}
            </a>
            <a
              href="#articles"
              className="inline-flex items-center justify-center rounded-[1rem] border border-white/10 bg-[rgba(255,255,255,0.06)] px-6 py-3 text-[1.2rem] transition-colors hover:bg-[rgba(255,255,255,0.1)]"
            >
              לחזרה למאמרים
            </a>
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <InnerPageLayout
      title="בלוג"
      description="במה חיה לתוכן, שאלות וקשר עם הקוראות."
    >
      <OrbitPageShell pageId="blog">
        <div dir="rtl" className="min-h-screen flex flex-col">
          <StickySectionNav />
          <FeaturedSection />
          <ArticlesSection />
          <QuickQuestionsSection />
          <CommunitySection />
          <RequestedTopicsSection />
          <SubscribersSection />
          <BottomCta />
        </div>
      </OrbitPageShell>
    </InnerPageLayout>
  );
};

export default Blog;
