"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { EASE } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel, EdButton } from "@/components/home/editorial";
import { useProjectCursor } from "@/components/home/cursor";
import type { Theme } from "@/lib/types";

/* 06 — FEATURED / NEW RELEASE
   Back to cinematic imagery after the informational chapters: the newest
   theme, full viewport. Image settles from scale(1.12) → 1 and drifts
   slightly slower than the page (SLOW PARALLAX); the name is huge, the
   words are few. */

export default function FeaturedRelease({ theme }: { theme: Theme | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const cursor = useProjectCursor("Explore");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // settle-in + slow drift, both restrained
  const scale = useTransform(scrollYProgress, [0, 0.45], [1.12, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  if (!theme) return null;

  return (
    <section
      ref={ref}
      aria-label="New release"
      className="relative flex min-h-svh items-end overflow-hidden bg-(--ed-dark)"
    >
      {theme.image && (
        <motion.div
          style={reduced ? undefined : { scale, y }}
          className="absolute inset-[-8%] will-change-transform"
          {...cursor}
        >
          <Image
            src={theme.image}
            alt={`${theme.title} theme preview`}
            fill
            sizes="100vw"
            className="object-cover object-top"
          />
        </motion.div>
      )}
      {/* readability overlay — subtle, never a heavy tint */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10" />

      <div className="ed-px relative z-10 mx-auto w-full max-w-[1760px] pb-[12vh] pt-[30vh] text-white">
        <SectionLabel className="text-white/60">06 / New Release</SectionLabel>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="mt-10 text-xs font-medium uppercase tracking-[0.3em] text-white/80"
        >
          Introducing
        </motion.p>
        <MaskedLines
          as="h2"
          lines={[theme.title]}
          delay={0.25}
          className="ed-display mt-3 text-[clamp(3.25rem,11vw,10rem)]"
        />
        <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            className="max-w-md text-[15px] leading-relaxed text-white/75"
          >
            {theme.shortDescription ||
              "Designed for brands that believe less can say more."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          >
            <EdButton href={`/themes/${theme.slug}`} invert>
              Explore Theme
            </EdButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
