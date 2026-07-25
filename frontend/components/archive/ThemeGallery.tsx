"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import ResultsBar from "@/components/archive/ResultsBar";
import ArchiveCard from "@/components/archive/ArchiveCard";
import MaskedLines from "@/components/motion/MaskedLines";
import { EASE_SOFT } from "@/lib/motion";
import { isFree } from "@/components/archive/ArchiveExperience";
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
const BREAK_AFTER = 9; // editorial break slots in after this many cards

export default function ThemeGallery({
  themes,
  allThemes,
  filters,
  setFilters,
  clearAll,
  view,
  setView,
  onQuickView,
}: {
  themes: Theme[];
  allThemes: Theme[];
  filters: ArchiveFilters;
  setFilters: (patch: Partial<ArchiveFilters>) => void;
  clearAll: () => void;
  view: "grid" | "index";
  setView: (v: "grid" | "index") => void;
  onQuickView: (t: Theme) => void;
}) {
  /* reset progressive loading whenever the result set changes */
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  useEffect(() => setVisible(INITIAL_VISIBLE), [filterKey]);

  const shown = themes.slice(0, visible);
  const hasBreak = shown.length > BREAK_AFTER;

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
          <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.flatMap((theme, i) => {
                const card = (
                  <motion.li
                    key={theme._id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.45,
                        ease: EASE_SOFT,
                        delay: Math.min((i % LOAD_STEP) * 0.04, 0.3),
                      },
                    }}
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
                // full-width editorial break inside the flow of the archive
                if (hasBreak && i === BREAK_AFTER - 1) {
                  return [card, <DiscoveryBreak key="discovery-break" />];
                }
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
              <button
                type="button"
                onClick={() => setVisible((v) => v + LOAD_STEP)}
                className="group mt-1 inline-flex h-12 items-center gap-2.5 border border-(--ed-line) px-7 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-ink) transition-colors duration-300 hover:bg-(--ed-ink) hover:text-(--ed-bg)"
              >
                Load more themes
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

/* Full-width typographic pause inside the gallery — not an advertisement,
   just an editorial pointer to the Theme Finder further down. */
function DiscoveryBreak() {
  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ layout: { duration: 0.5, ease: EASE_SOFT } }}
      className="col-span-full border-y border-(--ed-line) py-16 sm:py-20"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <MaskedLines
          as="p"
          lines={["Can't find", "the right fit?"]}
          className="ed-display text-[clamp(1.9rem,4vw,3.75rem)] lg:col-span-8"
        />
        <div className="lg:col-span-4 lg:justify-self-end">
          <p className="max-w-xs text-[15px] leading-relaxed text-(--ed-ink-2)">
            Tell us what you&rsquo;re building and we&rsquo;ll help you find a
            starting point.
          </p>
          <a
            href="#theme-finder"
            className="ed-underline mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-ink)"
          >
            Find my theme
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        </div>
      </div>
    </motion.li>
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
