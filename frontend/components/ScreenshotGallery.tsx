"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ScreenshotGallery({
  cover,
  screenshots,
}: {
  cover: string;
  screenshots: string[];
}) {
  const images = [cover, ...screenshots].filter(Boolean);
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-16/10 items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">
        No preview available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-16/10 overflow-hidden rounded-xl border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={`Preview ${active + 1}`}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-video overflow-hidden rounded-lg border bg-muted transition",
                i === active
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
