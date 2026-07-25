"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import MaskedLines from "@/components/motion/MaskedLines";
import { EASE } from "@/lib/motion";
import type { Theme } from "@/lib/types";

/* 01 — ARCHIVE INTRO
   Asymmetric editorial opening — metadata row → masked headline → offset
   copy — but the old version left the right/lower half as bare background.
   Since this IS the theme archive, we now fill that space with the work
   itself: a seamless, gently drifting marquee of real theme covers that
   bridges the headline into the gallery below. Reduced motion gets a static
   scrollable strip; the whole entrance still resolves in ~1.2s. */

export default function ArchiveHeader({
  total,
  themes,
}: {
  total: number;
  themes: Theme[];
}) {
  const reduced = useReducedMotion();
  const count = String(total).padStart(2, "0");

  // Featured first, then the rest — strongest covers lead the marquee.
  const covers = useMemo(() => {
    const withImg = themes.filter((t) => t.image);
    return [
      ...withImg.filter((t) => t.featured),
      ...withImg.filter((t) => !t.featured),
    ].slice(0, 12);
  }, [themes]);

  return (
    <header className="pt-16 sm:pt-24">
      <div className="ed-px mx-auto w-full max-w-[1760px]">
        {/* metadata row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="ed-label flex items-baseline justify-between text-(--ed-ink-2)"
        >
          <span>Theme Archive</span>
          <span className="tabular-nums">{count} / Themes</span>
        </motion.div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          {/* the headline owns the left two-thirds */}
          <h1 className="sr-only">Browse all Kayease themes</h1>
          <MaskedLines
            as="div"
            mode="mount"
            delay={0.15}
            lines={["Find the one", "that feels like you."]}
            className="ed-display text-[clamp(2.6rem,7vw,7.25rem)] lg:col-span-8"
          />

          {/* supporting copy sits low-right, deliberately off-axis */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="lg:col-span-4 lg:justify-self-end"
          >
            <p className="max-w-xs text-[15px] leading-relaxed text-(--ed-ink-2)">
              Thoughtfully crafted themes for brands that care about every
              digital detail — search, filter and preview the whole collection.
            </p>
            <p className="ed-label mt-8 flex items-center gap-2 text-(--ed-ink)">
              <ArrowDown className="size-3.5" aria-hidden />
              Explore
            </p>
          </motion.div>
        </div>
      </div>

      {/* full-bleed marquee of real theme covers */}
      {covers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: EASE }}
          className="relative mt-14 overflow-hidden pb-14 sm:mt-20 sm:pb-16"
        >
          {/* edge fades into the page background */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[10vw] bg-gradient-to-r from-(--ed-bg) to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[10vw] bg-gradient-to-l from-(--ed-bg) to-transparent" />

          {reduced ? (
            <div className="flex overflow-x-auto px-[clamp(1.5rem,4vw,4.5rem)]">
              {covers.map((t) => (
                <Cover key={t._id} theme={t} />
              ))}
            </div>
          ) : (
            // duplicated track; -50% lands copy #2 exactly on copy #1 → seamless
            <motion.div
              className="flex w-max"
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{ duration: 55, ease: "linear", repeat: Infinity }}
            >
              {[...covers, ...covers].map((t, i) => (
                <Cover key={i} theme={t} />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </header>
  );
}

/* One marquee tile. Spacing lives in the wrapper's right padding (not a flex
   gap) so each tile occupies an identical box — the -50% loop stays seamless.
   Links straight to the theme; hovering lifts the cover and warms it up. */
function Cover({ theme }: { theme: Theme }) {
  const free = theme.pricingType === "free" || theme.price === 0;
  return (
    <Link
      href={`/themes/${theme.slug}`}
      className="group block w-[clamp(210px,22vw,290px)] shrink-0 pr-4"
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-(--ed-line) bg-(--ed-surface)">
        <Image
          src={theme.image}
          alt={theme.title}
          fill
          sizes="290px"
          className="object-cover object-top opacity-90 grayscale transition-[transform,filter,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="truncate text-[13px] font-medium text-(--ed-ink)">
          {theme.title}
        </span>
        <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-(--ed-ink-2)">
          {free ? "Free" : theme.framework || theme.category}
        </span>
      </div>
    </Link>
  );
}
