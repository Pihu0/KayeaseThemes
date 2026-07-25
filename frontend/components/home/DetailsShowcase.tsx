"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { Menu, Plus } from "lucide-react";
import { EASE } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel } from "@/components/home/editorial";
import type { Theme } from "@/lib/types";

/* 04 — THE DETAILS
   “The difference between a template and an experience lives in the details.”
   Instead of icon cards: four small working interactions, laid out on an
   irregular bento (7/5 then 5/7) so it never reads as a SaaS grid. All hover
   demos are pure CSS; only the phone scroll is scroll-linked. */

export default function DetailsShowcase({ themes }: { themes: Theme[] }) {
  const [a, b, c] = [themes[0], themes[1] ?? themes[0], themes[2] ?? themes[0]];
  if (!a) return null;


  return (
    <section aria-label="The details" className="bg-(--ed-surface) py-28 sm:py-36">
      <div className="ed-px mx-auto max-w-[1760px]">
        <SectionLabel>04 / The Details</SectionLabel>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <MaskedLines
            as="h2"
            lines={["Designed down", "to the last pixel."]}
            className="ed-display text-[clamp(2.4rem,5.5vw,6.25rem)]"
          />
          <p className="mb-2 max-w-xs text-[15px] leading-relaxed text-(--ed-ink-2)">
            The difference between a template and an experience lives in the
            details.
          </p>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-12">
          <Module className="lg:col-span-7" index="01" caption="Navigation that feels effortless.">
            <NavigationDemo theme={a} />
          </Module>
          <Module className="lg:col-span-5" index="02" caption="Interactions with intention.">
            <ProductDemo theme={b} />
          </Module>
          <Module className="lg:col-span-5" index="03" caption="Designed for every screen.">
            <PhoneDemo theme={c} />
          </Module>
          <Module className="lg:col-span-7" index="04" caption="Motion with purpose.">
            <MotionDemo theme={a} />
          </Module>
        </div>
      </div>
    </section>
  );
}

/* ---------- bento cell ---------- */

function Module({
  index,
  caption,
  className = "",
  children,
}: {
  index: string;
  caption: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className={"group flex flex-col " + className}
    >
      <div className="relative flex-1 overflow-hidden rounded-[20px] border border-(--ed-line-soft) bg-(--ed-card)">
        {children}
      </div>
      <div className="mt-4 flex items-baseline gap-4">
        <span className="text-[11px] tabular-nums text-(--ed-ink-2)">{index}</span>
        <h3 className="text-sm font-medium">{caption}</h3>
      </div>
    </motion.div>
  );
}

/* ---------- 01 · navigation — hover opens a staggered menu ---------- */

