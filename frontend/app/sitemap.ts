import type { MetadataRoute } from "next";
import { apiFetch } from "@/lib/api";
import type { Theme } from "@/lib/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = ["", "/categories", "/contact"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: path === "" ? 1 : 0.7,
    })
  );

  // Dynamic theme pages
  let themes: Theme[] = [];
  try {
    const data = await apiFetch("/themes?limit=1000");
    themes = data.themes;
  } catch {
    themes = [];
  }

  const themeRoutes: MetadataRoute.Sitemap = themes.map((t) => ({
    url: `${siteUrl}/themes/${t.slug}`,
    lastModified: new Date(t.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...themeRoutes];
}
