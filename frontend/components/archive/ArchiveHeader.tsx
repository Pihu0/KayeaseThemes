"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import MaskedLines from "@/components/motion/MaskedLines";
import { EASE } from "@/lib/motion";

/* 01 — ARCHIVE INTRO
   Replaces "Browse Themes" with an asymmetric editorial opening:
   metadata row → masked headline → offset supporting copy. The whole
   entrance resolves in ~1.2s so browsing is never delayed. */

export default function ArchiveHeader({ total }: { total: number }) {
  const count = String(total).padStart(2, "0");

  return (
    <header className="ed-px mx-auto w-full max-w-[1760px] pb-14 pt-16 sm:pb-20 sm:pt-24">
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
    </header>
  );
}
