"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Theme } from "@/lib/types";

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  const loadThemes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/themes?limit=100");
      setThemes(data.themes);
    } catch {
      toast.error("Failed to load themes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this theme? This cannot be undone.")) return;
    try {
      await apiFetch(`/themes/${id}`, { method: "DELETE" });
      toast.success("Theme deleted");
      setThemes((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Themes</h1>
          <p className="text-sm text-muted-foreground">
            Manage your theme catalog.
          </p>
        </div>
        <Button render={<Link href="/admin/themes/new" />} nativeButton={false}>
          <Plus className="h-4 w-4" /> Add Theme
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border">
              <Skeleton className="aspect-16/10 w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : themes.length === 0 ? (
        <p className="text-muted-foreground">No themes yet. Add your first one.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {themes.map((t) => (
            <div
              key={t._id}
              className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-muted">
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.image}
                    alt={`${t.title} preview`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
                <Badge className="absolute left-3 top-3">{t.category}</Badge>
                {t.status === "draft" && (
                  <Badge
                    variant="secondary"
                    className="absolute right-3 top-3"
                  >
                    Draft
                  </Badge>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-medium">{t.title}</h3>
                  <span className="shrink-0 font-semibold text-primary">
                    {t.pricingType === "free" ? "Free" : `$${t.price}`}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    render={<Link href={`/admin/themes/${t._id}/edit`} />}
                    nativeButton={false}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(t._id)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
