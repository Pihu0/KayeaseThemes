"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { EASE } from "@/lib/motion";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { INTENTS, type IntentId } from "./intents";

/* INTENT SELECTOR — "what can we help with?" (brief §09–13).
   Full-width editorial rows, never cards. Hovering emphasises a row and
   quietly dims the rest; choosing one keeps it lit and swaps the arrow for a
   check. Real <button>s, so the whole thing is keyboard-operable and the
   selection drives the contextual fields in the form below. */

export default function IntentSelector({
  selected,
  onSelect,
}: {
  selected: IntentId | null;
  onSelect: (id: IntentId) => void;
}) {
  const [hovered, setHovered] = useState<IntentId | null>(null);

  return (
    <ul>
      {INTENTS.map((intent, i) => {
        const isSelected = selected === intent.id;
        const isHovered = hovered === intent.id;
        const active = isHovered || isSelected;
        // Dim a row only when another row is being hovered.
        const dimmed = hovered !== null && !isHovered;

        return (
          <motion.li
            key={intent.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6% 0px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
            className={cn(
              "border-b transition-colors duration-300 first:border-t",
              isSelected ? "border-(--ed-ink)/30" : "border-(--ed-line)"
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(intent.id)}
              onMouseEnter={() => setHovered(intent.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(intent.id)}
              onBlur={() => setHovered(null)}
              aria-pressed={isSelected}
              className={cn(
                "group grid w-full grid-cols-[2rem_1fr_auto] items-center gap-x-4 py-7 text-left outline-offset-4 transition-opacity duration-300 sm:gap-x-6 lg:grid-cols-[4.5rem_1fr_auto] lg:gap-x-8 lg:py-9",
                dimmed && "opacity-40"
              )}
            >
              <span
                className={cn(
                  "self-start pt-1.5 text-[11px] font-medium tabular-nums tracking-[0.14em] transition-colors duration-300 lg:self-center lg:pt-0",
                  active ? "text-(--ed-ink)" : "text-(--ed-ink-2)"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0">
                <span
                  className={cn(
                    "ed-display block text-[clamp(1.5rem,3.6vw,3.25rem)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active && "lg:translate-x-3"
                  )}
                >
                  {intent.title}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-[13px] leading-snug text-(--ed-ink-2) transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:mt-1.5",
                    active
                      ? "opacity-100 lg:translate-x-3"
                      : "opacity-60 lg:opacity-40"
                  )}
                >
                  {intent.summary}
                </span>
              </span>

              {/* selected → check; otherwise the signature ↗ */}
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border transition-colors duration-300 lg:size-11",
                  isSelected
                    ? "border-(--ed-ink) bg-(--ed-ink) text-(--ed-bg)"
                    : "border-(--ed-line) text-(--ed-ink)"
                )}
              >
                {isSelected ? (
                  <Check className="size-4" />
                ) : (
                  <ArrowUpRight
                    className={cn(
                      "size-4 transition-transform duration-300 lg:size-5",
                      active
                        ? "-translate-y-0.5 translate-x-0.5 opacity-100"
                        : "opacity-55"
                    )}
                  />
                )}
              </span>
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
}
