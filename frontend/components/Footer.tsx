import Link from "next/link";
import { LayoutGrid, Mail } from "lucide-react";

// GitHub isn't in this lucide version (brand icons removed) — inline SVG.
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.2 11.16.6.1.82-.25.82-.56v-2c-3.34.72-4.04-1.57-4.04-1.57-.55-1.36-1.33-1.72-1.33-1.72-1.09-.72.08-.71.08-.71 1.2.08 1.83 1.2 1.83 1.2 1.07 1.8 2.8 1.28 3.49.98.1-.76.42-1.28.76-1.57-2.67-.3-5.47-1.3-5.47-5.78 0-1.28.47-2.33 1.24-3.15-.13-.3-.54-1.5.11-3.14 0 0 1-.31 3.3 1.2a11.6 11.6 0 016 0c2.28-1.51 3.29-1.2 3.29-1.2.65 1.64.24 2.84.12 3.14.77.82 1.23 1.87 1.23 3.15 0 4.49-2.8 5.47-5.48 5.76.43.36.81 1.09.81 2.2v3.26c0 .31.22.67.83.56A12.02 12.02 0 0024 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}

const explore = [
  { href: "/", label: "Themes" },
  { href: "/categories", label: "Categories" },
  { href: "/contact", label: "Contact" },
];

const account = [
  { href: "/login", label: "Log in" },
  { href: "/register", label: "Sign up" },
];

const socialClass =
  "flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

const linkClass = "text-muted-foreground transition-colors hover:text-foreground";

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <LayoutGrid className="h-5 w-5 text-primary" />
              Kayease<span className="text-primary">Themes</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Premium, production-ready website themes and templates for every
              kind of project.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="https://github.com/Pihu0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={socialClass}
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:team@kayease.com"
                aria-label="Email"
                className={socialClass}
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Account</h3>
            <ul className="space-y-2.5 text-sm">
              {account.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Kayease Themes. All rights reserved.</p>
          <p>Built with Next.js, Express &amp; MongoDB.</p>
        </div>
      </div>
    </footer>
  );
}
