import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center duration-500 animate-in fade-in slide-in-from-bottom-4">
      {/* Ghost number + icon badge */}
      <div className="relative mb-6 flex items-center justify-center">
        <span className="font-heading text-[7rem] font-bold leading-none tracking-tighter text-primary/10 select-none sm:text-[9rem]">
          404
        </span>
        <div className="absolute flex h-16 w-16 items-center justify-center rounded-2xl border bg-card shadow-sm">
          <Compass className="h-8 w-8 text-primary" />
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Back to home
        </Link>
        <Link
          href="/categories"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Browse categories
        </Link>
      </div>
    </main>
  );
}
