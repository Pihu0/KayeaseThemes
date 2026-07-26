"use client";

import { useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useIsDesktop } from "@/lib/motion";

/* WHAT WE DO — a faithful recreation of the Framer "flip-deck" section
   (ref: cyan-ways-868556.framer.app), matched against a per-frame motion
   trace of the original.

   Four slots around the deck, keyed by circular distance from the active card:
     · CENTRE (raw 0) → content face, largest, in front, shows "Click here"
     · RIGHT  (raw 1) → content face, darker, behind on the right
     · HIDDEN (raw 2) → tucked out of sight behind the centre
     · LEFT   (raw 3) → NUMBER face, bright, behind on the left

   Each card is a real 3D flip card (front = content, back = number). Clicking
   the centre advances the deck: LEFT→CENTRE flips to content as it grows in,
   CENTRE→RIGHT slides across, RIGHT→HIDDEN flips to its number and tucks away,
   HIDDEN→LEFT slides out. The rotateY flip is what makes cards "switch". */

const ITEMS = [
  {
    n: "01",
    title: "Premium\nWeb Themes",
    body: "A curated library of handcrafted, production-ready templates — designed for real businesses and ready to launch in minutes.",
  },
  {
    n: "02",
    title: "Responsive\nby Design",
    body: "Every theme adapts flawlessly from mobile to desktop, with carefully crafted breakpoints and pixel-perfect layouts.",
  },
  {
    n: "03",
    title: "Developer\nFriendly",
    body: "Clean, well-documented code on a modern stack — Next.js, React and Tailwind — so customization stays fast and painless.",
  },
  {
    n: "04",
    title: "Built to\nConvert",
    body: "Thoughtful UX, fast load times and modern design that turn visitors into loyal customers across every industry.",
  },
] as const;

const BRIGHT = "#2563eb"; // Aashita Blue — centre + left
const DARK = "#475569"; // Slate Receding — right (receding)
// easeInOutCubic ≈ GSAP power3.inOut — the original's easing
const EASE = [0.65, 0, 0.35, 1] as const;

/* Slot by circular distance from the active card — mapping matched to the
   reference: raw 0 = CENTRE, raw 1 = LEFT (number), raw 2 = HIDDEN,
   raw 3 = RIGHT (content). rotateY 0 shows CONTENT (front); 180 shows NUMBER. */
function slotFor(raw: number) {
  if (raw === 0)
    return { x: 0, scale: 1.24, rotateY: 0, z: 40, opacity: 1, bg: BRIGHT, cta: true };
  if (raw === 1) // LEFT — bright number face
    return { x: -258, scale: 1.0, rotateY: 180, z: 30, opacity: 1, bg: BRIGHT, cta: false };
  if (raw === 2) // HIDDEN — tucked behind the centre
    return { x: 0, scale: 0.85, rotateY: 180, z: 5, opacity: 0, bg: DARK, cta: false };
  // raw 3 → RIGHT — darker content face
  return { x: 258, scale: 1.0, rotateY: 0, z: 20, opacity: 1, bg: DARK, cta: false };
}

