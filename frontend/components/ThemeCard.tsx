"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import type { Theme } from "@/lib/types";

export default function ThemeCard({
  theme,
  priority = false,
  index = 0,
}: {
  theme: Theme;
  priority?: boolean;
  index?: number;
}) {
  const isFree = theme.pricingType === "free" || theme.price === 0;
  const onSale = theme.originalPrice > theme.price && theme.price > 0;
  const discount = onSale
    ? Math.round((1 - theme.price / theme.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={`/themes/${theme.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm ring-1 ring-transparent transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:ring-primary/10"
      >
        {/* Preview image — the full banner (object-contain, never cropped) sits
            on a blurred fill of the same image, so the card looks full-bleed
            with no empty bars regardless of the banner's aspect ratio. */}
        <div className="relative aspect-16/10 overflow-hidden border-b bg-muted">
          {theme.image ? (
            <>
              {/* Blurred backdrop fills the frame */}
              <Image
                src={theme.image}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="scale-110 object-cover blur-xl"
              />
              {/* Sharp, fully-visible banner */}
              <Image
                src={theme.image}
                alt={`${theme.title} theme preview`}
                fill
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="relative object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No preview
            </div>
          )}
          {/* subtle gradient on hover for depth */}
          <div className="absolute inset-0 bg-linear-to-t from-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {onSale ? (
            <Badge className="absolute right-3 top-3 bg-emerald-600 text-white hover:bg-emerald-600">
              {discount}% OFF
            </Badge>
          ) : (
            isFree && (
              <Badge className="absolute right-3 top-3 bg-emerald-600 text-white hover:bg-emerald-600">
                Free
              </Badge>
            )
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 items-start justify-between gap-3 p-4">
          <div className="min-w-0">
            <h3 className="truncate font-semibold transition-colors group-hover:text-primary">
              {theme.title}
            </h3>
            {theme.framework && (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {theme.framework}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right leading-tight">
            {onSale && (
              <div className="text-xs text-muted-foreground line-through">
                ${theme.originalPrice}
              </div>
            )}
            <div className="text-base font-semibold text-primary">
              {isFree ? "Free" : `$${theme.price}`}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
