"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ListFilterIcon,
  SearchIcon,
  TagIcon,
  GlobeIcon,
  CircleDollarSignIcon,
  ChevronDownIcon,
} from "lucide-react";
import { Filters, type Filter, type FilterFieldConfig } from "@/components/reui/filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/lib/types";

const FRAMEWORKS = ["React", "Next.js", "Vue", "Shopify", "WordPress", "HTML/CSS"];
const FILTER_KEYS = ["category", "framework", "pricing"] as const;

const SORT_OPTIONS = [
  { value: "", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

export default function ThemeFilters({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

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

  // Fields for the reui Filters builder
  const fields: FilterFieldConfig[] = [
    {
      key: "category",
      label: "Category",
      icon: <TagIcon className="size-3.5" />,
      type: "select",
      searchable: true,
      options: categories.map((c) => ({ value: c.name, label: c.name })),
    },
    {
      key: "framework",
      label: "Framework",
      icon: <GlobeIcon className="size-3.5" />,
      type: "select",
      options: FRAMEWORKS.map((f) => ({ value: f, label: f })),
    },
    {
      key: "pricing",
      label: "Price",
      icon: <CircleDollarSignIcon className="size-3.5" />,
      type: "select",
      options: [
        { value: "free", label: "Free" },
        { value: "premium", label: "Paid" },
      ],
    },
  ];

  // Derive the active filters from the URL (stable ids = field name)
  const filters: Filter[] = FILTER_KEYS.filter((k) => searchParams.get(k)).map(
    (k) => ({
      id: k,
      field: k,
      operator: "is",
      values: [searchParams.get(k) as string],
    })
  );

  // Translate the builder's filter list back into URL params
  const handleFiltersChange = useCallback(
    (next: Filter[]) => {
      const params = new URLSearchParams(searchParams.toString());
      FILTER_KEYS.forEach((k) => params.delete(k));
      params.delete("page");
      next.forEach((f) => {
        const v = f.values?.[0];
        if (v != null && v !== "") params.set(f.field, String(v));
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const sort = searchParams.get("sort") ?? "";
  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Newest";

  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search themes…"
          className="pl-9"
        />
      </div>

      <Filters
        fields={fields}
        filters={filters}
        onChange={handleFiltersChange}
        trigger={
          <Button variant="outline" size="sm">
            <ListFilterIcon className="size-4" /> Filters
          </Button>
        }
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" aria-label="Sort themes">
              <span className="text-muted-foreground">Sort:</span>
              {sortLabel}
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-auto min-w-48">
          <DropdownMenuRadioGroup
            value={sort}
            onValueChange={(value) => setParam("sort", value)}
          >
            {SORT_OPTIONS.map((o) => (
              <DropdownMenuRadioItem key={o.value || "newest"} value={o.value}>
                {o.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
