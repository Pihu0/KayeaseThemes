"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import TextRoll from "@/components/motion/TextRoll";
import Magnetic from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

/* Shared editorial building blocks for the homepage.
   Button system (per brief): PRIMARY dark filled + arrow, SECONDARY animated
   underline text link, TERTIARY circular arrow. */

/** Uppercase metadata label — “02 / SELECTED THEMES” */
export function SectionLabel({
  children,
  onDark = false,
  className,
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "ed-label",
        onDark ? "text-(--ed-ink-2-on-dark)" : "text-(--ed-ink-2)",
        className
      )}
    >
      {children}
    </p>
  );
}

/** PRIMARY — filled button with arrow that nudges ↗ on hover. Magnetic. */
export function EdButton({
  href,
  children,
  invert = false,
  className,
}: {
  href: string;
  children: string;
  /** true on dark chapters: light fill, dark text */
  invert?: boolean;
  className?: string;
}) {
  return (
    <Magnetic className="inline-block">
      <Link
        href={href}
        className={cn(
          "group inline-flex h-12 items-center gap-2.5 px-6 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
          invert
            ? "bg-(--ed-ink-on-dark) text-(--ed-dark) hover:bg-white"
            : "bg-(--ed-ink) text-(--ed-bg) hover:bg-black dark:hover:bg-white",
          className
        )}
      >
        <TextRoll>{children}</TextRoll>
        <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </Magnetic>
  );
}

/** SECONDARY — uppercase text link with left→right underline. */
export function EdLink({
  href,
  children,
  onDark = false,
  external = false,
  className,
}: {
  href: string;
  children: string;
  onDark?: boolean;
  external?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "ed-underline group inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.14em]",
        onDark ? "text-(--ed-ink-on-dark)" : "text-(--ed-ink)",
        className
      )}
    >
      <TextRoll>{children}</TextRoll>
      <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

/** TERTIARY — circular arrow control (testimonial prev/next etc.). */
export function CircleButton({
  onClick,
  label,
  onDark = false,
  flip = false,
  className,
}: {
  onClick: () => void;
  label: string;
  onDark?: boolean;
  /** point the arrow left */
  flip?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "group flex size-11 items-center justify-center rounded-full border transition-colors duration-300",
        onDark
          ? "border-(--ed-line-on-dark) text-(--ed-ink-on-dark) hover:bg-(--ed-ink-on-dark) hover:text-(--ed-dark)"
          : "border-(--ed-line) text-(--ed-ink) hover:bg-(--ed-ink) hover:text-(--ed-bg)",
        className
      )}
    >
      <ArrowUpRight
        className={cn(
          "size-4 transition-transform duration-300 ease-out",
          flip
            ? "rotate-[225deg] group-hover:-translate-x-0.5"
            : "rotate-45 group-hover:translate-x-0.5"
        )}
      />
    </button>
  );
}
