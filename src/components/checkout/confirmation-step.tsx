"use client";

import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import type { Order } from "@/contracts";
import { Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/order-status";

export interface ConfirmationStepProps {
  order: Order;
}

export function ConfirmationStep({ order }: ConfirmationStepProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 text-center sm:p-8">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2 className="size-8" aria-hidden />
      </div>
      <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">
        Pedido confirmado!
      </h2>
      <p className="mt-2 text-sm text-text-secondary">
        Obrigada pela compra. Enviamos os detalhes para o seu e-mail.
      </p>

      <div className="mx-auto mt-6 max-w-md rounded-xl border border-border bg-surface/60 p-4 text-left">
        <div className="flex items-start gap-3">
          <Package className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0 text-sm">
            <p className="font-semibold text-text-primary">
              Pedido {order.orderNumber}
            </p>
            <p className="mt-1 text-text-secondary">
              Status: {ORDER_STATUS_LABELS[order.status]}
            </p>
            <p className="text-text-secondary">
              Pagamento: {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </p>
            <p className="mt-2 font-semibold tabular-nums text-text-primary">
              Total {formatCurrency(order.total)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href={`/conta/pedidos/${order.id}`}>
          <Button>Acompanhar pedido</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Continuar comprando</Button>
        </Link>
      </div>
    </div>
  );
}
