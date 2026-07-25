"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import ResultsBar from "@/components/archive/ResultsBar";
import { isFree } from "@/components/archive/ArchiveExperience";
import { EASE, useIsDesktop } from "@/lib/motion";
import type { ArchiveFilters } from "@/components/archive/ArchiveExperience";
import type { Theme } from "@/lib/types";

/* 37+38 — INDEX VIEW
   The archive as a professional list: number / name / industry / platform /
   price. On desktop, hovering a row summons a floating screenshot that
   trails the cursor; switching rows clips the old shot up and the new one in
   from below — the same interaction language as the homepage's industry
   explorer, so the two pages feel like one system. */

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
  const listRef = useRef<HTMLUListElement>(null);
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const showPreview = desktop && !reduced;

  const [active, setActive] = useState<Theme | null>(null);
  const [anchorY, setAnchorY] = useState(0);

  const mx = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 160, damping: 24 });

  const clampX = (clientX: number) => {
    const list = listRef.current?.getBoundingClientRect();
    if (!list) return 0;
    const half = 170; // preview half-width
    return Math.max(half, Math.min(list.width - half, clientX - list.left));
  };

  const onRowEnter = (theme: Theme, e: React.MouseEvent) => {
    if (!showPreview) return;
    const row = e.currentTarget.getBoundingClientRect();
    const list = listRef.current?.getBoundingClientRect();
    setAnchorY(row.top - (list?.top ?? 0) + row.height / 2);
    // when the preview is freshly summoned, jump (not spring) to the cursor
    // so it never glides in from the list's left edge
    if (!active) {
      mx.jump(clampX(e.clientX));
      x.jump(clampX(e.clientX));
    }
    setActive(theme);
  };
  const onMove = (e: React.MouseEvent) => {
    if (!showPreview) return;
    mx.set(clampX(e.clientX));
  };

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
        <ul
          ref={listRef}
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
          className="relative"
        >
          {themes.map((theme, i) => (
            <motion.li
              key={theme._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.4), ease: EASE }}
              className="border-b border-(--ed-line) first:border-t"
            >
              <Link
                href={`/themes/${theme.slug}`}
                onMouseEnter={(e) => onRowEnter(theme, e)}
                className="group grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 py-5 sm:grid-cols-[3.5rem_1fr_8rem_8rem_5rem_2rem] sm:gap-x-6 sm:py-6"
              >
                <span className="ed-label tabular-nums text-(--ed-ink-2)">
                  {String(i + 1).padStart(3, "0")}
                </span>
                <span className="flex min-w-0 items-center gap-4">
                  {/* inline thumb for touch — the floating preview is desktop-only */}
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
              </Link>
            </motion.li>
          ))}

          {/* floating screenshot that trails the cursor */}
          {showPreview && (
            <AnimatePresence>
              {active?.image && (
                <motion.div
                  key="index-preview"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1, top: anchorY }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: EASE, top: { duration: 0.45, ease: EASE } }}
                  style={{ x, left: 0 }}
                  className="pointer-events-none absolute z-20 -ml-42.5 -mt-26 w-85"
                >
                  <div className="relative aspect-4/3 overflow-hidden rounded-lg shadow-[0_24px_70px_-30px_rgba(0,0,0,0.45)]">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={active._id}
                        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                        exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={active.image}
                          alt=""
                          aria-hidden
                          fill
                          sizes="340px"
                          className="object-cover object-top"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </ul>
      )}
    </section>
  );
}
