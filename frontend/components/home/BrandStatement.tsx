"use client";

import { useRef } from "react";
import type { MotionValue } from "motion/react";
import {
  cubicBezier,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { EASE } from "@/lib/motion";
import { SectionLabel } from "@/components/home/editorial";

/* 03 — OUR APPROACH
   The quiet-then-bold beat: after the image-heavy showcase, a dark chapter
   carried entirely by typography. Each line mask-reveals as you scroll —
   line by line, driven by scroll position, not a one-shot trigger — and the
   closing line gains letter-spacing as you scroll on: a first impression,
   literally opening up. */

const LINES = [
  "We don't just",
  "design themes.",
  "We design",
  "first impressions.",
];

/* One typographic line whose mask-reveal is driven directly by scroll.
   Each line owns a staggered slice of the section's scroll progress, so it
   climbs out from behind the mask exactly as that slice passes through. */
function Line({
  line,
  index,
  isLast,
  progress,
  reduced,
  letterSpacing,
}: {
  line: string;
  index: number;
  isLast: boolean;
  progress: MotionValue<number>;
  reduced: boolean;
  letterSpacing: MotionValue<string>;
}) {
  // staggered scroll windows: each line reveals ~0.12 progress after the last
  const start = 0.04 + index * 0.12;
  const end = start + 0.22;
  const yv = useTransform(progress, [start, end], [112, 0], {
    ease: cubicBezier(...EASE),
  });
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useMotionTemplate`${yv}%`;

  return (
    <span
      // editorial asymmetry — alternating indents, nothing centred
      className={
        "block overflow-hidden pb-[0.06em] " +
        (index === 1 ? "pl-[8vw]" : index === 3 ? "pl-[16vw]" : "")
      }
    >
      <motion.span
        style={
          reduced
            ? { opacity }
            : isLast
            ? { y, letterSpacing }
            : { y }
        }
        className="ed-display block text-[clamp(3rem,8.5vw,9.5rem)] will-change-transform"
      >
        {line}
      </motion.span>
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
      className="relative bg-(--ed-dark) py-[22vh] text-(--ed-ink-on-dark)"
    >
      <div className="ed-px mx-auto max-w-[1760px]">
        <SectionLabel onDark>03 / Our Approach</SectionLabel>

        <div className="mt-14">
          {LINES.map((line, i) => (
            <Line
              key={line}
              line={line}
              index={i}
              isLast={i === LINES.length - 1}
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
          className="ml-auto mt-20 max-w-sm text-[15px] leading-relaxed text-(--ed-ink-2-on-dark) lg:mr-[6vw]"
        >
          Thoughtful layouts, purposeful interactions and performance-first
          foundations — crafted to give every brand its own digital character.
        </motion.p>
      </div>
    </section>
  );
}
