import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import CategoriesExperience from "@/components/categories/CategoriesExperience";
import type { Theme, Category } from "@/lib/types";

type ThemesResponse = {
  themes: Theme[];
  page: number;
  pages: number;
  total: number;
};

export const metadata: Metadata = {
  title: "Categories",
  description:
    "An editorial index of the Kayease catalog — explore themes by industry, with live counts and previews for every category.",
  alternates: { canonical: "/categories" },
};

/* /categories is a visual index, not a card grid: counts and hover
   previews derive from the real catalog, so the page fetches themes
   alongside categories (same one-shot pattern as the archive). */
export default async function CategoriesPage() {
  let data: ThemesResponse = { themes: [], page: 1, pages: 1, total: 0 };
  let categories: Category[] = [];
  try {
    [data, categories] = await Promise.all([
      apiFetch("/themes?limit=200"),
      apiFetch("/categories"),
    ]);
  } catch {
    // leave defaults — the designed empty state renders
  }

  return (
    <main>
      <CategoriesExperience
        categories={categories}
        themes={data.themes}
        total={data.total}
      />
    </main>
  );
}
