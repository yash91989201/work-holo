import { Skeleton } from "@work-holo/ui/components/skeleton";

export function FeatureSectionSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-56" />
        {[1, 2, 3].map((i) => (
          <Skeleton className="h-16 w-full rounded-2xl" key={i} />
        ))}
      </div>
    </div>
  );
}
