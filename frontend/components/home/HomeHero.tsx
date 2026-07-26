"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  cubicBezier,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { EASE, useIsDesktop } from "@/lib/motion";
import Magnetic from "@/components/motion/Magnetic";
import TextRoll from "@/components/motion/TextRoll";
import { SectionLabel } from "@/components/home/editorial";
import { useProjectCursor } from "@/components/home/cursor";
import type { Theme } from "@/lib/types";
import { ArrowRight } from "lucide-react";

/* 01 — HERO  (peel-deck, inspired by the Legion/Ovo scroll interaction)

   Intro: a loader fills a progress bar, dark curtain panels wipe upward, and
   the front theme preview drops in at near-fullscreen then scales down into
   the deck as the remaining cards cascade in behind it.

   Scroll: a giant headline marquee slides horizontally behind a centred deck
   of real theme previews. Through a pinned runway the front card lifts up and
   off, peeling one at a time to reveal the next — until the base card remains
   and the hero hands over to the Selected Themes chapter. */

const EYEBROW = "Kayease® / Digital Theme Studio";
const MARQUEE = "Your Next Website Shouldn't Look Familiar";
const TAGLINE =
  "Distinctive, production-ready themes for brands that care about every detail.";

function getThemeColors(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes("sakura")) return { primary: "#fda4af", secondary: "#f43f5e", bgGlow: "rgba(244, 63, 94, 0.2)" };
  if (s.includes("hikari")) return { primary: "#fcd34d", secondary: "#d97706", bgGlow: "rgba(217, 119, 6, 0.2)" };
  if (s.includes("petique")) return { primary: "#c084fc", secondary: "#7c3aed", bgGlow: "rgba(124, 58, 237, 0.2)" };
  if (s.includes("paw") || s.includes("bowl")) return { primary: "#fcd34d", secondary: "#ea580c", bgGlow: "rgba(234, 88, 12, 0.2)" };
  if (s.includes("flux") || s.includes("data")) return { primary: "#7dd3fc", secondary: "#0284c7", bgGlow: "rgba(2, 132, 199, 0.2)" };
  if (s.includes("zentro")) return { primary: "#fdba74", secondary: "#ea580c", bgGlow: "rgba(234, 88, 12, 0.2)" };
  if (s.includes("estatin")) return { primary: "#5eead4", secondary: "#0d9488", bgGlow: "rgba(13, 148, 136, 0.2)" };
  if (s.includes("blushora")) return { primary: "#818cf8", secondary: "#312e81", bgGlow: "rgba(129, 140, 248, 0.2)" };
  if (s.includes("news")) return { primary: "#fca5a5", secondary: "#b91c1c", bgGlow: "rgba(185, 28, 28, 0.2)" };
  if (s.includes("fresh") || s.includes("cart")) return { primary: "#86efac", secondary: "#16a34a", bgGlow: "rgba(22, 163, 74, 0.2)" };
  return { primary: "#a78bfa", secondary: "#4f46e5", bgGlow: "rgba(79, 70, 229, 0.2)" };
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 1.2;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(end * (progress * (2 - progress)));
      setDisplayValue(current);
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, 1000 / 60);
    return () => clearInterval(counter);
  }, [value]);
  return <span>{displayValue}{suffix}</span>;
}

function CountUpDecimal({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const end = value;
    const duration = 1.2;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = end * (progress * (2 - progress));
      setDisplayValue(Number(current.toFixed(1)));
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, 1000 / 60);
    return () => clearInterval(counter);
  }, [value]);
  return <span>{displayValue.toFixed(1)}</span>;
}

// per-card resting tilt (front → back), so the deck reads as a hand-stacked pile
const ROT = [0, 3.5, -4, -2, 2.5];

/* Peel scroll shape. The deck first HOLDS (nothing moves) so the front card
   is readable for a beat, then each card peels across its slice. The peel is
   eased-in — the card lingers, then whips off — so it reads as "sits there,
   then vanishes" rather than sliding from the first pixel of scroll. */
