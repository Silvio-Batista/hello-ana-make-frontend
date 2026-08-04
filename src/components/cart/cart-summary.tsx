"use client";

import Link from "next/link";
import type { CartTotals } from "@/contracts";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { CouponForm } from "./coupon-form";

export interface CartSummaryProps {
  totals: CartTotals;
  couponCode?: string | null;
  couponMessage?: string | null;
  onApplyCoupon: (code: string) => Promise<boolean> | boolean;
  onRemoveCoupon?: () => void;
  checkoutHref?: string;
  className?: string;
  showCheckout?: boolean;
}

export function CartSummary({
  totals,
  couponCode,
  couponMessage,
  onApplyCoupon,
  onRemoveCoupon,
  checkoutHref = "/checkout",
  className,
  showCheckout = true,
}: CartSummaryProps) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-white p-5 shadow-sm",
        className,
      )}
    >
      <h2 className="mb-4 font-display text-lg font-semibold text-text-primary">
        Resumo do pedido
      </h2>

      <CouponForm
        appliedCode={couponCode}
        message={couponMessage}
        onApply={onApplyCoupon}
        onRemove={onRemoveCoupon}
        className="mb-5"
      />

      <dl className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-text-secondary">
            Subtotal ({totals.itemCount}{" "}
            {totals.itemCount === 1 ? "item" : "itens"})
          </dt>
          <dd className="font-medium tabular-nums text-text-primary">
            {formatCurrency(totals.subtotal)}
          </dd>
        </div>
        {totals.discount > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-text-secondary">Desconto</dt>
            <dd className="font-medium tabular-nums text-success">
              −{formatCurrency(totals.discount)}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-text-secondary">Frete</dt>
          <dd className="font-medium tabular-nums text-text-primary">
            {totals.shipping > 0
              ? formatCurrency(totals.shipping)
              : "Calcular no checkout"}
          </dd>
        </div>
        <div className="mt-2 flex justify-between gap-4 border-t border-border pt-3">
          <dt className="font-semibold text-text-primary">Total</dt>
          <dd className="text-lg font-semibold tabular-nums text-text-primary">
            {formatCurrency(totals.total)}
          </dd>
        </div>
      </dl>

      {showCheckout ? (
        <Link href={checkoutHref} className="mt-5 block">
          <Button variant="primary" className="w-full" size="lg">
            Finalizar compra
          </Button>
        </Link>
      ) : null}
    </aside>
  );
}
