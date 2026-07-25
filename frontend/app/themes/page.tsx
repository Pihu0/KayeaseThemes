import { Suspense } from "react";
import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import ArchiveExperience from "@/components/archive/ArchiveExperience";
import type { Theme, Category } from "@/lib/types";

type SearchParams = { [key: string]: string | undefined };

type ThemesResponse = {
  themes: Theme[];
  page: number;
  pages: number;
  total: number;
};

export const metadata: Metadata = {
  title: "Theme Archive",
  description:
    "Explore every premium, production-ready theme in the Kayease catalog. Filter by category, framework, and price.",
  alternates: { canonical: "/themes" },
  openGraph: {
    title: "Theme Archive | Kayease Themes",
    description:
      "Explore every premium, production-ready theme in the Kayease catalog.",
    url: "/themes",
    type: "website",
  },
};

/* The archive fetches the WHOLE catalog once; searching / filtering /
   sorting then run client-side (mirroring the backend's query rules) so the
   gallery can FLIP-animate between states instead of re-rendering on a
   server round-trip. Filter state lives in the URL — same param names the
   old paginated page used, so shared links keep working. */
export default async function ThemesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Awaiting searchParams keeps this route dynamic, so the first server
  // render of ArchiveExperience already sees the URL's filters (via
  // useSearchParams) — shared filtered links render filtered HTML.
  await searchParams;

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
      <Suspense fallback={null}>
        <ArchiveExperience
          themes={data.themes}
          categories={categories}
          total={data.total}
        />
      </Suspense>
    </main>
  );
}
