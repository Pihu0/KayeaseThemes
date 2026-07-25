"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EASE, useIsDesktop } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import TextRoll from "@/components/motion/TextRoll";
import { SectionLabel, EdLink } from "@/components/home/editorial";
import { useProjectCursor } from "@/components/home/cursor";
import type { Theme } from "@/lib/types";

/* 02 — SELECTED THEMES
   Visual storytelling, not catalog browsing: only the strongest 3–4 themes,
   each staged with its own composition. On desktop, vertical scroll drives a
   pinned horizontal sequence; on mobile the same slides stack vertically. */

export default function SelectedThemes({ themes }: { themes: Theme[] }) {
  const slides = themes.slice(0, 4);
  const n = slides.length;

  const pinRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const pinned = useIsDesktop() && !reduced && n > 1;

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });
  const trackX = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(n - 1) * 100}vw`]);

  // “01 — 04” progress readout
  const [current, setCurrent] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setCurrent(Math.min(n, 1 + Math.round(p * (n - 1))))
  );

  if (n === 0) return null;

  const layoutFor = (i: number) =>
    i === 1 ? SlideSplit : i === 2 ? SlideOverlap : SlideFullBleed;

  return (
    <div id="selected">
      {/* ---- chapter intro ---- */}
      <div className="ed-px mx-auto max-w-[1760px] pb-16 pt-28 sm:pt-36">
        <SectionLabel>02 / Selected Themes</SectionLabel>
        <div className="mt-8 flex items-start gap-6">
          <MaskedLines
            as="h2"
            lines={["Crafted for brands", "with something", "worth showing."]}
            className="ed-display text-[clamp(2.4rem,5.5vw,6.25rem)]"
          />
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mt-2 text-sm tabular-nums text-(--ed-ink-2)"
          >
            ({String(n).padStart(2, "0")})
          </motion.span>
        </div>
      </div>

      {/* ---- the showcase ---- */}
      {pinned ? (
        <section
          ref={pinRef}
          aria-label="Selected themes showcase"
          style={{ height: `${n * 100}vh` }}
          className="relative"
        >
          <div className="sticky top-0 h-screen overflow-clip">
            <motion.div style={{ x: trackX }} className="flex h-full will-change-transform">
              {slides.map((t, i) => {
                const Slide = layoutFor(i);
                return (
                  <div key={t._id} className="relative h-full w-screen shrink-0">
                    <Slide
                      theme={t}
                      index={i}
                      n={n}
                      progress={scrollYProgress}
                      pinned
                      minimal={i === n - 1 && i > 0}
                    />
                  </div>
                );
              })}
            </motion.div>

            {/* minimal progress readout */}
            <div className="ed-label pointer-events-none absolute bottom-8 right-[clamp(1.5rem,4vw,4.5rem)] text-white mix-blend-difference">
              {String(current).padStart(2, "0")} — {String(n).padStart(2, "0")}
            </div>
          </div>
        </section>
      ) : (
        /* pinRef must be attached here too — useScroll targets it and throws
           if the ref never hydrates (mobile/reduced-motion path) */
        <section ref={pinRef} aria-label="Selected themes showcase">
          {slides.map((t, i) => {
            const Slide = layoutFor(i);
            return (
              <div key={t._id} className="relative">
                <Slide theme={t} index={i} n={n} minimal={i === n - 1 && i > 0} />
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

/* ---------- slide layouts ---------- */

type SlideProps = {
  theme: Theme;
  index: number;
  n: number;
  progress?: MotionValue<number>;
  pinned?: boolean;
  /** last slide gets the ultra-minimal treatment */
  minimal?: boolean;
};

const fmt = (i: number) => String(i + 1).padStart(2, "0");

/** Slow internal drift so full-bleed imagery feels cinematic (IMAGE PARALLAX). */
function useSlideParallax(progress: MotionValue<number> | undefined, index: number, n: number) {
  const fallback = useTransform(() => 0);
  const source = progress ?? fallback;
  // local position of this slide relative to the viewport: -1 … 0 … 1
  return useTransform(source, (p) => {
    if (!progress || n < 2) return "0%";
    const local = p * (n - 1) - index;
    return `${Math.max(-1, Math.min(1, local)) * 6}%`;
  });
}

/** 01 + 04 — the image dominates; metadata stays small. */
function SlideFullBleed({ theme, index, n, progress, minimal }: SlideProps) {
  const cursor = useProjectCursor("View Theme");
  const imgX = useSlideParallax(progress, index, n);

  return (
    <Link
      href={`/themes/${theme.slug}`}
      {...cursor}
      className="group relative block h-full min-h-[72svh] w-full cursor-none overflow-hidden"
    >
      {theme.image && (
        <motion.div style={{ x: imgX }} className="absolute inset-[-6%] will-change-transform">
          <Image
            src={theme.image}
            alt={`${theme.title} theme`}
            fill
            sizes="100vw"
            priority={index === 0}
            className="object-cover object-top"
          />
        </motion.div>
      )}
      {/* readability scrim — subtle, bottom-weighted */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

      <div
        className={
          "absolute inset-x-0 bottom-0 p-[clamp(1.5rem,4vw,4.5rem)] text-white " +
          (minimal ? "flex flex-col items-center text-center" : "")
        }
      >
        <p className="ed-label opacity-80">
          {fmt(index)} / {String(n).padStart(2, "0")}
        </p>
        <h3 className="ed-display mt-3 text-[clamp(2.2rem,5vw,4.5rem)]">{theme.title}</h3>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] opacity-80">
          {theme.category}
          {theme.framework ? ` / ${theme.framework}` : ""}
        </p>
        {/* not an <a> — the whole slide already is one (no nested anchors) */}
        <span className="ed-underline mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.14em]">
          <TextRoll>{minimal ? "View" : "View Theme"}</TextRoll>
          <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/** 02 — split composition: editorial text column + large preview panel. */
function SlideSplit({ theme, index, n, progress }: SlideProps) {
  const cursor = useProjectCursor("View Theme");
  const imgX = useSlideParallax(progress, index, n);
  const tags = [theme.category, theme.framework, theme.pricingType === "free" ? "Free" : "Commerce"]
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="ed-px flex h-full min-h-[80svh] w-full flex-col justify-center gap-10 bg-(--ed-bg) py-20 lg:flex-row lg:items-center lg:gap-16">
      <div className="flex max-w-xl flex-col justify-center lg:w-2/5">
        <p className="ed-label text-(--ed-ink-2)">
          {fmt(index)} / {String(n).padStart(2, "0")}
        </p>
        <MaskedLines
          as="h3"
          lines={[theme.title]}
          className="ed-display mt-4 text-[clamp(2.6rem,5vw,5.5rem)]"
        />
        <ul className="mt-6 space-y-1 text-xs uppercase tracking-[0.18em] text-(--ed-ink-2)">
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-(--ed-ink-2)">
          {theme.shortDescription}
        </p>
        <span className="mt-8">
          <EdLink href={`/themes/${theme.slug}`}>View Theme</EdLink>
        </span>
      </div>

      <Link
        href={`/themes/${theme.slug}`}
        {...cursor}
        className="relative block cursor-none overflow-hidden lg:w-3/5"
      >
        {/* CLIP REVEAL on entry, slight parallax while in view */}
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative aspect-4/3 w-full"
        >
          {theme.image && (
            <motion.div style={{ x: imgX }} className="absolute inset-[-6%]">
              <Image
                src={theme.image}
                alt={`${theme.title} theme`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-top"
              />
            </motion.div>
          )}
        </motion.div>
      </Link>
    </div>
  );
}

/** 03 — editorial overlap: the preview sits on top of a giant word. */
function SlideOverlap({ theme, index, n }: SlideProps) {
  const cursor = useProjectCursor("View Theme");

  return (
    <div className="ed-px relative flex h-full min-h-[80svh] w-full items-center justify-center overflow-hidden bg-(--ed-surface) py-24">
      {/* the word — edges stay readable, the middle hides behind the preview */}
      <h3
        aria-hidden
        className="ed-display pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap text-center text-[clamp(4rem,17vw,19rem)] text-(--ed-ink)"
      >
        {theme.title}
      </h3>

      <Link
        href={`/themes/${theme.slug}`}
        {...cursor}
        className="relative z-10 block w-[min(74vw,300px)] cursor-none lg:w-[min(30vw,440px)]"
      >
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative aspect-3/4 overflow-hidden"
        >
          {theme.image && (
            <Image
              src={theme.image}
              alt={`${theme.title} theme`}
              fill
              sizes="(max-width: 1024px) 74vw, 30vw"
              className="object-cover object-top"
            />
          )}
        </motion.div>
      </Link>

      {/* accessible title + metadata */}
      <div className="absolute bottom-[clamp(1.5rem,4vw,4.5rem)] left-[clamp(1.5rem,4vw,4.5rem)] z-10">
        <p className="ed-label text-(--ed-ink-2)">
          {fmt(index)} / {String(n).padStart(2, "0")} — {theme.title}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-(--ed-ink-2)">
          {theme.category}
        </p>
      </div>
      <div className="absolute bottom-[clamp(1.5rem,4vw,4.5rem)] right-[clamp(1.5rem,4vw,4.5rem)] z-10">
        <EdLink href={`/themes/${theme.slug}`}>View Theme</EdLink>
      </div>
    </div>
  );
}
