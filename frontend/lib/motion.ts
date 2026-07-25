"use client";

import { useEffect, useState } from "react";

/* Shared motion language for the homepage experience.
   One easing family + one duration scale so every animation feels related. */

// expo-style ease-out — weighted, physical, no bounce
export const EASE = [0.16, 1, 0.3, 1] as const;
// slightly softer variant for small UI moves
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

export const DUR = {
  micro: 0.3, //  hovers, arrows
  ui: 0.55, //    panels, controls
  reveal: 1, //   masked lines, images
  cinema: 1.3, // full-section moments
} as const;

/** SSR-safe media query hook (returns false on the server). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Desktop with a real pointer — gates cursor/parallax/pinned interactions. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px) and (pointer: fine)");
}
