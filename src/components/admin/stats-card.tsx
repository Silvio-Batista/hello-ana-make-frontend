import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  loading,
  className,
}: StatsCardProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-white p-5",
          className,
        )}
      >
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-8 w-32" />
        <Skeleton className="mt-2 h-3 w-40" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-text-primary">
            {value}
          </p>
          {description ? (
            <p className="mt-1 text-xs text-text-secondary">{description}</p>
          ) : null}
        </div>
        {icon ? (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
