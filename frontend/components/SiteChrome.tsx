"use client";

import { usePathname } from "next/navigation";

/* The admin login is a restricted, self-contained environment — it must NOT
   show the public navbar or footer (see admin-login spec §33/§50). Rather than
   convert the static Footer into a client component, we gate both here around
   the page content and keep the "bare" route list in one place. */
const BARE_ROUTES = new Set(["/login"]);

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
  const bare = BARE_ROUTES.has(pathname);

  return (
    <>
      {!bare && navbar}
      {children}
      {!bare && footer}
    </>
  );
}
