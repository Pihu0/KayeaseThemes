import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";

export default function CategoryStrip({
  categories,
}: {
  categories: Category[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse by category
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            Find the right starting point for your next project.
          </p>
        </div>
        <Link
          href="/categories"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          All categories
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat._id}
            href={`/themes?category=${encodeURIComponent(cat.name)}`}
            className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            <div className="min-w-0">
              <h3 className="truncate font-medium transition-colors group-hover:text-primary">
                {cat.name}
              </h3>
              {cat.description && (
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {cat.description}
                </p>
              )}
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </section>
  );
}
