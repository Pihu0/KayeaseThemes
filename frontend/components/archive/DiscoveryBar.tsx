"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ListFilter, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type {
  ArchiveFilters,
  FacetEntry,
  SortKey,
} from "@/components/archive/ArchiveExperience";

/* 02+03 — CATEGORY EXPLORER + DISCOVERY BAR
   Editorial text navigation over the collection, then the search / filters /
   sort control row. The whole block is position:sticky; once it actually
   sticks (detected with a sentinel + IntersectionObserver) it compacts and
   picks up a restrained glass surface — the one place glassmorphism is
   allowed on this page. */

const SORT_LABELS: { value: SortKey; label: string }[] = [
  { value: "", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "name", label: "Name A–Z" },
];

export default function DiscoveryBar({
  filters,
  setFilters,
  categories,
  frameworks,
  totalCount,
  activeFilterCount,
  onOpenFilters,
}: {
  filters: ArchiveFilters;
  setFilters: (patch: Partial<ArchiveFilters>) => void;
  categories: FacetEntry[];
  frameworks: FacetEntry[];
  totalCount: number;
  activeFilterCount: number;
  onOpenFilters: () => void;
}) {
  /* ---- sticky state: sentinel sits right above the bar; the moment it
     leaves the viewport (behind the navbar) the bar is "stuck" ---- */
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---- debounced search (URL updates 250ms after the last keystroke) ---- */
  const [query, setQuery] = useState(filters.search);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      if (query !== filters.search) setFilters({ search: query });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  // keep the box in sync when search is cleared elsewhere (chips, empty state)
  useEffect(() => {
    if (filters.search !== query && document.activeElement !== inputRef.current) {
      setQuery(filters.search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  const [focused, setFocused] = useState(false);
  const suggestions = [
    ...categories.slice(0, 4).map((c) => c.name),
    ...frameworks.slice(0, 2).map((f) => f.name),
  ];

  const sortLabel =
    SORT_LABELS.find((o) => o.value === filters.sort)?.label ?? "Newest";

  const explorer: FacetEntry[] = [{ name: "", count: totalCount }, ...categories];

  return (
    <>
      <div ref={sentinelRef} aria-hidden />

      <div
        className={cn(
          "sticky top-14 z-40 transition-all duration-400",
          // when stuck, a matching glass panel (::before) fills the strip the
          // hidden navbar vacates above the bar, so cards don't scroll through it
          "before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-14 before:transition-opacity before:duration-400",
          stuck
            ? "border-b border-(--ed-line-soft) bg-(--ed-bg) before:bg-(--ed-bg) before:opacity-100"
            : "border-b border-transparent before:opacity-0"
        )}
      >
        <div className="ed-px mx-auto w-full max-w-[1760px]">
          {/* ---- category quick explorer ---- */}
          <nav
            aria-label="Browse by category"
            className={cn(
              "flex gap-7 overflow-x-auto border-b border-(--ed-line-soft) [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              stuck ? "py-3" : "py-4"
            )}
          >
            {explorer.map((entry) => {
              const active = filters.category === entry.name;
              return (
                <button
                  key={entry.name || "all"}
                  type="button"
                  onClick={() => setFilters({ category: active ? "" : entry.name })}
                  aria-pressed={active}
                  className={cn(
                    "group relative shrink-0 pb-1.5 text-[12px] font-medium uppercase tracking-[0.18em] transition-all duration-300 hover:-translate-y-0.5",
                    active ? "text-(--ed-ink)" : "text-(--ed-ink-2) hover:text-(--ed-ink)"
                  )}
                >
                  {entry.name || "All"}
                  <sup className="ml-1 text-[9px] tabular-nums tracking-normal">
                    {String(entry.count).padStart(2, "0")}
                  </sup>
                  {active && (
                    <motion.span
                      layoutId="category-underline"
                      transition={{ duration: 0.45, ease: EASE }}
                      className="absolute inset-x-0 bottom-0 h-px bg-(--ed-ink)"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ---- search + controls ---- */}
          <div
            className={cn(
              "flex flex-col gap-3 sm:flex-row sm:items-center",
              stuck ? "py-3" : "py-5"
            )}
          >
            {/* search — stays dominant */}
            <div className="relative flex-1">
              <label htmlFor="archive-search" className="sr-only">
                Search themes
              </label>
              <Search
                aria-hidden
                className={cn(
                  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--ed-ink-2) transition-all duration-300",
                  focused ? "size-4 text-(--ed-ink)" : "size-4"
                )}
              />
              <input
                ref={inputRef}
                id="archive-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search by theme, industry, platform or style…"
                autoComplete="off"
                className={cn(
                  "w-full rounded-xl border bg-transparent pl-11 pr-4 text-[15px] text-(--ed-ink) outline-none transition-all duration-300 placeholder:text-(--ed-ink-2)",
                  stuck ? "h-11" : "h-12 sm:h-13",
                  focused
                    ? "border-(--ed-ink)/45"
                    : "border-(--ed-line) hover:border-(--ed-ink)/25"
                )}
              />

              {/* popular searches — only on focus while empty, real facets only */}
              {focused && query === "" && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute inset-x-0 top-full z-50 mt-2 rounded-xl border border-(--ed-line-soft) bg-(--ed-surface) p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]"
                >
                  <p className="ed-label text-(--ed-ink-2)">Popular searches</p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        // mousedown so it fires before the input's blur
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setQuery(s);
                          setFilters({ search: s });
                        }}
                        className="ed-underline text-[13px] uppercase tracking-[0.1em] text-(--ed-ink)"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* lightweight controls */}
            <div className="flex items-center gap-6 sm:justify-end">
              <button
                type="button"
                onClick={onOpenFilters}
                className={cn(
                  "ed-underline flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors",
                  activeFilterCount > 0 ? "text-(--ed-ink)" : "text-(--ed-ink-2) hover:text-(--ed-ink)"
                )}
              >
                <ListFilter aria-hidden className="size-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="tabular-nums">· {activeFilterCount}</span>
                )}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      aria-label="Sort themes"
                      className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-(--ed-ink-2) transition-colors hover:text-(--ed-ink)"
                    >
                      <span>Sort /</span>
                      <span className="text-(--ed-ink)">{sortLabel}</span>
                      <ChevronDown aria-hidden className="size-3.5" />
                    </button>
                  }
                />
                <DropdownMenuContent
                  align="end"
                  className="min-w-44 border-(--ed-line-soft) bg-(--ed-surface)/90 backdrop-blur-lg"
                >
                  <DropdownMenuRadioGroup
                    value={filters.sort}
                    onValueChange={(v) => setFilters({ sort: v as SortKey })}
                  >
                    {SORT_LABELS.map((o) => (
                      <DropdownMenuRadioItem
                        key={o.value || "newest"}
                        value={o.value}
                        className="text-[12px] uppercase tracking-[0.14em]"
                      >
                        {o.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
