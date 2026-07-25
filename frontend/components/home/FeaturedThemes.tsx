import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ThemeCard from "@/components/ThemeCard";
import type { Theme } from "@/lib/types";

export default function FeaturedThemes({ themes }: { themes: Theme[] }) {
  if (themes.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured themes
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            A handpicked selection of our most-loved templates.
          </p>
        </div>
        <Link
          href="/themes"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all themes
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme, i) => (
          <ThemeCard key={theme._id} theme={theme} index={i} priority={i < 4} />
        ))}
      </div>
    </section>
  );
}
