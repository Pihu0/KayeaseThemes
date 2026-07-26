"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { EASE, useIsDesktop } from "@/lib/motion";
import Magnetic from "@/components/motion/Magnetic";
import TextRoll from "@/components/motion/TextRoll";
import { SectionLabel } from "@/components/home/editorial";
import { useProjectCursor } from "@/components/home/cursor";
import type { Theme } from "@/lib/types";

/* 01 — HERO  (peel-deck, inspired by the Legion/Ovo scroll interaction)
   A giant headline marquee slides horizontally behind a centred deck of real
   theme previews. On scroll through a pinned runway the front card lifts up
   and off, peeling one at a time to reveal the next — until the base card
   remains and the hero hands over to the Selected Themes chapter. */

const EYEBROW = "Kayease® / Digital Theme Studio";
const MARQUEE = "Your Next Website Shouldn't Look Familiar";
const TAGLINE =
  "Distinctive, production-ready themes for brands that care about every detail.";

// per-card resting tilt (front → back), so the deck reads as a hand-stacked pile
const ROT = [0, 3.5, -4, -2, 2.5];

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

  return <HeroRunway deck={deck} total={total} morphOn={morphOn} />;
}

/* Split out so useScroll can bind to the runway ref after the early return. */
function HeroRunway({
  deck,
  total,
  morphOn,
}: {
  deck: Theme[];
  total: number;
  morphOn: boolean;
}) {
  const runwayRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  // marquee drifts a touch faster than the page as you scroll (parallax)
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

  const L = deck.length;

  return (
    <section
      ref={runwayRef}
      aria-label="Kayease Themes introduction"
      className="relative"
      style={morphOn ? { height: `${L * 100}vh` } : undefined}
    >
      <div
        className={
          "flex flex-col overflow-clip " +
          (morphOn ? "sticky top-0 h-screen" : "min-h-svh py-32")
        }
      >
        {/* ---- giant headline marquee, centred behind the deck ---- */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 overflow-hidden"
        >
          <motion.div style={morphOn ? { x: marqueeX } : undefined}>
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

        {/* ---- the peel deck ---- */}
        <div className="relative z-10 grid flex-1 place-items-center px-6">
          <div className="grid place-items-center">
            {deck.map((theme, i) => (
              <DeckCard
                key={theme._id}
                theme={theme}
                index={i}
                count={L}
                total={total}
                morphOn={morphOn}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* ---- copy + CTA, static at the foot of the frame ---- */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="relative z-20 mx-auto flex flex-col items-center gap-5 pb-[clamp(1.5rem,4vh,3.5rem)] text-center"
        >
          <SectionLabel>{EYEBROW}</SectionLabel>
          <p className="max-w-md text-pretty text-[13.5px] leading-relaxed text-(--ed-ink-2) sm:text-sm">
            {TAGLINE}
          </p>
          <DotButton href="/themes">Explore Themes</DotButton>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- one card in the deck ---------- */

function DeckCard({
  theme,
  index,
  count,
  total,
  morphOn,
  scrollYProgress,
}: {
  theme: Theme;
  index: number;
  count: number;
  total: number;
  morphOn: boolean;
  scrollYProgress: MotionValue<number>;
}) {
  const cursor = useProjectCursor("View");
  const isBase = index === count - 1;

  // Each card owns the scroll slice [index/L, (index+1)/L]; the base never
  // peels and holds through the final slice.
  const start = index / count;
  const end = (index + 1) / count;
  const y = useTransform(
    scrollYProgress,
    [start, end],
    ["0%", isBase ? "0%" : "-172%"]
  );
  // a hair of extra rotation as it lifts, so the peel feels physical
  const liftRot = useTransform(
    scrollYProgress,
    [start, end],
    [0, isBase ? 0 : (index % 2 === 0 ? -6 : 6)]
  );

  const rot = ROT[index % ROT.length];

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
        initial={{ opacity: 0, y: 70, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.9,
          delay: 0.35 + (count - 1 - index) * 0.09,
          ease: EASE,
        }}
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
              <div className="group relative aspect-3/2 overflow-hidden rounded-2xl bg-(--ed-bg-soft) shadow-[0_40px_80px_-30px_rgba(17,17,17,0.45)] ring-1 ring-(--ed-line-soft)">
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
                {/* caption chip, bottom-left */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-linear-to-t from-black/45 to-transparent p-4 text-white sm:p-5">
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
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- CTA pill with an accent dot (Ovo-style “● Learn More”) ---------- */

function DotButton({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
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
