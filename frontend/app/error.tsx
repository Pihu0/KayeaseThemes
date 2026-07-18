"use client";

import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        An unexpected error occurred on our end. Please try again — if it keeps
        happening, head back home.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>
          <RotateCw className="h-4 w-4" /> Try again
        </Button>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
