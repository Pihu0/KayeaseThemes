import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Theme } from "@/lib/types";

async function getTheme(slug: string): Promise<Theme | null> {
  try {
    return await apiFetch(`/themes/slug/${slug}`);
  } catch {
    return null;
  }
}

// Per-page SEO metadata (unique title, description, Open Graph)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const theme = await getTheme(slug);
  if (!theme) return { title: "Theme not found" };

  return {
    title: theme.title,
    description: theme.description,
    alternates: { canonical: `/themes/${theme.slug}` },
    openGraph: {
      title: theme.title,
      description: theme.description,
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
  const theme = await getTheme(slug);
  if (!theme) notFound();

  // Structured data (Product schema) for rich search results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: theme.title,
    description: theme.description,
    image: theme.image || undefined,
    category: theme.category,
    offers: {
      "@type": "Offer",
      price: theme.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to themes
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Preview */}
        <div className="relative aspect-16/10 overflow-hidden rounded-xl border bg-muted">
          {theme.image && (
            <Image
              src={theme.image}
              alt={`${theme.title} theme preview`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>

        {/* Info */}
        <div>
          <Badge className="mb-3">{theme.category}</Badge>
          <h1 className="text-3xl font-bold tracking-tight">{theme.title}</h1>
          <p className="mt-4 text-muted-foreground">{theme.description}</p>

          {theme.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {theme.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center gap-5">
            <span className="text-3xl font-bold text-primary">
              ${theme.price}
            </span>
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
              >
                Live Demo
              </Button>
            )}
          </div>

          <Button className="mt-6 w-full sm:w-auto">Buy Now</Button>
        </div>
      </div>
    </main>
  );
}
