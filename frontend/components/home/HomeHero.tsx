"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { EASE, useIsDesktop } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel, EdButton, EdLink } from "@/components/home/editorial";
import { useProjectCursor } from "@/components/home/cursor";
import type { Theme } from "@/lib/types";

/* 01 — HERO
   Communicates: “Kayease is a design studio; the themes are the proof.”
   Eye order: eyebrow → oversized headline → three real theme previews.
   On scroll (desktop) the copy retires, the side previews part toward the
   edges and the centre preview expands to near-fullscreen — the hero
   literally hands over to the Selected Themes chapter. */

const EYEBROW = "Kayease® / Digital Theme Studio";
const HEADLINE = ["Your next website", "shouldn't look familiar."];
const SUBTITLE =
  "Distinctive, production-ready themes crafted for brands that care about design, performance and every detail in between.";

// linear segment mapper for scrub maths: 0 before `a`, 1 after `b`
const seg = (p: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));

export default function HomeHero({
  themes,
  total,
}: {
  themes: Theme[];
  total: number;
}) {
  const runwayRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const centerBoxRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const morphOn = desktop && !reduced;

  /* ---- pointer parallax (desktop only): tiny drift + ≤1deg tilt ---- */
  const pxRaw = useMotionValue(0);
  const px = useSpring(pxRaw, { stiffness: 80, damping: 22 });
  const onMouseMove = (e: React.MouseEvent) => {
    if (!morphOn) return;
    const r = stageRef.current?.getBoundingClientRect();
    if (r) pxRaw.set(((e.clientX - r.left) / r.width) * 2 - 1); // -1..1
  };

  /* ---- scroll morph ---- */
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  // Measured “cover the viewport” targets for the centre preview
  const [cover, setCover] = useState({ scale: 1, x: 0, y: 0 });
  useEffect(() => {
    if (!morphOn) return;
    const measure = () => {
      const el = centerBoxRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Only trust the measurement while the stage is at rest (progress ≈ 0)
      if (scrollYProgress.get() > 0.02) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setCover({
        // 0.96 → “nearly full viewport”, keeps a sliver of breathing room
        scale: Math.max(vw / r.width, vh / r.height) * 0.96,
        x: vw / 2 - (r.left + r.width / 2),
        y: vh / 2 - (r.top + r.height / 2),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [morphOn, scrollYProgress]);

  // Copy retires first…
  const copyY = useTransform(scrollYProgress, (p) => -90 * seg(p, 0, 0.3));
  const copyOpacity = useTransform(scrollYProgress, (p) => 1 - seg(p, 0.02, 0.26));
  // …sides part toward the edges…
  const sideShift = useTransform(scrollYProgress, (p) => seg(p, 0.08, 0.5));
  const sideOpacity = useTransform(scrollYProgress, (p) => 1 - seg(p, 0.18, 0.5));
  // …centre expands to near-fullscreen.
  const centerScale = useTransform(scrollYProgress, (p) =>
    morphOn ? 1 + (cover.scale - 1) * seg(p, 0.28, 0.92) : 1
  );
  const centerX = useTransform(scrollYProgress, (p) => cover.x * seg(p, 0.28, 0.92));
  const centerY = useTransform(scrollYProgress, (p) => cover.y * seg(p, 0.28, 0.92));
  const centerRadius = useTransform(scrollYProgress, (p) => 18 - 12 * seg(p, 0.5, 0.9));
  const centerMetaOpacity = useTransform(scrollYProgress, (p) => 1 - seg(p, 0.04, 0.18));
  // Slide-01 style overlay fades in as the morph completes
  const overlayOpacity = useTransform(scrollYProgress, (p) => seg(p, 0.86, 0.98));

  const [left, center, right] = themes;
  if (!center) return null;

  return (
    <section
      ref={runwayRef}
      aria-label="Kayease Themes introduction"
      className={morphOn ? "relative h-[220vh]" : "relative"}
    >
      <div
        ref={stageRef}
        onMouseMove={onMouseMove}
        className={
          "flex flex-col overflow-clip pt-28 sm:pt-32 " +
          (morphOn ? "sticky top-0 h-screen" : "min-h-svh")
        }
      >
        {/* barely-visible atmospheric glow behind the composition */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-[50vh] max-w-4xl rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(180,180,180,0.10), transparent)",
          }}
        />

        {/* ---- copy ---- */}
        <motion.div
          style={morphOn ? { y: copyY, opacity: copyOpacity } : undefined}
          className="ed-px relative z-10 mx-auto flex w-full max-w-[1760px] flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <SectionLabel>{EYEBROW}</SectionLabel>
          </motion.div>

          <MaskedLines
            as="h1"
            mode="mount"
            lines={HEADLINE}
            delay={0.3}
            className="ed-display mt-7 text-[clamp(2.5rem,6.6vw,7.75rem)]"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
            className="mt-7 max-w-lg text-pretty text-[15px] leading-relaxed text-(--ed-ink-2) sm:text-base"
          >
            {SUBTITLE}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
          >
            <EdButton href="/themes">Explore Themes</EdButton>
            <EdLink href="/categories">View Collection</EdLink>
          </motion.div>
        </motion.div>

        {/* ---- three real theme previews ---- */}
        {morphOn ? (
          <div className="relative z-0 mx-auto mt-16 flex w-full max-w-[1760px] flex-1 items-start justify-center gap-[clamp(1rem,2.5vw,2.5rem)]">
            {left && (
              <SidePreview theme={left} dir={-1} px={px} shift={sideShift} opacity={sideOpacity} delay={1.1} />
            )}
            <CenterPreview
              theme={center}
              total={total}
              px={px}
              boxRef={centerBoxRef}
              scale={centerScale}
              x={centerX}
              y={centerY}
              radius={centerRadius}
              metaOpacity={centerMetaOpacity}
            />
            {right && (
              <SidePreview theme={right} dir={1} px={px} shift={sideShift} opacity={sideOpacity} delay={1.2} />
            )}
          </div>
        ) : (
          /* Mobile / reduced motion: one dominant preview, the others peek in
             a swipeable row — no pinning, no parallax. */
          <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-10 scrollbar-none">
            {[center, left, right].filter(Boolean).map((t, i) => (
              <Link
                key={t._id}
                href={`/themes/${t.slug}`}
                className="w-[78vw] max-w-105 shrink-0 snap-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 + i * 0.12, ease: EASE }}
                >
                  <div className="relative aspect-25/31 overflow-hidden rounded-2xl ring-1 ring-(--ed-line-soft)">
                    {t.image && (
                      <Image
                        src={t.image}
                        alt={`${t.title} theme preview`}
                        fill
                        priority={i === 0}
                        sizes="78vw"
                        className="object-cover object-top"
                      />
                    )}
                  </div>
                  <PreviewMeta theme={t} index={i} total={total} />
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {/* Slide-01-style overlay — appears as the centre preview reaches
            near-fullscreen, so the hero reads as “became the showcase”. */}
        {morphOn && (
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-[clamp(1.5rem,4vw,4.5rem)]"
          >
            <div className="text-white [text-shadow:0_1px_24px_rgba(0,0,0,0.45)]">
              <p className="ed-label opacity-80">01 / {Math.min(total, 4).toString().padStart(2, "0")}</p>
              <p className="ed-display mt-2 text-3xl">{center.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] opacity-80">
                {center.category} / {center.framework}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ---------- previews ---------- */

function PreviewMeta({
  theme,
  index,
  total,
  className = "",
}: {
  theme: Theme;
  index: number;
  total: number;
  className?: string;
}) {
  return (
    <div className={"mt-4 flex items-baseline justify-between " + className}>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.12em]">{theme.title}</p>
        <p className="mt-0.5 text-xs text-(--ed-ink-2)">
          {theme.category}
          {theme.framework ? ` / ${theme.framework}` : ""}
        </p>
      </div>
      <p className="text-[11px] tabular-nums text-(--ed-ink-2)">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
    </div>
  );
}

function CenterPreview({
  theme,
  total,
  px,
  boxRef,
  scale,
  x,
  y,
  radius,
  metaOpacity,
}: {
  theme: Theme;
  total: number;
  px: MotionValue<number>;
  boxRef: React.RefObject<HTMLDivElement | null>;
  scale: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  radius: MotionValue<number>;
  metaOpacity: MotionValue<number>;
}) {
  const cursor = useProjectCursor("View");
  // Centre moves least — depth comes from the difference vs the sides
  const parallaxX = useTransform(px, [-1, 1], [-8, 8]);
  const rotate = useTransform(px, [-1, 1], [0.6, -0.6]);

  return (
    <motion.div style={{ x, y, scale }} className="relative z-10 w-[min(46vw,500px)] shrink-0 will-change-transform">
      <motion.div style={{ x: parallaxX, rotate }}>
        <motion.div
          initial={{ opacity: 0, y: 120, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.95, ease: EASE }}
        >
          <Link href={`/themes/${theme.slug}`} {...cursor} className="block cursor-none">
            <motion.div
              ref={boxRef}
              style={{ borderRadius: radius }}
              className="relative aspect-25/31 overflow-hidden ring-1 ring-(--ed-line-soft)"
            >
              {theme.image && (
                <Image
                  src={theme.image}
                  alt={`${theme.title} theme preview`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 78vw, 60vw"
                  className="object-cover object-top"
                />
              )}
            </motion.div>
          </Link>
          <motion.div style={{ opacity: metaOpacity }}>
            <PreviewMeta theme={theme} index={0} total={total} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function SidePreview({
  theme,
  dir,
  px,
  shift,
  opacity,
  delay,
}: {
  theme: Theme;
  dir: -1 | 1;
  px: MotionValue<number>;
  shift: MotionValue<number>;
  opacity: MotionValue<number>;
  delay: number;
}) {
  const cursor = useProjectCursor("View");
  // Sides drift more than the centre (max 16px) + part toward the edges on scroll
  const parallaxX = useTransform(px, [-1, 1], [-16, 16]);
  const rotate = useTransform(px, [-1, 1], [1.2 * dir, -1.2 * dir]);
  const scrollX = useTransform(shift, (v) => v * dir * 420);

  return (
    <motion.div
      style={{ x: scrollX, opacity }}
      className="relative z-0 mt-14 w-[min(27vw,380px)] shrink-0 will-change-transform"
    >
      <motion.div style={{ x: parallaxX, rotate }}>
        <motion.div
          initial={{ opacity: 0, y: 120, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay, ease: EASE }}
        >
          <Link href={`/themes/${theme.slug}`} {...cursor} className="block cursor-none">
            <div className="relative aspect-19/24 overflow-hidden rounded-[18px] ring-1 ring-(--ed-line-soft)">
              {theme.image && (
                <Image
                  src={theme.image}
                  alt={`${theme.title} theme preview`}
                  fill
                  sizes="27vw"
                  className="object-cover object-top"
                />
              )}
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
