"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  FolderTree,
  ExternalLink,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Only routes that actually exist get a nav entry — no fake pages.
const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/themes", label: "Themes", icon: Palette },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

// Human-friendly title for the current route, shown in the topbar.
function pageTitle(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/themes/new") return "Add Theme";
  if (/^\/admin\/themes\/[^/]+\/edit$/.test(pathname)) return "Edit Theme";
  if (pathname.startsWith("/admin/themes")) return "Themes";
  if (pathname.startsWith("/admin/categories")) return "Categories";
  return "Admin";
}

/* ---------------------------------------------------------------- */

function NavItem({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: (typeof nav)[number];
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-foreground/[0.07] text-foreground"
          : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
      )}
    >
      {/* left accent indicator on the active item */}
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
      )}
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarBody({
  collapsed,
  onNavigate,
  user,
  onLogout,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  user: { name?: string } | null;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const initials = (user?.name || "A").slice(0, 2).toUpperCase();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 items-center gap-2.5 border-b border-border px-5",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
          K
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">KAYEASE</p>
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Admin
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Main
          </p>
        )}
        {nav.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Footer / profile */}
      <div className="border-t border-border p-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/[0.07] text-xs font-semibold">
              {initials}
            </div>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    sweep
                    onClick={onLogout}
                    aria-label="Log out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] text-xs font-semibold">
              {initials}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium">
                {user?.name || "Admin"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Administrator
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    sweep
                    onClick={onLogout}
                    aria-label="Log out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent>Log out</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Restore the collapse preference set on a previous visit.
  useEffect(() => {
    setCollapsed(localStorage.getItem("admin-sidebar-collapsed") === "1");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  };

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const initials = (user?.name || "A").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden shrink-0 border-r border-border bg-sidebar transition-[width] duration-200 lg:block",
          collapsed ? "w-[72px]" : "w-[248px]"
        )}
      >
        <SidebarBody
          collapsed={collapsed}
          user={user}
          onLogout={logout}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-border bg-sidebar">
            <Button
              variant="ghost"
              size="icon-sm"
              sweep
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4"
            >
              <X className="h-4 w-4" />
            </Button>
            <SidebarBody
              collapsed={false}
              user={user}
              onLogout={logout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200",
          collapsed ? "lg:pl-[72px]" : "lg:pl-[248px]"
        )}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            sweep
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            sweep
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:inline-flex"
          >
            {collapsed ? (
              <PanelLeft className="h-[18px] w-[18px]" />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px]" />
            )}
          </Button>

          <h1 className="text-sm font-semibold tracking-tight">
            {pageTitle(pathname)}
          </h1>

          <div className="ml-auto flex items-center gap-2">
            <Button
              render={<Link href="/" target="_blank" />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">View Site</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    className="flex items-center gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-foreground/[0.06]"
                    aria-label="Account menu"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/[0.07] text-xs font-semibold">
                      {initials}
                    </span>
                    <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="leading-tight">
                    <p className="text-sm font-medium text-foreground">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Administrator
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<Link href="/" target="_blank" />}
                >
                  <ExternalLink className="h-4 w-4" /> View Website
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logout}>
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
