import { MessageSquare } from "lucide-react";
import type { ProductRating } from "@/contracts";
import { EmptyState } from "@/components/ui/empty-state";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

export interface ProductReviewsProps {
  rating: ProductRating;
  reviews?: ProductReview[];
  className?: string;
}

export function ProductReviews({
  rating,
  reviews = [],
  className,
}: ProductReviewsProps) {
  const distribution = rating.distribution;

  return (
    <section className={cn("w-full", className)}>
      <h2 className="mb-6 font-display text-xl font-semibold text-text-primary">
        Avaliações
      </h2>

      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
        <div className="flex flex-col items-start gap-2">
          <p className="font-display text-4xl font-semibold text-text-primary tabular-nums">
            {rating.average.toFixed(1)}
          </p>
          <StarRating rating={rating.average} size="md" />
          <p className="text-sm text-text-secondary">
            {rating.count}{" "}
            {rating.count === 1 ? "avaliação" : "avaliações"}
          </p>
        </div>

        {distribution ? (
          <ul className="flex w-full max-w-xs flex-col gap-1.5">
            {([5, 4, 3, 2, 1] as const).map((stars) => {
              const count = distribution[stars] ?? 0;
              const pct =
                rating.count > 0 ? Math.round((count / rating.count) * 100) : 0;
              return (
                <li key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-6 tabular-nums text-text-secondary">
                    {stars}★
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-nude">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right tabular-nums text-text-secondary">
                    {pct}%
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="size-6" aria-hidden />}
          title="Nenhuma avaliação ainda"
          description="Seja a primeira pessoa a avaliar este produto."
        />
      ) : (
        <ul className="flex flex-col gap-5">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="border-b border-border pb-5 last:border-b-0"
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-text-primary">
                  {review.author}
                </p>
                <StarRating rating={review.rating} size="sm" />
                <time
                  className="text-xs text-text-secondary"
                  dateTime={review.createdAt}
                >
                  {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                </time>
              </div>
              {review.title ? (
                <p className="mb-1 text-sm font-medium text-text-primary">
                  {review.title}
                </p>
              ) : null}
              <p className="text-sm leading-relaxed text-text-secondary">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
