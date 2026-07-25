"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import MaskedLines from "@/components/motion/MaskedLines";
import HeroCards from "@/components/archive/HeroCards";
import Magnetic from "@/components/motion/Magnetic";
import TextRoll from "@/components/motion/TextRoll";
import { EASE } from "@/lib/motion";
import type { Theme } from "@/lib/types";

/* 01 — ARCHIVE INTRO
   A centred editorial opening: small metadata → two-tier headline (a lighter
   lead line over the bold statement) → supporting line → CTA, and then the
   work itself — a full-width circular fan of real theme covers curving in
   beneath the type. The entrance still resolves in ~1.2s so browsing is never
   delayed. */

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

  return (
    <header className="pt-24 sm:pt-28">
      <div className="ed-px mx-auto flex w-full max-w-275 flex-col items-center text-center">
        {/* metadata */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="ed-label text-(--ed-ink-2)"
        >
          Theme Archive — <span className="tabular-nums">{count}</span> Themes
        </motion.p>

        {/* two-tier headline: lighter lead line, then the bold statement */}
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
          className="ed-display text-[clamp(2.6rem,6.4vw,6.25rem)] leading-[0.95]"
        />

        {/* supporting line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="mt-7 max-w-md text-[15px] leading-relaxed text-(--ed-ink-2)"
        >
          Thoughtfully crafted themes for brands that care about every digital
          detail — search, filter and preview the whole collection.
        </motion.p>

        {/* CTA — scrolls down into the collection */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="mt-9"
        >
          <Magnetic className="inline-block">
            <button
              type="button"
              onClick={onExplore}
              className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-(--ed-ink) px-7 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-bg) transition-colors duration-300 hover:bg-black dark:hover:bg-white"
            >
              <TextRoll>Explore the collection</TextRoll>
              <ArrowDown className="size-4 transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
            </button>
          </Magnetic>
        </motion.div>
      </div>

      {/* the floating theme-cover fan */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: EASE }}
        className="mt-14 pb-16 sm:mt-16 sm:pb-20"
      >
        <HeroCards themes={themes} />
      </motion.div>
    </header>
  );
}
