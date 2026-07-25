import Link from "next/link";
import { ArrowRight, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomCTA() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="hero-glow relative overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 text-foreground/[0.04] bg-dot-grid"
        />
        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-primary">
            <PenTool className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Need something one-of-a-kind?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-pretty">
            Can&apos;t find the perfect fit? Tell us about your project and our
            team will design a custom theme built around your brand.
          </p>
          <div className="mt-8">
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              size="lg"
              data-icon="inline-end"
            >
              Request a custom design
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
