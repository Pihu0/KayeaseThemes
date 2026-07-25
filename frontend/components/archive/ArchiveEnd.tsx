"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel, EdButton } from "@/components/home/editorial";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { FacetEntry } from "@/components/archive/ArchiveExperience";
import type { Theme } from "@/lib/types";

/* 08+10 — THEME FINDER + FINAL CTA
   The finder is a two-question visual quiz (industry → platform) that just
   drives the real filters — no fake logic. The final CTA is the dark chapter
   that closes the archive, mirroring the homepage's ending. */

export default function ArchiveEnd({
  categories,
  frameworks,
  themes,
  onFind,
}: {
  categories: FacetEntry[];
  frameworks: FacetEntry[];
  themes: Theme[];
  onFind: (category: string, framework: string) => void;
}) {
  return (
    <>
      <ThemeFinder categories={categories} frameworks={frameworks} themes={themes} onFind={onFind} />
      <FinalCTA />
    </>
  );
}

function ThemeFinder({
  categories,
  frameworks,
  themes,
  onFind,
}: {
  categories: FacetEntry[];
  frameworks: FacetEntry[];
  themes: Theme[];
  onFind: (category: string, framework: string) => void;
}) {
  const [step, setStep] = useState<0 | 1>(0);
  const [category, setCategory] = useState("");

  if (categories.length === 0) return null;

  // platforms that actually exist within the chosen industry
  const platformOptions = [
    { name: "", count: 0 }, // "any platform"
    ...frameworks.filter(
      (f) =>
        !category ||
        themes.some((t) => t.category === category && t.framework === f.name)
    ),
  ];

  const pick = (framework: string) => {
    onFind(category, framework);
    setStep(0);
    setCategory("");
  };

  return (
    <section
      id="theme-finder"
      aria-label="Theme finder"
      className="scroll-mt-24 bg-(--ed-bg-soft) py-24 sm:py-32"
    >
      <div className="ed-px mx-auto w-full max-w-[1760px]">
        <SectionLabel>Need a little direction?</SectionLabel>
        <MaskedLines
          as="h2"
          lines={["Let's find your", "perfect starting point."]}
          className="ed-display mt-8 text-[clamp(2.2rem,5vw,5.5rem)]"
        />
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-(--ed-ink-2)">
          Two quick questions and we&rsquo;ll narrow the collection down for
          you — using the same filters you see above.
        </p>

        <div className="mt-14 min-h-44">
          <AnimatePresence mode="wait" initial={false}>
            {step === 0 ? (
              <motion.div
                key="q1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="ed-label text-(--ed-ink-2)">
                  Question 01 / 02 — What are you building?
                </p>
                <div className="mt-6 flex flex-wrap gap-x-10 gap-y-5">
                  {categories.slice(0, 8).map((c) => (
                    <FinderOption
                      key={c.name}
                      label={c.name}
                      onClick={() => {
                        setCategory(c.name);
                        setStep(1);
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="q2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="ed-label text-(--ed-ink-2)">
                  Question 02 / 02 — {category}: on which platform?
                </p>
                <div className="mt-6 flex flex-wrap gap-x-10 gap-y-5">
                  {platformOptions.map((f) => (
                    <FinderOption
                      key={f.name || "any"}
                      label={f.name || "Show me everything"}
                      onClick={() => pick(f.name)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="ed-underline mt-10 text-[11px] font-medium uppercase tracking-[0.16em] text-(--ed-ink-2) hover:text-(--ed-ink)"
                >
                  ← Start over
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FinderOption({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "ed-display group relative pb-1 text-[clamp(1.4rem,3vw,2.6rem)] text-(--ed-ink-2) transition-colors duration-300 hover:text-(--ed-ink)",
        "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-(--ed-ink) after:transition-transform after:duration-450 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100"
      )}
    >
      {label}
    </button>
  );
}

function FinalCTA() {
  return (
    <section aria-label="Closing call to action" className="bg-(--ed-dark) py-28 sm:py-36">
      <div className="ed-px mx-auto w-full max-w-[1760px]">
        <SectionLabel onDark>The whole collection, above</SectionLabel>
        <MaskedLines
          as="h2"
          lines={["Found something", "you like?"]}
          className="ed-display mt-8 text-[clamp(2.4rem,6vw,6.5rem)] text-(--ed-ink-on-dark)"
        />
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
          <p className="max-w-sm text-[15px] leading-relaxed text-(--ed-ink-2-on-dark)">
            Explore the details, preview it live, and make it yours — or tell
            us what you need and we&rsquo;ll build something custom.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:ml-auto">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="ed-underline inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-ink-on-dark)"
            >
              Back to the archive
              <ArrowUp aria-hidden className="size-3.5" />
            </button>
            <EdButton href="/contact" invert>
              Talk to Kayease
            </EdButton>
          </div>
        </div>
      </div>
    </section>
  );
}
