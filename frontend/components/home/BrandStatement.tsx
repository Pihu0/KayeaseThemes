"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { EASE, DUR } from "@/lib/motion";
import { SectionLabel } from "@/components/home/editorial";

/* 03 — OUR APPROACH
   The quiet-then-bold beat: after the image-heavy showcase, a dark chapter
   carried entirely by typography. Each line mask-reveals in sequence; the
   closing line gains letter-spacing as you scroll — a first impression,
   literally opening up. */

const LINES = [
  "We don't just",
  "design themes.",
  "We design",
  "first impressions.",
];

export default function BrandStatement() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  // observe the (unclipped) block — masked lines report zero visible area
  const linesRef = useRef<HTMLDivElement>(null);
  const inView = useInView(linesRef, { once: true, margin: "-18% 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });
  // FIRST IMPRESSIONS: -0.04em → 0.01em, extremely gradual
  const ls = useTransform(scrollYProgress, [0.25, 0.9], [-0.04, 0.01]);
  const letterSpacing = useMotionTemplate`${ls}em`;

  return (
    <section
      ref={ref}
      aria-label="Our approach"
      className="relative bg-(--ed-dark) py-[22vh] text-(--ed-ink-on-dark)"
    >
      <div className="ed-px mx-auto max-w-[1760px]">
        <SectionLabel onDark>03 / Our Approach</SectionLabel>

        <div ref={linesRef} className="mt-14">
          {LINES.map((line, i) => {
            const isLast = i === LINES.length - 1;
            const from = reduced ? { opacity: 0 } : { y: "112%" };
            const to = reduced ? { opacity: 1 } : { y: "0%" };
            return (
              <span
                key={line}
                // editorial asymmetry — alternating indents, nothing centred
                className={
                  "block overflow-hidden pb-[0.06em] " +
                  (i === 1 ? "pl-[8vw]" : i === 3 ? "pl-[16vw]" : "")
                }
              >
                <motion.span
                  initial={from}
                  animate={inView ? to : from}
                  transition={{ duration: DUR.reveal, delay: i * 0.08, ease: EASE }}
                  style={isLast && !reduced ? { letterSpacing } : undefined}
                  className="ed-display block text-[clamp(3rem,8.5vw,9.5rem)] will-change-transform"
                >
                  {line}
                </motion.span>
              </span>
            );
          })}
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
