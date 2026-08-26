"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/contracts";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { cn, formatCurrency } from "@/lib/utils";

export interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  className?: string;
}

export function CartItem({
  item,
  onQuantityChange,
  onRemove,
  className,
}: CartItemProps) {
  const unit =
    item.promotionalPrice != null && item.promotionalPrice < item.unitPrice
      ? item.promotionalPrice
      : item.unitPrice;

  return (
    <article
      className={cn(
        "flex gap-3 border-b border-border py-4 last:border-b-0 sm:gap-4",
        className,
      )}
    >
      <Link
        href={`/produtos/${item.productSlug}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-nude sm:size-24"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/produtos/${item.productSlug}`}
              className="line-clamp-2 text-sm font-semibold text-text-primary hover:text-primary sm:text-base"
            >
              {item.productName}
            </Link>
            <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
              {item.variantName}
            </p>
            {!item.isAvailable ? (
              <p className="mt-1 text-xs font-medium text-error">
                Indisponível no momento
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remover ${item.productName}`}
            className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-secondary hover:text-error"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <QuantitySelector
            value={item.quantity}
            onChange={onQuantityChange}
            max={item.maxQuantity}
            min={1}
            disabled={!item.isAvailable}
          />
          <div className="text-right">
            {item.promotionalPrice != null &&
            item.promotionalPrice < item.unitPrice ? (
              <p className="text-xs text-text-secondary line-through">
                {formatCurrency(item.unitPrice * item.quantity)}
              </p>
            ) : null}
            <p className="text-sm font-semibold tabular-nums text-text-primary sm:text-base">
              {formatCurrency(unit * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
