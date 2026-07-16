"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Kayease<span className="text-primary">Themes</span>
        </Link>

        {/* Center nav links (hidden on mobile) */}
        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/" className="transition-colors hover:text-foreground">
            Themes
          </Link>
          <Link
            href="/categories"
            className="transition-colors hover:text-foreground"
          >
            Categories
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </div>

        {/* Auth actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === "admin" && (
                <Button
                  render={<Link href="/admin" />}
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                >
                  Admin
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button render={<Link href="/login" />} nativeButton={false} size="sm">
              Login
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
