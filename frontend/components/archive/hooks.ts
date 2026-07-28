"use client";

import { useEffect, type RefObject } from "react";

/* Small a11y/behavior hooks shared by the archive overlays
   (filter drawer, quick view). */

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    
    if ((window as any).lenis) (window as any).lenis.stop();
    const lockScroll = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", lockScroll, { passive: false });
    window.addEventListener("touchmove", lockScroll, { passive: false });

    return () => {
      el.style.overflow = prev;
      if ((window as any).lenis) (window as any).lenis.start();
      window.removeEventListener("wheel", lockScroll);
      window.removeEventListener("touchmove", lockScroll);
    };
  }, [active]);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab/Shift+Tab cycling inside the overlay and closes on Escape.
 * On open, focus moves to the first focusable element; on close it is
 * returned to whatever had focus before (usually the trigger button).
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onClose: () => void
) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;
    const previous = document.activeElement as HTMLElement | null;

    // initial focus — prefer an element marked as such, else the first one
    const initial =
      node.querySelector<HTMLElement>("[data-autofocus]") ??
      node.querySelector<HTMLElement>(FOCUSABLE);
    initial?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [active, ref, onClose]);
}
