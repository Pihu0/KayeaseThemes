"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  cubicBezier,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
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
  // scroll rotates the hue of the active-theme headline's watercolour fill
  const headingFilter = useTransform(
    scrollYProgress,
    [0, 1],
    ["hue-rotate(0deg)", "hue-rotate(150deg)"]
  );

  const L = deck.length;
  const skipIntro = reduced || introPlayed;

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

  return (
    <section
      ref={runwayRef}
      aria-label="Kayease Themes introduction"
      className="relative"
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
          <motion.div
            initial={skipIntro ? false : { opacity: 0 }}
            animate={{ opacity: show ? 1 : 0 }}
            transition={{ duration: 0.8, delay: skipIntro ? 0 : 0.5 }}
            style={morphOn ? { x: marqueeX } : undefined}
          >
            <div className="ed-marquee-track flex w-max">
              {[0, 1].map((half) => (
                <span
                  key={half}
                  aria-hidden={half === 1}
                  className="ed-display flex shrink-0 items-center whitespace-nowrap pr-[0.35em] text-[clamp(3.5rem,13.5vw,15rem)] leading-none text-(--ed-ink) opacity-[0.08]"
                >
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className="pr-[0.35em]">
                      {MARQUEE}
                      <span className="px-[0.25em] align-middle text-[0.5em] opacity-70">
                        ✳
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* barely-visible atmospheric glow behind the composition */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[55vh] max-w-4xl -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(180,180,180,0.16), transparent)",
          }}
        />

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
            className="ed-px absolute inset-y-0 left-0 z-30 flex w-[46%] flex-col justify-center"
          >
            <SectionLabel>{EYEBROW}</SectionLabel>
            <AnimatePresence mode="wait">
              <motion.div
                key={active._id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-6"
              >
                <p className="ed-label text-(--ed-ink-2)">
                  {active.category}
                  {active.framework ? ` / ${active.framework}` : ""}
                </p>
                <motion.h2
                  style={{ filter: headingFilter }}
                  className="ed-display ed-aurora-text mt-3 text-[clamp(2rem,3.4vw,3.75rem)]"
                >
                  {active.title}
                </motion.h2>
                <p className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-(--ed-ink-2)">
                  {active.shortDescription || active.description}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-9 flex items-center gap-7">
              <DotButton href={`/themes/${active.slug}`}>View Theme</DotButton>
              <span className="ed-label tabular-nums text-(--ed-ink-2)">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(L).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        )}

        {/* ---- the peel deck — centred during the intro, then slides right ---- */}
        <motion.div
          initial={false}
          animate={
            morphOn
              ? { x: settled ? "19%" : "0%", scale: settled ? 0.86 : 1 }
              : undefined
          }
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
}) {
  const cursor = useProjectCursor("View");
  const isBase = index === count - 1;
  const isFront = index === 0;

  // After the hold, each peeling card owns an equal slice of [PEEL_HOLD, PEEL_END];
  // the base never peels and holds through to the end.
  const peelCount = Math.max(1, count - 1);
  const segLen = (PEEL_END - PEEL_HOLD) / peelCount;
  const start = PEEL_HOLD + index * segLen;
  const end = start + segLen;
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

  // Intro: the front card drops in near-fullscreen then shrinks to its slot;
  // the rest cascade in from slightly-large with a fade, front card landing last.
  const introVariants: Variants = {
    hidden: isFront
      ? { scale: introScale, opacity: 1, y: 0 }
      : { scale: 1.12, opacity: 0, y: 34 },
    shown: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        // front card holds full-width until the curtains have cleared (~1.1s),
        // then shrinks; the rest assemble behind it in the meantime.
        duration: isFront ? 1 : 0.8,
        delay: skipIntro ? 0 : isFront ? 1.3 : 0.4 + index * 0.12,
        ease: EASE,
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
        <motion.div style={morphOn ? { rotate: liftRot } : { rotate: rot }}>
          <div style={morphOn ? { rotate: `${rot}deg` } : undefined}>
            <Link
              href={`/themes/${theme.slug}`}
              {...(morphOn ? cursor : {})}
              className={
                "block w-[clamp(280px,44vw,660px)] " +
                (morphOn ? "cursor-none" : "")
              }
            >
              <div
                data-hero-front={isFront ? "" : undefined}
                className="group relative aspect-3/2 overflow-hidden rounded-2xl bg-(--ed-bg-soft) shadow-[0_40px_80px_-30px_rgba(17,17,17,0.45)] ring-1 ring-(--ed-line-soft)"
              >
                {theme.image && (
                  <Image
                    src={theme.image}
                    alt={`${theme.title} theme preview`}
                    fill
                    priority={index <= 1}
                    sizes="(max-width: 1024px) 88vw, 44vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                )}
                {/* caption chip, bottom-left — hidden while the card is big */}
                <motion.div
                  initial={skipIntro ? false : { opacity: 0 }}
                  animate={{ opacity: settled ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-linear-to-t from-black/45 to-transparent p-4 text-white sm:p-5"
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
              </div>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- CTA pill with an accent dot (Ovo-style “● Learn More”) ---------- */

function DotButton({ href, children }: { href: string; children: string }) {
  return (
    <Magnetic className="inline-block">
      <Link
        href={href}
        className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-(--ed-ink) pl-5 pr-6 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-bg) transition-colors duration-300 hover:bg-black dark:hover:bg-white"
      >
        <span className="size-2 rounded-full bg-brand transition-transform duration-300 group-hover:scale-125" />
        <TextRoll>{children}</TextRoll>
      </Link>
    </Magnetic>
  );
}
