"use client";

import { Check } from "lucide-react";
import type { Order, OrderStatus } from "@/contracts";
import {
  ORDER_STATUS_LABELS,
  ORDER_TIMELINE_STEPS,
} from "@/lib/order-status";
import { cn } from "@/lib/utils";

function statusIndex(status: OrderStatus): number {
  if (status === "cancelled" || status === "refunded" || status === "returned") {
    return -1;
  }
  return ORDER_TIMELINE_STEPS.indexOf(status);
}

function dateForStep(order: Order, status: OrderStatus): string | null {
  switch (status) {
    case "pending_payment":
      return order.createdAt;
    case "paid":
      return order.paidAt ?? null;
    case "shipped":
    case "in_transit":
      return order.shippedAt ?? null;
    case "delivered":
      return order.deliveredAt ?? null;
    default:
      return null;
  }
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export interface OrderTimelineProps {
  order: Order;
  className?: string;
}

export function OrderTimeline({ order, className }: OrderTimelineProps) {
  const current = statusIndex(order.status);
  const isCancelled =
    order.status === "cancelled" ||
    order.status === "refunded" ||
    order.status === "returned";

  if (isCancelled) {
    return (
      <div
        className={cn(
          "rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error",
          className,
        )}
      >
        Pedido {ORDER_STATUS_LABELS[order.status].toLowerCase()}
        {order.cancelledAt ? ` em ${formatDate(order.cancelledAt)}` : ""}
      </div>
    );
  }

  return (
    <ol className={cn("flex flex-col gap-0", className)}>
      {ORDER_TIMELINE_STEPS.map((status, index) => {
        const done = current >= index;
        const active = current === index;
        const date = dateForStep(order, status);

        return (
          <li key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs",
                  done
                    ? "bg-primary text-white"
                    : "border border-border bg-white text-text-secondary",
                )}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
              </span>
              {index < ORDER_TIMELINE_STEPS.length - 1 ? (
                <span
                  className={cn(
                    "min-h-6 w-0.5 flex-1",
                    done && current > index ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
            </div>
            <div
              className={cn(
                "pb-5",
                index === ORDER_TIMELINE_STEPS.length - 1 && "pb-0",
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium",
                  active || done ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {ORDER_STATUS_LABELS[status]}
              </p>
              {date && done ? (
                <p className="mt-0.5 text-xs text-text-secondary">
                  {formatDate(date)}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
