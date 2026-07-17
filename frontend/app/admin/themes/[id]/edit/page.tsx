"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ThemeForm from "@/components/admin/ThemeForm";
import { Skeleton } from "@/components/ui/skeleton";
import type { Theme } from "@/lib/types";

export default function EditThemePage() {
  const { id } = useParams<{ id: string }>();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/themes/${id}`)
      .then(setTheme)
      .catch(() => setTheme(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!theme) {
    return <p className="text-muted-foreground">Theme not found.</p>;
  }

  return <ThemeForm theme={theme} />;
}
