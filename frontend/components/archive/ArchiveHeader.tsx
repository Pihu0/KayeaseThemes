"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import MaskedLines from "@/components/motion/MaskedLines";
import Magnetic from "@/components/motion/Magnetic";
import TextRoll from "@/components/motion/TextRoll";
import { StripHero } from "@/components/archive/HeroCards";
import { EASE, useIsDesktop } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/types";

/* 01 — ARCHIVE INTRO
   A centred editorial opening. On desktop the covers themselves are drawn by the
   fixed HeroMorph overlay (rendered by ArchiveExperience) so they can fly down
   into the real gallery grid on scroll; here we just reserve the hero space.
   Mobile / reduced motion get a plain scroll strip. */

export default function ArchiveHeader({
  total,
  themes,
  onExplore,
}: {
  total: number;
  themes: Theme[];
  onExplore?: () => void;
}) {
  const count = String(total).padStart(2, "0");
  const desktop = useIsDesktop();

  return (
    <header className={cn("relative", desktop && "min-h-screen")}>
      <div className="ed-px mx-auto flex w-full max-w-275 flex-col items-center pt-16 text-center sm:pt-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="ed-label text-(--ed-ink-2)"
        >
          Theme Archive — <span className="tabular-nums">{count}</span> Themes
        </motion.p>

        <h1 className="sr-only">Browse all Kayease themes</h1>
        <MaskedLines
          as="div"
          mode="mount"
          delay={0.12}
          lines={["Find the one"]}
          className="ed-display mt-6 text-[clamp(1.6rem,3.4vw,3rem)] text-(--ed-ink-2)"
        />
        <MaskedLines
          as="div"
          mode="mount"
          delay={0.22}
          lines={["that feels like you."]}
          className="ed-display text-[clamp(2.4rem,6vw,5.75rem)] leading-[0.95]"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="mt-6 max-w-md text-[15px] leading-relaxed text-(--ed-ink-2)"
        >
          Thoughtfully crafted themes for brands that care about every digital
          detail — search, filter and preview the whole collection.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="mt-8"
        >
          <Magnetic className="inline-block">
            <button
              type="button"
              data-hero-anchor
              onClick={onExplore}
              className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-(--ed-ink) px-7 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-bg) transition-colors duration-300 hover:bg-black dark:hover:bg-white"
            >
              <TextRoll>Explore the collection</TextRoll>
              <ArrowDown className="size-4 transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
            </button>
          </Magnetic>
        </motion.div>
      </div>

      {/* mobile / reduced-motion: a plain strip (desktop covers live in the overlay) */}
      {!desktop && (
        <div className="mt-14 pb-16 sm:mt-16 sm:pb-20">
          <StripHero themes={themes} />
        </div>
      )}
    </header>
  );
}
