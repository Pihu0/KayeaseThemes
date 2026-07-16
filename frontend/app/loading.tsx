import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-center gap-4">
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <Skeleton className="h-5 w-1/2 max-w-sm" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border">
            <Skeleton className="aspect-16/10 w-full rounded-none" />
            <div className="flex items-center justify-between p-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-10" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
