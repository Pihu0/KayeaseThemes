"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { EASE, useIsDesktop } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { EdButton, EdLink } from "@/components/home/editorial";
import type { Theme } from "@/lib/types";

/* 09 — FINAL CTA
   The emotional ending: a dark room with the collection floating quietly in
   the background. Previews drift slowly (compositor-only transforms) and
   lean a few pixels toward the cursor. Copy stays fully readable — the
   collage sits at low opacity behind a vignette. */

// deliberate scatter — position, size, drift duration, drift amplitude
const SPOTS = [
  { cls: "left-[4%] top-[12%] w-[clamp(8rem,16vw,15rem)]", dur: 16, amp: 16, depth: 18 },
  { cls: "right-[6%] top-[8%] w-[clamp(7rem,14vw,13rem)]", dur: 19, amp: 20, depth: 26 },
  { cls: "left-[12%] bottom-[10%] w-[clamp(7rem,13vw,12rem)]", dur: 21, amp: 14, depth: 32 },
  { cls: "right-[10%] bottom-[14%] w-[clamp(8rem,15vw,14rem)]", dur: 17, amp: 18, depth: 22 },
  { cls: "left-[44%] top-[6%] w-[clamp(6rem,11vw,10rem)]", dur: 23, amp: 12, depth: 40 },
];

export default function FinalCTA({ themes }: { themes: Theme[] }) {
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const drift = !reduced;
  const parallax = desktop && !reduced;

  // cursor lean, spring-smoothed, a few px only
  const mx = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!parallax) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <section
      aria-label="Start exploring"
      onMouseMove={onMove}
      className="relative flex min-h-svh items-center overflow-hidden bg-(--ed-dark) text-(--ed-ink-on-dark)"
    >
      {/* floating collection, behind everything */}
      <div aria-hidden className="absolute inset-0">
        {themes.slice(0, SPOTS.length).map((t, i) => {
          const s = SPOTS[i];
          return (
            <FloatingCard
              key={t._id}
              theme={t}
              spot={s}
              drift={drift}
              mx={mx}
              my={my}
              parallax={parallax}
            />
          );
        })}
        {/* vignette keeps the typography effortless to read */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(16,16,16,0.72),rgba(16,16,16,0.35))]" />
      </div>

      <div className="ed-px relative z-10 mx-auto flex w-full max-w-[1760px] flex-col items-center py-32 text-center">
        <MaskedLines
          as="h2"
          lines={["Your next website", "starts here."]}
          className="ed-display text-[clamp(2.8rem,8vw,8.5rem)]"
        />
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="mt-8 max-w-md text-[15px] leading-relaxed text-(--ed-ink-2-on-dark)"
        >
          Find a theme designed for where your brand is going.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-9 gap-y-4"
        >
          <EdButton href="/themes" invert>
            Explore All Themes
          </EdButton>
          <EdLink href="/contact" onDark>
            Talk to Us
          </EdLink>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingCard({
  theme,
  spot,
  drift,
  parallax,
  mx,
  my,
}: {
  theme: Theme;
  spot: (typeof SPOTS)[number];
  drift: boolean;
  parallax: boolean;
  mx: ReturnType<typeof useMotionValue<number>>;
  my: ReturnType<typeof useMotionValue<number>>;
}) {
  // deeper cards lean more — cheap depth without 3D
  const leanX = useTransform(mx, [-1, 1], [-spot.depth / 2, spot.depth / 2]);
  const leanY = useTransform(my, [-1, 1], [-spot.depth / 3, spot.depth / 3]);

  if (!theme.image) return null;
  return (
    <motion.div
      style={parallax ? { x: leanX, y: leanY } : undefined}
      className={"absolute " + spot.cls}
    >
      <motion.div
        animate={drift ? { y: [-spot.amp, spot.amp, -spot.amp] } : undefined}
        transition={
          drift
            ? { duration: spot.dur, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        className="relative aspect-3/4 overflow-hidden rounded-xl opacity-25"
      >
        <Image
          src={theme.image}
          alt=""
          fill
          sizes="240px"
          className="object-cover object-top"
        />
      </motion.div>
    </motion.div>
  );
}
