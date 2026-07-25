"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { SectionLabel, CircleButton } from "@/components/home/editorial";

/* 08 — SOCIAL PROOF
   One testimonial at a time, typographic and large — never a 3-column card
   grid. Old copy exits upward, new copy enters from below.

   NOTE FOR CONTENT: these quotes are clearly-labelled SAMPLES (see the
   section label). Replace with real client quotes + names as soon as they
   exist — never ship fabricated attributions as if they were real. */

const QUOTES = [
  {
    quote:
      "The theme didn't just change our website. It changed how our brand felt online.",
    author: "Client name",
    role: "Founder — fashion brand",
  },
  {
    quote:
      "It looked custom-built from day one. Nobody believes it started as a theme.",
    author: "Client name",
    role: "Marketing lead — travel company",
  },
  {
    quote:
      "Fast, considered, and easy to make ours. The details were already right.",
    author: "Client name",
    role: "Owner — education platform",
  },
];

export default function Testimonial() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + QUOTES.length) % QUOTES.length);
  };

  const q = QUOTES[index];

  return (
    <section
      aria-label="Client stories"
      className="overflow-hidden bg-(--ed-surface) py-28 sm:py-36"
    >
      <div className="ed-px mx-auto max-w-[1760px]">
        {/* honest label — swap once real client stories are collected */}
        <SectionLabel>08 / Client Stories — Sample Copy</SectionLabel>

        <div className="relative mt-16 min-h-[46vh] lg:min-h-[40vh]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={index}
              custom={dir}
              initial={{ opacity: 0, y: 56 * dir }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -56 * dir }}
              transition={{ duration: 0.6, ease: EASE }}
              className="max-w-5xl"
            >
              <blockquote className="ed-display text-[clamp(1.7rem,3.8vw,3.6rem)]">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-10">
                <p className="text-sm font-medium">{q.author}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-(--ed-ink-2)">
                  {q.role}
                </p>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-(--ed-line) pt-8">
          <p className="text-sm tabular-nums text-(--ed-ink-2)">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(QUOTES.length).padStart(2, "0")}
          </p>
          <div className="flex gap-3">
            <CircleButton onClick={() => go(-1)} label="Previous story" flip />
            <CircleButton onClick={() => go(1)} label="Next story" />
          </div>
        </div>
      </div>
    </section>
  );
}
