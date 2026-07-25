"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EASE } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel, EdLink } from "@/components/home/editorial";
import CategoryDirectory, {
  type DirectoryEntry,
} from "@/components/categories/CategoryDirectory";
import type { Theme, Category } from "@/lib/types";

/* THE CATEGORY EXPLORER — /categories
   Homepage is cinematic, the archive is a working tool; this page is a
   visual index of the catalog. No cards anywhere: an asymmetric editorial
   header, then a full-width typographic directory where hovering a
   category summons a floating preview of its strongest real theme.
   Counts, previews and descriptions all derive from live theme data —
   nothing here is hand-written twice. */

export default function CategoriesExperience({
  categories,
  themes,
  total,
}: {
  categories: Category[];
  themes: Theme[];
  total: number;
}) {
  const reduced = useReducedMotion();

  /* Lenis smooth scroll — same setup as the homepage and archive shells,
     so all three pages share one motion feel. */
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.115 });
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);

  /* ---- derived, real data (no invented counts) ---- */
  const entries: DirectoryEntry[] = useMemo(
    () =>
      categories
        .map((category) => {
          // featured work first, so the preview shows the strongest theme
          const inCat = [
            ...themes.filter((t) => t.category === category.name && t.featured),
            ...themes.filter((t) => t.category === category.name && !t.featured),
          ];
          return { category, count: inCat.length, preview: inCat[0] ?? null };
        })
        .filter((e) => e.count > 0),
    [categories, themes]
  );
  const totalThemes = total || themes.length;

  return (
    <MotionConfig reducedMotion="user">
      <div className="editorial relative overflow-x-clip">
        {/* paints behind the transparent navbar + under overscroll */}
        <div aria-hidden className="fixed inset-0 -z-10 bg-(--ed-bg)" />
        {/* the same near-invisible film grain as the rest of the site */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-70 opacity-[0.022]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ---- editorial header: asymmetric, art-directed ---- */}
        <header className="ed-px mx-auto w-full max-w-[1760px] pt-[clamp(8.5rem,14vw,13.5rem)]">
          <div className="flex items-baseline justify-between gap-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="ed-label text-(--ed-ink-2)"
            >
              Explore / By Industry
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="ed-label hidden tabular-nums text-(--ed-ink-2) sm:block"
            >
              {String(entries.length).padStart(2, "0")} Categories
            </motion.p>
          </div>

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end">
            <MaskedLines
              as="h1"
              mode="mount"
              delay={0.12}
              lines={["Find your", "starting point."]}
              className="ed-display text-[clamp(3rem,6vw,7rem)] lg:col-span-8"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
              className="max-w-xs text-[15px] leading-relaxed text-(--ed-ink-2) lg:col-span-4 lg:justify-self-end lg:text-right"
            >
              Explore themes shaped around different industries, ideas and
              digital experiences.
            </motion.p>
          </div>
        </header>

        {/* ---- the directory ---- */}
        <section
          aria-label="Browse themes by category"
          className="ed-px mx-auto w-full max-w-[1760px] mt-[clamp(4.5rem,8vw,8.5rem)]"
        >
          {entries.length === 0 ? (
            <p className="border-t border-(--ed-line) py-32 text-center text-sm text-(--ed-ink-2)">
              No categories yet — the catalog is on its way.
            </p>
          ) : (
            <>
              <CategoryDirectory entries={entries} />

              {/* view all — resets any category filter */}
              <div className="pt-14 sm:pt-20">
                <Link
                  href="/themes"
                  className="ed-underline group inline-flex items-center gap-3 text-(--ed-ink)"
                >
                  <span className="ed-display text-[clamp(1.25rem,2.4vw,2rem)]">
                    Explore all {totalThemes}{" "}
                    {totalThemes === 1 ? "theme" : "themes"}
                  </span>
                  <ArrowUpRight className="size-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 lg:size-6" />
                </Link>
              </div>
            </>
          )}
        </section>

        {/* ---- quiet bridge into the footer ---- */}
        <section className="ed-px mx-auto mt-[clamp(7.5rem,11vw,11.5rem)] w-full max-w-[1760px] pb-[clamp(7.5rem,10vw,11rem)]">
          <div className="border-t border-(--ed-line) pt-14 sm:pt-20">
            <SectionLabel>Nothing quite right?</SectionLabel>
            <MaskedLines
              as="p"
              lines={["Then let's make", "something yours."]}
              className="ed-display mt-7 text-[clamp(2rem,4vw,4rem)]"
            />
            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-sm text-[15px] leading-relaxed text-(--ed-ink-2)">
                Work with Kayease on a digital experience built around your
                brand.
              </p>
              <EdLink href="/contact">Start a project</EdLink>
            </div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
