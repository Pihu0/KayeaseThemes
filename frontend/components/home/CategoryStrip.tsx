"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EASE } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel } from "@/components/home/editorial";
import type { Category } from "@/lib/types";

/* BROWSE BY CATEGORY
   A clean editorial grid of category cards in the homepage flow.
   Each card links to /themes?category=… and shows the category name
   with a subtle hover lift and arrow. Styled using the editorial
   design tokens (--ed-*) to match the rest of the homepage. */

export default function CategoryStrip({
  categories,
}: {
  categories: Category[];
}) {
  const reduced = useReducedMotion();

  if (categories.length === 0) return null;

  return (
    <section
      aria-label="Browse by category"
      className="bg-(--ed-bg) py-24 sm:py-32"
    >
      <div className="ed-px mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel>Categories</SectionLabel>
            <MaskedLines
              as="h2"
              mode="inview"
              delay={0.1}
              lines={["Browse by category"]}
              className="ed-display mt-5 text-[clamp(2rem,4vw,3.25rem)]"
            />
            <motion.p
              initial={reduced ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="mt-4 max-w-lg text-[15px] leading-relaxed text-(--ed-ink-2)"
            >
              Find the right starting point for your next project.
            </motion.p>
          </div>

          <motion.div
            initial={reduced ? {} : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
          >
            <Link
              href="/themes"
              className="group inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.12em] text-(--ed-ink-2) transition-colors hover:text-(--ed-ink)"
            >
              All themes
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.slice(0, 8).map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
            >
              <Link
                href={`/themes?category=${encodeURIComponent(cat.name)}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-(--ed-line) bg-(--ed-card) p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-(--ed-ink)/20 hover:shadow-lg hover:shadow-black/[0.04]"
              >
                <div className="min-w-0">
                  <h3 className="truncate text-[15px] font-semibold tracking-tight text-(--ed-ink) transition-colors group-hover:text-(--ed-ink)">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-1 truncate text-[13px] text-(--ed-ink-2)">
                      {cat.description}
                    </p>
                  )}
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-(--ed-ink-2) transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--ed-ink)" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
