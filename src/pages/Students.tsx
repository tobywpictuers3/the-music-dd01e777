import type { ComponentType } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import InnerPageLayout from "@/components/InnerPageLayout";
import OrbitPageShell from "@/orbit-system/OrbitPageShell";
import type { OrbitItemConfig, OrbitItemId } from "@/orbit-system/orbit.types";
import { STUDENTS_PAGE_ORBIT_CONTENT } from "@/content/orbit/studentsPageOrbitContent";
import { STUDENTS_PAGE_BODY_CONTENT } from "@/content/students/studentsPageBodyContent";
import AppearOnScroll from "@/components/AppearOnScroll";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BadgeDollarSign,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  MessageSquareMore,
  Mic2,
  Music2,
  Quote,
  Smartphone,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";

/* =========================================================
   תמונות
   ========================================================= */
import studentsPresenterMain from "@/assets/students/students-presenter-main.png";
import studentsTestimonialsAnnouncer from "@/assets/students/students-testimonials-announcer.png";
import studentsLearningTouch from "@/assets/students/students-learning-touch.webp";
import studentsStudyMaterials from "@/assets/students/students-study-materials.webp";
import studentsStageAtmosphereWide from "@/assets/students/students-stage-atmosphere-wide.webp";
import studentsDemoSystemPreview from "@/assets/students/students-demo-system-preview.webp";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* =========================================================
   קישורים
   ========================================================= */
const CONTACT_STUDENTS_HREF = "/contact?from=students&topic=lessons_private";
const STUDENTS_APP_HREF = "https://tobymusic.lovable.app";
const STUDENTS_DEMO_HREF = "/students-demo";
const EDUCATIONAL_ORCHESTRA_HREF = "/orchestras";
const ABOUT_TEACHING_HREF = "/about#teaching";

/* =========================================================
   אייקונים
   ========================================================= */
const ICONS = {
  music: Music2,
  mic: Mic2,
  graduation: GraduationCap,
  clipboard: ClipboardList,
  calendar: CalendarRange,
  book: BookOpen,
  check: CheckCircle2,
  sparkles: Sparkles,
  message: MessageSquareMore,
  badgeDollar: BadgeDollarSign,
} as const;

const DEFAULT_ACTIVE_ORBIT_ID: OrbitItemId =
  STUDENTS_PAGE_ORBIT_CONTENT.orbit.items[0]?.id ?? "1";

const STUDENTS_SECTION_ORBIT_MAP = STUDENTS_PAGE_ORBIT_CONTENT.orbit.items
  .filter((item) => !!item.targetSectionId)
  .map((item) => ({
    sectionId: item.targetSectionId as string,
    orbitId: item.id,
  }));

/* =========================================================
   רכיבי עזר
   ========================================================= */

type AudioIconButtonProps = {
  speaking: boolean;
  onClick: () => void;
  className?: string;
};

function AudioIconButton({
  speaking,
  onClick,
  className,
}: AudioIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={speaking ? "עצירת השמעה" : "השמעה"}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:-translate-y-[1px] hover:bg-secondary",
        className
      )}
    >
      {speaking ? (
        <Square className="h-4 w-4 text-primary" />
      ) : (
        <Volume2 className="h-5 w-5 text-primary" />
      )}
    </button>
  );
}

