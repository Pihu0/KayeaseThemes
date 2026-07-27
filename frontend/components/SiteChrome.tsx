"use client";

import { usePathname } from "next/navigation";
import CustomDesignCTA from "@/components/home/CustomDesignCTA";

/* The admin login and the admin panel are restricted, self-contained
   environments — they must NOT show the public navbar or footer (see
   admin-login spec §33/§50). The admin panel renders its own sidebar + topbar,
   so the public chrome would collide with it. Rather than convert the static
   Footer into a client component, we gate both here around the page content and
   keep the "bare" route list in one place. */
const BARE_ROUTES = new Set(["/login"]);

/* Route prefixes that are also bare (covers nested routes like
   /admin/themes/new, /admin/categories, etc.). */
const BARE_PREFIXES = ["/admin"];

export default function SiteChrome({
  navbar,
  footer,
  children,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare =
    BARE_ROUTES.has(pathname) ||
    BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const showCTA = !bare && pathname !== "/customdesign";

  return (
    <>
      {!bare && navbar}
      {children}
      {showCTA && <CustomDesignCTA />}
      {!bare && footer}
    </>
  );
}
