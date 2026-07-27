"use client";

import { useRef } from "react";
import type { MotionValue } from "motion/react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { EASE } from "@/lib/motion";

/* 03 — OUR APPROACH
   The quiet-then-bold beat: after the image-heavy showcase, a dark chapter
   carried entirely by typography. Each line mask-reveals as you scroll —
   line by line, driven by scroll position, not a one-shot trigger — and the
   closing line gains letter-spacing as you scroll on: a first impression,
   literally opening up. */

/* The closing phrase is split into its own two lines ("first" / "impressions.")
   rather than left to wrap. The last line's letter-spacing is scroll-animated,
   and a wrapping multi-word line sits right on its wrap boundary at common
   desktop widths — so the extra width would flip "impressions." between rows
   as you scroll (a visible flicker). One word per line makes the layout
   deterministic: the spacing animates without ever changing the row count. */
const LINES = [
  "We don't just",
  "design themes.",
  "We design",
  "first",
  "impressions.",
];

/* One typographic line whose mask-reveal is driven directly by scroll.
   Each line owns a staggered slice of the section's scroll progress, so it
   climbs out from behind the mask exactly as that slice passes through. */
function Line({
  line,
  index,
  isClosing,
  progress,
  reduced,
  letterSpacing,
}: {
  line: string;
  index: number;
  isClosing: boolean;
  progress: MotionValue<number>;
  reduced: boolean;
  letterSpacing: MotionValue<string>;
}) {
  // staggered scroll windows: each line reveals ~0.12 progress after the last
  const start = 0.04 + index * 0.12;
  const end = start + 0.22;
  
  // Left-to-right clip-path fill
  const clipPercent = useTransform(progress, [start, end], [100, 0]);
  const clipPath = useMotionTemplate`inset(0 ${clipPercent}% 0 0)`;

  // Fallback simple opacity reveal for reduced-motion
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  const fontStyle =
    "ed-display text-[clamp(3rem,8.5vw,9.5rem)] block will-change-transform " +
    // closing lines never wrap, so the animated letter-spacing can't reflow them
    (isClosing ? "whitespace-nowrap" : "");

  return (
    <span
      // editorial asymmetry — alternating indents, nothing centred
      className={
        "block overflow-hidden pb-[0.06em] " +
        (index === 1 ? "pl-[8vw]" : index >= 3 ? "pl-[16vw]" : "")
      }
    >
      <span className="relative inline-block">
        {/* Base translucent text */}
        <motion.span
          style={
            reduced
              ? { opacity }
              : isClosing
              ? { letterSpacing }
              : {}
          }
          className={`${fontStyle} text-(--ed-ink) opacity-20 dark:text-(--ed-ink-on-dark)`}
        >
          {line}
        </motion.span>

        {/* Scroll color fill overlay */}
        {!reduced && (
          <motion.span
            style={
              isClosing
                ? { clipPath, letterSpacing }
                : { clipPath }
            }
            className={`${fontStyle} absolute inset-0 text-(--primary) select-none pointer-events-none`}
            aria-hidden="true"
          >
            {line}
          </motion.span>
        )}
      </span>
    </span>
  );
}

export default function BrandStatement() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end start"],
  });
  // FIRST IMPRESSIONS: -0.04em → 0.01em, extremely gradual
  const ls = useTransform(scrollYProgress, [0.4, 0.95], [-0.04, 0.01]);
  const letterSpacing = useMotionTemplate`${ls}em`;

  return (
    <section
      ref={ref}
      aria-label="Our approach"
      className="relative bg-(--ed-bg) py-[22vh] text-(--ed-ink) transition-colors duration-300 dark:bg-(--ed-dark) dark:text-(--ed-ink-on-dark)"
    >
      {/* Animated Creative Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes floatGrad1 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            33% { transform: translate3d(80px, -60px, 0) scale(1.2); }
            66% { transform: translate3d(-40px, 50px, 0) scale(0.9); }
          }
          @keyframes floatGrad2 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1.1); }
            33% { transform: translate3d(-90px, 80px, 0) scale(0.9); }
            66% { transform: translate3d(60px, -40px, 0) scale(1.3); }
          }
          @keyframes floatGrad3 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(0.9); }
            33% { transform: translate3d(40px, 70px, 0) scale(1.15); }
            66% { transform: translate3d(-50px, -60px, 0) scale(0.85); }
          }
          .animate-float-grad-1 {
            animation: floatGrad1 25s infinite ease-in-out;
            will-change: transform;
          }
          .animate-float-grad-2 {
            animation: floatGrad2 30s infinite ease-in-out;
            will-change: transform;
          }
          .animate-float-grad-3 {
            animation: floatGrad3 22s infinite ease-in-out;
            will-change: transform;
          }
        `}} />
        {/* Soft base wash blending with the primary site background */}
        <div className="absolute inset-0 bg-gradient-to-b from-(--ed-bg) via-white/10 to-(--ed-bg) dark:from-(--ed-bg) dark:via-black/20 dark:to-(--ed-bg) opacity-90" />
        
        {/* Floating blurred organic gradient shapes */}
        <div className="absolute inset-0 filter blur-[120px] saturate-[1.4] opacity-50 dark:opacity-20">
          <div className="absolute top-[10%] left-[20%] size-[40vw] rounded-full bg-(--primary) animate-float-grad-1" />
          <div className="absolute bottom-[20%] right-[25%] size-[45vw] rounded-full bg-(--secondary) animate-float-grad-2" />
          <div className="absolute top-[35%] left-[45%] size-[35vw] rounded-full bg-[#6366f1]/40 dark:bg-[#6366f1]/30 animate-float-grad-3" />
        </div>

        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(var(--ed-ink) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="ed-px mx-auto max-w-[1760px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-(--ed-line) bg-white/40 dark:bg-white/[0.02] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-(--ed-ink) dark:text-(--ed-ink-on-dark) backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-(--primary) animate-pulse" />
            Our Approach
          </span>
        </motion.div>

        <div className="mt-14">
          {LINES.map((line, i) => (
            <Line
              key={line}
              line={line}
              index={i}
              // the closing phrase is the last two lines ("first" / "impressions.")
              isClosing={i >= LINES.length - 2}
              progress={scrollYProgress}
              reduced={reduced}
              letterSpacing={letterSpacing}
            />
          ))}
        </div>

        {/* small supporting copy, pushed to the lower right */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="ml-auto mt-20 max-w-sm text-[15px] leading-relaxed text-(--ed-ink-2) lg:mr-[6vw] dark:text-(--ed-ink-2-on-dark)"
        >
          Thoughtful layouts, purposeful interactions and performance-first
          foundations — crafted to give every brand its own digital character.
        </motion.p>
      </div>
    </section>
  );
}
