"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import MaskedLines from "@/components/motion/MaskedLines";
import { EdButton } from "@/components/home/editorial";
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
  showStripHero = false,
}: {
  total: number;
  themes: Theme[];
  onExplore?: () => void;
  showStripHero?: boolean;
}) {
  const count = String(total).padStart(2, "0");
  const desktop = useIsDesktop();

  return (
    <header className={cn("relative", desktop && "min-h-screen")}>
      <div className="ed-px mx-auto flex w-full max-w-275 flex-col items-center pt-28 text-center sm:pt-36">
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
          data-hero-anchor
          className="mt-8"
        >
          <EdButton onClick={onExplore} icon={<ArrowDown className="size-4" />}>
            Explore the collection
          </EdButton>
        </motion.div>
      </div>

      {/* mobile / reduced-motion or index view: a plain strip */}
      {showStripHero && (
        <div className="mt-14 pb-16 sm:mt-16 sm:pb-20">
          <StripHero themes={themes} />
        </div>
      )}
    </header>
  );
}
