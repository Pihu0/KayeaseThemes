import Link from "next/link";
import { Mail } from "lucide-react";
import FooterWordmark from "@/components/FooterWordmark";

/* 10 — EDITORIAL FOOTER
   Dark chapter that continues the Final CTA. Fixed palette (not theme
   tokens) because it is part of the brand's art direction on every page,
   in both colour schemes. Ends on the enormous KAYEASE wordmark. */

// GitHub isn't in this lucide version (brand icons removed) — inline SVG.
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.2 11.16.6.1.82-.25.82-.56v-2c-3.34.72-4.04-1.57-4.04-1.57-.55-1.36-1.33-1.72-1.33-1.72-1.09-.72.08-.71.08-.71 1.2.08 1.83 1.2 1.83 1.2 1.07 1.8 2.8 1.28 3.49.98.1-.76.42-1.28.76-1.57-2.67-.3-5.47-1.3-5.47-5.78 0-1.28.47-2.33 1.24-3.15-.13-.3-.54-1.5.11-3.14 0 0 1-.31 3.3 1.2a11.6 11.6 0 016 0c2.28-1.51 3.29-1.2 3.29-1.2.65 1.64.24 2.84.12 3.14.77.82 1.23 1.87 1.23 3.15 0 4.49-2.8 5.47-5.48 5.76.43.36.81 1.09.81 2.2v3.26c0 .31.22.67.83.56A12.02 12.02 0 0024 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}

const columns: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { href: "/themes", label: "Themes" },
      { href: "/categories", label: "Categories" },
      { href: "/contact", label: "Custom design" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Sign up" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

const linkClass =
  "text-sm text-[#98978f] transition-colors duration-300 hover:text-[#f4f4f0]";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#101010] text-[#f4f4f0]">
      <div className="mx-auto max-w-[1760px] px-[clamp(1.5rem,4vw,4.5rem)] pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-2">
          {/* Brand statement */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em]">
              Kayease<span className="align-super text-[0.6em]">®</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#98978f]">
              Digital experiences for modern brands. Premium, production-ready
              website themes for every kind of project.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href="https://github.com/Pihu0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#98978f] transition-colors duration-300 hover:border-white/40 hover:text-[#f4f4f0]"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:team@kayease.com"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#98978f] transition-colors duration-300 hover:border-white/40 hover:text-[#f4f4f0]"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#98978f]">
                  {col.heading}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={`${col.heading}-${l.label}`}>
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div className="flex flex-col items-start justify-between gap-3 py-8 text-xs uppercase tracking-[0.18em] text-[#98978f] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Kayease® — Digital experiences for modern brands</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="transition-colors duration-300 hover:text-[#f4f4f0]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors duration-300 hover:text-[#f4f4f0]">
              Terms
            </Link>
          </div>
        </div>

        {/* The wordmark almost touches the viewport edges */}
        <div className="pb-6">
          <FooterWordmark />
        </div>
      </div>
    </footer>
  );
}
