"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Search } from "lucide-react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/types";

/* THEME PICKER — a searchable selector, not a giant dropdown (brief §19).
   Reuses the same underline trigger as every other field; the results panel
   is the one place glassmorphism is allowed on this page (§45). Full keyboard
   combobox: type to filter, ↑/↓ to move, Enter to choose, Esc to close.
   Thumbnails come straight from real theme data — nothing is fabricated. */

export default function ThemePicker({
  label,
  themes,
  value,
  onChange,
}: {
  label: string;
  themes: Theme[];
  value: string;
  onChange: (title: string) => void;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? themes.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.category?.toLowerCase().includes(q)
        )
      : themes;
    return list.slice(0, 8);
  }, [themes, query]);

  // Close on outside click / Escape; keep the active row in range.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const changeQuery = (v: string) => {
    setQuery(v);
    setActive(0); // fresh filter → highlight the first result
    setOpen(true);
  };

  const choose = (t: Theme) => {
    onChange(t.title);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && open && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <label
        htmlFor={id}
        className="block text-[11px] font-medium uppercase tracking-[0.14em] text-(--ed-ink-2)"
      >
        {label}
      </label>

      {/* Trigger doubles as the search input once open. */}
      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          autoComplete="off"
          value={open ? query : value}
          placeholder={value ? value : "Search themes…"}
          onFocus={() => setOpen(true)}
          onChange={(e) => changeQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent pt-2.5 pb-2.5 pr-8 text-[clamp(1rem,1.6vw,1.15rem)] text-(--ed-ink) placeholder:text-(--ed-ink-2)/60 outline-none"
        />
        <button
          type="button"
          aria-label={open ? "Close theme list" : "Open theme list"}
          onClick={() => {
            setOpen((o) => !o);
            inputRef.current?.focus();
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-(--ed-ink-2) transition-colors hover:text-(--ed-ink)"
        >
          {open ? (
            <Search className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </button>
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-(--ed-ink)/18" />
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 bottom-0 h-px origin-left bg-(--ed-ink) transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "scale-x-100" : "scale-x-0"
          )}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={`${id}-list`}
            role="listbox"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-(--ed-line) bg-(--ed-surface)/80 p-1.5 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          >
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-[13px] text-(--ed-ink-2)">
                No themes match “{query}”.
              </li>
            ) : (
              results.map((t, i) => {
                const selected = t.title === value;
                return (
                  <li key={t._id} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(t)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors",
                        i === active ? "bg-(--ed-ink)/6" : "bg-transparent"
                      )}
                    >
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-(--ed-line) bg-(--ed-bg)">
                        {t.image && (
                          <Image
                            src={t.image}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover object-top"
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] text-(--ed-ink)">
                          {t.title}
                        </span>
                        {t.category && (
                          <span className="block truncate text-[11px] uppercase tracking-[0.12em] text-(--ed-ink-2)">
                            {t.category}
                          </span>
                        )}
                      </span>
                      {selected && (
                        <Check className="size-4 shrink-0 text-(--ed-ink)" />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
