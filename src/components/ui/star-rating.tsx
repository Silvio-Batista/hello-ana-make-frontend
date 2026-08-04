import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const starSizes = {
  sm: "size-3.5",
  md: "size-4",
} as const;

export function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const clamped = Math.min(Math.max(rating, 0), max);

  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      role="img"
      aria-label={`${clamped.toFixed(1)} de ${max} estrelas`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, index) => {
          const fill = Math.min(Math.max(clamped - index, 0), 1);
          return (
            <span key={index} className="relative inline-flex">
              <Star
                className={cn(starSizes[size], "text-champagne")}
                fill="currentColor"
                aria-hidden
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  className={cn(starSizes[size], "text-gold")}
                  fill="currentColor"
                  aria-hidden
                />
              </span>
            </span>
          );
        })}
      </div>
      {showValue ? (
        <span className="text-xs font-medium text-text-secondary tabular-nums">
          {clamped.toFixed(1)}
        </span>
      ) : null}
      {reviewCount != null ? (
        <span className="text-xs text-text-secondary">
          ({reviewCount})
        </span>
      ) : null}
    </div>
  );
}
