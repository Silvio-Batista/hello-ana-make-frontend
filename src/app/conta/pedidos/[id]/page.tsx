"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { OrderTimeline } from "@/components/account";
import { Badge, Button, ErrorState, Spinner } from "@/components/ui";
import { useCancelOrder, useOrder } from "@/hooks";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/order-status";
import { formatCurrency } from "@/lib/utils";

export default function PedidoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const orderQuery = useOrder(id);
  const cancelOrder = useCancelOrder();

  if (orderQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner label="Carregando pedido" />
      </div>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <ErrorState
        title="Pedido não encontrado"
        description="Verifique o link ou volte para a lista de pedidos."
        onRetry={() => void orderQuery.refetch()}
      />
    );
  }

  const order = orderQuery.data;
  const canCancel = ["pending_payment", "paid", "processing"].includes(
    order.status,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/conta/pedidos"
            className="text-xs font-medium text-primary hover:underline"
          >
            ← Voltar aos pedidos
          </Link>
          <h2 className="mt-2 font-display text-xl font-semibold text-text-primary">
            Pedido {order.orderNumber}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {PAYMENT_METHOD_LABELS[order.paymentMethod]} ·{" "}
            {formatCurrency(order.total)}
          </p>
        </div>
        <Badge>{ORDER_STATUS_LABELS[order.status]}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              Status do pedido
            </h3>
            <OrderTimeline order={order} />
            {order.trackingCode ? (
              <p className="mt-4 text-sm text-text-secondary">
                Rastreio:{" "}
                {order.trackingUrl ? (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {order.trackingCode}
                  </a>
                ) : (
                  <span className="font-medium text-text-primary">
                    {order.trackingCode}
                  </span>
                )}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-border bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              Itens
            </h3>
            <ul className="flex flex-col gap-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-nude">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/produtos/${item.productSlug}`}
                      className="text-sm font-medium text-text-primary hover:text-primary"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-xs text-text-secondary">
                      {item.variantName} · Qtd. {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium tabular-nums">
                    {formatCurrency(item.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <section className="rounded-2xl border border-border bg-white p-5 text-sm">
            <h3 className="mb-3 font-semibold text-text-primary">Entrega</h3>
            <p className="text-text-secondary">
              {order.shippingAddress.recipientName}
              <br />
              {order.shippingAddress.street}, {order.shippingAddress.number}
              <br />
              {order.shippingAddress.neighborhood} —{" "}
              {order.shippingAddress.city}/{order.shippingAddress.state}
              <br />
              CEP {order.shippingAddress.zipCode}
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-white p-5 text-sm">
            <h3 className="mb-3 font-semibold text-text-primary">Resumo</h3>
            <dl className="flex flex-col gap-2">
              <div className="flex justify-between gap-2">
                <dt className="text-text-secondary">Subtotal</dt>
                <dd className="tabular-nums">
                  {formatCurrency(order.subtotal)}
                </dd>
              </div>
              {order.discount > 0 ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-text-secondary">Desconto</dt>
                  <dd className="tabular-nums text-success">
                    −{formatCurrency(order.discount)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-2">
                <dt className="text-text-secondary">Frete</dt>
                <dd className="tabular-nums">
                  {order.shipping > 0
                    ? formatCurrency(order.shipping)
                    : "Grátis"}
                </dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-border pt-2 font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatCurrency(order.total)}</dd>
              </div>
            </dl>
          </section>

          {canCancel ? (
            <Button
              variant="outline"
              loading={cancelOrder.isPending}
              onClick={() => {
                if (
                  window.confirm("Tem certeza que deseja cancelar este pedido?")
                ) {
                  void cancelOrder.mutateAsync({ id: order.id });
                }
              }}
            >
              Cancelar pedido
            </Button>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
