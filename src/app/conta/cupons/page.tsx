"use client";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui";
import { coupons } from "@/mocks/coupons";
import { formatCurrency } from "@/lib/utils";

function couponValueLabel(type: string, value: number): string {
  if (type === "percentage") return `${value}% OFF`;
  if (type === "fixed_amount") return `${formatCurrency(value)} OFF`;
  if (type === "free_shipping") return "Frete grátis";
  return String(value);
}

export default function CuponsPage() {
  const active = coupons.filter((c) => c.isActive);

  return (
    <div>
      <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
        Cupons
      </h2>
      <p className="mb-6 text-sm text-text-secondary">
        Use estes códigos no carrinho ou no checkout.
      </p>

      <ul className="flex flex-col gap-3">
        {active.map((coupon) => (
          <li
            key={coupon.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-white p-4 sm:p-5"
          >
            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Tag className="size-4" aria-hidden />
              </span>
              <div>
                <p className="font-mono text-sm font-semibold tracking-wide text-text-primary">
                  {coupon.code}
                </p>
                <p className="mt-0.5 text-sm text-text-secondary">
                  {coupon.description}
                </p>
                {coupon.minOrderValue ? (
                  <p className="mt-1 text-xs text-text-secondary">
                    Mínimo {formatCurrency(coupon.minOrderValue)}
                  </p>
                ) : null}
              </div>
            </div>
            <Badge variant="new">
              {couponValueLabel(coupon.type, coupon.value)}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
