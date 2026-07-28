"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import ResultsBar from "@/components/archive/ResultsBar";
import ArchiveCard from "@/components/archive/ArchiveCard";
import MaskedLines from "@/components/motion/MaskedLines";
import { EASE_SOFT } from "@/lib/motion";
import { isFree } from "@/components/archive/ArchiveExperience";
import { EdButton } from "@/components/home/editorial";
import type { ArchiveFilters } from "@/components/archive/ArchiveExperience";
import type { Theme } from "@/lib/types";

/* 05+07 — MAIN THEME GALLERY
   A clean, generous editorial grid (1 → 2 → 3 columns; screenshots deserve
   space). Filter/sort/search changes FLIP-animate: surviving cards glide to
   their new slot, removed cards fade/scale out, new ones rise in — the
   signature interaction of this page. Discovery is progressive: LOAD MORE
   with a progress readout instead of numbered pagination. */

const INITIAL_VISIBLE = 12;
const LOAD_STEP = 9;

export default function ThemeGallery({
  themes,
  allThemes,
  filters,
  setFilters,
  clearAll,
  view,
  setView,
  onQuickView,
  gridRef,
  morphCount = 0,
  morphLanded = false,
}: {
  themes: Theme[];
  allThemes: Theme[];
  filters: ArchiveFilters;
  setFilters: (patch: Partial<ArchiveFilters>) => void;
  clearAll: () => void;
  view: "grid" | "index";
  setView: (v: "grid" | "index") => void;
  onQuickView: (t: Theme) => void;
  /** the hero-morph overlay measures these cells to fly its covers into them */
  gridRef?: React.Ref<HTMLUListElement>;
  /** first N cards are marked (always) as morph targets… */
  morphCount?: number;
  /** …and kept invisible (but laid out + measurable) until the morph lands */
  morphLanded?: boolean;
}) {
  /* reset progressive loading whenever the result set changes (derive during
     render — the React-recommended way to reset state on a prop change) */
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const [seenKey, setSeenKey] = useState(filterKey);
  if (filterKey !== seenKey) {
    setSeenKey(filterKey);
    setVisible(INITIAL_VISIBLE);
  }

  const shown = themes.slice(0, visible);

  return (
    <section
      aria-label="Theme gallery"
      className="ed-px mx-auto w-full max-w-[1760px] pb-28 pt-10"
    >
      <ResultsBar
        count={themes.length}
        filters={filters}
        setFilters={setFilters}
        clearAll={clearAll}
        view={view}
        setView={setView}
      />

      {themes.length === 0 ? (
        <EmptyState search={filters.search} clearAll={clearAll} suggestions={allThemes.slice(0, 3)} />
      ) : (
        <>
          <ul
            ref={gridRef}
            className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.flatMap((theme, i) => {
                const isMorphCell = i < morphCount; // always marked, so measurable
                const morphHidden = isMorphCell && !morphLanded; // covered by overlay
                const card = (
                  <motion.li
                    key={theme._id}
                    layout
                    data-morph-cell={isMorphCell ? i : undefined}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={
                      morphHidden
                        ? { opacity: 0, y: 0, scale: 1, transition: { duration: 0 } }
                        : isMorphCell
                          ? // revealed *under* the overlay's crossfade — appear
                            // instantly in final position, no entrance of our own
                            { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } }
                          : {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                duration: 0.45,
                                ease: EASE_SOFT,
                                delay: Math.min((i % LOAD_STEP) * 0.04, 0.3),
                              },
                            }
                    }
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.3 } }}
                    transition={{ layout: { duration: 0.5, ease: EASE_SOFT } }}
                  >
                    <ArchiveCard
                      theme={theme}
                      number={i + 1}
                      priority={i < 3}
                      onQuickView={onQuickView}
                    />
                  </motion.li>
                );
                return [card];
              })}
            </AnimatePresence>
          </ul>

          {/* ---- progressive discovery ---- */}
          {themes.length > shown.length && (
            <div className="mx-auto mt-20 flex max-w-sm flex-col items-center gap-5">
              <p className="ed-label text-(--ed-ink-2)">
                Showing {shown.length} of {themes.length}
              </p>
              <div className="h-px w-full bg-(--ed-line)">
                <div
                  className="h-px bg-(--ed-ink) transition-[width] duration-500 ease-out"
                  style={{ width: `${(shown.length / themes.length) * 100}%` }}
                />
              </div>
              <EdButton
                onClick={() => setVisible((v) => v + LOAD_STEP)}
                className="mt-1"
              >
                Load more themes
              </EdButton>
            </div>
          )}
        </>
      )}
    </section>
  );
}

/* 34 — designed empty state: echo the query, offer a way out, and surface a
   few real themes instead of a dead end. */
function EmptyState({
  search,
  clearAll,
  suggestions,
}: {
  search: string;
  clearAll: () => void;
  suggestions: Theme[];
}) {
  return (
    <div className="py-16 sm:py-24">
      <MaskedLines
        as="p"
        mode="mount"
        lines={["No matches", "found."]}
        className="ed-display text-[clamp(2.2rem,5vw,4.5rem)]"
      />
      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-(--ed-ink-2)">
        {search
          ? `We couldn't find anything for “${search}”. `
          : "Nothing matches this combination of filters. "}
        Try removing a filter or exploring the whole collection.
      </p>
      <button
        type="button"
        onClick={clearAll}
        className="ed-underline mt-7 inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-ink)"
      >
        Clear filters
        <ArrowUpRight aria-hidden className="size-3.5" />
      </button>

      {suggestions.length > 0 && (
        <div className="mt-16 border-t border-(--ed-line) pt-10">
          <p className="ed-label text-(--ed-ink-2)">You might like</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {suggestions.map((t) => (
              <Link key={t._id} href={`/themes/${t.slug}`} className="group">
                <div className="relative aspect-16/10 overflow-hidden rounded-xl border border-(--ed-line-soft) bg-(--ed-bg-soft)">
                  {t.image && (
                    <Image
                      src={t.image}
                      alt={`${t.title} theme preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <p className="truncate text-[14px] font-semibold uppercase tracking-[0.04em] text-(--ed-ink)">
                    {t.title}
                  </p>
                  <p className="shrink-0 text-[13px] tabular-nums text-(--ed-ink-2)">
                    {isFree(t) ? "Free" : `$${t.price}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
