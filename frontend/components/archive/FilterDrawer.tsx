"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useFocusTrap, useScrollLock } from "@/components/archive/hooks";
import { EASE, useMediaQuery } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type {
  ArchiveFilters,
  FacetEntry,
  PricingKey,
} from "@/components/archive/ArchiveExperience";

/* 13+49 — FILTER EXPERIENCE
   Desktop: a premium side drawer from the right (~460px). Mobile: a bottom
   sheet with rounded top corners and sticky actions. Filters apply live —
   the gallery reorders behind the scrim — and the primary action always
   reads "SHOW N THEMES" with the real result count.

   Only real data dimensions appear: platform (framework), industry
   (category) and price. No invented metadata. */

export default function FilterDrawer({
  open,
  onClose,
  filters,
  setFilters,
  clearAll,
  categories,
  frameworks,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: ArchiveFilters;
  setFilters: (patch: Partial<ArchiveFilters>) => void;
  clearAll: () => void;
  categories: FacetEntry[];
  frameworks: FacetEntry[];
  resultCount: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const sheet = !useMediaQuery("(min-width: 640px)"); // bottom sheet on phones
  useScrollLock(open);
  useFocusTrap(panelRef, open, onClose);

  const hasActive = Boolean(filters.category || filters.framework || filters.pricing);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-90">
          {/* restrained backdrop — no site-wide blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={onClose}
            className="absolute inset-0 bg-black/25"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filter themes"
            initial={sheet ? { y: "100%" } : { x: "100%" }}
            animate={sheet ? { y: 0 } : { x: 0 }}
            exit={sheet ? { y: "100%" } : { x: "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
            className={cn(
              "absolute flex flex-col bg-(--ed-surface) text-(--ed-ink)",
              sheet
                ? "inset-x-0 bottom-0 max-h-[86svh] rounded-t-2xl"
                : "bottom-0 right-0 top-0 w-[min(92vw,460px)] border-l border-(--ed-line-soft)"
            )}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-(--ed-line-soft) px-7 py-5">
              <p className="ed-label">Filter Themes</p>
              <button
                type="button"
                onClick={onClose}
                data-autofocus
                aria-label="Close filters"
                className="flex size-9 items-center justify-center rounded-full border border-(--ed-line) transition-colors hover:bg-(--ed-ink) hover:text-(--ed-bg)"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* scrollable body */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-7 py-6">
              <Section title="Platform" delay={0.08}>
                {frameworks.map((f) => (
                  <OptionRow
                    key={f.name}
                    label={f.name}
                    count={f.count}
                    checked={filters.framework === f.name}
                    onToggle={() =>
                      setFilters({
                        framework: filters.framework === f.name ? "" : f.name,
                      })
                    }
                  />
                ))}
              </Section>

              <Section title="Industry" delay={0.14}>
                {categories.map((c) => (
                  <OptionRow
                    key={c.name}
                    label={c.name}
                    count={c.count}
                    checked={filters.category === c.name}
                    onToggle={() =>
                      setFilters({
                        category: filters.category === c.name ? "" : c.name,
                      })
                    }
                  />
                ))}
              </Section>

              <Section title="Price" delay={0.2} last>
                {(
                  [
                    { value: "free", label: "Free" },
                    { value: "premium", label: "Paid" },
                  ] as { value: PricingKey; label: string }[]
                ).map((p) => (
                  <OptionRow
                    key={p.value}
                    label={p.label}
                    checked={filters.pricing === p.value}
                    onToggle={() =>
                      setFilters({
                        pricing: filters.pricing === p.value ? "" : p.value,
                      })
                    }
                  />
                ))}
              </Section>
            </div>

            {/* sticky actions */}
            <div className="flex items-center gap-3 border-t border-(--ed-line-soft) px-7 py-5">
              <button
                type="button"
                onClick={clearAll}
                disabled={!hasActive && !filters.search}
                className="ed-underline text-[12px] font-medium uppercase tracking-[0.16em] text-(--ed-ink-2) transition-colors hover:text-(--ed-ink) disabled:pointer-events-none disabled:opacity-40"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={onClose}
                className="ml-auto inline-flex h-12 items-center bg-(--ed-ink) px-7 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-bg) transition-colors duration-300 hover:bg-black dark:hover:bg-white"
              >
                Show {resultCount} {resultCount === 1 ? "theme" : "themes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  children,
  delay = 0,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
  last?: boolean;
}) {
  return (
    <motion.fieldset
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={cn("py-2", !last && "border-b border-(--ed-line-soft) pb-7 mb-6")}
    >
      <legend className="ed-label pb-4 text-(--ed-ink-2)">{title}</legend>
      <div className="space-y-1">{children}</div>
    </motion.fieldset>
  );
}

/* custom minimal checkbox — a real button with role=checkbox, so it stays
   keyboard + screen-reader friendly without the browser-default look */
function OptionRow({
  label,
  count,
  checked,
  onToggle,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="group flex w-full items-center gap-3.5 py-2 text-left"
    >
      <span
        aria-hidden
        className={cn(
          "flex size-4.5 shrink-0 items-center justify-center border transition-colors duration-200",
          checked
            ? "border-(--ed-ink) bg-(--ed-ink) text-(--ed-bg)"
            : "border-(--ed-line) group-hover:border-(--ed-ink)/50"
        )}
      >
        {checked && <Check className="size-3" />}
      </span>
      <span
        className={cn(
          "text-[14px] transition-colors duration-200",
          checked ? "text-(--ed-ink)" : "text-(--ed-ink-2) group-hover:text-(--ed-ink)"
        )}
      >
        {label}
      </span>
      {typeof count === "number" && (
        <span className="ml-auto text-[12px] tabular-nums text-(--ed-ink-2)">
          {String(count).padStart(2, "0")}
        </span>
      )}
    </button>
  );
}
