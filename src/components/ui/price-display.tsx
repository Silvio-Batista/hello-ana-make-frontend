import {
  formatCurrency,
  formatDiscountPercentage,
  getInstallmentInfo,
  cn,
} from "@/lib/utils";

export interface PriceDisplayProps {
  price: number;
  promotionalPrice?: number | null;
  showInstallments?: boolean;
  maxInstallments?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const priceSizes = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
} as const;

export function PriceDisplay({
  price,
  promotionalPrice,
  showInstallments = true,
  maxInstallments = 6,
  className,
  size = "md",
}: PriceDisplayProps) {
  const hasPromo =
    promotionalPrice != null && promotionalPrice > 0 && promotionalPrice < price;
  const current = hasPromo ? promotionalPrice : price;
  const discount = hasPromo
    ? formatDiscountPercentage(price, promotionalPrice)
    : 0;
  const installments = getInstallmentInfo(current, maxInstallments);

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {hasPromo ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-secondary line-through">
            {formatCurrency(price)}
          </span>
          {discount > 0 ? (
            <span className="rounded-lg bg-error/10 px-1.5 py-0.5 text-xs font-semibold text-error">
              -{discount}%
            </span>
          ) : null}
        </div>
      ) : null}
      <span
        className={cn(
          "font-semibold text-text-primary tabular-nums",
          priceSizes[size],
        )}
      >
        {formatCurrency(current)}
      </span>
      {showInstallments ? (
        <span className="text-xs text-text-secondary">{installments.label}</span>
      ) : null}
    </div>
  );
}
