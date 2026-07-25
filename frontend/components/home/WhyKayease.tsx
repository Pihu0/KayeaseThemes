"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel } from "@/components/home/editorial";

/* 07 — WHY KAYEASE
   Product substance without the six-icon-card grid: oversized statements,
   short qualitative lists, and counters that only ever show REAL numbers
   from the database (no invented “98/100” metrics). */

export type RealStats = {
  themes: number;
  categories: number;
  frameworks: number;
};

export default function WhyKayease({ stats }: { stats: RealStats }) {
  const blocks: {
    n: string;
    lines: string[];
    items: string[];
    stat?: { value: number; label: string };
  }[] = [
    {
      n: "01",
      lines: ["Built for", "speed."],
      items: ["Performance-first foundations", "Optimised assets", "Fast first paint"],
      stat: { value: stats.themes, label: "Production-ready themes" },
    },
    {
      n: "02",
      lines: ["Made for", "every screen."],
      items: ["Desktop", "Tablet", "Mobile"],
      stat: { value: stats.categories, label: "Industries covered" },
    },
    {
      n: "03",
      lines: ["Built to", "evolve."],
      items: ["Flexible sections", "Flexible layouts", "Flexible branding"],
      stat: { value: stats.frameworks, label: "Frameworks supported" },
    },
  ];

  return (
    <section aria-label="Why Kayease" className="bg-(--ed-bg) py-28 sm:py-36">
      <div className="ed-px mx-auto max-w-[1760px]">
        <SectionLabel>07 / Why Kayease</SectionLabel>

        <div className="mt-14">
          {blocks.map((b, i) => (
            <motion.div
              key={b.n}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.9, delay: 0.05 * i, ease: EASE }}
              className="grid gap-8 border-t border-(--ed-line) py-14 last:border-b lg:grid-cols-12 lg:gap-6"
            >
              <span className="text-[11px] tabular-nums text-(--ed-ink-2) lg:col-span-1">
                {b.n}
              </span>
              <MaskedLines
                as="h3"
                lines={b.lines}
                className="ed-display text-[clamp(2.2rem,4.6vw,4.75rem)] lg:col-span-5"
              />
              <ul className="space-y-1.5 self-end text-xs uppercase tracking-[0.18em] text-(--ed-ink-2) lg:col-span-3">
                {b.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {b.stat && b.stat.value > 0 && (
                <div className="self-end lg:col-span-3 lg:text-right">
                  <Counter value={b.stat.value} />
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-(--ed-ink-2)">
                    {b.stat.label}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Counts up to a real, verified number when it enters the viewport. */
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: EASE,
      // setState from the animation-frame callback — not a sync effect call
      onUpdate: (v) => setAnimated(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  // reduced motion: no count-up, just the real number
  const display = reduced ? value : animated;

  return (
    <p ref={ref} className="ed-display text-[clamp(3rem,6vw,6rem)] tabular-nums">
      {display}
      <span className="text-(--ed-ink-2)">+</span>
    </p>
  );
}
