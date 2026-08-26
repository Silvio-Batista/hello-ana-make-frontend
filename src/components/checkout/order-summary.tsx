"use client";

import Image from "next/image";
import type { CartItem, CartTotals } from "@/contracts";
import { CouponForm } from "@/components/cart";
import { formatCurrency, cn } from "@/lib/utils";

export interface CheckoutOrderSummaryProps {
  items: CartItem[];
  totals: CartTotals;
  couponCode?: string | null;
  couponMessage?: string | null;
  onApplyCoupon?: (code: string) => Promise<boolean> | boolean;
  onRemoveCoupon?: () => void;
  shippingLabel?: string | null;
  className?: string;
}

export function CheckoutOrderSummary({
  items,
  totals,
  couponCode,
  couponMessage,
  onApplyCoupon,
  onRemoveCoupon,
  shippingLabel,
  className,
}: CheckoutOrderSummaryProps) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-white p-5 shadow-sm",
        className,
      )}
    >
      <h2 className="mb-4 font-display text-lg font-semibold text-text-primary">
        Resumo
      </h2>

      <ul className="mb-4 flex max-h-64 flex-col gap-3 overflow-y-auto">
        {items.map((item) => {
          const unit = item.promotionalPrice ?? item.unitPrice;
          return (
            <li key={item.id} className="flex gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-nude">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : null}
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                  {item.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">
                  {item.productName}
                </p>
                <p className="text-xs text-text-secondary">{item.variantName}</p>
              </div>
              <p className="shrink-0 text-sm font-medium tabular-nums">
                {formatCurrency(unit * item.quantity)}
              </p>
            </li>
          );
        })}
      </ul>

      {onApplyCoupon ? (
        <CouponForm
          appliedCode={couponCode}
          message={couponMessage}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
          className="mb-4"
        />
      ) : null}

      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-text-secondary">Subtotal</dt>
          <dd className="tabular-nums">{formatCurrency(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 ? (
          <div className="flex justify-between gap-3">
            <dt className="text-text-secondary">Desconto</dt>
            <dd className="tabular-nums text-success">
              −{formatCurrency(totals.discount)}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-3">
          <dt className="text-text-secondary">
            Frete{shippingLabel ? ` (${shippingLabel})` : ""}
          </dt>
          <dd className="tabular-nums">
            {totals.shipping > 0
              ? formatCurrency(totals.shipping)
              : shippingLabel
                ? "Grátis"
                : "A calcular"}
          </dd>
        </div>
        <div className="mt-1 flex justify-between gap-3 border-t border-border pt-3">
          <dt className="font-semibold">Total</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {formatCurrency(totals.total)}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
