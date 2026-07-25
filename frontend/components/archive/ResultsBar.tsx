"use client";

import { X, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArchiveFilters } from "@/components/archive/ArchiveExperience";

/* 04 — RESULT INFORMATION
   "12 RESULTS" + compact editorial chips for every active filter on the left,
   GRID / INDEX view switcher on the right. Chips remove one filter each;
   CLEAR ALL resets everything. */

export default function ResultsBar({
  count,
  filters,
  setFilters,
  clearAll,
  view,
  setView,
}: {
  count: number;
  filters: ArchiveFilters;
  setFilters: (patch: Partial<ArchiveFilters>) => void;
  clearAll: () => void;
  view: "grid" | "index";
  setView: (v: "grid" | "index") => void;
}) {
  const chips: { label: string; clear: Partial<ArchiveFilters> }[] = [];
  if (filters.search) chips.push({ label: `“${filters.search}”`, clear: { search: "" } });
  if (filters.category) chips.push({ label: filters.category, clear: { category: "" } });
  if (filters.framework) chips.push({ label: filters.framework, clear: { framework: "" } });
  if (filters.pricing)
    chips.push({
      label: filters.pricing === "free" ? "Free" : "Paid",
      clear: { pricing: "" },
    });

  return (
    <div className="mb-10 border-b border-(--ed-line) pb-4">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <p className="ed-label text-(--ed-ink)" aria-live="polite">
            {count} {count === 1 ? "Result" : "Results"}
          </p>

          {chips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => setFilters(chip.clear)}
              className="group flex items-center gap-1.5 border-b border-(--ed-line) pb-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-(--ed-ink-2) transition-colors hover:border-(--ed-ink) hover:text-(--ed-ink)"
            >
              {chip.label}
              <X aria-hidden className="size-3" />
              <span className="sr-only">— remove filter</span>
            </button>
          ))}

          {chips.length > 1 && (
            <button
              type="button"
              onClick={clearAll}
              className="ed-underline text-[11px] font-medium uppercase tracking-[0.16em] text-(--ed-ink-2) hover:text-(--ed-ink)"
            >
              Clear all
            </button>
          )}
        </div>

        {/* GRID / INDEX — the archive's two reading modes */}
        <div className="flex items-center gap-4" role="group" aria-label="View mode">
          {(
            [
              { key: "grid", label: "Grid", Icon: LayoutGrid },
              { key: "index", label: "Index", Icon: List },
            ] as const
          ).map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={cn(
                "flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors",
                view === key
                  ? "text-(--ed-ink)"
                  : "text-(--ed-ink-2) hover:text-(--ed-ink)"
              )}
            >
              <Icon aria-hidden className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
