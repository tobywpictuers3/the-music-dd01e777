import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import InnerPageLayout from "@/components/InnerPageLayout";
import OrbitPageShell from "@/orbit-system/OrbitPageShell";
import type { OrbitItemConfig } from "@/orbit-system/orbit.types";
import AppearOnScroll from "@/components/AppearOnScroll";
import {
  ABOUT_TOPICS,
  type AboutTopicItem,
} from "@/content/orbit/aboutOrbit";
import { ABOUT_PAGE_ORBIT_CONTENT } from "@/content/orbit/aboutPageOrbitContent";
import red3 from "@/assets/red3.png";

function SignatureLine({ text }: { text: string }) {
  const key = "אומנות ואמינות";
  const idx = text.indexOf(key);
  const before = idx >= 0 ? text.slice(0, idx) : text;
  const after = idx >= 0 ? text.slice(idx + key.length) : "";

  return (
    <div className="mt-6">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-border/70 bg-card/70 px-5 py-5 backdrop-blur md:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.04] mix-blend-screen dark:opacity-[0.08]"
            style={{ backgroundImage: `url(${red3})` }}
          />
          <div className="absolute right-0 top-[-2.5rem] h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
        </div>

        <div className="relative text-base font-semibold leading-8 text-foreground/95 md:text-lg">
          {idx >= 0 ? (
            <span>
              {before}
              <span className="shimmer-gold">{key}</span>
              {after}
            </span>
          ) : (
            text
          )}
        </div>
      </div>
    </div>
  );
}

function ExpandableStoryCard({
  item,
  isOpen,
  onToggle,
}: {
  item: AboutTopicItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const clampedPreview = isOpen
    ? undefined
    : ({
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      } as CSSProperties);

  return (
    <article
      id={`about-${item.id}`}
      className={`relative overflow-hidden rounded-[2rem] border backdrop-blur transition-all duration-500 ${
        isOpen
          ? "border-primary/30 bg-card/80 shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
          : "border-border/70 bg-card/65"
      }`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute inset-0 bg-cover bg-center mix-blend-screen transition-opacity duration-500 ${
            isOpen
              ? "opacity-[0.06] dark:opacity-[0.11]"
              : "opacity-[0.03] dark:opacity-[0.06]"
          }`}
          style={{ backgroundImage: `url(${red3})` }}
        />
        {isOpen && (
          <div className="absolute right-8 top-[-2rem] h-28 w-28 rounded-full bg-primary/14 blur-3xl" />
        )}
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="relative block w-full px-6 py-6 text-right md:px-8 md:py-7"
      >
        <div className="flex items-start justify-between gap-6">
          <span
            className={`mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-lg font-bold transition-all duration-300 ${
              isOpen
                ? "border-primary/35 bg-primary/14 text-primary"
                : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            }`}
            aria-hidden="true"
          >
            {isOpen ? "−" : "+"}
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="text-3xl font-bold leading-tight text-foreground md:text-[2.2rem]">
              {item.title}
            </h3>

            <div className="relative mt-4">
              <p
                style={clampedPreview}
                className={`text-base leading-8 transition-opacity duration-300 md:text-lg ${
                  isOpen ? "text-foreground/72" : "text-foreground/92"
                }`}
              >
                {item.preview}
              </p>

              {!isOpen && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card via-card/90 to-transparent" />
              )}
            </div>
          </div>
        </div>
      </button>

      <div
        className={`grid transition-all duration-500 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 md:px-8 md:pb-8">
            <div className="space-y-4 text-base leading-8 text-foreground/92 md:text-lg">
              {item.paragraphs.map((paragraph, index) => (
                <p key={`${item.id}-${index}`}>{paragraph}</p>
              ))}
            </div>

            <SignatureLine text={item.signature} />

            {(item.ctaLabel || item.secondaryCtaLabel) && (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {item.ctaLabel && item.ctaTo && (
                  <Link
                    to={item.ctaTo}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    {item.ctaLabel}
                  </Link>
                )}

                {item.secondaryCtaLabel && item.secondaryCtaTo && (
                  <Link
                    to={item.secondaryCtaTo}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    {item.secondaryCtaLabel}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function About() {
  const [openId, setOpenId] = useState<string>(ABOUT_TOPICS[1].id);

  const activeOrbitId =
    ABOUT_PAGE_ORBIT_CONTENT.orbit.items.find(
      (item) => item.targetSectionId === `about-${openId}`
    )?.id ?? null;

  function openCardFromOrbit(item: OrbitItemConfig) {
    const targetSectionId = item.targetSectionId;
    if (!targetSectionId) return;

    const topicId = targetSectionId.replace("about-", "");
    setOpenId(topicId);

    requestAnimationFrame(() => {
      const el = document.getElementById(targetSectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  return (
    <InnerPageLayout
      title="אודות"
      description="המוסיקה ואני — דרך משותפת של למעלה משלושה עשורים."
    >
      <OrbitPageShell
        pageId="about"
        content={ABOUT_PAGE_ORBIT_CONTENT}
        onOrbitItemClick={openCardFromOrbit}
        controlledActiveItemId={activeOrbitId}
      >
        <style>{`
          .shimmer-gold {
            background: linear-gradient(
              90deg,
              rgba(255, 211, 106, 0.84) 0%,
              rgba(255, 241, 191, 1) 18%,
              rgba(255, 214, 120, 0.96) 40%,
              rgba(255, 243, 198, 1) 62%,
              rgba(255, 204, 94, 0.86) 100%
            );
            background-size: 240% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 18px rgba(255, 215, 120, 0.18);
          }
        `}</style>

        <div className="relative pb-28">
          <section className="w-full py-10 md:py-14">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
              <div className="mb-6 text-sm font-medium tracking-[0.30em] text-primary/80">
                להעמקה
              </div>

              <div className="space-y-4">
                {ABOUT_TOPICS.map((item, index) => (
                  <AppearOnScroll key={item.id} delay={index * 70}>
                    <div
                      className="scroll-mt-28"
                      onMouseEnter={() => setOpenId(item.id)}
                    >
                      <ExpandableStoryCard
                        item={item}
                        isOpen={openId === item.id}
                        onToggle={() => {
                          setOpenId((current) =>
                            current === item.id ? "" : item.id
                          );
                        }}
                      />
                    </div>
                  </AppearOnScroll>
                ))}
              </div>
            </div>
          </section>
        </div>
      </OrbitPageShell>
    </InnerPageLayout>
  );
}
