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
import { EASE, useIsDesktop } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Category, Theme } from "@/lib/types";

/* CATEGORY DIRECTORY — the heart of /categories.
   Not a card grid: one large editorial index where the category NAME is the
   interface. Desktop pointers get the signature interaction — a floating
   theme preview that trails the cursor on springs (weighted, never 1:1),
   flips sides near the right edge, and swaps images with an upward
   clip-path reveal when the active category changes. Keyboard focus gets
   the same row emphasis; touch gets a compact directory with descriptions
   inline. One preview element, one mouse handler — no per-row loops. */

export type DirectoryEntry = {
  category: Category;
  count: number;
  preview: Theme | null;
};

const PREVIEW_W = 360; // px — 4:3 image + metadata line below
const PREVIEW_H = 310;
const CURSOR_GAP = 25; // preview sits beside the pointer, never under it

export default function CategoryDirectory({
  entries,
}: {
  entries: DirectoryEntry[];
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const showPreview = desktop && !reduced;

  const [active, setActive] = useState<DirectoryEntry | null>(null);
  // preview only follows a real pointer — keyboard focus highlights the row
  const [viaPointer, setViaPointer] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // spring ≈ the classic `current += (target - current) * 0.12` weight
  const x = useSpring(mx, { stiffness: 170, damping: 26 });
  const y = useSpring(my, { stiffness: 170, damping: 26 });

  /** Aim the preview next to the cursor, clamped inside the list. */
  const place = (e: React.MouseEvent, snap = false) => {
    if (!showPreview) return;
    const list = listRef.current?.getBoundingClientRect();
    if (!list) return;
    const relX = e.clientX - list.left;
    const relY = e.clientY - list.top;
    // right of the pointer by default; flip to the left near the edge
    const rawX =
      relX + CURSOR_GAP + PREVIEW_W > list.width
        ? relX - CURSOR_GAP - PREVIEW_W
        : relX + CURSOR_GAP;
    const tx = Math.max(0, Math.min(list.width - PREVIEW_W, rawX));
    const ty = Math.max(
      0,
      Math.min(list.height - PREVIEW_H, relY - PREVIEW_H / 2)
    );
    if (snap) {
      // entering the directory: appear at the cursor, don't glide across
      x.jump(tx);
      y.jump(ty);
    }
    mx.set(tx);
    my.set(ty);
  };

  const clear = () => {
    setActive(null);
    setViaPointer(false);
  };

  if (entries.length === 0) return null;

  return (
    <ul
      ref={listRef}
      onMouseEnter={(e) => place(e, true)}
      onMouseMove={(e) => place(e)}
      onMouseLeave={clear}
      className="relative"
    >
      {entries.map((entry, i) => {
        const isActive = active?.category._id === entry.category._id;
        const isDimmed = active !== null && !isActive;
        return (
          <motion.li
            key={entry.category._id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.04, ease: EASE }}
            className={cn(
              "border-b transition-colors duration-300 first:border-t",
              isActive ? "border-(--ed-ink)/30" : "border-(--ed-line)"
            )}
          >
            {/* dim lives on the link, not the li — the entrance animation
                leaves an inline opacity on the li that would win otherwise */}
            <Link
              href={`/themes?category=${encodeURIComponent(entry.category.name)}`}
              onMouseEnter={() => {
                setActive(entry);
                setViaPointer(true);
              }}
              onFocus={() => {
                setActive(entry);
                setViaPointer(false);
              }}
              onBlur={clear}
              className={cn(
                "group grid grid-cols-[2rem_1fr_auto] items-center gap-x-4 py-7 outline-offset-4 transition-opacity duration-300 sm:gap-x-6 sm:py-9 lg:grid-cols-[4.5rem_1fr_auto] lg:gap-x-8 lg:py-10",
                isDimmed && "opacity-35"
              )}
            >
              {/* index */}
              <span
                className={cn(
                  "self-start pt-2 text-[11px] font-medium tabular-nums tracking-[0.14em] transition-colors duration-300 lg:self-center lg:pt-0",
                  isActive ? "text-(--ed-ink)" : "text-(--ed-ink-2)"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* name + description */}
              <span className="min-w-0">
                <span
                  className={cn(
                    "ed-display block text-[clamp(1.85rem,4.6vw,5rem)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isActive && "lg:translate-x-4"
                  )}
                >
                  {entry.category.name}
                </span>

                {entry.category.description && (
                  <>
                    {/* touch/small screens: description always inline */}
                    <span className="mt-1.5 block text-[13px] leading-snug text-(--ed-ink-2) lg:hidden">
                      {entry.category.description}
                    </span>
                    {/* desktop: revealed only while the row is active */}
                    <span
                      className={cn(
                        "hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:grid",
                        isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <span className="block overflow-hidden">
                        <span
                          className={cn(
                            "block pt-2.5 text-sm text-(--ed-ink-2) transition-[opacity,transform] duration-500",
                            isActive
                              ? "translate-x-4 opacity-100"
                              : "translate-y-2 opacity-0"
                          )}
                        >
                          {entry.category.description}
                        </span>
                      </span>
                    </span>
                  </>
                )}
              </span>

              {/* count + arrow */}
              <span className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-6 lg:gap-10">
                <span
                  className={cn(
                    "text-[11px] font-medium uppercase tabular-nums tracking-widest transition-colors duration-300",
                    isActive ? "text-(--ed-ink)" : "text-(--ed-ink-2)"
                  )}
                >
                  {String(entry.count).padStart(2, "0")}{" "}
                  {entry.count === 1 ? "Theme" : "Themes"}
                </span>
                <ArrowUpRight
                  className={cn(
                    "size-4 transition-[opacity,transform] duration-300 lg:size-6",
                    isActive
                      ? "-translate-y-0.75 translate-x-0.75 opacity-100"
                      : "opacity-45"
                  )}
                />
              </span>
            </Link>
          </motion.li>
        );
      })}

      {/* ---- the one floating preview (desktop pointer only) ---- */}
      {showPreview && (
        <AnimatePresence>
          {viaPointer && active?.preview?.image && (
            <motion.div
              key="preview"
              aria-hidden
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ x, y, width: PREVIEW_W }}
              className="pointer-events-none absolute left-0 top-0 z-20"
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-(--ed-line) bg-(--ed-surface) shadow-[0_24px_70px_-40px_rgba(0,0,0,0.5)]">
                {/* category switch: old image clips out upward, new reveals from below */}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active.category._id}
                    initial={{ clipPath: "inset(100% 0% 0% 0%)", y: "8%" }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)", y: "0%" }}
                    exit={{ clipPath: "inset(0% 0% 100% 0%)", y: "-12%" }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={active.preview.image}
                      alt=""
                      fill
                      sizes="360px"
                      className="object-cover object-top"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* tiny metadata — real theme, real category */}
              <div className="mt-2.5 flex items-baseline justify-between gap-4 px-0.5">
                <p className="truncate text-[11px] font-medium uppercase tracking-[0.14em] text-(--ed-ink)">
                  {active.preview.title}
                </p>
                <p className="shrink-0 text-[11px] uppercase tracking-widest text-(--ed-ink-2)">
                  {active.category.name}
                  {active.preview.framework
                    ? ` / ${active.preview.framework}`
                    : ""}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </ul>
  );
}
