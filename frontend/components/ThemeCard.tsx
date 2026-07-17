"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import type { Theme } from "@/lib/types";

export default function ThemeCard({
  theme,
  priority = false,
}: {
  theme: Theme;
  priority?: boolean;
}) {
  const isFree = theme.pricingType === "free" || theme.price === 0;
  const onSale = theme.originalPrice > theme.price && theme.price > 0;
  const discount = onSale
    ? Math.round((1 - theme.price / theme.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/themes/${theme.slug}`}
        className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Preview image */}
        <div className="relative aspect-16/10 overflow-hidden bg-muted">
          {theme.image ? (
            <Image
              src={theme.image}
              alt={`${theme.title} theme preview`}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No preview
            </div>
          )}
          <Badge className="absolute left-3 top-3">{theme.category}</Badge>
          {onSale && (
            <Badge className="absolute right-3 top-3 bg-emerald-600 text-white hover:bg-emerald-600">
              {discount}% OFF
            </Badge>
          )}
        </div>

        {/* Title + price */}
        <div className="flex items-center justify-between gap-2 p-4">
          <h3 className="truncate font-medium">{theme.title}</h3>
          <div className="flex shrink-0 items-baseline gap-1.5">
            {onSale && (
              <span className="text-xs text-muted-foreground line-through">
                ${theme.originalPrice}
              </span>
            )}
            <span className="font-semibold text-primary">
              {isFree ? "Free" : `$${theme.price}`}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
