"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE, DUR } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Masked line-by-line reveal for major headings (shared motion language:
 * MASKED REVEAL). Each line sits in an overflow-hidden wrapper and slides up
 * from translateY(110%) — never an opacity-only fade.
 *
 * Visibility is observed on the CONTAINER, not the lines: a fully-masked
 * line is clipped to zero visible area, and IntersectionObserver clips
 * against ancestor overflow — so observing the line itself would never fire.
 *
 * `mode="mount"` plays on first render (hero); `mode="inview"` plays when
 * scrolled into view. Falls back to a plain fade under reduced motion.
 */
export default function MaskedLines({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.11,
  mode = "inview",
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  mode?: "mount" | "inview";
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const visible = mode === "mount" || inView;

  const from = reduced ? { y: 0, opacity: 0 } : { y: "110%", opacity: 1 };
  const to = { y: "0%", opacity: 1 };

  return (
    // @ts-expect-error — ref type narrows per tag, always an HTMLElement here
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] mb-[-0.08em]">
          <motion.span
            initial={from}
            animate={visible ? to : from}
            transition={{
              duration: reduced ? 0.4 : DUR.reveal,
              delay: delay + i * stagger,
              ease: EASE,
            }}
            className={cn("block will-change-transform", lineClassName)}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
