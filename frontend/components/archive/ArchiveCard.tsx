"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Expand } from "lucide-react";
import { useProjectCursor } from "@/components/home/cursor";
import { isFree } from "@/components/archive/ArchiveExperience";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/types";

/* 05 — ARCHIVE CARD
   Not a boxed product card: the screenshot IS the surface, metadata sits
   under it in whitespace with archive numbering. Hover: image eases up a
   notch and — when a real second screenshot exists — cross-reveals it with a
   clip-path wipe. A glass "quick view" control appears over the corner. */

export default function ArchiveCard({
  theme,
  number,
  priority = false,
  onQuickView,
}: {
  theme: Theme;
  number: number;
  priority?: boolean;
  onQuickView: (t: Theme) => void;
}) {
  const cursor = useProjectCursor("View");
  const [loaded, setLoaded] = useState(false);

  const free = isFree(theme);
  const onSale = theme.originalPrice > theme.price && theme.price > 0;
  const discount = onSale
    ? Math.round((1 - theme.price / theme.originalPrice) * 100)
    : 0;
  // one badge maximum — sale beats free beats featured
  const badge = onSale
    ? `${discount}% off`
    : free
      ? "Free"
      : theme.featured
        ? "Featured"
        : null;

  const altShot = theme.screenshots?.find((s) => s && s !== theme.image) ?? null;
  const num = String(number).padStart(3, "0");

  return (
    <article className="group relative">
      {/* stretched link — the whole card is one tab stop */}
      <Link
        href={`/themes/${theme.slug}`}
        {...cursor}
        aria-label={`${theme.title} — view theme`}
        className="absolute inset-0 z-10 rounded-2xl lg:cursor-none"
      />

      {/* ---- preview surface ---- */}
      <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-(--ed-line-soft) bg-(--ed-bg-soft) transition-[border-radius] duration-500 ease-out group-hover:rounded-xl">
        {theme.image ? (
          <>
            {/* blurred fill behind an uncropped banner, so any aspect ratio
                reads full-bleed without bars */}
            <Image
              src={theme.image}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="scale-110 object-cover blur-xl"
            />
            <Image
              src={theme.image}
              alt={`${theme.title} theme preview`}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              onLoad={() => setLoaded(true)}
              className={cn(
                "relative object-contain transition-all duration-700 ease-out group-hover:scale-[1.025]",
                loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
              )}
            />
            {/* real second screenshot wipes in from the bottom on hover */}
            {altShot && (
              <Image
                src={altShot}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="absolute inset-0 object-cover object-top [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[clip-path:inset(0_0_0_0)]"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-(--ed-ink-2)">
            No preview
          </div>
        )}

        {badge && (
          <span className="absolute left-3 top-3 rounded-md bg-white/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#111] backdrop-blur-md">
            {badge}
          </span>
        )}

        {/* quick view — glass control, hover/focus revealed, above the link */}
        <button
          type="button"
          onClick={() => onQuickView(theme)}
          className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-md bg-white/70 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#111] opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Expand aria-hidden className="size-3" />
          Quick view
          <span className="sr-only">— {theme.title}</span>
        </button>
      </div>

      {/* ---- metadata in whitespace ---- */}
      <div className="mt-4 px-0.5">
        <p className="ed-label text-(--ed-ink-2)">
          {num}
          {theme.framework ? ` — ${theme.framework}` : ""}
        </p>
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <h3 className="truncate text-[17px] font-semibold uppercase tracking-[0.04em] text-(--ed-ink)">
            {theme.title}
          </h3>
          <p className="shrink-0 text-[15px] tabular-nums text-(--ed-ink)">
            {onSale && (
              <span className="mr-2 text-[12px] text-(--ed-ink-2) line-through">
                ${theme.originalPrice}
              </span>
            )}
            {free ? "Free" : `$${theme.price}`}
          </p>
        </div>
        <div className="mt-1 flex items-center justify-between gap-4">
          <p className="truncate text-[12px] uppercase tracking-[0.16em] text-(--ed-ink-2)">
            {theme.category}
            {theme.tags?.[0] ? ` / ${theme.tags[0]}` : ""}
          </p>
          <ArrowUpRight
            aria-hidden
            className="size-3.5 shrink-0 text-(--ed-ink-2) transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--ed-ink)"
          />
        </div>
      </div>
    </article>
  );
}
