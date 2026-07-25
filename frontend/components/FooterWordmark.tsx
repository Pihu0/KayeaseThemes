"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";

/* Enormous KAYEASE wordmark — letters reveal from below with a subtle
   stagger when the footer enters the viewport. Decorative (the accessible
   brand name lives in the footer heading), hence aria-hidden.
   Visibility is observed on the unclipped row — the masked letters
   themselves never intersect while hidden. */

const LETTERS = "KAYEASE".split("");

export default function FooterWordmark() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  const from = reduced ? { opacity: 0 } : { y: "108%" };
  const to = reduced ? { opacity: 1 } : { y: "0%" };

  return (
    <div
      ref={ref}
      aria-hidden
      className="flex select-none justify-between overflow-hidden leading-none"
    >
      {LETTERS.map((letter, i) => (
        <motion.span
          key={i}
          initial={from}
          animate={inView ? to : from}
          transition={{ duration: 1, delay: 0.05 + i * 0.055, ease: EASE }}
          className="ed-display block text-[clamp(3rem,12.5vw,13.5rem)] text-[#f4f4f0]/90 will-change-transform"
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}
