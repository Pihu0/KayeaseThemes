"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { EASE, useIsDesktop } from "@/lib/motion";
import type { Theme } from "@/lib/types";

/* HERO MORPH — the covers ride a 3D carousel, then FLY into the real gallery.
   On load they stack, fan into a concave arc and flow right→left. As you scroll,
   a fixed overlay measures the live gallery cells (the ones under "27 RESULTS")
   and flies each cover from its arc slot straight into its cell — reshaping
   portrait → landscape and revealing metadata — while the gallery keeps those
   cells hidden until the covers land. So the carousel literally becomes the grid.
   Mobile / reduced motion: a plain scroll strip (StripHero) in the header. */

const STEP_DEG = 15;
const RADIUS = 860;
const PERSPECTIVE = 670;
const VERTICAL_ARC = 12;
const SEC_PER_CARD = 2.2;
const META_H = 84;
const ARC_HALF = 180; // ≈ half the arc's visual height, to seat it under the CTA

/* ---------- mobile / reduced-motion fallback ---------- */
function StripCard({ theme }: { theme: Theme }) {
  const free = theme.pricingType === "free" || theme.price === 0;
  return (
    <Link
      href={`/themes/${theme.slug}`}
      data-strip-card
      className="group w-[clamp(9.5rem,42vw,13rem)] shrink-0 backface-hidden transform-3d will-change-transform"
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-(--ed-line) bg-(--ed-surface)">
        <Image
          src={theme.image}
          alt={theme.title}
          fill
          sizes="(max-width: 640px) 42vw, 208px"
          className="object-cover object-top"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="truncate text-[13px] font-medium text-(--ed-ink)">{theme.title}</span>
        <span className="shrink-0 text-[12px] tabular-nums text-(--ed-ink-2)">
          {free ? "Free" : `$${theme.price}`}
        </span>
      </div>
    </Link>
  );
}