const PEEL_HOLD = 0.18; // fraction of scroll before any card moves
const PEEL_END = 0.94; // last card is gone by here; base holds to the end
const EASE_IN = cubicBezier(0.6, 0, 0.85, 0.25);

// Only run the full loader+intro once per page load — client-side navigations
// back to the homepage skip straight to the settled deck.
let introPlayed = false;

export default function HomeHero({
  themes,
  total,
}: {
  themes: Theme[];
  total: number;
}) {
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const morphOn = desktop && !reduced;

  const deck = themes.filter((t): t is Theme => Boolean(t)).slice(0, 5);

  if (deck.length === 0) return null;

  return (
    <HeroRunway deck={deck} total={total} morphOn={morphOn} reduced={!!reduced} />
  );
}

/* Split out so useScroll can bind to the runway ref after the early return. */
function HeroRunway({
  deck,
  total,
  morphOn,
  reduced,
}: {
  deck: Theme[];
  total: number;
  morphOn: boolean;
  reduced: boolean;
}) {
  const runwayRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  // marquee drifts a touch faster than the page as you scroll (parallax)
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const marqueeScale = useTransform(scrollYProgress, [0, 1], [0.98, 1.04]);
  const marqueeOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.05, 0.06, 0.03, 0.015]);
  
  const L = deck.length;
  const skipIntro = reduced || introPlayed;

  /* The intro loader and the pinned peel-deck are authored assuming the hero
     starts at the very top. A browser back/refresh restores the previous
     scroll position, so if the intro replays from there the front card is
     stuck mid-zoom and overlaps the copy. Take over scroll restoration and
     snap to the top before the intro runs so it always starts from scratch. */
  useEffect(() => {
    if (skipIntro) return;
    const prev = window.history.scrollRestoration;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = prev;
      }
    };
    // run once on mount; skipIntro is stable for the life of this component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- intro state machine: loading → exiting → done ---- */
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">(
    skipIntro ? "done" : "loading"
  );
  const [pct, setPct] = useState(skipIntro ? 100 : 0);

  // drive the loader progress bar
  useEffect(() => {
    if (skipIntro) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1150);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPhase("exiting");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [skipIntro]);

  // curtains lift (~1.1s), the front card holds full-width for a beat, then
  // shrinks into the deck (~1s). Keep the loader mounted until that all clears.
  useEffect(() => {
    if (phase !== "exiting") return;
    introPlayed = true;
    const id = setTimeout(() => setPhase("done"), 2500);
    return () => clearTimeout(id);
  }, [phase]);

  // hold the page still while the intro plays
  useEffect(() => {
    if (phase === "done") return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [phase]);

  // Scale so the front card fills the FULL viewport width (height overflows and
  // crops top/bottom, like the reference) before it shrinks into the deck.
  // offsetWidth ignores the transform, so this stays correct mid-animation.
  const [introScale, setIntroScale] = useState(2.3);
  useEffect(() => {
    const measure = () => {
      const el = runwayRef.current?.querySelector<HTMLElement>(
        "[data-hero-front]"
      );
      if (!el || !el.offsetWidth) return;
      const s = (window.innerWidth * 0.985) / el.offsetWidth;
      setIntroScale(Math.min(Math.max(s, 1.3), 5));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const show = skipIntro || phase !== "loading";
  const settled = skipIntro || phase === "done";

  /* Which card is currently on top — drives the left-hand text panel. It
     swaps to the next card around the midpoint of each card's peel. */
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!morphOn) return;
    const segLen = (PEEL_END - PEEL_HOLD) / Math.max(1, L - 1);
    let a = 0;
    if (p > PEEL_HOLD) {
      const s = (p - PEEL_HOLD) / segLen;
      a = Math.floor(s) + (s - Math.floor(s) > 0.5 ? 1 : 0);
    }
    a = Math.max(0, Math.min(L - 1, a));
    setActiveIndex((prev) => (prev === a ? prev : a));
  });
  const active = deck[activeIndex] ?? deck[0];
  const colors = getThemeColors(active.slug);

  const handleRailClick = (idx: number) => {
    if (!runwayRef.current) return;
    const rect = runwayRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const runwayStart = rect.top + scrollTop;
    let targetP = 0;
    if (idx === 0) {
      targetP = 0;
    } else {
      const segLen = (PEEL_END - PEEL_HOLD) / Math.max(1, L - 1);
      targetP = PEEL_HOLD + (idx - 0.5) * segLen;
    }
    const targetScrollY = runwayStart + targetP * (L * window.innerHeight);
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth"
    });
  };

  return (
    <section
      ref={runwayRef}
      aria-label="Kayease Themes introduction"
      className="relative select-none"
      style={morphOn ? { height: `${L * 100}vh` } : undefined}
    >
      {phase !== "done" && <HeroLoader phase={phase} pct={pct} />}

      <div
        className={
          "relative flex flex-col overflow-clip " +
          (morphOn ? "sticky top-0 h-screen" : "min-h-svh py-32")
        }
      >
        {/* ---- giant headline marquee, centred behind the deck ---- */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active._id}
              initial={skipIntro ? false : { opacity: 0, scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: EASE }}
              style={
                morphOn
                  ? { x: marqueeX, scale: marqueeScale, opacity: marqueeOpacity }
                  : { opacity: 0.05 }
              }
              className="w-max will-change-[transform,opacity]"
            >
              <div className="ed-marquee-track flex w-max">
                {[0, 1].map((half) => (
                  <span
                    key={half}
                    aria-hidden={half === 1}
                    className="ed-display flex shrink-0 items-center whitespace-nowrap pr-[0.35em] text-[clamp(3.5rem,13.5vw,15rem)] leading-none text-(--ed-ink)"
                  >
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span key={i} className="pr-[0.35em]">
                        {active.title.toUpperCase()} • {active.category.toUpperCase()}
                        <span className="px-[0.25em] align-middle text-[0.5em] opacity-70">
                          ✳
                        </span>
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic theme-aware background system */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <style>{`
            @keyframes float-blob-1 {
              0% { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); }
              50% { transform: translate(-50%, -50%) translate(40px, -30px) scale(1.08); }
              100% { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); }
            }
            @keyframes float-blob-2 {
              0% { transform: translate(50%, 50%) translate(0px, 0px) scale(1); }
              50% { transform: translate(50%, 50%) translate(-40px, 30px) scale(0.92); }
              100% { transform: translate(50%, 50%) translate(0px, 0px) scale(1); }
            }
            @keyframes pulse-ripple {
              0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.7; }
              100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
            }
          `}</style>
          <div className="absolute inset-0">
            {/* Blob 1 */}
            <div
              style={{
                background: `radial-gradient(circle 400px at center, ${colors.primary}18, transparent)`,
                animation: "float-blob-1 25s infinite ease-in-out",
              }}
              className="absolute left-[35%] top-[30%] h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl will-change-transform"
            />
            {/* Blob 2 */}
            <div
              style={{
                background: `radial-gradient(circle 350px at center, ${colors.secondary}14, transparent)`,
                animation: "float-blob-2 28s infinite ease-in-out",
              }}
              className="absolute right-[35%] bottom-[30%] h-[60vh] w-[60vh] translate-x-1/2 translate-y-1/2 rounded-full opacity-60 blur-3xl will-change-transform"
            />

            {/* Splash wave ripples */}
            <div
              style={{
                border: `1.5px solid ${colors.primary}22`,
                background: `radial-gradient(circle, ${colors.primary}08 0%, transparent 65%)`,
                animation: "pulse-ripple 3.2s infinite linear",
              }}
              className="absolute left-1/2 top-1/2 h-[75vh] w-[75vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-xs will-change-transform"
            />

            {/* Floating tech design particles */}
            <FloatingParticles colors={colors} />
          </div>
        </div>

        {/* ---- left text panel (desktop): fades in once the deck settles,
             then swaps its copy to the active card as you scroll ---- */}
        {morphOn && (
          <motion.div
            initial={false}
            animate={{
              opacity: settled ? 1 : 0,
              x: settled ? 0 : -28,
            }}
            transition={{ duration: 0.9, ease: EASE, delay: skipIntro ? 0 : 0.15 }}
            style={{ pointerEvents: settled ? "auto" : "none" }}
            className="ed-px absolute inset-y-0 left-0 z-30 flex w-[48%] flex-row items-center gap-10"
          >
            {/* Vertical Progress Rail */}
            <div className="relative flex flex-col items-center justify-between h-[200px] w-4 py-2 shrink-0">
              <div className="absolute top-0 bottom-0 w-[1px] bg-(--ed-line-soft)" />
              <motion.div
                className="absolute top-0 w-[1px] bg-(--ed-ink)"
                animate={{
                  height: `${(activeIndex / Math.max(1, L - 1)) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ transformOrigin: "top" }}
              />
              {deck.map((_, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => handleRailClick(idx)}
                    className="group relative z-10 flex h-6 w-6 items-center justify-center focus:outline-none"
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <motion.div
                      animate={{
                        height: isActive ? 24 : 8,
                        backgroundColor: isActive ? "var(--ed-ink)" : "var(--ed-line)",
                      }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="w-[2px] rounded-full transition-colors group-hover:bg-(--ed-ink)"
                    />
                  </button>
                );
              })}
            </div>

            {/* Left Content Area */}
            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active._id}
                  className="mt-0"
                >
                  {/* Title with solid high-performance hardware-accelerated gradient */}
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                    className="ed-display mt-2 text-[clamp(2rem,3.4vw,3.75rem)]"
                  >
                    {active.title}
                  </motion.h2>

                  {/* Animated Tech Badges using fast CSS hover scales */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-3 flex flex-wrap gap-2"
                  >
                    {[...(active.technologies || []), "SEO Optimized"].slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        style={{
                          borderColor: "rgba(255, 255, 255, 0.1)",
                        }}
                        className="inline-flex items-center rounded-md border bg-white/5 px-2.5 py-0.5 text-xs font-medium backdrop-blur-md text-(--ed-ink-2) transition-all duration-200 hover:scale-105 hover:text-white cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </motion.div>

                  {/* Description (optimized, single block transition) */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
                    className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-(--ed-ink-2)"
                  >
                    {active.shortDescription || active.description}
                  </motion.p>

                  {/* Statistics / Metrics Block with CSS-only hover states */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5"
                  >
                    <div className="relative overflow-hidden group pb-1.5 cursor-pointer">
                      <p className="text-xl font-bold tracking-tight text-(--ed-ink)">
                        120+
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-(--ed-ink-2)">Themes Available</p>
                      <div
                        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                        style={{ backgroundColor: colors.primary }}
                      />
                    </div>
                    <div className="relative overflow-hidden group pb-1.5 cursor-pointer">
                      <p className="text-xl font-bold tracking-tight text-(--ed-ink)">
                        {active.downloads || 45}K+
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-(--ed-ink-2)">Downloads</p>
                      <div
                        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                        style={{ backgroundColor: colors.primary }}
                      />
                    </div>
                    <div className="relative overflow-hidden group pb-1.5 cursor-pointer">
                      <p className="text-xl font-bold tracking-tight text-(--ed-ink)">
                        {(active.rating || 4.9).toFixed(1)}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-(--ed-ink-2)">Avg Rating</p>
                      <div
                        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                        style={{ backgroundColor: colors.primary }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ---- the peel deck — centred during the intro, then slides right ---- */}
        <motion.div
          initial={false}
          /* Always a defined target (never undefined) so the settled offset is
             delivered as a real prop change. When the intro is skipped, `settled`
             is true from the first render and only `morphOn` flips false→true
             after mount; if this were gated to `undefined` while non-morph,
             Framer would skip applying the +21% and the deck would overlap the
             copy (seen after a browser back-nav). */
          animate={{
            x: morphOn && settled ? "21%" : "0%",
            scale: morphOn && settled ? 0.9 : 1,
          }}
          transition={{ duration: 1, ease: EASE, delay: skipIntro ? 0 : 0.15 }}
          className={
            morphOn
              ? "absolute inset-0 z-10 grid place-items-center"
              : "relative z-10 grid flex-1 place-items-center px-6"
          }
        >
          <div className="grid place-items-center">
            {deck.map((theme, i) => (
              <DeckCard
                key={theme._id}
                theme={theme}
                index={i}
                count={L}
                total={total}
                morphOn={morphOn}
                show={show}
                settled={settled}
                skipIntro={skipIntro}
                introScale={introScale}
                scrollYProgress={scrollYProgress}
                activeIndex={activeIndex}
              />
            ))}
          </div>
        </motion.div>

        {/* ---- centred copy (mobile / reduced-motion only) ---- */}
        {!morphOn && (
          <motion.div
            initial={skipIntro ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: settled ? 1 : 0, y: settled ? 0 : 18 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative z-20 mx-auto mt-12 flex flex-col items-center gap-5 text-center"
          >
            <SectionLabel>{EYEBROW}</SectionLabel>
            <p className="max-w-md text-pretty text-[13.5px] leading-relaxed text-(--ed-ink-2) sm:text-sm">
              {TAGLINE}
            </p>
            <DotButton href="/themes">Explore Themes</DotButton>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ---------- loader: progress bar + staggered curtain wipe ---------- */

function HeroLoader({
  phase,
  pct,
}: {
  phase: "loading" | "exiting" | "done";
  pct: number;
}) {
  const exiting = phase === "exiting";
  return (
    <div className="fixed inset-0 z-100 flex overflow-hidden">
      {/* curtain columns — lift upward in a staggered wave on exit */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "0%" }}
          animate={{ y: exiting ? "-101%" : "0%" }}
          transition={{
            duration: 0.75,
            ease: [0.76, 0, 0.24, 1],
            delay: exiting ? i * 0.08 : 0,
          }}
          className="h-full flex-1 bg-(--ed-dark)"
        />
      ))}

      {/* progress read-out, centred, fades out first */}
      <motion.div
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? -16 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 text-(--ed-ink-on-dark)"
      >
        <p className="ed-label text-(--ed-ink-2-on-dark)">
          Kayease® / Loading
        </p>
        <p className="ed-display text-[clamp(3rem,9vw,7rem)] tabular-nums">
          {String(pct).padStart(3, "0")}
        </p>
        <div className="relative h-px w-[min(280px,60vw)] overflow-hidden bg-(--ed-line-on-dark)">
          <motion.div
            className="absolute inset-y-0 left-0 bg-(--ed-ink-on-dark)"
            style={{ width: `${pct}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- one card in the deck ---------- */

function DeckCard({
  theme,
  index,
  count,
  total,
  morphOn,
  show,
  settled,
  skipIntro,
  introScale,
  scrollYProgress,
  activeIndex,
}: {
  theme: Theme;
  index: number;
  count: number;
  total: number;
  morphOn: boolean;
  show: boolean;
  settled: boolean;
  skipIntro: boolean;
  introScale: number;
  scrollYProgress: MotionValue<number>;
  activeIndex: number;
}) {
  const cursor = useProjectCursor("View");
  const colors = getThemeColors(theme.slug);
  const isBase = index === count - 1;
  const isFront = index === 0;

  // After the hold, each peeling card owns an equal slice of [PEEL_HOLD, PEEL_END];
  // the base never peels and holds through to the end.
  const peelCount = Math.max(1, count - 1);
  const segLen = (PEEL_END - PEEL_HOLD) / peelCount;
  const start = PEEL_HOLD + index * segLen;
  const end = start + segLen;

  const prevStart = PEEL_HOLD + (index - 1) * segLen;
  const prevEnd = prevStart + segLen;

  const prevPrevStart = PEEL_HOLD + (index - 2) * segLen;
  const prevPrevEnd = prevPrevStart + segLen;

  const y = useTransform(
    scrollYProgress,
    [start, end],
    ["0%", isBase ? "0%" : "-178%"],
    { ease: EASE_IN }
  );

  // a hair of extra rotation as it lifts, so the peel feels physical
  const liftRot = useTransform(
    scrollYProgress,
    [start, end],
    [0, isBase ? 0 : index % 2 === 0 ? -6 : 6],
    { ease: EASE_IN }
  );

  const rot = ROT[index % ROT.length];

  // --- UNCONDITIONAL REACT HOOKS AT TOP LEVEL ---
  const scaleFront = useMotionValue(1.0);
  const staticScale = useMotionValue(1.0);

  const scaleOne = useTransform(scrollYProgress, [prevStart, prevEnd], [0.92, 1.0]);
  const overlayOpacityOne = useTransform(scrollYProgress, [prevStart, prevEnd], [0.15, 0.0]);

  const scaleMulti = useTransform(
    scrollYProgress,
    [prevPrevStart, prevPrevEnd, prevStart, prevEnd],
    [0.86, 0.92, 0.92, 1.0]
  );
  const overlayOpacityMulti = useTransform(
    scrollYProgress,
    [prevPrevStart, prevPrevEnd, prevStart, prevEnd],
    [0.3, 0.15, 0.15, 0.0]
  );

  // Assign the dynamic MotionValues based on conditions
  let cardScale: MotionValue<number>;
  let cardOverlayOpacity: MotionValue<number> | number = 0;

  if (morphOn) {
    if (index === 0) {
      cardScale = scaleFront;
      cardOverlayOpacity = 0;
    } else if (index === 1) {
      cardScale = scaleOne;
      cardOverlayOpacity = overlayOpacityOne;
    } else {
      cardScale = scaleMulti;
      cardOverlayOpacity = overlayOpacityMulti;
    }
  } else {
    cardScale = staticScale;
    cardOverlayOpacity = 0;
  }

  // Peel shadow progress
  const peelProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

  // Mouse-based 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);



  // Performance optimized spotlight positioning using MotionValues (no React re-renders)
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightBg = useMotionTemplate`radial-gradient(circle 250px at ${spotlightX}px ${spotlightY}px, rgba(255, 255, 255, 0.12), transparent)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!morphOn || index !== activeIndex) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    mouseX.set((e.clientX - rect.left) / width - 0.5);
    mouseY.set((e.clientY - rect.top) / height - 0.5);
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Glass reflection sweep — pause during scroll
  const [isScrolling, setIsScrolling] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolling(false), 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const introVariants: Variants = {
    hidden: isFront
      ? { scale: introScale, opacity: 1, y: 0 }
      : { scale: 1.12, opacity: 0, y: 34 },
    shown: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: isFront ? 160 : 200,
        damping: isFront ? 24 : 20,
        delay: skipIntro ? 0 : isFront ? 1.3 : 0.4 + index * 0.12,
      },
    },
  };

  return (
    <motion.div
      style={{
        gridColumnStart: 1,
        gridRowStart: 1,
        zIndex: count - index,
        ...(morphOn ? { y } : {}),
      }}
      className="will-change-transform"
    >
      <motion.div
        variants={introVariants}
        initial={skipIntro ? "shown" : "hidden"}
        animate={show ? "shown" : "hidden"}
      >
        <motion.div
          style={{
            transformStyle: "preserve-3d",
            perspective: 1000,
          }}
          className="will-change-transform"
          animate={
            morphOn && index === activeIndex
              ? {
                  y: [0, -6, 6, 0],
                }
              : undefined
          }
          transition={{
            y: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            },
          }}
        >
          <motion.div
            style={
              morphOn
                ? {
                    rotate: liftRot,
                    rotateX: index === activeIndex ? rotateX : 0,
                    rotateY: index === activeIndex ? rotateY : 0,
                  }
                : { rotate: rot }
            }
          >
            <div style={morphOn ? { rotate: `${rot}deg` } : undefined}>
              <Link
                href={`/themes/${theme.slug}`}
                {...(morphOn ? cursor : {})}
                className={
                  "block w-[clamp(320px,50vw,780px)] " +
                  (morphOn ? "cursor-none" : "")
                }
              >
                <motion.div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  data-hero-front={isFront ? "" : undefined}
                  style={
                    morphOn
                      ? {
                          scale: cardScale,
                        }
                      : undefined
                  }
                  className={`group relative aspect-3/2 overflow-hidden rounded-2xl bg-(--ed-bg-soft) ring-1 ring-(--ed-line-soft) will-change-transform transition-all duration-500 ease-out ${
                    index === activeIndex
                      ? "shadow-[0_40px_80px_-25px_rgba(17,17,17,0.45)] hover:shadow-[0_55px_100px_-30px_rgba(17,17,17,0.6)]"
                      : "shadow-[0_20px_40px_-15px_rgba(17,17,17,0.25)] opacity-75"
                  }`}
                >
                  {theme.image && (
                    <Image
                      src={theme.image}
                      alt={`${theme.title} theme preview`}
                      fill
                      priority={index <= 1}
                      sizes="(max-width: 1024px) 88vw, 44vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] will-change-transform"
                    />
                  )}

                  {/* Dynamic darkness overlay (replacing expensive CPU-bound CSS filter animations) */}
                  {morphOn && (
                    <motion.div
                      style={{ opacity: cardOverlayOpacity }}
                      className="absolute inset-0 z-10 bg-black pointer-events-none will-change-opacity"
                    />
                  )}

                  {/* Cursor lighting spotlight */}
                  {morphOn && index === activeIndex && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-10"
                      style={{
                        background: spotlightBg,
                      }}
                    />
                  )}

                  {/* Glass reflection sweep */}
                  {morphOn && index === activeIndex && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-20 bg-linear-to-tr from-transparent via-white/10 to-transparent"
                      animate={isScrolling ? { x: "-100%" } : { x: ["-100%", "200%"] }}
                      transition={{
                        duration: 2.2,
                        repeat: isScrolling ? 0 : Infinity,
                        repeatDelay: 8,
                        ease: "easeInOut",
                      }}
                      style={{
                        transform: "skewX(-20deg)",
                      }}
                    />
                  )}

                  {/* View Details Button Overlay (Upper Right Corner) */}
                  {morphOn && index === activeIndex && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: settled ? 1 : 0, scale: settled ? 1 : 0.8 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="absolute top-4 right-4 z-30 pointer-events-auto sm:top-5 sm:right-5"
                    >
                      <VisualDotButton colors={colors}>View Details</VisualDotButton>
                    </motion.div>
                  )}

                  {/* caption chip, bottom-left — hidden while the card is big */}
                  <motion.div
                    initial={skipIntro ? false : { opacity: 0 }}
                    animate={{ opacity: settled ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between bg-linear-to-t from-black/45 to-transparent p-4 text-white sm:p-5"
                  >
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] sm:text-sm">
                        {theme.title}
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] opacity-80 sm:text-[11px]">
                        {theme.category}
                        {theme.framework ? ` / ${theme.framework}` : ""}
                      </p>
                    </div>
                    <p className="text-[10px] tabular-nums opacity-80 sm:text-[11px]">
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(total).padStart(2, "0")}
                    </p>
                  </motion.div>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- CTA pill with an accent dot (Ovo-style “● Learn More”) ---------- */

function DotButton({
  href,
  children,
  colors,
}: {
  href: string;
  children: string;
  colors?: { primary: string; secondary: string };
}) {
  return (
    <Magnetic className="inline-block" strength={12}>
      <Link
        href={href}
        className="group relative inline-flex h-12 items-center gap-2.5 rounded-full bg-(--ed-ink) pl-5 pr-6 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-bg) transition-all duration-300 hover:bg-black dark:hover:bg-white overflow-hidden"
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-sm"
          style={{
            backgroundImage: colors
              ? `linear-gradient(to right, ${colors.primary}33, ${colors.secondary}33)`
              : "linear-gradient(to right, var(--brand) 30%, var(--secondary) 100%)",
          }}
        />
        
        {/* Animated Gradient border */}
        <div
          className="absolute inset-0 rounded-full border transition-colors duration-300"
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        />

        <span
          className="size-2 rounded-full transition-transform duration-300 group-hover:scale-125"
          style={{
            backgroundColor: colors ? colors.primary : "var(--brand)",
          }}
        />
        
        <TextRoll>{children}</TextRoll>

        {/* Animated Arrow */}
        <ArrowRight
          className="size-4 ml-1 transition-transform duration-300 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
          style={{
            color: colors ? colors.primary : "var(--brand)",
          }}
        />
      </Link>
    </Magnetic>
  );
}

/* ---------- Visual CTA badge overlaid on card (no nested <a> tag to prevent hydration failure) ---------- */

function VisualDotButton({
  children,
  colors,
}: {
  children: string;
  colors?: { primary: string; secondary: string };
}) {
  const primaryColor = colors?.primary || "var(--brand)";
  const secondaryColor = colors?.secondary || "var(--brand)";

  return (
    <motion.div
      whileHover="hover"
      className="relative inline-flex h-8 items-center gap-1.5 rounded-full border bg-black/40 backdrop-blur-md px-3 text-[10px] font-semibold uppercase tracking-[0.14em] overflow-hidden shadow-lg transition-colors duration-300"
      style={{
        borderColor: `${primaryColor}44`,
        color: primaryColor,
      }}
    >
      {/* Background Hover Glow */}
      <motion.div
        variants={{
          hover: { opacity: 1 },
        }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 -z-10 blur-xs"
        style={{
          backgroundImage: `linear-gradient(to right, ${primaryColor}33, ${secondaryColor}33)`,
        }}
      />

      {/* Accent Dot */}
      <motion.span
        variants={{
          hover: { scale: 1.25 },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="size-1.5 rounded-full"
        style={{
          backgroundColor: primaryColor,
        }}
      />

      <TextRoll>{children}</TextRoll>

      {/* Animated Arrow */}
      <motion.div
        variants={{
          hover: { x: 0, opacity: 1, width: 12, marginLeft: 4 },
        }}
        initial={{ x: -4, opacity: 0, width: 0, marginLeft: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        className="overflow-hidden inline-flex items-center"
      >
        <ArrowRight
          className="size-3"
          style={{
            color: primaryColor,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ---------- Floating tech-style particles for ambient background depth ---------- */

function FloatingParticles({ colors }: { colors: { primary: string; secondary: string } }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
      <style>{`
        @keyframes particle-float-1 {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(15px, -20px) rotate(180deg); }
          100% { transform: translate(0px, 0px) rotate(360deg); }
        }
        @keyframes particle-float-2 {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(-20px, 15px); }
          100% { transform: translate(0px, 0px); }
        }
      `}</style>
      {/* Particle 1: Top Left */}
      <div
        style={{
          color: colors.primary,
          animation: "particle-float-1 18s infinite ease-in-out",
        }}
        className="absolute left-[15%] top-[25%] size-3 border border-current rounded-full will-change-transform"
      />
      
      {/* Particle 2: Bottom Left */}
      <div
        style={{
          color: colors.secondary,
          animation: "particle-float-2 22s infinite ease-in-out",
        }}
        className="absolute left-[20%] bottom-[20%] text-xs font-light will-change-transform"
      >
        +
      </div>

      {/* Particle 3: Top Right */}
      <div
        style={{
          color: colors.primary,
          animation: "particle-float-1 25s infinite ease-in-out",
        }}
        className="absolute right-[15%] top-[20%] size-2 bg-current rounded-full will-change-transform"
      />

      {/* Particle 4: Center Bottom */}
      <div
        style={{
          color: colors.secondary,
          animation: "particle-float-2 20s infinite ease-in-out",
        }}
        className="absolute left-[50%] bottom-[15%] size-4 border border-current opacity-20 rotate-45 will-change-transform"
      />
    </div>
  );
}


