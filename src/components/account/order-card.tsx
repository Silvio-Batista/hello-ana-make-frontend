"use client";

import Image from "next/image";
import Link from "next/link";
import type { Order } from "@/contracts";
import { Badge } from "@/components/ui";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/order-status";
import { formatCurrency, cn } from "@/lib/utils";

function statusVariant(
  status: Order["status"],
): "success" | "warning" | "neutral" | "sale" {
  switch (status) {
    case "delivered":
      return "success";
    case "cancelled":
    case "refunded":
    case "returned":
      return "sale";
    case "pending_payment":
      return "warning";
    default:
      return "neutral";
  }
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export interface OrderCardProps {
  order: Order;
  className?: string;
}

export function OrderCard({ order, className }: OrderCardProps) {
  const preview = order.items.slice(0, 3);

  return (
    <Link
      href={`/conta/pedidos/${order.id}`}
      className={cn(
        "block rounded-2xl border border-border bg-white p-4 transition-colors hover:border-primary/40 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            {order.orderNumber}
          </p>
          <p className="mt-0.5 text-xs text-text-secondary">
            {formatDate(order.createdAt)} ·{" "}
            {PAYMENT_METHOD_LABELS[order.paymentMethod]}
          </p>
        </div>
        <Badge variant={statusVariant(order.status)}>
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {preview.map((item) => (
          <div
            key={item.id}
            className="relative size-12 overflow-hidden rounded-lg bg-nude"
          >
            <Image
              src={item.image}
              alt={item.productName}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ))}
        {order.items.length > 3 ? (
          <span className="text-xs text-text-secondary">
            +{order.items.length - 3}
          </span>
        ) : null}
        <p className="ml-auto text-sm font-semibold tabular-nums text-text-primary">
          {formatCurrency(order.total)}
        </p>
      </div>
    </Link>
  );
}
