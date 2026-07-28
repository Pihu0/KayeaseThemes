"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { EASE, EASE_SOFT, useIsDesktop } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel } from "@/components/home/editorial";
import type { Theme } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════════════════
   04 — DESIGN DETAILS
   An immersive, scroll-driven showcase replacing the four-card Bento.
   Four chapters flow as one continuous narrative (theme-adaptive for
   both Light Mode and Dark Mode):

     01 RESPONSIVE  — pinned device morph with live iframe of blushora

   Desktop: the responsive chapter pins for ~2.4 viewport-heights; every
   other chapter uses normal scroll + useInView triggers.
   Mobile/tablet: tab-based device switching, tap-driven demos, no pinning.
   ═══════════════════════════════════════════════════════════════════════ */

// ── constants ──────────────────────────────────────────────────────

const DEVICES = {
  desktop: { label: "Desktop", w: 1440, h: 900, ar: 1440 / 900 },
  tablet: { label: "Tablet", w: 768, h: 1024, ar: 768 / 1024 },
  mobile: { label: "Mobile", w: 390, h: 844, ar: 390 / 844 },
} as const;

type DeviceMode = keyof typeof DEVICES;
const DEVICE_KEYS: DeviceMode[] = ["desktop", "tablet", "mobile"];


/* Scroll-progress breakpoints for the responsive morph. */
const P = {
  deskEnd: 0.15,
  tabStart: 0.15,
  tabReady: 0.42,
  tabEnd: 0.55,
  mobStart: 0.55,
  mobReady: 0.82,
};

// ── main export ────────────────────────────────────────────────────

export default function DetailsShowcase({ themes }: { themes: Theme[] }) {
  const responsiveTheme = themes[2] ?? themes[0];
  if (!responsiveTheme) return null;

  return (
    <section
      aria-label="Design details"
      className="bg-(--ed-surface) text-(--ed-ink) transition-colors duration-300 dark:bg-(--ed-dark) dark:text-(--ed-ink-on-dark)"
    >
      <ChapterResponsive theme={responsiveTheme} allThemes={themes} />
    </section>
  );
}

// ── chapter 01 — responsive ────────────────────────────────────────

