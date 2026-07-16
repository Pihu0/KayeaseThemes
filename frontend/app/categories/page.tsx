import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse website themes by category.",
};

export default async function CategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = await apiFetch("/categories");
  } catch {
    categories = [];
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Browse by Category
      </h1>
      <p className="mb-10 text-muted-foreground">
        Find the perfect theme for your type of project.
      </p>

      {categories.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No categories yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat._id} href={`/?category=${encodeURIComponent(cat.name)}`}>
              <Card className="group h-full transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{cat.name}</h2>
                    {cat.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
