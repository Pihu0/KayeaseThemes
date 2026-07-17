"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Themes" },
  { href: "/categories", label: "Categories" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Kayease<span className="text-primary">Themes</span>
        </Link>

        {/* Center nav links (desktop) */}
        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              {user.role === "admin" && (
                <Button
                  render={<Link href="/admin" />}
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="hidden sm:inline-flex"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              render={<Link href="/login" />}
              nativeButton={false}
              size="sm"
              className="hidden sm:inline-flex"
            >
              Login
            </Button>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t pt-3">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Button
                      render={<Link href="/admin" />}
                      nativeButton={false}
                      variant="outline"
                      size="sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  render={<Link href="/login" />}
                  nativeButton={false}
                  size="sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