function ChapterResponsive({ allThemes = [] }: { theme: Theme; allThemes?: Theme[] }) {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const morphEnabled = desktop && !reduced;

  const runwayRef = useRef<HTMLDivElement>(null);
  const [activeDevice, setActiveDevice] = useState<DeviceMode>("desktop");
  const [isInteractive, setIsInteractive] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const demoUrl = "https://blushora.kayease.com/";

  /* ---- scroll morph (desktop + pointer only) ---- */
  const { scrollYProgress: p } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  // frame geometry — interpolated per-frame by motion/react
  const widthPct = useTransform(
    p,
    [0, P.deskEnd, P.tabReady, P.tabEnd, P.mobReady, 1],
    [82, 82, 42, 42, 24, 24],
  );
  const widthStr = useMotionTemplate`${widthPct}%`;

  const maxW = useTransform(
    p,
    [0, P.deskEnd, P.tabReady, P.tabEnd, P.mobReady, 1],
    [1100, 1100, 500, 500, 320, 320],
  );

  const ar = useTransform(
    p,
    [0, P.deskEnd, P.tabReady, P.tabEnd, P.mobReady, 1],
    [
      DEVICES.desktop.ar,
      DEVICES.desktop.ar,
      DEVICES.tablet.ar,
      DEVICES.tablet.ar,
      DEVICES.mobile.ar,
      DEVICES.mobile.ar,
    ],
  );

  const br = useTransform(
    p,
    [0, P.deskEnd, P.tabReady, P.tabEnd, P.mobReady, 1],
    [12, 12, 18, 18, 26, 26],
  );

  // sync active tab from scroll progress
  useEffect(() => {
    if (!morphEnabled) return;
    return p.on("change", (v) => {
      if (v < (P.deskEnd + P.tabReady) / 2) setActiveDevice("desktop");
      else if (v < (P.tabEnd + P.mobReady) / 2) setActiveDevice("tablet");
      else setActiveDevice("mobile");
    });
  }, [morphEnabled, p]);

  // clicking a tab scrolls the runway to the right progress
  const handleTab = useCallback(
    (device: DeviceMode) => {
      if (morphEnabled && runwayRef.current) {
        const rect = runwayRef.current.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        const range = rect.height - window.innerHeight;
        const target: Record<DeviceMode, number> = {
          desktop: 0.05,
          tablet: (P.tabReady + P.tabEnd) / 2,
          mobile: (P.mobReady + 1) / 2,
        };
        window.scrollTo({ top: top + range * target[device], behavior: "smooth" });
      } else {
        setActiveDevice(device);
      }
    },
    [morphEnabled],
  );

  // Find Blushora theme object if present, otherwise fallback to clean loader
  const blushoraTheme = allThemes.find(
    (t) =>
      t.demoUrl?.includes("blushora") ||
      t.slug?.includes("blushora") ||
      t.title?.toLowerCase().includes("blushora")
  );
  const fallbackImage = blushoraTheme?.image;

  return (
    <div className="ed-px mx-auto max-w-[1760px] pb-12">
      <ChapterHeader
        index="01"
        label="Responsive"
        lines={["One design.", "Every screen."]}
        description="Live preview of Blushora — reflowing seamlessly across all breakpoints."
      />

      {/* ---- morph runway (desktop) / static stage (mobile) ---- */}
      <div
        ref={runwayRef}
        className={morphEnabled ? "relative mt-8" : "mt-8"}
        style={morphEnabled ? { height: "340vh" } : undefined}
      >
        <div
          className={
            "flex flex-col items-center gap-4 " +
            (morphEnabled
              ? "sticky top-0 h-screen justify-center pt-16 pb-4"
              : "py-8")
          }
        >
          {/* header controls & switcher */}
          <div className="flex items-center gap-6">
            <DeviceSwitcher active={activeDevice} onChange={handleTab} />
            <button
              onClick={() => setIsInteractive((prev) => !prev)}
              className={
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] transition-all duration-300 " +
                (isInteractive
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40"
                  : "bg-black/5 dark:bg-white/5 text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark) border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25")
              }
              title={
                isInteractive
                  ? "Click to enable page scroll morph"
                  : "Click to scroll and interact inside live site"
              }
            >
              <span
                className={
                  "size-1.5 rounded-full " +
                  (isInteractive ? "bg-emerald-500 animate-pulse" : "bg-black/40 dark:bg-white/40")
                }
              />
              {isInteractive ? "Live Interactive" : "Click to Interact"}
            </button>
          </div>

          {/* ── device frame ── */}
          {morphEnabled ? (
            /* scroll-driven morph with live iframe */
            <motion.div
              className="relative mx-auto overflow-hidden border border-black/10 dark:border-white/12 bg-white dark:bg-black shadow-xl dark:shadow-2xl transition-all duration-300"
              style={{ width: widthStr, maxWidth: maxW, aspectRatio: ar, borderRadius: br }}
            >
              {/* browser address bar */}
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-[#F7F5F0] dark:bg-[#35332C]/90 px-3.5 py-2 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <span className="block size-2 rounded-full bg-[#FF5F56]/80" />
                  <span className="block size-2 rounded-full bg-[#FFBD2E]/80" />
                  <span className="block size-2 rounded-full bg-[#27C93F]/80" />
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-black/5 dark:bg-white/5 px-3 py-0.5 text-[11px] font-mono text-black/70 dark:text-white/70 border border-black/5 dark:border-white/5 truncate max-w-[240px] sm:max-w-[360px]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className="truncate">blushora.kayease.com</span>
                </div>
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                  title="Open live site in new tab"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>

              {/* live iframe container */}
              <div className="relative h-[calc(100%-33px)] w-full overflow-hidden bg-white dark:bg-[#111111]">
                {/* clean loading state — only shows Blushora screenshot if present, or clean spinner */}
                {!iframeLoaded && (
                  <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-(--secondary) dark:bg-[#242320]">
                    {fallbackImage ? (
                      <Image
                        src={fallbackImage}
                        alt="Blushora template loading"
                        fill
                        className="object-cover object-top opacity-80"
                        priority
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-neutral-400 dark:text-neutral-500">
                        <div className="size-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        <span className="text-[10px] font-mono uppercase tracking-widest">
                          Loading blushora.kayease.com
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* live interactive iframe */}
                <iframe
                  src={demoUrl}
                  title="Blushora Live Responsive View"
                  onLoad={() => setIframeLoaded(true)}
                  className={
                    "relative z-10 h-full w-full border-0 bg-white transition-opacity duration-500 " +
                    (isInteractive ? "pointer-events-auto" : "pointer-events-none")
                  }
                  style={{ opacity: iframeLoaded ? 1 : 0 }}
                />

                {/* hover helper overlay when not in interactive mode */}
                {!isInteractive && (
                  <div
                    onClick={() => setIsInteractive(true)}
                    className="absolute inset-0 z-20 flex cursor-pointer items-end justify-center bg-gradient-to-t from-black/30 via-transparent to-transparent p-4 opacity-0 transition-opacity hover:opacity-100"
                  >
                    <span className="rounded-full bg-black/80 px-4 py-1.5 text-xs font-medium text-white border border-white/20 shadow-lg backdrop-blur-sm">
                      Click frame to interact with live site ↗
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* tab-driven (mobile / tablet / reduced motion) */
            <div
              className="relative flex items-center justify-center w-full"
              style={{ minHeight: "45vh" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDevice}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="relative overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-xl dark:shadow-2xl"
                  style={{
                    width:
                      activeDevice === "desktop"
                        ? "100%"
                        : activeDevice === "tablet"
                          ? "72%"
                          : "52%",
                    maxWidth:
                      activeDevice === "desktop"
                        ? 600
                        : activeDevice === "tablet"
                          ? 420
                          : 280,
                    aspectRatio: DEVICES[activeDevice].ar,
                    borderRadius:
                      activeDevice === "desktop"
                        ? 12
                        : activeDevice === "tablet"
                          ? 16
                          : 22,
                  }}
                >
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-[#F7F5F0] dark:bg-[#35332C] px-3 py-1.5">
                    <div className="flex items-center gap-1">
                      <span className="block size-1.5 rounded-full bg-[#FF5F56]" />
                      <span className="block size-1.5 rounded-full bg-[#FFBD2E]" />
                      <span className="block size-1.5 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="text-[10px] font-mono text-black/60 dark:text-white/60">blushora.kayease.com</span>
                  </div>
                  <div className="h-[calc(100%-25px)] w-full">
                    <iframe
                      src={demoUrl}
                      title="Blushora Live View"
                      className="h-full w-full border-0 bg-white"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* dimension label */}
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDevice}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="flex items-center justify-center gap-3 text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)"
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.05em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <span className="uppercase tracking-[0.15em]">
                  {DEVICES[activeDevice].label}
                </span>
                <span className="opacity-30">·</span>
                <span>
                  {DEVICES[activeDevice].w} × {DEVICES[activeDevice].h}
                </span>
                <span className="opacity-30">·</span>
                <span className="text-emerald-600 dark:text-emerald-400">Live View</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── helpers ────────────────────────────────────────────────────────

/** Shared chapter heading: index label, headline and supporting copy. */
function ChapterHeader({
  index,
  label,
  lines,
  description,
}: {
  index: string;
  label: string;
  lines: string[];
  description: string;
}) {
  return (
    <div className="mb-4">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="ed-label text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)"
      >
        {index} / {label}
      </motion.p>
      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <MaskedLines
          as="h3"
          lines={lines}
          className="ed-display text-[clamp(2rem,4.5vw,5rem)]"
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mb-1 max-w-xs text-[15px] leading-relaxed text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)"
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
}

/** Desktop / Tablet / Mobile tab bar with sliding underline indicator. */
function DeviceSwitcher({
  active,
  onChange,
}: {
  active: DeviceMode;
  onChange: (d: DeviceMode) => void;
}) {
  return (
    <div role="tablist" className="flex items-center gap-6 sm:gap-8">
      {DEVICE_KEYS.map((key) => (
        <button
          key={key}
          role="tab"
          aria-selected={active === key}
          onClick={() => onChange(key)}
          className={
            "relative pb-2 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-300 " +
            (active === key
              ? "text-(--ed-ink) dark:text-(--ed-ink-on-dark)"
              : "text-(--ed-ink-2)/50 hover:text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)/50 dark:hover:text-(--ed-ink-2-on-dark)")
          }
        >
          {DEVICES[key].label}
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-px bg-(--ed-ink) dark:bg-(--ed-ink-on-dark)"
            initial={false}
            animate={{
              scaleX: active === key ? 1 : 0,
              opacity: active === key ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </button>
      ))}
    </div>
  );
}
