import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Pagination({
  page,
  pages,
  params,
}: {
  page: number;
  pages: number;
  params: Record<string, string | undefined>;
}) {
  if (pages <= 1) return null;

  // Build an href that preserves current filters but changes the page
  const hrefFor = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && k !== "page") sp.set(k, v);
    });
    sp.set("page", String(p));
    return `/?${sp.toString()}`;
  };

  const base = buttonVariants({ variant: "outline", size: "sm" });
  const disabled = cn(base, "pointer-events-none opacity-50");

  return (
    <nav className="mt-12 flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={base}>
          Previous
        </Link>
      ) : (
        <span className={disabled}>Previous</span>
      )}

      <span className="px-2 text-sm text-muted-foreground">
        Page {page} of {pages}
      </span>

      {page < pages ? (
        <Link href={hrefFor(page + 1)} className={base}>
          Next
        </Link>
      ) : (
        <span className={disabled}>Next</span>
      )}
    </nav>
  );
}
