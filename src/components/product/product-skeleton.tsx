import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface ProductSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export function ProductSkeleton({
  count = 8,
  className,
}: ProductSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
      aria-busy="true"
      aria-label="Carregando produtos"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-8 md:grid-cols-2",
        className,
      )}
      aria-busy="true"
      aria-label="Carregando produto"
    >
      <div className="flex flex-col gap-3">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="size-16 rounded-xl sm:size-20" />
          <Skeleton className="size-16 rounded-xl sm:size-20" />
          <Skeleton className="size-16 rounded-xl sm:size-20" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