export default function Students() {
  const content = STUDENTS_PAGE_BODY_CONTENT;

  const [openSmartSystem, setOpenSmartSystem] = useState(false);
  const [tIndex, setTIndex] = useState(0);
  const [activeOrbitId, setActiveOrbitId] =
    useState<OrbitItemId>(DEFAULT_ACTIVE_ORBIT_ID);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const testimonialPauseRef = useRef(false);

  const currentTestimonial =
    content.testimonials[tIndex] ?? content.testimonials[0];

  const orbitIdBySection = useMemo(() => {
    return Object.fromEntries(
      STUDENTS_SECTION_ORBIT_MAP.map((item) => [item.sectionId, item.orbitId])
    ) as Record<string, OrbitItemId>;
  }, []);

  function setActiveOrbitBySection(sectionId: string) {
    const orbitId = orbitIdBySection[sectionId];
    if (orbitId) setActiveOrbitId(orbitId);
  }

  function stopSpeech() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeakingKey(null);
  }

  function speakText(key: string, text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "he-IL";
    utterance.rate = 0.96;
    utterance.pitch = 1;

    utterance.onend = () =>
      setSpeakingKey((current) => (current === key ? null : current));
    utterance.onerror = () =>
      setSpeakingKey((current) => (current === key ? null : current));

    setSpeakingKey(key);
    synth.speak(utterance);
  }

  function toggleSpeech(key: string, text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    if (speakingKey === key && synth.speaking) {
      stopSpeech();
      return;
    }

    speakText(key, text);
  }

  function scrollToSection(sectionId?: string, orbitId?: OrbitItemId) {
    if (orbitId) setActiveOrbitId(orbitId);
    if (!sectionId) return;

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleOrbitItemClick(item: OrbitItemConfig) {
    scrollToSection(item.targetSectionId, item.id);
  }

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (testimonialPauseRef.current) return;
      setTIndex((prev) => (prev + 1) % content.testimonials.length);
    }, 8500);

    return () => window.clearInterval(id);
  }, [content.testimonials.length]);

  useEffect(() => {
    const elements = STUDENTS_SECTION_ORBIT_MAP.map((item) => {
      const el = document.getElementById(item.sectionId);
      return el ? { ...item, el } : null;
    }).filter(Boolean) as Array<{
      sectionId: string;
      orbitId: OrbitItemId;
      el: HTMLElement;
    }>;

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const matched = elements.find(({ el }) => el === visible.target);
        if (matched) {
          setActiveOrbitId(matched.orbitId);
        }
      },
      {
        threshold: [0.15, 0.35, 0.6],
        rootMargin: "-28% 0px -42% 0px",
      }
    );

    elements.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <InnerPageLayout
      title="תלמידות"
      description="מסלול מוסיקלי יסודי, אנושי ומסודר לתלמידות — עם שיעור, תרגול, רצף ומערכת תומכת."
    >
      <main dir="rtl" className="pb-24">
        <OrbitPageShell
          pageId="students"
          content={STUDENTS_PAGE_ORBIT_CONTENT}
          onOrbitItemClick={handleOrbitItemClick}
          controlledActiveItemId={activeOrbitId}
        >
          <div className="pb-16">
            <div className="mx-auto max-w-6xl space-y-12 px-6 md:space-y-16">
              <AppearOnScroll delay={18}>
                <section className="flex justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                  >
                    <a href={CONTACT_STUDENTS_HREF}>{content.topCta.label}</a>
                  </Button>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={54}>
                <section
                  id="track-section"
                  className="scroll-mt-28 pt-2"
                  onMouseEnter={() => setActiveOrbitBySection("track-section")}
                  onMouseLeave={() => {
                    testimonialPauseRef.current = false;
                  }}
                >
                  <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15 md:text-sm">
                      <Quote className="h-4 w-4" />
                      {content.trackSection.badge}
                    </div>

                    <h2 className="mt-4 text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
                      {content.trackSection.titleLines[0]}
                      <span className="mt-2 block">
                        {content.trackSection.titleLines[1]}
                      </span>
                    </h2>

                    <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-xl">
                      {content.trackSection.description}
                    </p>
                  </div>

                  <div className="mt-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                    <div
                      className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-8"
                      onMouseEnter={() => {
                        testimonialPauseRef.current = true;
                      }}
                      onMouseLeave={() => {
                        testimonialPauseRef.current = false;
                      }}
                    >
                      <div key={currentTestimonial.key} className="min-h-[220px]">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                          <Quote className="h-6 w-6" />
                        </div>

                        <div className="mt-5 text-2xl font-semibold leading-relaxed text-foreground md:text-[2rem]">
                          “{currentTestimonial.quote}”
                        </div>

                        <div className="mt-6 text-base text-muted-foreground md:text-lg">
                          <span className="font-black text-primary">
                            {currentTestimonial.name}
                          </span>
                          {currentTestimonial.context && (
                            <>
                              <span className="mx-2 opacity-50">|</span>
                              <span>{currentTestimonial.context}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          {content.testimonials.map((item, i) => (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => setTIndex(i)}
                              className={cn(
                                "h-3.5 w-3.5 rounded-full transition-all",
                                i === tIndex
                                  ? "scale-110 bg-primary"
                                  : "bg-primary/20 hover:bg-primary/40"
                              )}
                              aria-label={`המלצה ${i + 1}`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            className="h-12 rounded-2xl px-5 text-sm font-semibold md:text-base"
                            onClick={() =>
                              setTIndex(
                                (prev) =>
                                  (prev - 1 + content.testimonials.length) %
                                  content.testimonials.length
                              )
                            }
                          >
                            <ChevronRight className="ml-2 h-5 w-5" />
                            הקודם
                          </Button>

                          <Button
                            className="h-12 rounded-2xl px-5 text-sm font-semibold md:text-base"
                            onClick={() =>
                              setTIndex(
                                (prev) =>
                                  (prev + 1) % content.testimonials.length
                              )
                            }
                          >
                            הבא
                            <ChevronLeft className="mr-2 h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="flex justify-center rounded-[2rem] border border-border bg-card p-5 shadow-soft">
                        <img
                          src={studentsTestimonialsAnnouncer}
                          alt={content.trackSection.announcerAlt}
                          className="h-auto w-full max-w-[320px] object-contain md:max-w-[420px]"
                          loading="lazy"
                        />
                      </div>

                      <div className="rounded-[2rem] border border-border bg-secondary p-6 shadow-soft md:p-8">
                        <div className="text-2xl font-black leading-tight text-foreground md:text-3xl">
                          {content.trackSection.sideCardTitleLines[0]}
                          <span className="mt-2 block">
                            {content.trackSection.sideCardTitleLines[1]}
                          </span>
                        </div>

                        <ul className="mt-5 space-y-2.5 text-base leading-relaxed text-muted-foreground md:text-lg">
                          {content.trackSection.sideCardBullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>

                        <Button
                          asChild
                          className="mt-6 h-12 rounded-2xl px-5 text-sm font-semibold md:text-base"
                        >
                          <a href={CONTACT_STUDENTS_HREF}>
                            {content.trackSection.sideCardCtaLabel}
                            <ArrowLeft className="mr-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={92}>
                <section className="pt-1">
                  <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15 md:text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      {content.commitmentSection.badge}
                    </div>

                    <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl text-foreground">
                      {content.commitmentSection.titleLines[0]}
                      <span className="mt-2 block">
                        {content.commitmentSection.titleLines[1]}
                      </span>
                    </h2>
                  </div>

                  <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_1.02fr]">
                    <div className="flex flex-col items-center gap-4">
                      <AudioIconButton
                        speaking={speakingKey === "hero-piano"}
                        onClick={() =>
                          toggleSpeech("hero-piano", content.heroQuote)
                        }
                      />

                      <img
                        src={studentsPresenterMain}
                        alt={content.commitmentSection.presenterAlt}
                        className="h-auto w-full max-w-[420px] object-contain md:max-w-[560px]"
                        loading="eager"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-8">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                          <Quote className="h-6 w-6" />
                        </div>

                        <div className="mt-5 text-lg leading-relaxed text-foreground md:text-2xl">
                          “{content.heroQuote}”
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-soft md:p-6">
                          <div className="text-base font-bold text-foreground md:text-lg">
                            {content.commitmentSection.importantTitle}
                          </div>
                          <div className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                            {content.commitmentSection.importantText}
                          </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-soft md:p-6">
                          <div className="text-base font-bold text-foreground md:text-lg">
                            {content.commitmentSection.resultTitle}
                          </div>
                          <div className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                            {content.commitmentSection.resultText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={110}>
                <section
                  id="studies-section"
                  className="scroll-mt-28 pt-2"
                  onMouseEnter={() => setActiveOrbitBySection("studies-section")}
                >
                  <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15 md:text-sm">
                      <Music2 className="h-4 w-4" />
                      {content.studiesSection.badge}
                    </div>

                    <h2 className="mt-4 text-3xl font-black text-foreground sm:text-4xl md:text-5xl">
                      {content.studiesSection.title}
                    </h2>

                    <div className="mt-4 text-base leading-relaxed text-muted-foreground md:text-xl">
                      {content.studiesSection.description}
                    </div>
                  </div>

                  <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.02fr_0.98fr]">
                    <div className="space-y-6">
                      <img
                        src={studentsLearningTouch}
                        alt={content.studiesSection.imageAlt}
                        className="h-auto min-h-[360px] w-full rounded-[2rem] border border-border object-cover object-center shadow-soft"
                        loading="lazy"
                      />

                      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-7">
                        <div className="text-2xl font-black text-foreground md:text-3xl">
                          {content.studiesSection.supportTitle}
                        </div>

                        <div className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                          {content.studiesSection.supportDescription}
                        </div>

                        <div className="mt-5 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                          {content.studiesSection.supportStudies.map((item) => (
                            <span
                              key={item}
                              className="rounded-full bg-secondary px-3.5 py-2 text-sm text-secondary-foreground ring-1 ring-border md:text-base"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid items-start gap-5 md:grid-cols-2">
                      {content.studiesSection.primaryStudies.map((study) => {
                        const Icon =
                          ICONS[study.iconKey as keyof typeof ICONS] ?? Music2;

                        return (
                          <div
                            key={study.key}
                            className="flex h-full flex-col rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-7"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-2xl font-black text-foreground md:text-3xl">
                                  {study.title}
                                </div>
                                <div className="mt-2 text-base text-muted-foreground">
                                  {study.subtitle}
                                </div>
                              </div>

                              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                                <Icon className="h-7 w-7 text-primary" />
                              </span>
                            </div>

                            <ul className="mt-6 space-y-3">
                              {study.bullets.map((bullet) => (
                                <li
                                  key={bullet}
                                  className="flex items-start gap-3 text-base"
                                >
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                  <span className="leading-relaxed text-muted-foreground">
                                    {bullet}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8">
                    <a href={EDUCATIONAL_ORCHESTRA_HREF} className="block">
                      <div className="rounded-[2rem] border border-border bg-card px-8 py-8 text-center shadow-soft md:px-10 md:py-10">
                        <div className="text-3xl font-black text-foreground md:text-4xl">
                          {content.studiesSection.orchestraTitle}
                        </div>
                        <div className="mx-auto mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-2xl">
                          {content.studiesSection.orchestraDescription}
                        </div>
                        <div className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-primary md:text-lg">
                          {content.studiesSection.orchestraCtaLabel}
                          <ArrowLeft className="h-4 w-4" />
                        </div>
                      </div>
                    </a>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={130}>
                <section
                  id="belief-section"
                  className="scroll-mt-28 pt-2"
                  onMouseEnter={() => setActiveOrbitBySection("belief-section")}
                >
                  <div className="relative overflow-hidden rounded-[2.2rem] border border-border shadow-soft">
                    <img
                      src={studentsStageAtmosphereWide}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-background/85 dark:bg-background/80" />

                    <div className="relative grid gap-8 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.02fr_0.98fr]">
                      <div className="space-y-4">
                        <div className="rounded-[1.7rem] border border-border bg-card/80 p-6 shadow-soft backdrop-blur-sm md:p-8">
                          <div className="inline-flex items-center gap-3">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                              <Quote className="h-6 w-6 text-primary" />
                            </span>
                            <div className="text-sm font-medium text-muted-foreground md:text-base">
                              {content.beliefSection.label}
                            </div>
                          </div>

                          <div className="mt-6 text-3xl font-black leading-tight text-foreground md:text-5xl">
                            {content.beliefSection.titleLines[0]}
                            <span className="mt-2 block">
                              {content.beliefSection.titleLines[1]}
                            </span>
                          </div>

                          <div className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                            {content.beliefSection.description}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {content.beliefSection.lines.map((belief, idx) => (
                          <div
                            key={belief}
                            className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 px-5 py-4 shadow-soft backdrop-blur-sm"
                          >
                            <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/18">
                              {idx + 1}
                            </div>
                            <div className="text-sm leading-relaxed text-foreground md:text-base">
                              {belief}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={150}>
                <section
                  id="process-section"
                  className="scroll-mt-28 pt-2"
                  onMouseEnter={() => setActiveOrbitBySection("process-section")}
                >
                  <div className="grid items-start gap-8 lg:grid-cols-[0.96fr_1.04fr]">
                    <img
                      src={studentsStudyMaterials}
                      alt={content.processSection.imageAlt}
                      className="h-auto min-h-[380px] w-full rounded-[2rem] border border-border object-cover object-center shadow-soft"
                      loading="lazy"
                    />

                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15 md:text-sm">
                        <ClipboardList className="h-4 w-4" />
                        {content.processSection.badge}
                      </div>

                      <h2 className="mt-4 text-3xl font-black text-foreground sm:text-4xl md:text-5xl">
                        {content.processSection.title}
                      </h2>

                      <div className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
                        {content.processSection.description}
                      </div>

                      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {content.processSection.items.map((item) => {
                          const Icon =
                            ICONS[item.iconKey as keyof typeof ICONS] ??
                            ClipboardList;

                          return (
                            <div
                              key={item.key}
                              className="rounded-[1.5rem] border border-border bg-card p-5 shadow-soft md:p-6"
                            >
                              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                                <Icon className="h-6 w-6 text-primary" />
                              </span>

                              <div className="mt-4 text-lg font-black text-foreground md:text-xl">
                                {item.title}
                              </div>
                              <div className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                                {item.text}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={170}>
                <section
                  id="system-section"
                  className="scroll-mt-28 pt-2"
                  onMouseEnter={() => setActiveOrbitBySection("system-section")}
                >
                  <div className="grid items-start gap-8 lg:grid-cols-[1.04fr_0.96fr]">
                    <div className="space-y-4">
                      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15 md:text-sm">
                        <Smartphone className="h-4 w-4" />
                        {content.systemSection.badge}
                      </div>

                      <h2 className="text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
                        {content.systemSection.titleLines[0]}
                        <span className="mt-2 block">
                          {content.systemSection.titleLines[1]}
                        </span>
                      </h2>

                      <div className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
                        {content.systemSection.description}
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {content.systemSection.features.map((item) => {
                          const Icon =
                            ICONS[item.iconKey as keyof typeof ICONS] ??
                            Sparkles;

                          return (
                            <div
                              key={item.key}
                              className="flex items-start gap-4 rounded-2xl border border-border bg-card px-4 py-4 shadow-soft"
                            >
                              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                                <Icon className="h-5 w-5 text-primary" />
                              </span>

                              <span className="min-w-0">
                                <span className="block text-sm font-black text-foreground md:text-base">
                                  {item.title}
                                </span>
                                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground md:text-base">
                                  {item.text}
                                </span>
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div>
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-12 rounded-2xl px-6 text-sm font-semibold md:text-base"
                          onClick={() => setOpenSmartSystem(true)}
                        >
                          {content.systemSection.modalButtonLabel}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <img
                        src={studentsDemoSystemPreview}
                        alt={content.systemSection.demoImageAlt}
                        className="h-auto min-h-[420px] w-full rounded-[2rem] border border-border object-cover object-center shadow-soft"
                        loading="lazy"
                      />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Button
                          asChild
                          size="lg"
                          className="h-14 rounded-[1.3rem] text-base font-black"
                        >
                          <a href={STUDENTS_DEMO_HREF}>
                            {content.systemSection.demoButtonLabel}
                          </a>
                        </Button>

                        <Button
                          asChild
                          variant="secondary"
                          size="lg"
                          className="h-14 rounded-[1.3rem] text-base font-black"
                        >
                          <a
                            href={STUDENTS_APP_HREF}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {content.systemSection.loginButtonLabel}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={190}>
                <section>
                  <div className="rounded-[2rem] border border-border bg-card px-5 py-5 shadow-soft md:px-7 md:py-6">
                    <div className="grid grid-cols-2 gap-5 text-center md:grid-cols-3 xl:grid-cols-6">
                      {content.numbers.map((item) => (
                        <div key={item.label}>
                          <div className="text-2xl font-black text-primary md:text-4xl">
                            {item.value}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground md:text-sm">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </AppearOnScroll>

              <AppearOnScroll delay={220}>
                <section className="flex justify-center">
                  <div className="w-full max-w-4xl rounded-[2rem] border border-border bg-card px-6 py-8 shadow-soft md:px-10 md:py-10">
                    <div className="text-center">
                      <div className="text-2xl font-black leading-tight text-foreground md:text-4xl">
                        {content.bottomCta.title}
                      </div>

                      <div className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-lg">
                        {content.bottomCta.description}
                      </div>

                      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                        <Button
                          asChild
                          size="lg"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                        >
                          <a href={CONTACT_STUDENTS_HREF}>
                            {content.bottomCta.contactButtonLabel}
                          </a>
                        </Button>

                        <Button
                          asChild
                          variant="secondary"
                          size="lg"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                        >
                          <a href={STUDENTS_DEMO_HREF}>
                            {content.bottomCta.demoButtonLabel}
                          </a>
                        </Button>

                        <Button
                          asChild
                          variant="secondary"
                          size="lg"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                        >
                          <a href={STUDENTS_APP_HREF} target="_blank" rel="noreferrer">
                            {content.bottomCta.loginButtonLabel}
                          </a>
                        </Button>

                        <Button
                          asChild
                          variant="secondary"
                          size="lg"
                          className="h-12 rounded-2xl px-7 text-sm font-semibold md:text-base"
                        >
                          <a href={ABOUT_TEACHING_HREF}>
                            {content.bottomCta.aboutButtonLabel}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              </AppearOnScroll>
            </div>
          </div>
        </OrbitPageShell>

        <Dialog open={openSmartSystem} onOpenChange={setOpenSmartSystem}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{content.systemSection.modalTitle}</DialogTitle>
              <DialogDescription>
                {content.systemSection.modalDescription}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 pt-2">
              {content.systemSection.features.map((item) => {
                const Icon =
                  ICONS[item.iconKey as keyof typeof ICONS] ?? Sparkles;

                return (
                  <div
                    key={item.key}
                    className="flex items-start gap-4 rounded-2xl border border-border bg-card/60 px-4 py-4"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                      <Icon className="h-5 w-5 text-primary" />
                    </span>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground md:text-base">
                        {item.title}
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                        {item.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button asChild className="rounded-2xl">
                <a href={STUDENTS_APP_HREF} target="_blank" rel="noreferrer">
                  {content.systemSection.modalPrimaryButtonLabel}
                </a>
              </Button>

              <Button asChild variant="secondary" className="rounded-2xl">
                <a href={STUDENTS_DEMO_HREF}>
                  {content.systemSection.modalSecondaryButtonLabel}
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </InnerPageLayout>
  );
}
