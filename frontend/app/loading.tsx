import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
      <div className="flex flex-col items-center gap-5">
        <Skeleton className="h-8 w-40 rounded-full" />
        <Skeleton className="h-12 w-2/3 max-w-lg" />
        <Skeleton className="h-5 w-1/2 max-w-md" />
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-11 w-36" />
          <Skeleton className="h-11 w-44" />
        </div>
      </div>
    </main>
  );
}
