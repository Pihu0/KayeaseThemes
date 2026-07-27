import Link from "next/link";
import Logo from "@/components/Logo";

/* 10 — SITE FOOTER
   Black-background footer: an animated dotted top border, a four-column nav
   grid led by a large heading, an oversized KAYEASE wordmark, and a legal
   line. Fixed palette (not theme tokens) — it's brand art direction on every
   page, in both colour schemes. All styles live in the scoped block below. */

// internal routes use next/link; external (github / mailto) stay plain <a>
const NAV_EXPLORE = [
  { href: "/themes", label: "Themes" },
  { href: "/customdesign", label: "Custom Design" },
  { href: "/customdesign", label: "Contact" },
];

const NAV_COMPANY = [
  { href: "/login", label: "Log in" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

const NAV_CONNECT = [
  { href: "mailto:team@kayease.com", label: "team@kayease.com" },
  { href: "https://github.com/Pihu0", label: "GitHub", external: true },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="footer-dots" aria-hidden="true">
        <div className="footer-dots__line" />
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand-column">
            <Logo imgClassName="h-20" />
            <h2>Premium themes, crafted to make a first impression.</h2>
          </div>

          <nav className="site-footer__nav" aria-label="Footer navigation">
            <span className="site-footer__nav-title">Explore</span>
            {NAV_EXPLORE.map((l) => (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>

          <nav className="site-footer__nav" aria-label="Company links">
            <span className="site-footer__nav-title">Company</span>
            {NAV_COMPANY.map((l) => (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>

          <nav className="site-footer__nav" aria-label="Connect">
            <span className="site-footer__nav-title">Connect</span>
            {NAV_CONNECT.map((l) =>
              l.external ? (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ) : (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              )
            )}
          </nav>
        </div>

        <div className="site-footer__legal">
          <p>© 2026 Kayease. All rights reserved.</p>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}

const css = `
.site-footer {
  --hero-max-width: 1820px;
  /* light-mode palette (default) — flips to black under .dark below */
  --ft-bg: #F8FAFC;
  --ft-ink: #0F172A;
  --ft-nav: rgba(15, 23, 42, 0.82);
  --ft-legal: rgba(15, 23, 42, 0.5);
  --ft-mark: #2563eb;      /* brand blue circle */
  --ft-mark-cut: #F8FAFC;  /* cream zig-zag stripes */
  --ft-dot: 15 23 42;      /* rgb triple for drifting dots */
  position: relative;
  /* stay below the sticky navbar (z-50) so the footer never paints over it
     as it scrolls up underneath */
  z-index: 1;
  /* clip horizontally only (dots strip is 200% wide, wordmark is nowrap) —
     keeping the y-axis visible so the oversized wordmark isn't cut off */
  overflow-x: clip;
  background: var(--ft-bg);
  color: var(--ft-ink);
  font-family: "Geist", "Inter", ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

/* next-themes toggles .dark on <html> — restore the black art direction */
.dark .site-footer {
  --ft-bg: #23221E;
  --ft-ink: #F8FAFC;
  --ft-nav: rgba(248, 250, 252, 0.88);
  --ft-legal: rgba(248, 250, 252, 0.52);
  --ft-mark: #2563eb;
  --ft-mark-cut: #23221E;
  --ft-dot: 248 250 252;
}

.site-footer a {
  color: inherit;
  text-decoration: none;
}

/* --- animated dots strip --- */
.footer-dots {
  position: relative;
  height: 120px;
  overflow: hidden;
  background: var(--ft-bg);
}

.footer-dots__line {
  position: absolute;
  left: 0;
  top: 50%;
  width: 200%;
  height: 70px;
  opacity: 0.75;
  transform: translateY(-50%);
  background-image:
    radial-gradient(circle, rgb(var(--ft-dot) / 0.55) 1.5px, transparent 2px),
    radial-gradient(circle, rgb(var(--ft-dot) / 0.35) 1px, transparent 1.5px),
    radial-gradient(circle, rgb(var(--ft-dot) / 0.45) 1.2px, transparent 1.8px);
  background-position: 0 8px, 24px 22px, 48px 14px;
  background-size: 72px 38px, 110px 44px, 160px 52px;
  animation: footerDotsMove 18s linear infinite;
}

@keyframes footerDotsMove {
  from { transform: translate3d(0, -50%, 0); }
  to   { transform: translate3d(-50%, -50%, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .footer-dots__line { animation: none; }
}

/* --- inner container --- */
.site-footer__inner {
  width: min(100% - 96px, var(--hero-max-width));
  margin: 0 auto;
  padding: clamp(34px, 4vw, 66px) 0 clamp(18px, 2vw, 34px);
}

/* --- top grid --- */
.site-footer__top {
  display: grid;
  grid-template-columns: minmax(320px, 1.25fr) repeat(3, minmax(150px, 0.42fr));
  gap: clamp(28px, 4vw, 76px);
  min-height: clamp(160px, 15vw, 240px);
}

.site-footer__top h2 {
  max-width: 680px;
  margin: 0;
  color: var(--ft-ink);
  font-family: var(--font-heading), sans-serif;
  font-size: clamp(26px, 2.5vw, 38px);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.06;
}

.site-footer__nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(10px, 1vw, 16px);
}

.site-footer__nav-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--primary);
  margin-bottom: clamp(6px, 0.8vw, 12px);
}

.site-footer__nav a {
  color: var(--ft-nav);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  transition: color 180ms ease, transform 180ms ease;
}

.site-footer__nav a:hover {
  color: var(--ft-ink);
  transform: translateX(3px);
}

/* --- brand column --- */
.site-footer__brand-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}



/* --- legal line --- */
.site-footer__legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px 24px;
  border-top: 1px dashed var(--border);
  padding-top: 20px;
  margin-top: clamp(20px, 3vw, 36px);
  color: var(--ft-legal);
  font-size: 12px;
  line-height: 1.5;
}

.site-footer__legal p {
  margin: 0;
}

.site-footer__legal a {
  color: inherit;
  transition: color 180ms ease;
}

.site-footer__legal a:hover {
  color: var(--ft-ink);
}

/* --- responsive --- */
@media (max-width: 980px) {
  .site-footer__inner {
    width: min(100% - 48px, var(--hero-max-width));
  }
  .site-footer__top {
    grid-template-columns: 1fr 1fr;
  }
  .site-footer__top h2 {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .site-footer__inner {
    width: min(100% - 32px, var(--hero-max-width));
  }
  .site-footer__top {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .site-footer__nav a {
    font-size: 15px;
  }
}
`;
