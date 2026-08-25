"use client";

import Link from "next/link";
import { CheckCircle2, FileText, Package } from "lucide-react";
import type { CreatePaymentResponse, Order } from "@/contracts";
import { Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/order-status";

export interface ConfirmationStepProps {
  order: Order;
  payment?: CreatePaymentResponse;
}

function formatExpiry(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(
    new Date(iso),
  );
}

export function ConfirmationStep({ order, payment }: ConfirmationStepProps) {
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

      {payment?.method === "pix" && payment.status !== "paid" ? (
        <div className="mx-auto mt-6 max-w-md rounded-xl border border-border bg-surface/60 p-4 text-left">
          <p className="text-sm font-semibold text-text-primary">Pague com PIX</p>
          {payment.pixQrCodeUrl ? (
            <img
              src={payment.pixQrCodeUrl}
              alt="QR Code PIX"
              className="mx-auto mt-3 size-40 rounded-lg border border-border bg-white p-2"
            />
          ) : null}
          {payment.pixQrCode ? (
            <code className="mt-3 block break-all rounded-lg bg-white p-3 text-xs text-text-secondary">
              {payment.pixQrCode}
            </code>
          ) : null}
          {payment.pixExpiresAt ? (
            <p className="mt-2 text-xs text-text-secondary">
              Expira em {formatExpiry(payment.pixExpiresAt)}
            </p>
          ) : null}
        </div>
      ) : null}

      {payment?.method === "boleto" && payment.status !== "paid" ? (
        <div className="mx-auto mt-6 max-w-md rounded-xl border border-border bg-surface/60 p-4 text-left">
          <p className="text-sm font-semibold text-text-primary">Boleto bancário</p>
          {payment.boletoBarcode ? (
            <code className="mt-3 block break-all rounded-lg bg-white p-3 text-xs text-text-secondary">
              {payment.boletoBarcode}
            </code>
          ) : null}
          {payment.boletoUrl ? (
            <a
              href={payment.boletoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <FileText className="size-4" aria-hidden />
              Visualizar boleto
            </a>
          ) : null}
        </div>
      ) : null}

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
