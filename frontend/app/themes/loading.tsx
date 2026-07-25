import { Skeleton } from "@/components/ui/skeleton";

/* Editorial skeleton matching the archive layout: metadata row, oversized
   headline, category strip, search bar, then the 3-column gallery. */
export default function Loading() {
  return (
    <main className="editorial min-h-svh">
      <div className="ed-px mx-auto w-full max-w-[1760px] pt-16 sm:pt-24">
        {/* metadata + headline */}
        <div className="flex items-baseline justify-between">
          <Skeleton className="h-3 w-32 bg-(--ed-line-soft)" />
          <Skeleton className="h-3 w-24 bg-(--ed-line-soft)" />
        </div>
        <Skeleton className="mt-10 h-[clamp(2.6rem,7vw,7.25rem)] w-[min(90%,54rem)] bg-(--ed-line-soft)" />
        <Skeleton className="mt-4 h-[clamp(2.6rem,7vw,7.25rem)] w-[min(70%,42rem)] bg-(--ed-line-soft)" />

        {/* category strip + search */}
        <div className="mt-16 flex gap-7 border-b border-(--ed-line-soft) pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-20 bg-(--ed-line-soft)" />
          ))}
        </div>
        <div className="mt-5 flex items-center gap-6">
          <Skeleton className="h-12 flex-1 rounded-xl bg-(--ed-line-soft)" />
          <Skeleton className="hidden h-3 w-20 bg-(--ed-line-soft) sm:block" />
          <Skeleton className="hidden h-3 w-28 bg-(--ed-line-soft) sm:block" />
        </div>

        {/* gallery */}
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 pb-24 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-16/10 w-full rounded-2xl bg-(--ed-line-soft)" />
              <Skeleton className="mt-4 h-3 w-24 bg-(--ed-line-soft)" />
              <div className="mt-3 flex items-center justify-between">
                <Skeleton className="h-4 w-36 bg-(--ed-line-soft)" />
                <Skeleton className="h-4 w-12 bg-(--ed-line-soft)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
