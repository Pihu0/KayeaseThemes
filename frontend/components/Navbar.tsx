"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import HeaderSearch from "@/components/HeaderSearch";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/themes", label: "Themes" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Transparent over the hero → floating blurred surface once scrolling starts
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const isActive = (href: string) => pathname.startsWith(href);
  const linkClass = (href: string) =>
    cn(
      "text-[12px] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
      isActive(href)
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    );

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1760px] items-center justify-between transition-all duration-400 ease-out",
          "px-[clamp(1rem,4vw,4.5rem)]",
          scrolled || menuOpen ? "h-14" : "h-18"
        )}
      >
        {/* Floating translucent surface — appears only after scroll */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 border-b transition-all duration-400",
            scrolled || menuOpen
              ? "border-border/60 bg-background/75 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          )}
        />

        <div className="relative flex items-center gap-10">
          <Logo imgClassName="h-9" />
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2 sm:gap-3">
          <HeaderSearch />
          <ThemeToggle />

          {/* Quiet account links — deliberately less prominent than Contact */}
          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link href="/admin" className={linkClass("/admin")}>
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-[12px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>
            )}
          </div>

          <Link
            href="/contact"
            className="group hidden items-center gap-1 text-[12px] font-medium uppercase tracking-[0.18em] text-foreground md:inline-flex"
          >
            <span className="ed-underline">Custom Design</span>
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="relative border-b bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {[...navLinks, { href: "/contact", label: "Custom Design" }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "py-2.5 text-sm font-medium uppercase tracking-[0.14em] transition-colors",
                  isActive(l.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-5 border-t pt-4">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
