import { Suspense } from "react";
import { apiFetch } from "@/lib/api";
import ThemeCard from "@/components/ThemeCard";
import ThemeFilters from "@/components/ThemeFilters";
import Pagination from "@/components/Pagination";
import type { Theme, Category } from "@/lib/types";

type SearchParams = { [key: string]: string | undefined };

type ThemesResponse = {
  themes: Theme[];
  page: number;
  pages: number;
  total: number;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  // Forward the allowed filters to the API
  const query = new URLSearchParams();
  ["search", "category", "sort", "page"].forEach((k) => {
    if (sp[k]) query.set(k, sp[k] as string);
  });

  let data: ThemesResponse = { themes: [], page: 1, pages: 1, total: 0 };
  let categories: Category[] = [];
  try {
    [data, categories] = await Promise.all([
      apiFetch(`/themes?${query.toString()}`),
      apiFetch("/categories"),
    ]);
  } catch {
    // leave defaults — empty state renders
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Premium Website Themes
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
          Production-ready templates for every project — beautifully designed,
          fully responsive, and ready to launch.
        </p>
      </section>

      {/* Filters (client) — Suspense required for useSearchParams */}
      <Suspense fallback={<div className="mb-10 h-9" />}>
        <ThemeFilters categories={categories} />
      </Suspense>

      {/* Grid */}
      {data.themes.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No themes match your search. Try adjusting the filters.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.themes.map((theme, i) => (
              <ThemeCard key={theme._id} theme={theme} priority={i < 3} />
            ))}
          </div>
          <Pagination page={data.page} pages={data.pages} params={sp} />
        </>
      )}
    </main>
  );
}
