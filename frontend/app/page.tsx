import { apiFetch } from "@/lib/api";
import HomeExperience from "@/components/home/HomeExperience";
import type { Theme, Category } from "@/lib/types";

type ThemesResponse = {
  themes: Theme[];
  page: number;
  pages: number;
  total: number;
};

// The homepage stages real work: hero previews, the Selected Themes
// showcase, industry counts and the newest release all derive from this
// one batch (newest-first from the API).
export default async function HomePage() {
  let data: ThemesResponse = { themes: [], page: 1, pages: 1, total: 0 };
  let categories: Category[] = [];
  try {
    [data, categories] = await Promise.all([
      apiFetch("/themes?limit=60"),
      apiFetch("/categories"),
    ]);
  } catch {
    // leave defaults — sections gracefully hide when empty
  }

  return (
    <main>
      <HomeExperience
        themes={data.themes}
        categories={categories}
        total={data.total}
      />
    </main>
  );
}
