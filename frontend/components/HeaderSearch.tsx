"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Header search: an icon button that expands into a full-width search bar
// below the header. Submitting routes to the /themes catalog with ?search=.
export default function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/themes?search=${encodeURIComponent(term)}` : "/themes");
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        onClick={() => setOpen((o) => !o)}
        aria-label="Search themes"
        aria-expanded={open}
      >
        <Search className="h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute inset-x-0 top-full px-4 pt-2">
          <form
            onSubmit={submit}
            className="mx-auto flex w-full max-w-4xl items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] backdrop-blur-md dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)]"
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search themes…"
              className="h-9 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="sm" className="rounded-full">
              Search
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() => setOpen(false)}
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
