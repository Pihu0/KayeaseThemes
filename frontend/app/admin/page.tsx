"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  FolderTree,
  Mail,
  Plus,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      href: "/admin/themes",
      cta: "View themes",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: FolderTree,
      href: "/admin/categories",
      cta: "View categories",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: Mail,
      href: "/admin",
      cta: "View messages",
    },
  ];

  // Count themes per category for the breakdown
  const byCategory = themes.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});
  const breakdown = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(1, ...breakdown.map(([, n]) => n));

  // Most recently created themes for the bottom list
  const recentThemes = [...themes]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <>
      {/* Header + quick actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your theme catalog and enquiries.
          </p>
        </div>
        <Button render={<Link href="/admin/themes/new" />} nativeButton={false}>
          <Plus className="h-4 w-4" /> Add Theme
        </Button>
      </div>

      {/* Stat cards — compact & clickable */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, href, cta }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-px hover:border-foreground/20"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            {loading ? (
              <Skeleton className="mt-3 h-9 w-16" />
            ) : (
              <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
            )}
            <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              {cta}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </p>
          </Link>
        ))}
      </div>

      {/* Two-column: category breakdown + recent messages */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        {/* Themes by category */}
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Themes by Category</h2>
                <p className="text-xs text-muted-foreground">
                  {stats.themes} themes across {stats.categories} categories
                </p>
              </div>
              <Link
                href="/admin/categories"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                View categories <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : breakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">No themes yet.</p>
            ) : (
              <div className="space-y-3.5">
                {breakdown.map(([cat, count]) => (
                  <div key={cat}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{cat}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
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
            <h2 className="mb-4 text-sm font-semibold">Recent Messages</h2>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : recent.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border py-8 text-center">
                <Mail className="mx-auto h-6 w-6 text-muted-foreground/60" />
                <p className="mt-2 text-sm font-medium">No new messages</p>
                <p className="text-xs text-muted-foreground">
                  New enquiries will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {recent.map((m) => (
                  <div
                    key={m._id}
                    className="flex gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-foreground/[0.03]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] text-xs font-semibold uppercase">
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {m.subject || m.message}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground/70">
                        {m.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recently added themes */}
      <Card className="mt-4">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recently Added Themes</h2>
            <Link
              href="/admin/themes"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentThemes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No themes yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentThemes.map((t) => (
                <Link
                  key={t._id}
                  href={`/admin/themes/${t._id}/edit`}
                  className="group flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                    {t.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.category}
                      {t.framework ? ` · ${t.framework}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium tabular-nums">
                    {t.pricingType === "free" ? "Free" : `$${t.price}`}
                  </span>
                  <Badge
                    variant={t.status === "published" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {t.status === "published" ? "Published" : "Draft"}
                  </Badge>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
