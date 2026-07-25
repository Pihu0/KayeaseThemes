"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { useFocusTrap, useScrollLock } from "@/components/archive/hooks";
import { isFree } from "@/components/archive/ArchiveExperience";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/types";

/* 31 — QUICK VIEW
   Preview a theme without leaving the archive: a large immersive overlay
   with the real screenshots, price and the two ways forward (details page /
   live demo). Focus is trapped, ESC closes, scroll is locked.

   Device-width tabs were considered and skipped deliberately: our previews
   are static screenshots, so resizing the frame would fake a responsive
   preview we don't actually have. The live demo link gives the real thing. */

export default function QuickView({
  theme,
  onClose,
}: {
  theme: Theme | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = theme !== null;
  useScrollLock(open);
  useFocusTrap(panelRef, open, onClose);

  // all real, distinct shots: cover first, then extra screenshots
  const shots = theme
    ? [theme.image, ...(theme.screenshots ?? [])].filter(
        (s, i, arr) => Boolean(s) && arr.indexOf(s) === i
      )
    : [];
  const [shot, setShot] = useState(0);
  useEffect(() => setShot(0), [theme?._id]);

  return (
    <AnimatePresence>
      {theme && (
        <div className="fixed inset-0 z-90 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${theme.title} — quick view`}
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-(--ed-line-soft) bg-(--ed-surface) text-(--ed-ink)"
          >
            {/* header */}
            <div className="flex items-center justify-between gap-4 border-b border-(--ed-line-soft) px-6 py-4 sm:px-8">
              <div className="flex min-w-0 items-baseline gap-4">
                <h2 className="truncate text-[17px] font-semibold uppercase tracking-[0.04em]">
                  {theme.title}
                </h2>
                <p className="ed-label hidden text-(--ed-ink-2) sm:block">
                  {theme.category}
                  {theme.framework ? ` / ${theme.framework}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-autofocus
                aria-label="Close quick view"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-(--ed-line) transition-colors hover:bg-(--ed-ink) hover:text-(--ed-bg)"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* large preview — screenshots swap with a vertical clip wipe */}
            <div className="relative min-h-0 flex-1 bg-(--ed-bg-soft)">
              <div className="relative aspect-16/10 max-h-[62svh] w-full">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={shots[shot] ?? "empty"}
                    initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute inset-0"
                  >
                    {shots[shot] ? (
                      <Image
                        src={shots[shot]}
                        alt={`${theme.title} screenshot ${shot + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 1024px"
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-(--ed-ink-2)">
                        No preview available
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* screenshot dots — only when there is really more than one */}
              {shots.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/70 px-3 py-2 backdrop-blur-md">
                  {shots.map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShot(i)}
                      aria-label={`Screenshot ${i + 1}`}
                      aria-current={shot === i}
                      className={cn(
                        "size-2 rounded-full transition-all duration-300",
                        shot === i ? "scale-125 bg-[#111]" : "bg-[#111]/30 hover:bg-[#111]/60"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* footer */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-(--ed-line-soft) px-6 py-5 sm:px-8">
              <p className="text-[19px] font-semibold tabular-nums">
                {isFree(theme) ? "Free" : `$${theme.price}`}
                {theme.originalPrice > theme.price && theme.price > 0 && (
                  <span className="ml-2 text-[13px] font-normal text-(--ed-ink-2) line-through">
                    ${theme.originalPrice}
                  </span>
                )}
              </p>
              <div className="ml-auto flex flex-wrap items-center gap-x-7 gap-y-3">
                {theme.demoUrl && (
                  <a
                    href={theme.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ed-underline inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-ink)"
                  >
                    Live preview
                    <ArrowUpRight aria-hidden className="size-3.5" />
                  </a>
                )}
                <Link
                  href={`/themes/${theme.slug}`}
                  className="group inline-flex h-11 items-center gap-2.5 bg-(--ed-ink) px-6 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-bg) transition-colors duration-300 hover:bg-black dark:hover:bg-white"
                >
                  View details
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
