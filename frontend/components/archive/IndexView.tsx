"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import ResultsBar from "@/components/archive/ResultsBar";
import { isFree } from "@/components/archive/ArchiveExperience";
import { EASE } from "@/lib/motion";
import type { ArchiveFilters } from "@/components/archive/ArchiveExperience";
import type { Theme } from "@/lib/types";

/* 37+38 — INDEX VIEW
   The archive as a professional list: number / name / industry / platform /
   price. Its own hover language: the row expands open (grid-rows 0fr→1fr) to
   reveal the theme's banner as a full-width strip — no floating card, no
   cursor tracking, and the banner is generous enough never to look clipped.
   The banner lives inside the row's link, so gliding onto it keeps the row
   open. Touch devices keep the static title + inline thumbnail. */

export default function IndexView({
  themes,
  filters,
  setFilters,
  clearAll,
  view,
  setView,
}: {
  themes: Theme[];
  filters: ArchiveFilters;
  setFilters: (patch: Partial<ArchiveFilters>) => void;
  clearAll: () => void;
  view: "grid" | "index";
  setView: (v: "grid" | "index") => void;
}) {
  return (
    <section
      aria-label="Theme index"
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
        <p className="py-20 text-[15px] text-(--ed-ink-2)">
          Nothing matches this combination — try clearing a filter.
        </p>
      ) : (
        <ul className="relative">
          {themes.map((theme, i) => (
            <motion.li
              key={theme._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.4), ease: EASE }}
              className="border-b border-(--ed-line) first:border-t"
            >
              <Link href={`/themes/${theme.slug}`} className="group block">
                {/* the list row */}
                <span className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 py-5 sm:grid-cols-[3.5rem_1fr_8rem_8rem_5rem_2rem] sm:gap-x-6 sm:py-6">
                  <span className="ed-label tabular-nums text-(--ed-ink-2) transition-colors duration-300 group-hover:text-(--ed-ink)">
                    {String(i + 1).padStart(3, "0")}
                  </span>
                  <span className="flex min-w-0 items-center gap-4">
                    {/* inline thumb for touch — desktop reveals the banner instead */}
                    {theme.image && (
                      <span className="relative block h-10 w-14 shrink-0 overflow-hidden rounded-md lg:hidden">
                        <Image
                          src={theme.image}
                          alt=""
                          aria-hidden
                          fill
                          sizes="56px"
                          className="object-cover object-top"
                        />
                      </span>
                    )}
                    <span className="truncate text-[clamp(1.1rem,2.2vw,1.6rem)] font-semibold uppercase tracking-[0.03em] text-(--ed-ink) transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                      {theme.title}
                    </span>
                  </span>
                  <span className="hidden truncate text-[12px] uppercase tracking-[0.16em] text-(--ed-ink-2) sm:block">
                    {theme.category}
                  </span>
                  <span className="hidden truncate text-[12px] uppercase tracking-[0.16em] text-(--ed-ink-2) sm:block">
                    {theme.framework}
                  </span>
                  <span className="text-right text-[14px] tabular-nums text-(--ed-ink)">
                    {isFree(theme) ? "Free" : `$${theme.price}`}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="hidden size-4 justify-self-end text-(--ed-ink-2) transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--ed-ink) sm:block"
                  />
                </span>

                {/* banner strip — expands open on hover (desktop pointer) */}
                {theme.image && (
                  <span
                    aria-hidden
                    className="hidden grid-rows-[0fr] transition-[grid-template-rows] duration-600 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:grid-rows-[1fr] lg:grid"
                  >
                    <span className="min-h-0 overflow-hidden">
                      <span className="relative block aspect-16/5 w-full overflow-hidden rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <Image
                          src={theme.image}
                          alt={theme.title}
                          fill
                          sizes="1760px"
                          className="object-cover object-top"
                        />
                      </span>
                      {/* breathing room below the banner while open */}
                      <span className="block h-6" />
                    </span>
                  </span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
