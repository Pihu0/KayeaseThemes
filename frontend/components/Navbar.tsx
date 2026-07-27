"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import HeaderSearch from "@/components/HeaderSearch";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/themes", label: "Themes" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);

  useEffect(() => {
    if (pathname !== "/themes") {
      setHiddenByScroll(false);
      return;
    }

    const handleScroll = () => {
      const discoveryBar = document.querySelector("nav[aria-label='Browse by category']")?.parentElement;
      if (discoveryBar) {
        const rect = discoveryBar.getBoundingClientRect();
        // Hide navbar only when the discovery bar is stuck at the top (rect.top <= 70)
        // and has not yet scrolled off the top of the screen (rect.bottom > 0)
        if (rect.top <= 70 && rect.bottom > 0) {
          setHiddenByScroll(true);
        } else {
          setHiddenByScroll(false);
        }
      } else {
        setHiddenByScroll(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    const t = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(t);
    };
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{
        y: hiddenByScroll ? -100 : 0,
        opacity: hiddenByScroll ? 0 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-3 z-50 px-4 pointer-events-none"
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-4xl items-center justify-between pointer-events-auto",
          "rounded-full border border-border/60 bg-background/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md",
          "px-4 py-2 transition-all duration-300 ease-out"
        )}
      >
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 pl-2">
          <Logo imgClassName="h-8" />
        </div>

        {/* Center: Navigation Pill Container */}
        <div className="hidden items-center rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-border/20 p-0.5 md:flex gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              target="_self"
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300",
                isActive(l.href)
                  ? "bg-white dark:bg-white/[0.08] text-(--primary) shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right: Controls & CTA button */}
        <div className="flex items-center gap-2 pr-1">
          <HeaderSearch />
          <ThemeToggle />

          {/* Admin link (if applicable) */}
          {user && user.role === "admin" && (
            <Link
              href="/admin"
              target="_self"
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                pathname.startsWith("/admin")
                  ? "text-(--primary)"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Admin
            </Link>
          )}

          {/* Login/Logout link */}
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <button
                onClick={logout}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                target="_self"
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                  pathname === "/login"
                    ? "text-(--primary)"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Login
              </Link>
            )}
          </div>

          {/* Primary Action Button */}
          <Link
            href="/customdesign"
            target="_self"
            className={cn(
              "group items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-300 hidden md:inline-flex",
              "bg-(--primary) text-white hover:bg-(--primary)/90 hover:shadow-md active:scale-95"
            )}
          >
            <span>Custom Design</span>
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>



          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden rounded-full ml-1"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="mx-auto mt-2 w-full max-w-4xl rounded-3xl border border-border/60 bg-background/90 shadow-lg backdrop-blur-xl md:hidden pointer-events-auto">
          <div className="flex flex-col gap-1 px-5 py-4">
            {[...navLinks, { href: "/customdesign", label: "Custom Design" }, { href: "/login", label: "Login" }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                target="_self"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                  isActive(l.href)
                    ? "bg-black/[0.03] dark:bg-white/[0.05] text-(--primary)"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <div className="mt-2 flex items-center justify-between border-t pt-4 px-4">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    AdminPanel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.header>
  );
}
