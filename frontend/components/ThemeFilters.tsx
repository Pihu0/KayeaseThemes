"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";

const FRAMEWORKS = [
  "React",
  "Next.js",
  "Vue",
  "Shopify",
  "WordPress",
  "HTML/CSS",
];

const selectClass =
  "h-9 rounded-lg border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function ThemeFilters({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  // Update a query param and reset to page 1 on any filter change
  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounce the search box
  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    const t = setTimeout(() => {
      if (search !== current) setParam("search", search);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const category = searchParams.get("category") ?? "";
  const framework = searchParams.get("framework") ?? "";
  const pricing = searchParams.get("pricing") ?? "";
  const sort = searchParams.get("sort") ?? "";

  // Active filters shown as removable chips
  const chips = [
    search && { key: "search", label: `“${search}”` },
    category && { key: "category", label: category },
    framework && { key: "framework", label: framework },
    pricing && { key: "pricing", label: pricing === "free" ? "Free" : "Paid" },
  ].filter(Boolean) as { key: string; label: string }[];

  const removeChip = (key: string) => {
    if (key === "search") setSearch("");
    setParam(key, "");
  };

  const clearAll = () => {
    setSearch("");
    router.push(pathname);
  };

  return (
    <div className="mb-10 space-y-3">
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search themes…"
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex">
          <select
            value={category}
            onChange={(e) => setParam("category", e.target.value)}
            className={selectClass}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={framework}
            onChange={(e) => setParam("framework", e.target.value)}
            className={selectClass}
            aria-label="Filter by framework"
          >
            <option value="">All frameworks</option>
            {FRAMEWORKS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            value={pricing}
            onChange={(e) => setParam("pricing", e.target.value)}
            className={selectClass}
            aria-label="Filter by price"
          >
            <option value="">Any price</option>
            <option value="free">Free</option>
            <option value="premium">Paid</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className={selectClass}
            aria-label="Sort themes"
          >
            <option value="">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active:</span>
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => removeChip(chip.key)}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm transition-colors hover:bg-muted/70"
            >
              {chip.label}
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
