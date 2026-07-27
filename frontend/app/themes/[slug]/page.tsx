import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Download,
  Globe,
  Package,
  Tag as TagIcon,
  User,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import type { Theme } from "@/lib/types";

// track=true increments the theme's view count. Only the page render passes it;
// generateMetadata does NOT, so a single visit counts as one view (not two).
async function getTheme(slug: string, track = false): Promise<Theme | null> {
  try {
    return await apiFetch(`/themes/slug/${slug}${track ? "?track=1" : ""}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const theme = await getTheme(slug);
  if (!theme) return { title: "Theme not found" };

  // Guarantee a non-empty description: imported themes sometimes ship with all
  // three text fields blank, which previously left the page with no meta
  // description at all. The final clause is a hard fallback that can never be empty.
  const description =
    theme.metaDescription ||
    theme.shortDescription ||
    theme.description ||
    `${theme.title} — a premium ${theme.category || ""} theme, available to download on Kayease Themes.`;

  return {
    title: theme.metaTitle || theme.title,
    description,
    keywords: theme.keywords?.length ? theme.keywords : undefined,
    alternates: { canonical: `/themes/${theme.slug}` },
    openGraph: {
      title: theme.metaTitle || theme.title,
      description,
      images: theme.image ? [{ url: theme.image }] : [],
      type: "website",
    },
  };
}

export default async function ThemeDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = await getTheme(slug, true); // count this render as a view
  if (!theme) notFound();

  const isFree = theme.pricingType === "free" || theme.price === 0;
  const onSale = theme.originalPrice > theme.price && theme.price > 0;
  const discount = onSale
    ? Math.round((1 - theme.price / theme.originalPrice) * 100)
    : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: theme.title,
    description: theme.shortDescription || theme.description,
    image: theme.image || undefined,
    category: theme.category,
    brand: { "@type": "Brand", name: theme.authorName || "Kayease Themes" },
    offers: {
      "@type": "Offer",
      price: theme.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  const specs = [
    { label: "Framework", value: theme.framework, icon: Globe },
    { label: "Version", value: theme.version, icon: Package },
    { label: "File format", value: theme.fileFormat, icon: Package },
    { label: "File size", value: theme.fileSize, icon: Package },
  ].filter((s) => s.value);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/themes"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to themes
      </Link>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left: gallery + content */}
        <div className="space-y-8 lg:col-span-2">
          <ScreenshotGallery
            cover={theme.image}
            screenshots={theme.screenshots}
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{theme.category}</Badge>
              {theme.featured && (
                <Badge variant="secondary">★ Featured</Badge>
              )}
              {onSale && (
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                  {discount}% OFF
                </Badge>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              {theme.title}
            </h1>
            {theme.shortDescription && (
              <p className="mt-3 text-lg text-muted-foreground">
                {theme.shortDescription}
              </p>
            )}
          </div>

          <div className="prose-sm max-w-none whitespace-pre-line text-muted-foreground">
            {theme.description}
          </div>

          {theme.keyFeatures?.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">Key Features</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {theme.keyFeatures.map((f, i) => (
                  <li key={`${f}-${i}`} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(theme.technologies?.length > 0 ||
            theme.browserSupport?.length > 0) && (
            <div className="grid gap-6 sm:grid-cols-2">
              {theme.technologies?.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {theme.technologies.map((t, i) => (
                      <Badge key={`${t}-${i}`} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {theme.browserSupport?.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold">Browser Support</h3>
                  <div className="flex flex-wrap gap-2">
                    {theme.browserSupport.map((b, i) => (
                      <Badge key={`${b}-${i}`} variant="secondary">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: sticky purchase card */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-5 rounded-xl border bg-card p-6">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-primary">
                {isFree ? "Free" : `$${theme.price}`}
              </span>
              {onSale && (
                <span className="mb-1 text-lg text-muted-foreground line-through">
                  ${theme.originalPrice}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {/* Primary action. No checkout is wired, so paid themes route to
                  contact; free themes with a download link download directly. */}
              {isFree && theme.downloadUrl ? (
                <Button
                  render={
                    <a
                      href={theme.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  nativeButton={false}
                  className="w-full"
                  data-icon="inline-start"
                >
                  <Download /> Download for Free
                </Button>
              ) : (
                <Button
                  render={<Link href="/customdesign" />}
                  nativeButton={false}
                  className="w-full"
                >
                  {isFree ? "Get this theme" : "Buy now"}
                </Button>
              )}
              {theme.demoUrl && (
                <Button
                  render={
                    <a
                      href={theme.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  nativeButton={false}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4" /> Live Demo
                </Button>
              )}
              {/* Only for paid themes — free downloads use the primary button above. */}
              {!isFree && theme.downloadUrl && (
                <Button
                  render={
                    <a
                      href={theme.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  nativeButton={false}
                  variant="ghost"
                  className="w-full"
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
              )}
            </div>

            {specs.length > 0 && (
              <div className="space-y-2 border-t pt-4 text-sm">
                {specs.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {theme.authorName && (
              <div className="flex items-center gap-2 border-t pt-4 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">By</span>
                <span className="font-medium">{theme.authorName}</span>
              </div>
            )}

            {theme.tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                <TagIcon className="h-4 w-4 text-muted-foreground" />
                {theme.tags.map((tag, i) => (
                  <Badge key={`${tag}-${i}`} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
