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

/** PRIMARY — filled button with a brand-blue sweep + arrow that nudges on hover.
   Magnetic. Renders as a link (href), an action button (onClick), or a form
   submit (type="submit"). This is the single source of truth for primary CTAs
   across the site — style it here and every CTA stays in sync. */
export function EdButton({
  href,
  onClick,
  type = "button",
  disabled = false,
  icon,
  children,
  invert = false,
  className,
}: {
  /** render as a link (navigation) — mutually exclusive with onClick */
  href?: string;
  /** render as a button (in-page action) */
  onClick?: () => void;
  /** button behaviour — "submit" wires it to the enclosing form */
  type?: "button" | "submit";
  /** disables the button variant (e.g. while a form is sending) */
  disabled?: boolean;
  /** trailing icon; defaults to the ↗ arrow. Inherits the hover nudge. */
  icon?: React.ReactNode;
  children: string;
  /** true on dark chapters: light fill, dark text */
  invert?: boolean;
  className?: string;
}) {
  const shared = cn(
    "group relative inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-xl px-6 text-[13px] font-medium uppercase tracking-[0.14em] transition-all duration-300 border border-black/10 dark:border-white/10 outline-none select-none",
    invert
      ? "bg-white text-black hover:border-primary dark:bg-neutral-900 dark:text-white"
      : "bg-white text-black hover:border-primary dark:bg-neutral-900 dark:text-white",
    disabled && "pointer-events-none opacity-60",
    className
  );

  const inner = (
    <>
      <span aria-hidden className="pointer-events-none absolute -inset-y-6 left-[-25%] w-[150%] -translate-x-[160%] skew-x-[-16deg] bg-blue-700 transition-transform duration-500 ease-out group-hover:translate-x-0" />
      <span className="relative z-10 flex items-center gap-2.5 text-black dark:text-white transition-colors duration-300 ease-in-out group-hover:text-white">
        <TextRoll>{children}</TextRoll>
        <span className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          {icon ?? <ArrowUpRight className="size-4" />}
        </span>
      </span>
    </>
  );

  return (
    <Magnetic className="inline-block">
      {href ? (
        <Link href={href} className={shared}>
          {inner}
        </Link>
      ) : (
        <button type={type} onClick={onClick} disabled={disabled} className={shared}>
          {inner}
        </button>
      )}
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
        "group flex size-11 items-center justify-center rounded-xl border transition-colors duration-300",
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
