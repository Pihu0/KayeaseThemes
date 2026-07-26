import Link from "next/link";

/* 10 — SITE FOOTER
   Black-background footer: an animated dotted top border, a four-column nav
   grid led by a large heading, an oversized KAYEASE wordmark, and a legal
   line. Fixed palette (not theme tokens) — it's brand art direction on every
   page, in both colour schemes. All styles live in the scoped block below. */

// internal routes use next/link; external (github / mailto) stay plain <a>
const NAV_EXPLORE = [
  { href: "/themes", label: "Themes" },
  { href: "/contact", label: "Custom Design" },
  { href: "/contact", label: "Contact" },
];

const NAV_COMPANY = [
  { href: "/login", label: "Log in" },
  { href: "/register", label: "Sign up" },
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
          <h2>Premium themes, crafted to make a first impression.</h2>

          <nav className="site-footer__nav" aria-label="Footer navigation">
            {NAV_EXPLORE.map((l) => (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>

          <nav className="site-footer__nav" aria-label="Company links">
            {NAV_COMPANY.map((l) => (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>

          <nav className="site-footer__nav" aria-label="Connect">
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

        <div className="site-footer__brand-row">
          <Link className="site-footer__brand" href="/" aria-label="Kayease home">
            <span className="site-footer__mark" aria-hidden="true" />
            {/* SVG wordmark auto-scales to fill the row — never overflows or
               clips, whatever the viewport. textLength pins the glyphs to the
               viewBox width; max-height caps how large it grows on desktop. */}
            <svg
              className="site-footer__wordmark"
              viewBox="0 0 1000 190"
              preserveAspectRatio="xMinYMid meet"
              aria-hidden="true"
            >
              <text x="0" y="145" textLength="1000" lengthAdjust="spacingAndGlyphs">
                Kayease
              </text>
            </svg>
          </Link>
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
  --ft-bg: #f5f4f0;
  --ft-ink: #111111;
  --ft-nav: rgb(17 17 17 / 0.82);
  --ft-legal: rgb(17 17 17 / 0.5);
  --ft-mark: #111111;      /* the circle */
  --ft-mark-cut: #f5f4f0;  /* zig-zag stripes = page bg */
  --ft-dot: 17 17 17;      /* rgb triple for the drifting dots */
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
  --ft-bg: #000000;
  --ft-ink: #ffffff;
  --ft-nav: rgb(255 255 255 / 0.88);
  --ft-legal: rgb(255 255 255 / 0.52);
  --ft-mark: #ffffff;
  --ft-mark-cut: #000000;
  --ft-dot: 255 255 255;
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
  font-size: clamp(34px, 3.5vw, 62px);
  font-weight: 220;
  letter-spacing: 0;
  line-height: 1.06;
}

.site-footer__nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(14px, 1.35vw, 22px);
}

.site-footer__nav a {
  color: var(--ft-nav);
  font-size: 16px;
  font-weight: 650;
  line-height: 1.1;
  transition: color 180ms ease, transform 180ms ease;
}

.site-footer__nav a:hover {
  color: var(--ft-ink);
  transform: translateX(3px);
}

/* --- brand row --- */
.site-footer__brand-row {
  width: 100%;
  margin-top: clamp(18px, 3vw, 46px);
}

.site-footer__brand {
  display: flex;
  align-items: center;
  width: 100%;
  color: var(--ft-ink);
}

.site-footer__mark {
  position: relative;
  flex: 0 0 clamp(58px, 6.1vw, 118px);
  aspect-ratio: 1;
  margin-right: clamp(14px, 1.6vw, 28px);
  overflow: hidden;
  border-radius: 50%;
  background: var(--ft-mark);
}

.site-footer__mark::before {
  content: "";
  position: absolute;
  inset: -18%;
  background: var(--ft-mark-cut);
  clip-path: polygon(
    0 20%, 100% 8%, 100% 19%, 0 31%,
    0 43%, 100% 31%, 100% 42%, 0 54%,
    0 66%, 100% 54%, 100% 65%, 0 77%
  );
}

.site-footer__wordmark {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  height: auto;
  /* fills the row width on smaller screens; caps its height on desktop so
     the wordmark stays large but never absurd. No clip on any device. */
  max-height: clamp(56px, 22vw, 214px);
  overflow: visible;
}

.site-footer__wordmark text {
  fill: var(--ft-ink);
  font-family: "Geist", "Inter", ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 760;
  font-size: 150px;
}

/* --- legal line --- */
.site-footer__legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px 18px;
  margin-top: clamp(14px, 1.4vw, 24px);
  color: var(--ft-legal);
  font-size: 9px;
  line-height: 1.35;
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
  .site-footer__mark {
    flex-basis: clamp(38px, 12vw, 58px);
  }
  .site-footer__wordmark {
    /* fills the single-column row width; keeps it from getting too tall */
    max-height: clamp(44px, 20vw, 96px);
  }
}
`;
