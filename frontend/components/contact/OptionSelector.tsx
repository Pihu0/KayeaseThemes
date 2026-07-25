"use client";

import { cn } from "@/lib/utils";

/* OPTION SELECTOR — text choices, not colourful pills (brief §22).
   A row of underline-able words; the selected one gets a quiet dark fill.
   Rendered as real radio-group semantics so it's keyboard + screen-reader
   friendly. Used for build type, budget and timeline in the custom flow. */

export default function OptionSelector({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[11px] font-medium uppercase tracking-[0.14em] text-(--ed-ink-2)">
        {label}
      </legend>
      <div
        role="radiogroup"
        aria-label={label}
        className="mt-4 flex flex-wrap gap-x-3 gap-y-3"
      >
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              name={name}
              onClick={() => onChange(active ? "" : opt)}
              className={cn(
                "rounded-full border px-4 py-2 text-[13px] uppercase tracking-[0.1em] transition-colors duration-300",
                active
                  ? "border-(--ed-ink) bg-(--ed-ink) text-(--ed-bg)"
                  : "border-(--ed-line) text-(--ed-ink-2) hover:border-(--ed-ink)/40 hover:text-(--ed-ink)"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
