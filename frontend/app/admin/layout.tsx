"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";

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

  return <AdminShell>{children}</AdminShell>;
}
