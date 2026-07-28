"use client";

import { useEffect, useMemo } from "react";
import Lenis from "lenis";
import { MotionConfig, useReducedMotion } from "motion/react";
import { CursorProvider } from "@/components/home/cursor";
import HomeHero from "@/components/home/HomeHero";

import BrandStatement from "@/components/home/BrandStatement";
import DetailsShowcase from "@/components/home/DetailsShowcase";
import WhatWeDo from "@/components/home/WhatWeDo";
import IndustryExplorer, { type IndustryEntry } from "@/components/home/IndustryExplorer";
import WhyKayease from "@/components/home/WhyKayease";

import type { Theme, Category } from "@/lib/types";

/* The homepage experience shell: smooth scrolling (Lenis), the film-grain
   overlay, the shared project cursor, and the chapter sequence.

   Chapter rhythm (QUIET → WOW → BOLD → DETAIL → QUIET → WOW → INFO →
   EMOTION → ACTION), with backgrounds flowing:
   hero #F5F4F0 → selected (same) → approach #101010 → details #FAFAF8 →
   industries #F1F0EC → release (image-dark) → why #F5F4F0 →
   stories #FAFAF8 → CTA #101010 → footer (same dark). */

export default function HomeExperience({
  themes,
  categories,
  total,
}: {
  themes: Theme[];
  categories: Category[];
  total: number;
}) {
  const reduced = useReducedMotion();

  /* Lenis smooth scroll — native scrollTop under the hood, so position:
     sticky and motion's useScroll keep working. Disabled for reduced
     motion; touch devices keep native momentum by default. */
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.115 });
    (window as any).lenis = lenis;
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, [reduced]);

  /* ---- derived, real data (no invented content) ---- */
  const derived = useMemo(() => {
    // strongest work first: featured themes, then newest
    const featuredFirst = [
      ...themes.filter((t) => t.featured),
      ...themes.filter((t) => !t.featured),
    ];
    const selected = featuredFirst.slice(0, 4);
    // hero peel-deck: strongest work on top, peeling to reveal the rest
    const heroDeck = featuredFirst.slice(0, 5);

    const entries: IndustryEntry[] = categories
      .map((category) => {
        const inCat = featuredFirst.filter((t) => t.category === category.name);
        return {
          category,
          count: inCat.length,
          preview: inCat[0] ?? null,
          previews: inCat.slice(0, 3),
        };
      })
      .filter((e) => e.count > 0);

    const frameworks = new Set(themes.map((t) => t.framework).filter(Boolean));

    return {
      selected,
      heroDeck,
      entries,
      newest: themes[0] ?? null, // API returns newest-first
      stats: {
        themes: total || themes.length,
        categories: entries.length || categories.length,
        frameworks: frameworks.size,
      },
    };
  }, [themes, categories, total]);

  return (
    <MotionConfig reducedMotion="user">
      <CursorProvider>
        <div className="editorial relative overflow-x-clip">
          {/* paints the strip behind the transparent navbar + under overscroll */}
          <div aria-hidden className="fixed inset-0 -z-10 bg-(--ed-bg)" />

          {/* almost-invisible film grain over every chapter */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-70 opacity-[0.022]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          <HomeHero themes={derived.heroDeck} total={derived.stats.themes} />

          <BrandStatement />
          <DetailsShowcase themes={derived.selected} />
          <WhatWeDo />
          <IndustryExplorer entries={derived.entries} />
          <WhyKayease stats={derived.stats} />

        </div>
      </CursorProvider>
    </MotionConfig>
  );
}
