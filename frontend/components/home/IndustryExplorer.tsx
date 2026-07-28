"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { EASE, useIsDesktop } from "@/lib/motion";
import type { Category, Theme } from "@/lib/types";

/* 05 — INDUSTRY EXPLORER
   Centred editorial index of industries (styled after Shopify's Impression
   "best-sellers" list). Hovering a row on desktop fades the others down,
   draws a hairline above/below the active row, and reveals its strongest
   themes as framed thumbnails on the LEFT with a "View products" cue on the
   RIGHT — the title itself stays centred. Touch devices get the static list. */

export type IndustryEntry = {
  category: Category;
  count: number;
  preview: Theme | null;
  previews: Theme[];
};

export default function IndustryExplorer({ entries }: { entries: IndustryEntry[] }) {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const interactive = desktop && !reduced;

  const [activeId, setActiveId] = useState<string | null>(null);

  if (entries.length === 0) return null;

  return (
    <section
      aria-label="Browse by industry"
      className="bg-(--ed-bg) py-28 sm:py-36"
    >
      <div className="ed-px mx-auto max-w-[1760px]">
        <ul
          onMouseLeave={() => setActiveId(null)}
          className=""
        >
          {entries.map((entry, i) => {
            const isActive = activeId === entry.category._id;
            const dimmed = interactive && activeId !== null && !isActive;
            const thumbs = entry.previews.filter((t) => t.image).slice(0, 3);

            return (
              <motion.li
                key={entry.category._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
              >
                <Link
                  href={`/themes?category=${encodeURIComponent(entry.category.name)}`}
                  onMouseEnter={() => interactive && setActiveId(entry.category._id)}
                  className="group relative flex items-center justify-center py-6 sm:py-8"
                >
                  {/* ---- hairlines: scale out from centre on activate ---- */}
                  {interactive && (
                    <>
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute inset-x-0 top-0 h-px origin-center bg-(--ed-line) transition-transform duration-700 ease-[cubic-bezier(0.25,0.75,0.5,1)] ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px origin-center bg-(--ed-line) transition-transform duration-700 ease-[cubic-bezier(0.25,0.75,0.5,1)] ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </>
                  )}

                  {/* ---- left: framed thumbnails (desktop, active only) ---- */}
                  {interactive && thumbs.length > 0 && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 items-center gap-3 lg:flex"
                    >
                      {thumbs.map((t, ti) => (
                        <span
                          key={t._id}
                          style={{ transitionDelay: isActive ? `${ti * 0.07}s` : "0s" }}
                          className={`relative block h-16 w-16 shrink-0 overflow-hidden rounded-sm shadow-[0_10px_30px_-14px_rgba(0,0,0,0.5)] ring-1 ring-(--ed-line) transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.25,0.75,0.5,1)] xl:h-18 xl:w-18 ${
                            isActive ? "scale-100 opacity-100" : "scale-90 opacity-0"
                          }`}
                        >
                          <Image
                            src={t.image}
                            alt=""
                            fill
                            sizes="72px"
                            className="object-cover object-top"
                          />
                        </span>
                      ))}
                    </span>
                  )}

                  {/* ---- centre: title + superscript count ---- */}
                  <span
                    className={`ed-display flex items-start text-center text-[clamp(1.9rem,5.5vw,4.75rem)] transition-[color,opacity] duration-500 ${
                      dimmed ? "text-(--ed-ink-2) opacity-60" : "text-(--ed-ink)"
                    }`}
                  >
                    {entry.category.name}
                    <sup className="ml-1 mt-[0.15em] text-[0.26em] font-normal tabular-nums tracking-normal text-(--ed-ink-2)">
                      {String(entry.count).padStart(2, "0")}
                    </sup>
                  </span>

                  {/* ---- right: view-products cue (desktop, active only) ---- */}
                  {interactive && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 items-center lg:flex"
                    >
                      <span
                        className={`flex items-center gap-1.5 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.25,0.75,0.5,1)] ${
                          isActive ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                        }`}
                      >
                        <span className="ed-label border-b border-(--ed-ink) pb-0.5 text-(--ed-ink)">
                          View products
                        </span>
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 8 8"
                          fill="none"
                          className="text-(--ed-ink)"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.5 1.11L6.5 4 1.5 6.89V1.11Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    </span>
                  )}

                  {/* ---- mobile: inline thumbnail beside the title ---- */}
                  {!interactive && entry.preview?.image && (
                    <span className="relative ml-4 block h-10 w-14 shrink-0 overflow-hidden rounded-sm lg:hidden">
                      <Image
                        src={entry.preview.image}
                        alt=""
                        aria-hidden
                        fill
                        sizes="56px"
                        className="object-cover object-top"
                      />
                    </span>
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
