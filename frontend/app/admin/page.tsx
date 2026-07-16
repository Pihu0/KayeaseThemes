"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, FolderTree, Mail, Plus, ExternalLink } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Theme } from "@/lib/types";

type Message = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [stats, setStats] = useState({ themes: 0, categories: 0, messages: 0 });
  const [recent, setRecent] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [themeData, cats, msgs] = await Promise.all([
          apiFetch("/themes?limit=100"),
          apiFetch("/categories"),
          apiFetch("/contacts"),
        ]);
        setThemes(themeData.themes);
        setStats({
          themes: themeData.total,
          categories: cats.length,
          messages: msgs.length,
        });
        setRecent(msgs.slice(0, 4));
      } catch {
        // stays at defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    {
      label: "Total Themes",
      value: stats.themes,
      icon: LayoutGrid,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: FolderTree,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: Mail,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  // Count themes per category for the breakdown
  const byCategory = themes.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});
  const breakdown = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(1, ...breakdown.map(([, n]) => n));

  return (
    <>
      {/* Header + quick actions */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{user?.name ? `, ${user.name}` : ""} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your theme catalog.
          </p>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href="/admin/themes" />} nativeButton={false}>
            <Plus className="h-4 w-4" /> Add Theme
          </Button>
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            variant="outline"
          >
            <ExternalLink className="h-4 w-4" /> View Site
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="overflow-hidden">
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}
              >
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                {loading ? (
                  <Skeleton className="mt-1 h-8 w-12" />
                ) : (
                  <p className="text-3xl font-bold tabular-nums">{value}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-column: category breakdown + recent messages */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Themes by category */}
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 font-semibold">Themes by Category</h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : breakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">No themes yet.</p>
            ) : (
              <div className="space-y-3">
                {breakdown.map(([cat, count]) => (
                  <div key={cat}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{cat}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent messages */}
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 font-semibold">Recent Messages</h2>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {recent.map((m) => (
                  <div
                    key={m._id}
                    className="flex gap-3 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold uppercase text-primary">
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-medium">{m.name}</p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {m.email}
                        </span>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {m.subject || m.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
