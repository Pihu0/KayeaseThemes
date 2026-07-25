"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EASE, useIsDesktop } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import Magnetic from "@/components/motion/Magnetic";
import TextRoll from "@/components/motion/TextRoll";
import { SectionLabel } from "@/components/home/editorial";
import type { Theme } from "@/lib/types";

/* CLOSING — the page turns dark for its conclusion (brief §42–44).
   Behind the headline, two or three real theme covers sit at very low opacity
   and drift a handful of pixels with the cursor — present, never competing
   with the type. No location line: "Jaipur" isn't confirmed anywhere in the
   project, so per the brief we omit it rather than invent it. */

const SPOTS = [
  { top: "8%", left: "6%", w: 200, depth: 10 },
  { top: "52%", left: "70%", w: 240, depth: -14 },
  { top: "18%", left: "78%", w: 150, depth: 8 },
];

export default function ClosingSection({ themes }: { themes: Theme[] }) {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const drift = desktop && !reduced;

  // pointer position, normalised to -0.5..0.5, softened by springs
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });

  const covers = themes.filter((t) => t.image).slice(0, SPOTS.length);

  const onMove = (e: React.MouseEvent) => {
    if (!drift) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      onMouseMove={onMove}
      className="relative isolate mt-[clamp(6rem,10vw,10rem)] overflow-hidden bg-[#101010] text-[#f4f4f0]"
    >
      {/* faint drifting theme covers */}
      {drift &&
        covers.map((t, i) => (
          <Cover key={t._id} theme={t} spot={SPOTS[i]} px={px} py={py} />
        ))}

      <div className="ed-px mx-auto w-full max-w-[1760px] py-[clamp(7rem,14vw,13rem)]">
        <SectionLabel onDark>Kayease®</SectionLabel>
        <MaskedLines
          as="h2"
          lines={["Good things", "start with", "a conversation."]}
          className="ed-display mt-8 text-[clamp(2.75rem,8.5vw,8.5rem)]"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4"
        >
          <Magnetic className="inline-block">
            <Link
              href="/themes"
              className="group inline-flex h-12 items-center gap-2.5 bg-[#f4f4f0] px-6 text-[13px] font-medium uppercase tracking-[0.14em] text-[#101010] transition-colors duration-300 hover:bg-white"
            >
              <TextRoll>Explore themes</TextRoll>
              <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Magnetic>
          <a
            href="mailto:team@kayease.com"
            className="ed-underline text-[13px] font-medium uppercase tracking-[0.14em] text-[#98978f] transition-colors hover:text-[#f4f4f0]"
          >
            team@kayease.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Cover({
  theme,
  spot,
  px,
  py,
}: {
  theme: Theme;
  spot: (typeof SPOTS)[number];
  px: ReturnType<typeof useMotionValue<number>>;
  py: ReturnType<typeof useMotionValue<number>>;
}) {
  const x = useTransform(px, (v) => v * spot.depth);
  const y = useTransform(py, (v) => v * spot.depth);
  return (
    <motion.div
      aria-hidden
      style={{ x, y, top: spot.top, left: spot.left, width: spot.w }}
      className="pointer-events-none absolute -z-10 hidden aspect-4/3 overflow-hidden rounded-lg opacity-[0.12] lg:block"
    >
      <Image
        src={theme.image}
        alt=""
        fill
        sizes="240px"
        className="object-cover object-top grayscale"
      />
    </motion.div>
  );
}
