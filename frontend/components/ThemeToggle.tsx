"use client";

import { useEffect, useState } from "react";
import { MonitorCogIcon, MoonStarIcon, SunIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { icon: MonitorCogIcon, value: "system" },
  { icon: SunIcon, value: "light" },
  { icon: MoonStarIcon, value: "dark" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid a hydration mismatch (theme is only known on the client)
  if (!isMounted) {
    return <div className="h-7 w-21" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center overflow-hidden rounded-md border bg-muted/80"
      role="radiogroup"
      aria-label="Theme"
    >
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            "relative flex size-7 cursor-pointer items-center justify-center rounded-md transition-all",
            theme === option.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          role="radio"
          aria-checked={theme === option.value}
          aria-label={`Switch to ${option.value} theme`}
          onClick={() => setTheme(option.value)}
        >
          {theme === option.value && (
            <motion.div
              layoutId="theme-option"
              transition={{ type: "spring", bounce: 0.1, duration: 0.75 }}
              className="absolute inset-0 rounded-md border border-muted-foreground/50"
            />
          )}
          <option.icon className="size-3.5" />
        </button>
      ))}
    </motion.div>
  );
}
