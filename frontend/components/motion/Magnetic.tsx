"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useIsDesktop } from "@/lib/motion";

/**
 * Refined magnetic hover (shared motion language: MAGNETIC MOVEMENT).
 * Pulls its child a few pixels toward the cursor — max ~5px, never more.
 * Desktop-with-pointer only; inert on touch and for reduced motion.
 */
export default function Magnetic({
  children,
  strength = 5,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const enabled = desktop && !reduced;

  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    // -0.5..0.5 relative to element centre → scaled to `strength`
    x.set(((e.clientX - r.left) / r.width - 0.5) * 2 * strength);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 2 * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={enabled ? { x, y } : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
    >
      {children}
    </motion.div>
  );
}