export function StripHero({ themes }: { themes: Theme[] }) {
  const reduced = useReducedMotion();
  const cards = useMemo(() => themes.filter((t) => t.image).slice(0, 12), [themes]);

  // continuous left-drift marquee — the mobile echo of the desktop arc's flow.
  // A ref-driven rAF loop nudges the track and wraps once the first copy has
  // fully scrolled past (cards are rendered twice, so the second copy takes over
  // with no visible seam). We wrap at the second copy's exact offset — measuring
  // that instead of halving scrollWidth keeps the loop pixel-seamless despite
  // the flex gaps. Touch pauses it so covers stay readable/tappable;
  // reduced-motion users get a static swipe strip instead.
  const x = useMotionValue(0);
  const wrapRef = useRef<HTMLDivElement>(null); // strip viewport, for measuring card positions
  const copyRef = useRef<HTMLDivElement>(null); // the 2nd copy; its offsetLeft == one loop
  const pausedRef = useRef(false);
  const SPEED = 32; // px per second

  // 3D arc tuning — coverflow, like the reference: the card(s) in the centre
  // stay FLAT and upright (the focal point), and only cards past a dead-zone
  // start rotating inward, ramping up hard toward the edges. Size is kept
  // uniform (no translateZ) so the row never reads as mixed sizes — the depth
  // comes from the edge cards angling away while the middle faces you.
  const MAX_ROT = 52; // deg at the very edges
  const DEAD = 0.4; // |t| below this stays flat (the upright middle band)
  const REACH = 0.45; // fraction of strip width to reach full tilt

  useAnimationFrame((_, delta) => {
    if (reduced || !copyRef.current || !wrapRef.current) return;
    // advance the marquee (unless paused by touch/hover)
    if (!pausedRef.current) {
      const advance = copyRef.current.offsetLeft;
      if (advance) {
        let next = x.get() - (delta / 1000) * SPEED;
        if (next <= -advance) next += advance;
        x.set(next);
      }
    }
    // per-card 3D pass: flat middle, tilt ramps in past the dead-zone
    const wrap = wrapRef.current.getBoundingClientRect();
    const mid = wrap.left + wrap.width / 2;
    const reach = wrap.width * REACH;
    const els = wrapRef.current.querySelectorAll<HTMLElement>("[data-strip-card]");
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const t = Math.max(-1.6, Math.min(1.6, (c - mid) / reach));
      const s = Math.sign(t);
      const a = Math.abs(t);
      // 0 inside the dead-zone, then eased 0→1 out to the edge
      const raw = a <= DEAD ? 0 : Math.min(1, (a - DEAD) / (1.4 - DEAD));
      const ramp = raw * raw * (3 - 2 * raw); // smoothstep
      el.style.transform = `rotateY(${-s * ramp * MAX_ROT}deg)`;
    });
  });

  if (cards.length === 0) return null;

  // reduced motion: keep the swipeable snap strip (no auto-movement)
  if (reduced) {
    return (
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-(--ed-bg) to-transparent sm:w-12" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-(--ed-bg) to-transparent sm:w-12" />
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(1.25rem,10vw,4.5rem)] pb-2 scroll-px-[clamp(1.25rem,10vw,4.5rem)] scrollbar-none sm:gap-4">
          {cards.map((t) => (
            <div key={t._id} className="snap-center">
              <StripCard theme={t} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden perspective-[1100px] perspective-origin-center"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-(--ed-bg) to-transparent sm:w-12" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-(--ed-bg) to-transparent sm:w-12" />
      <motion.div
        style={{ x }}
        className="flex w-max gap-3 pb-2 transform-3d sm:gap-4"
        onPointerDown={() => (pausedRef.current = true)}
        onPointerUp={() => (pausedRef.current = false)}
        onPointerCancel={() => (pausedRef.current = false)}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {/* first copy */}
        <div className="flex shrink-0 gap-3 transform-3d sm:gap-4">
          {cards.map((t) => (
            <StripCard key={t._id} theme={t} />
          ))}
        </div>
        {/* identical second copy — its offset marks the seamless wrap point */}
        <div ref={copyRef} className="flex shrink-0 gap-3 transform-3d sm:gap-4">
          {cards.map((t) => (
            <StripCard key={`dup-${t._id}`} theme={t} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- desktop overlay ---------- */
export default function HeroMorph({
  themes,
  count,
  gridRef,
  active,
  onLanded,
}: {
  themes: Theme[];
  count: number;
  gridRef: React.RefObject<HTMLUListElement | null>;
  active: boolean;
  onLanded: (landed: boolean) => void;
}) {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const use3D = desktop && !reduced;

  const cards = useMemo(
    () => themes.filter((t) => t.image).slice(0, count),
    [themes, count]
  );
  const n = cards.length;

  // arc animation state
  const reveal = useMotionValue(0);
  const intro = useMotionValue(0);
  const phase = useMotionValue(0);
  const flowRef = useRef<ReturnType<typeof animate> | null>(null);
  // until the entrance (stack → expand → flow) has finished, the covers ignore
  // scroll entirely (p is pinned to 0) so the arc always plays cleanly
  const readyRef = useRef(false);
  useEffect(() => {
    if (!use3D || n === 0) return;
    let flow: ReturnType<typeof animate> | undefined;
    const rc = animate(reveal, 1, { duration: 0.4, delay: 0.25, ease: EASE });
    const ic = animate(intro, 1, {
      duration: 0.7,
      delay: 0.5,
      ease: EASE,
      onComplete: () => {
        flow = animate(phase, n * STEP_DEG, {
          duration: n * SEC_PER_CARD,
          ease: "linear",
          repeat: Infinity,
        });
        flowRef.current = flow;
        readyRef.current = true;
      },
    });
    return () => {
      rc.stop();
      ic.stop();
      flow?.stop();
      flowRef.current = null;
    };
  }, [use3D, n, phase, intro, reveal]);

  // live measured gallery geometry (viewport coords) + morph progress
  const gridLeft = useMotionValue(0);
  const gridTop = useMotionValue(99999);
  const colW = useMotionValue(300);
  const gapX = useMotionValue(32);
  const rowStepY = useMotionValue(360);
  const cellH = useMotionValue(320);
  const p = useMotionValue(0);
  const anchorBottom = useMotionValue(0); // viewport-y of the hero CTA's bottom
  const hoveredRef = useRef(false); // pause the flow while a cover is hovered
  const [cols, setCols] = useState(3);
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  const landedRef = useRef(false);
  // the morph is a ONE-WAY commit: the first time the covers fully land, we latch
  // it forever — the gallery keeps its cards and the covers never fly back on an
  // up-scroll. Afterwards the overlay becomes a resting hero arc that simply lives
  // in the hero zone (fading out toward the grid), so the hero is never empty.
  const committedRef = useRef(false);
  const overlayOp = useMotionValue(1); // whole-overlay opacity (scroll fade when resting)

  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  useAnimationFrame(() => {
    if (!use3D || !active) return;
    // track the hero CTA so the arc always sits just below the real text/button
    const anchor = document.querySelector("[data-hero-anchor]");
    const ab = anchor ? (anchor as HTMLElement).getBoundingClientRect().bottom : 0;
    anchorBottom.set(ab);

    // ---- RESTING HERO ARC (post-commit) ----
    // the covers now just live in the hero: pinned to the arc (p = 0), still
    // flowing, and faded by scroll so they dissolve into the top as the hero
    // scrolls away. They NEVER scrub back into the grid — the grid keeps its cards.
    if (committedRef.current) {
      p.set(0);
      const arcCenterY = ab !== 0 ? ab + 24 + ARC_HALF : vp.h * 0.72;
      const topEdge = vp.h * 0.12;
      const fullAt = vp.h * 0.5;
      const f0 = Math.max(0, Math.min(1, (arcCenterY - topEdge) / (fullAt - topEdge)));
      const f = f0 * f0 * (3 - 2 * f0); // smoothstep the scroll fade
      overlayOp.set(f);
      // pause the flow while the arc is out of view (optimization) or hovered
      if (hoveredRef.current || f < 0.02) flowRef.current?.pause();
      else flowRef.current?.play();
      return;
    }

    // hold the arc until the entrance is done — scroll can't morph it early
    if (!readyRef.current) {
      p.set(0);
      return;
    }
    const el = gridRef.current;
    if (!el) return;
    const cells = Array.from(el.querySelectorAll("[data-morph-cell]")).map((c) =>
      (c as HTMLElement).getBoundingClientRect()
    );
    if (cells.length < n) return;
    const first = cells[0];
    const c = Math.max(1, cells.filter((r) => Math.abs(r.top - first.top) < 4).length);
    if (c !== cols) setCols(c);
    gridLeft.set(first.left);
    gridTop.set(first.top);
    colW.set(first.width);
    cellH.set(first.height);
    if (cells[1] && Math.abs(cells[1].top - first.top) < 4) gapX.set(cells[1].left - first.right);
    if (cells[c]) rowStepY.set(cells[c].top - first.top);

    // progress: 0 while the grid sits below the fold, 1 when it reaches the top
    // zone. A wide window (begin just below the fold, finish near the top) plus a
    // smoothstep gives the covers a long, un-rushed glide instead of a fast snap —
    // and the eased tail decelerates them gently onto the cells.
    const START = vp.h * 1.1;
    const LAND = vp.h * 0.12;
    const raw = Math.max(0, Math.min(1, (START - first.top) / (START - LAND)));
    const pv = raw * raw * (3 - 2 * raw); // smoothstep
    p.set(pv);
    if (raw > 0.015 || hoveredRef.current) flowRef.current?.pause();
    else flowRef.current?.play();

    // hand off early: reveal the real cells (instantly, under the still-opaque
    // overlay) before the covers crossfade out, so there's no bare-then-fade-in
    // flash. This toggle stays reversible until the morph fully completes.
    const landed = pv >= 0.94;
    if (landed !== landedRef.current) {
      landedRef.current = landed;
      onLanded(landed);
    }
    // fully home → commit for good: from here the overlay is a resting hero arc
    // and the grid owns its cards permanently (an up-scroll can't steal them back).
    if (pv >= 0.999) committedRef.current = true;
  });

  if (!use3D || n === 0 || !active) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-40"
      style={{ perspective: `${PERSPECTIVE}px`, opacity: overlayOp }}
    >
      {/* preserve-3d so the perspective reaches each cover's translateZ (depth) */}
      <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        {cards.map((t, i) => (
          <MorphCard
            key={t._id}
            theme={t}
            index={i}
            number={i + 1}
            cols={cols}
            total={n}
            vpW={vp.w}
            vpH={vp.h}
            phase={phase}
            intro={intro}
            reveal={reveal}
            p={p}
            gridLeft={gridLeft}
            gridTop={gridTop}
            colW={colW}
            gapX={gapX}
            rowStepY={rowStepY}
            cellH={cellH}
            anchorBottom={anchorBottom}
            overlayOp={overlayOp}
            onHover={(v) => {
              hoveredRef.current = v;
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function MorphCard({
  theme,
  index,
  number,
  cols,
  total,
  vpW,
  vpH,
  phase,
  intro,
  reveal,
  p,
  gridLeft,
  gridTop,
  colW,
  gapX,
  rowStepY,
  cellH,
  anchorBottom,
  overlayOp,
  onHover,
}: {
  theme: Theme;
  index: number;
  number: number;
  cols: number;
  total: number;
  vpW: number;
  vpH: number;
  phase: MotionValue<number>;
  intro: MotionValue<number>;
  reveal: MotionValue<number>;
  p: MotionValue<number>;
  gridLeft: MotionValue<number>;
  gridTop: MotionValue<number>;
  colW: MotionValue<number>;
  gapX: MotionValue<number>;
  rowStepY: MotionValue<number>;
  cellH: MotionValue<number>;
  anchorBottom: MotionValue<number>;
  overlayOp: MotionValue<number>;
  onHover: (hovered: boolean) => void;
}) {
  const totalArc = total * STEP_DEG;
  const half = totalArc / 2;
  const mid = (total - 1) / 2;
  const wrap = (a: number) => (((a + half) % totalArc) + totalArc) % totalArc - half;
  const restAngle = wrap(index * STEP_DEG);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const portraitW = Math.max(180, Math.min(0.135 * vpW, 225)); // original cover size
  // don't let the faded resting arc capture clicks over the content below it
  const pe = useTransform(overlayOp, (v) => (v > 0.9 ? "auto" : "none"));

  const angle = useTransform([intro, phase], ([iv, pv]: number[]) =>
    iv < 1 ? restAngle * iv : wrap(index * STEP_DEG - pv)
  );

  const transform = useTransform(
    [angle, intro, p, gridLeft, gridTop, colW, gapX, rowStepY, cellH, anchorBottom],
    ([a, iv, pv, gl, gt, cw, gp, rs, ch, ab]: number[]) => {
      const r = (a * Math.PI) / 180;
      const s = 1 - iv;
      // sit the arc just under the measured CTA (tracks it up and off-screen once
      // scrolled; the lower-third fallback only applies before the CTA is measured)
      const arcCenterY = ab !== 0 ? ab + 24 + ARC_HALF : vpH * 0.72;
      const ARC_Y = arcCenterY - vpH / 2;
      const ax = RADIUS * Math.sin(r) + s * (index - mid) * 4;
      const ay = -VERTICAL_ARC * (1 - Math.cos(r)) + s * (index - mid) * 5 + ARC_Y;
      const az = RADIUS * (1 - Math.cos(r));
      const aScale = 0.88 + 0.12 * iv;
      const aRotZ = s * (index - mid) * 2.4;
      // live cell centre in viewport → overlay-centre relative
      const gx = gl + col * (cw + gp) + cw / 2 - vpW / 2;
      const gy = gt + row * rs + ch / 2 - vpH / 2;
      const X = lerp(ax, gx, pv);
      const Y = lerp(ay, gy, pv);
      const Z = lerp(az, 0, pv);
      const RY = lerp(-a, 0, pv);
      const RZ = lerp(aRotZ, 0, pv);
      const SC = lerp(aScale, 1, pv);
      return `translate(-50%, -50%) translateX(${X}px) translateY(${Y}px) translateZ(${Z}px) rotateY(${RY}deg) rotateZ(${RZ}deg) scale(${SC})`;
    }
  );

  const width = useTransform([p, colW], ([pv, cw]: number[]) => lerp(portraitW, cw || portraitW, pv));
  const zIndex = useTransform([angle, p], ([a, pv]: number[]) =>
    pv > 0.5 ? 1 : Math.round(RADIUS * (1 - Math.cos((a * Math.PI) / 180)))
  );
  const opacity = useTransform([angle, reveal, p], ([a, rv, pv]: number[]) => {
    const ab = Math.abs(a);
    const fade = ab >= 68 ? 0 : ab <= 58 ? 1 : 1 - (ab - 58) / 10;
    const inArc = lerp(fade * rv, 1, pv);
    // dissolve the cover over the last stretch, revealing the real cell (which is
    // already placed underneath) — a gentle crossfade, not an abrupt swap
    const out = pv > 0.94 ? 1 - (pv - 0.94) / 0.06 : 1;
    return inArc * Math.max(0, out);
  });

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ transform, zIndex, opacity, transformStyle: "preserve-3d", pointerEvents: pe }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <motion.div style={{ width }}>
        <Link href={`/themes/${theme.slug}`} className="group relative block w-full">
          <MorphFace theme={theme} number={number} p={p} />
        </Link>
      </motion.div>
    </motion.div>
  );
}

function MorphFace({
  theme,
  number,
  p,
}: {
  theme: Theme;
  number: number;
  p: MotionValue<number>;
}) {
  const free = theme.pricingType === "free" || theme.price === 0;
  const aspect = useTransform(p, [0, 1], [0.8, 1.6]); // 4:5 → 16:10
  const radius = useTransform(p, [0, 1], [12, 16]);
  const metaH = useTransform(p, [0.55, 1], [0, META_H - 12]);
  const metaOp = useTransform(p, [0.6, 1], [0, 1]);
  const num = String(number).padStart(3, "0");
  // same hover as the gallery card: a real second screenshot wipes in from below
  const altShot = theme.screenshots?.find((s) => s && s !== theme.image) ?? null;

  return (
    <>
      <motion.div
        style={{ aspectRatio: aspect, borderRadius: radius }}
        className="relative overflow-hidden border border-(--ed-line) bg-(--ed-surface) shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
      >
        <Image
          src={theme.image}
          alt={theme.title}
          fill
          sizes="420px"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {altShot && (
          <Image
            src={altShot}
            alt=""
            aria-hidden
            fill
            sizes="420px"
            className="absolute inset-0 object-cover object-top [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[clip-path:inset(0_0_0_0)]"
          />
        )}
      </motion.div>
      <motion.div style={{ height: metaH, opacity: metaOp }} className="overflow-hidden">
        <div className="mt-3 px-0.5">
          <p className="ed-label text-(--ed-ink-2)">
            {num}
            {theme.framework ? ` — ${theme.framework}` : ""}
          </p>
          <div className="mt-2 flex items-baseline justify-between gap-4">
            <h3 className="truncate text-[15px] font-semibold uppercase tracking-[0.04em] text-(--ed-ink)">
              {theme.title}
            </h3>
            <p className="shrink-0 text-[14px] tabular-nums text-(--ed-ink)">
              {free ? "Free" : `$${theme.price}`}
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
