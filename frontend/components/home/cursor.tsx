"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { useIsDesktop } from "@/lib/motion";

/* CURSOR PREVIEW (shared motion language): a circular “VIEW / EXPLORE” badge
   that trails the pointer, shown ONLY while hovering theme previews.
   Desktop-with-pointer only — never rendered for touch or reduced motion.
   Purely decorative: the underlying links stay ordinary links, so keyboard
   and screen-reader interaction is untouched. */

const CursorContext = createContext<(label: string | null) => void>(() => {});

/** Hover handlers for elements that should summon the project cursor. */
export function useProjectCursor(label = "View") {
  const set = useContext(CursorContext);
  return {
    onMouseEnter: () => set(label),
    onMouseLeave: () => set(null),
  };
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [label, setLabel] = useState<string | null>(null);
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const enabled = desktop && !reduced;

  const x = useSpring(useMotionValue(-100), { stiffness: 380, damping: 34 });
  const y = useSpring(useMotionValue(-100), { stiffness: 380, damping: 34 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [enabled, x, y]);

  const set = useCallback(
    (l: string | null) => setLabel(enabled ? l : null),
    [enabled]
  );

  return (
    <CursorContext.Provider value={set}>
      {children}
      {enabled && (
        <AnimatePresence>
          {label && (
            <motion.div
              aria-hidden
              style={{ x, y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="pointer-events-none fixed left-0 top-0 z-80 -ml-8 -mt-8 flex size-16 items-center justify-center rounded-full bg-(--ed-ink) text-center text-[10px] font-medium uppercase leading-tight tracking-[0.18em] text-(--ed-bg) mix-blend-normal"
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </CursorContext.Provider>
  );
}