function CheckeredGrid() {
  const currentLetterIdxRef = useRef(0);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    // Only trigger on cells, and only if they are not already active
    if (!target || !target.classList.contains("grid-cell")) return;
    if (target.classList.contains("cell-active")) return;

    // Reset sequence back to 'K' after 1.5s of hover inactivity
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => {
      currentLetterIdxRef.current = 0;
    }, 1500);

    const letters = ["K", "A", "Y", "E", "A", "S", "E"];
    const char = letters[currentLetterIdxRef.current];
    currentLetterIdxRef.current = (currentLetterIdxRef.current + 1) % letters.length;

    // Set the character directly in DOM for 0ms React render lag
    target.textContent = char;
    target.classList.add("cell-active");

    // Smooth transition back to transparent and empty text (snappier 0.5s duration)
    setTimeout(() => {
      target.classList.remove("cell-active");
      // Double check that the cell's text hasn't been updated by a new hover
      if (target.textContent === char) {
        target.textContent = "";
      }
    }, 500);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gridPulse {
          0%, 100% { 
            background-color: transparent; 
            border-color: rgba(193, 192, 194, 0.08); 
          }
          50% { 
            background-color: rgba(138, 157, 177, 0.02); 
            border-color: rgba(138, 157, 177, 0.12); 
          }
        }
        .animate-grid-pulse {
          animation: gridPulse 9s infinite ease-in-out;
        }
        .grid-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 800;
          font-family: var(--font-heading), sans-serif;
          color: transparent;
          border: 0.5px solid transparent;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .grid-cell.cell-active {
          color: var(--primary);
          background-image: linear-gradient(135deg, rgba(138, 157, 177, 0.15), rgba(131, 125, 104, 0.1));
          border-color: rgba(138, 157, 177, 0.3);
          transform: scale(1.15) translate3d(0,0,0);
          z-index: 10;
          text-shadow: 0 0 6px rgba(138, 157, 177, 0.4);
          transition: none;
        }
      `}} />
      {/* Soft base wash blending with the primary site background */}
      <div className="absolute inset-0 bg-gradient-to-b from-(--ed-bg) via-white/5 to-(--ed-bg) dark:from-(--ed-bg) dark:via-black/10 dark:to-(--ed-bg) opacity-90" />
      <div 
        onMouseOver={handleMouseOver}
        className="grid grid-cols-[repeat(auto-fill,minmax(36px,1fr))] auto-rows-[36px] gap-[1px] p-[1px] w-full h-full pointer-events-auto"
      >
        {Array.from({ length: 2000 }).map((_, i) => {
          const delay = (i % 31) * 0.35;
          return (
            <div
              key={i}
              style={{ animationDelay: `${delay}s` }}
              className="grid-cell animate-grid-pulse"
            />
          );
        })}
      </div>
    </div>
  );
}

export default function WhatWeDo() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [active, setActive] = useState(3);

  const spread = isDesktop ? 1 : 0.58;
  const len = ITEMS.length;

  return (
    <section
      aria-label="What we do"
      className="relative w-full overflow-x-clip bg-(--ed-bg) py-24 transition-colors duration-300 sm:py-32 dark:bg-(--ed-dark)"
    >
      <CheckeredGrid />

      <h2
        style={{ fontFamily: "var(--font-heading)" }}
        className="relative z-10 text-center text-[clamp(2.25rem,6vw,3.5rem)] font-bold tracking-tight text-(--primary)"
      >
        What We Do
      </h2>
      <p className="relative z-10 mx-auto mt-5 max-w-xl px-6 text-center text-base leading-relaxed text-(--ed-ink-2) sm:text-lg dark:text-white/60">
        Everything we build helps businesses and developers launch beautiful,
        functional websites faster.
      </p>

      {/* perspective lives on the deck so each card's rotateY has real depth */}
      <div className="relative z-10 mx-auto mt-14 flex h-[600px] w-full max-w-6xl items-center justify-center [perspective:1800px] sm:mt-16 pointer-events-none">
        {ITEMS.map((item, i) => {
          const raw = (i - active + len) % len;
          const s = slotFor(raw);

          const onActivate = () => setActive(raw === 0 ? (i + 1) % len : i);

          return (
            <motion.button
              key={item.n}
              type="button"
              onClick={onActivate}
              aria-label={raw === 0 ? `${item.title.replace("\n", " ")} — next` : `Show ${item.title.replace("\n", " ")}`}
              initial={false}
              animate={{
                x: s.x * spread,
                scale: s.scale,
                rotateY: reduced ? 0 : s.rotateY,
                zIndex: s.z,
                opacity: s.opacity,
              }}
              transition={{
                duration: reduced ? 0 : 0.9,
                ease: EASE,
                // staggered flip: the outgoing card (→hidden) turns early, the
                // incoming card (→centre) turns ~230ms later — matches the trace
                rotateY: {
                  duration: reduced ? 0 : 0.65,
                  ease: EASE,
                  delay: reduced ? 0 : raw === 0 ? 0.25 : 0,
                },
              }}
              style={{
                pointerEvents: s.opacity === 0 ? "none" : "auto",
                transformStyle: "preserve-3d",
              }}
              className="absolute h-[380px] w-[280px] cursor-pointer rounded-[28px] text-left outline-none pointer-events-auto"
            >
              {/* FRONT — content (title + body + centre CTA) */}
              <motion.div
                animate={{ backgroundColor: s.bg }}
                transition={{ duration: 0.85, ease: EASE }}
                className="absolute inset-0 flex flex-col rounded-[28px] p-7 [backface-visibility:hidden] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.8)]"
              >
                <h3
                  style={{ fontFamily: "var(--font-heading)" }}
                  className="whitespace-pre-line text-[25px] font-bold leading-[1.12] tracking-[-0.5px] text-white"
                >
                  {item.title}
                </h3>
                <p className="mt-auto max-w-[210px] text-[14px] leading-relaxed text-white/90">
                  {item.body}
                </p>
                {s.cta && (
                  <span className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--secondary) text-sm font-semibold text-(--secondary-foreground) shadow-lg">
                    Explore
                  </span>
                )}
              </motion.div>

              {/* BACK — oversized number */}
              <motion.div
                animate={{ backgroundColor: s.bg }}
                transition={{ duration: 0.85, ease: EASE }}
                className="absolute inset-0 flex items-center rounded-[28px] p-7 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.8)]"
              >
                <span
                  style={{ fontFamily: "var(--font-heading)" }}
                  className="text-[110px] font-bold leading-none tracking-[-6px] text-white"
                >
                  {item.n}
                </span>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
