"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useIsDesktop } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Theme } from "@/lib/types";

/* HERO CARDS — an infinite 3D carousel of real theme covers.
   The covers ride a CONCAVE curved wall (centre small & set back, edges large
   & forward, x = R·sinθ / z = R·(1 − cosθ), rotated to face inward) and the
   whole row scrolls CONTINUOUSLY right → left: a single ever-advancing angular
   `phase` drives every card, each wrapping seamlessly around the ring so covers
   enter from the right and leave on the left, forever. Hovering pauses the flow
   so a cover can be read and clicked. Desktop pointers get the full 3D; touch /
   small screens / reduced motion fall back to a clean horizontal scroll. */

const STEP_DEG = 15; // angular gap between neighbouring cards on the ring
const RADIUS = 860; // px ring radius — controls spread + depth of the bowl
const PERSPECTIVE = 670; // px — smaller = stronger front/back size contrast
const VERTICAL_ARC = 12; // px the outer cards rise, for the circular bow
const MAX_CARDS = 12; // covers on the ring (more = longer before a cover repeats)
const SEC_PER_CARD = 2.2; // seconds for the row to advance by one card

export default function HeroCards({ themes }: { themes: Theme[] }) {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();

  // Featured first, so the strongest covers lead the stream.
  const cards = useMemo(() => {
    const withImg = themes.filter((t) => t.image);
    const ordered = [
      ...withImg.filter((t) => t.featured),
      ...withImg.filter((t) => !t.featured),
    ];
    return ordered.slice(0, Math.min(ordered.length, MAX_CARDS));
  }, [themes]);

  // pointer → gentle group tilt (spring-damped, never more than a few degrees)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), {
    stiffness: 60,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), {
    stiffness: 60,
    damping: 18,
  });

  const use3D = desktop && !reduced;
  const count = cards.length;
  const totalArc = count * STEP_DEG; // the ring wraps every `count` cards

  // the endless conveyor: advance `phase` by one full ring, linearly, forever.
  const phase = useMotionValue(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  useEffect(() => {
    if (!use3D || count === 0) return;
    const controls = animate(phase, totalArc, {
      duration: count * SEC_PER_CARD,
      ease: "linear",
      repeat: Infinity,
    });
    controlsRef.current = controls;
    return () => {
      controls.stop();
      controlsRef.current = null;
    };
  }, [use3D, count, totalArc, phase]);

  if (count === 0) return null;

  // ---- fallback: a plain scrollable strip ----
  if (!use3D) {
    return (
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-(--ed-bg) to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-(--ed-bg) to-transparent" />
        <div className="flex snap-x gap-4 overflow-x-auto px-[clamp(1.5rem,4vw,4.5rem)] pb-2 scrollbar-none">
          {cards.map((t) => (
            <Link
              key={t._id}
              href={`/themes/${t.slug}`}
              className="group w-57.5 shrink-0 snap-start"
            >
              <CardFace theme={t} variant="strip" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // ---- desktop 3D carousel ----
  return (
    <div className="relative">
      <div
        className="relative flex justify-center"
        style={{ perspective: `${PERSPECTIVE}px` }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseEnter={() => controlsRef.current?.pause()}
        onMouseLeave={() => {
          controlsRef.current?.play();
          px.set(0);
          py.set(0);
        }}
      >
        {/* cursor-driven tilt, layered over the flowing ring */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative h-[clamp(300px,30vw,420px)] w-full"
        >
          {cards.map((t, i) => (
            <FlowCard
              key={t._id}
              theme={t}
              index={i}
              phase={phase}
              count={count}
            />
          ))}
        </motion.div>
      </div>

      {/* the row dissolves into the page background at both edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[clamp(56px,13vw,240px)] bg-linear-to-r from-(--ed-bg) via-(--ed-bg)/80 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[clamp(56px,13vw,240px)] bg-linear-to-l from-(--ed-bg) via-(--ed-bg)/80 to-transparent"
      />
    </div>
  );
}

/* One cover on the conveyor. Reads the shared `phase`, works out its own angle
   on the ring (wrapped into a symmetric range so it loops), and derives its 3D
   transform / stacking / fade — all off the React render loop via motion values. */
function FlowCard({
  theme,
  index,
  phase,
  count,
}: {
  theme: Theme;
  index: number;
  phase: MotionValue<number>;
  count: number;
}) {
  const totalArc = count * STEP_DEG;
  const half = totalArc / 2;
  const visMax = 68; // deg past which a cover is fully hidden (off-screen)
  const visFade = 58; // deg where it starts fading out

  // signed angle on the ring, advancing right→left, wrapped to (−half, half]
  const angle = useTransform(phase, (p) => {
    const a = index * STEP_DEG - p;
    return (((a + half) % totalArc) + totalArc) % totalArc - half;
  });

  const transform = useTransform(angle, (a) => {
    const r = (a * Math.PI) / 180;
    const x = RADIUS * Math.sin(r);
    const z = RADIUS * (1 - Math.cos(r));
    const y = -VERTICAL_ARC * (1 - Math.cos(r));
    return `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) translateZ(${z}px) rotateY(${-a}deg)`;
  });

  // nearer (edge) covers sit on top; hide the one crossing the seam at the back
  const zIndex = useTransform(angle, (a) =>
    Math.round(RADIUS * (1 - Math.cos((a * Math.PI) / 180)))
  );
  const opacity = useTransform(angle, (a) => {
    const ab = Math.abs(a);
    if (ab >= visMax) return 0;
    if (ab <= visFade) return 1;
    return 1 - (ab - visFade) / (visMax - visFade);
  });

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ transform, zIndex, opacity, transformStyle: "preserve-3d" }}
    >
      <Link
        href={`/themes/${theme.slug}`}
        className="group relative block w-[clamp(180px,13.5vw,225px)] outline-offset-8"
      >
        <CardFace theme={theme} variant="fan" />
      </Link>
    </motion.div>
  );
}

/* A single card face — portrait cover + title / meta. Hover warms the image
   and lifts it (composes on top of any 3D transform).
   - "strip": inline caption beneath (mobile fallback)
   - "fan": caption revealed on hover (the flow pauses on hover, so it's legible) */
function CardFace({
  theme,
  variant,
}: {
  theme: Theme;
  variant: "strip" | "fan";
}) {
  const free = theme.pricingType === "free" || theme.price === 0;
  const meta = free ? "Free" : theme.framework || theme.category;
  const fan = variant === "fan";

  return (
    <>
      <div
        className={cn(
          "relative aspect-4/5 overflow-hidden rounded-xl border border-(--ed-line) bg-(--ed-surface) transition-transform duration-500 ease-out group-hover:-translate-y-1.5",
          fan && "shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
        )}
      >
        <Image
          src={theme.image}
          alt={theme.title}
          fill
          sizes="260px"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      {fan ? (
        <div className="absolute left-1/2 top-full mt-3 flex -translate-x-1/2 items-baseline gap-2 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-[13px] font-medium text-(--ed-ink)">
            {theme.title}
          </span>
          <span className="text-[11px] uppercase tracking-[0.12em] text-(--ed-ink-2)">
            {meta}
          </span>
        </div>
      ) : (
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <span className="truncate text-[13px] font-medium text-(--ed-ink)">
            {theme.title}
          </span>
          <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-(--ed-ink-2)">
            {meta}
          </span>
        </div>
      )}
    </>
  );
}
