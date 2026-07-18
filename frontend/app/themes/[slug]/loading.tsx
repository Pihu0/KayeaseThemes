import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <Skeleton className="mb-8 h-5 w-32" />

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left: gallery + content */}
        <div className="space-y-8 lg:col-span-2">
          <Skeleton className="aspect-16/10 w-full rounded-xl" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-lg" />
            ))}
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </div>

        {/* Right: purchase card */}
        <div>
          <div className="space-y-4 rounded-xl border p-6">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <div className="space-y-2 border-t pt-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
