"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/themes", label: "Themes" },
  { href: "/admin/categories", label: "Categories" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // Remember whether this session was ever authorized, so we can tell an
  // expired session apart from a plain "not logged in" visit.
  const wasAuthed = useRef(false);

  // Central auth guard for the whole /admin section
  useEffect(() => {
    if (loading) return;
    if (user && user.role === "admin") {
      wasAuthed.current = true;
      return;
    }
    const params = new URLSearchParams({ redirect: pathname });
    if (wasAuthed.current) params.set("reason", "session");
    router.replace(`/login?${params.toString()}`);
  }, [loading, user, router, pathname]);

  if (loading || !user || user.role !== "admin") {
    return (
      <main className="mx-auto max-w-6xl px-4 py-20 text-center text-muted-foreground">
        Checking access…
      </main>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 flex gap-1 border-b">
        {tabs.map((t) => {
          // Dashboard matches exactly; section tabs also match their nested
          // routes (e.g. /admin/themes/new highlights "Themes").
          const active =
            t.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