function NavigationDemo({ theme }: { theme: Theme }) {
  const links = ["Collection", "Lookbook", "Journal", "Contact"];
  return (
    <div className="flex h-full min-h-80 flex-col p-6 sm:p-10">
      <div className="overflow-hidden rounded-xl border border-(--ed-line-soft) bg-(--ed-bg)">
        {/* mini navbar */}
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">
            {theme.title}
          </span>
          <Menu className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-90" />
        </div>
        {/* menu panel — slides open on hover/focus */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <ul className="border-t border-(--ed-line-soft) px-5 py-4">
              {links.map((l, i) => (
                <li
                  key={l}
                  style={{ transitionDelay: `${80 + i * 60}ms` }}
                  className="ed-display translate-y-3 py-1.5 text-2xl opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
                >
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="mt-auto pt-6 text-xs text-(--ed-ink-2)">Hover to open the menu</p>
    </div>
  );
}

/* ---------- 02 · product card — live mobile render of the theme's site ------- */

function ProductDemo({ theme }: { theme: Theme }) {
  return (
    <div className="flex h-full min-h-80 items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-64">
        <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-(--ed-bg)">
          <LivePreview
            url={theme.demoUrl}
            title={`${theme.title} — live preview`}
            fallback={theme.screenshots?.[0] || theme.image}
            alt={`${theme.title} preview`}
          />
          {/* CTA appears from below */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex translate-y-8 items-center justify-between rounded-md bg-white/85 px-3.5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#111] opacity-0 backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
            Add to cart
            <Plus className="size-3.5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em]">{theme.title}</p>
            <p className="mt-0.5 text-[11px] text-(--ed-ink-2)">{theme.category}</p>
          </div>
          <p className="text-xs tabular-nums">
            {theme.price > 0 ? `$${theme.price}` : "Free"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- reusable live mobile preview ----------
   Renders a real site inside its (relative, overflow-hidden) parent as a *mobile*
   view: the iframe is laid out at a true phone width (MOBILE_W) so the site serves
   its mobile layout, then CSS-scaled to the parent's width so it fits exactly. It
   only mounts once scrolled into view, and a screenshot fallback covers it until
   the live frame paints. Fills the parent — the parent controls the visible box. */

const MOBILE_W = 390; // real mobile viewport width the site renders at
const MOBILE_H = Math.round((MOBILE_W * 19) / 9); // tall enough to fill a 9/19 screen
const PREVIEW_URL = "https://blushora.kayease.com/"; // live site shown in the phone

function LivePreview({
  url,
  title,
  fallback,
  alt,
}: {
  url?: string;
  title: string;
  fallback?: string;
  alt: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { once: true, margin: "10% 0px" });
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // keep the scale exact as the box resizes across breakpoints
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / MOBILE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden">
      {fallback && (
        <Image
          src={fallback}
          alt={alt}
          fill
          sizes="256px"
          className={
            "object-cover object-top transition-opacity duration-700 " +
            (loaded ? "opacity-0" : "opacity-100")
          }
        />
      )}
      {inView && url && scale > 0 && (
        <iframe
          src={url}
          title={title}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups"
          onLoad={() => setLoaded(true)}
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{
            width: MOBILE_W,
            height: MOBILE_H,
            transform: `scale(${scale})`,
          }}
        />
      )}
    </div>
  );
}

/* ---------- 03 · phone — live mobile render of the featured site ---------- */

function PhoneDemo({ theme }: { theme: Theme }) {
  return (
    <div className="flex h-full min-h-96 items-center justify-center p-6 sm:p-10">
      <div className="relative w-44 overflow-hidden rounded-[30px] border-[6px] border-(--ed-ink) bg-(--ed-ink) shadow-none sm:w-52">
        <div className="relative aspect-9/19 overflow-hidden rounded-3xl bg-(--ed-bg)">
          <LivePreview
            url={PREVIEW_URL}
            title="Blushora — live mobile preview"
            fallback={theme.screenshots?.[0] || theme.image}
            alt={`${theme.title} on mobile`}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- 04 · motion — hover replays a masked + clip reveal ---------- */

function MotionDemo({ theme }: { theme: Theme }) {
  const src = theme.screenshots?.[1] || theme.image;
  return (
    <div className="flex h-full min-h-80 flex-col justify-between gap-8 p-6 sm:flex-row sm:items-center sm:p-10">
      <div>
        {/* word reveals from its mask on hover */}
        <div className="overflow-hidden">
          <p className="ed-display translate-y-0 text-[clamp(2rem,4vw,3.5rem)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:animate-none">
            <span className="block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-[-110%]">
              Motion
            </span>
          </p>
        </div>
        <div className="mt-[-1em] overflow-hidden">
          <p className="ed-display translate-y-[110%] text-[clamp(2rem,4vw,3.5rem)] text-(--ed-ink-2) transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
            Purpose
          </p>
        </div>
        <p className="mt-6 max-w-52 text-xs leading-relaxed text-(--ed-ink-2)">
          Reveals, masks and easing tuned to feel weighted — never decorative.
        </p>
      </div>
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg border border-(--ed-line-soft) sm:w-1/2">
        {src && (
          <Image
            src={src}
            alt={`${theme.title} reveal`}
            fill
            sizes="(max-width: 640px) 100vw, 420px"
            className="scale-108 object-cover object-top transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
          />
        )}
        {/* clip curtain — covers at rest, lifts on hover to replay the reveal */}
        <div className="absolute inset-0 flex origin-top items-center justify-center bg-(--ed-bg) transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-0">
          <span className="ed-label text-(--ed-ink-2)">Hover to play</span>
        </div>
      </div>
    </div>
  );
}
