"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: React.ReactNode;
  variant?: "default" | "dark" | "outline" | "indigo";
  className?: string;
  icon?: React.ReactNode;
}

export function AnimatedButton({
  href,
  children,
  variant = "default",
  className,
  icon,
  disabled,
  onClick,
  type = "button",
  ...props
}: AnimatedButtonProps) {
  const baseClasses = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden px-6 py-3 font-medium uppercase tracking-[0.14em] text-xs transition-all duration-300 rounded-xl border border-black/15 dark:border-white/15 outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50",
    variant === "default" &&
      "bg-white text-black hover:border-purple-600 dark:bg-neutral-900 dark:text-white dark:hover:border-purple-500",
    variant === "indigo" &&
      "bg-white border-indigo-600/20 text-black hover:border-indigo-600 dark:bg-neutral-900 dark:border-indigo-500/30 dark:text-white",
    variant === "dark" &&
      "bg-neutral-950 border-neutral-800 text-white hover:border-purple-600",
    variant === "outline" &&
      "bg-transparent border-current text-current hover:border-purple-600",
    className
  );

  const wipeBg =
    variant === "indigo"
      ? "bg-gradient-to-r from-indigo-600 to-purple-600"
      : "bg-purple-600 dark:bg-purple-600";

  const wipeElement = (
    <span
      className={cn(
        "absolute bottom-0 left-0 mb-9 ml-9 h-56 w-56 -translate-x-full translate-y-full rotate-[-40deg] rounded transition-all duration-500 ease-out group-hover:mb-32 group-hover:ml-0 group-hover:translate-x-0 pointer-events-none",
        wipeBg
      )}
    />
  );

  const contentElement = (
    <span className="relative z-10 flex items-center justify-center gap-2 w-full transition-colors duration-300 ease-in-out group-hover:text-white">
      {children}
      {icon && <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">{icon}</span>}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {wipeElement}
        {contentElement}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      {wipeElement}
      {contentElement}
    </button>
  );
}

/** Component export to match user snippet schema */
export const Component = ({ label = "Animation Button" }: { label?: string }) => {
  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
      <a
        href="#"
        className="relative inline-flex items-center justify-start px-6 py-2 overflow-hidden font-medium transition-all bg-white rounded-xl hover:bg-white group outline outline-1"
      >
        <span className="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0" />
        <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
          {label}
        </span>
      </a>
    </div>
  );
};
