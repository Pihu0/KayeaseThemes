import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private/admin routes out of search results
      disallow: ["/admin", "/login"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
