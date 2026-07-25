"use client";

import { cn } from "@/lib/utils";

/**
 * Vertical text-roll hover (shared motion language: TEXT ROLL).
 * The visible copy slides up and a duplicate enters from below.
 * Pure CSS — needs a `group` class on the interactive parent.
 */
export default function TextRoll({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn("relative inline-flex overflow-hidden align-bottom", className)}
    >
      <span
        aria-hidden={false}
        className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
      >
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 motion-reduce:hidden"
      >
        {children}
      </span>
    </span>
  );
}
