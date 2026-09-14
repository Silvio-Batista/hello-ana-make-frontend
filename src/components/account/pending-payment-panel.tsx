"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Order } from "@/contracts";
import { Button } from "@/components/ui";
import { PaymentInstructions } from "@/components/checkout/payment-instructions";
import { orderKeys, useCreatePayment, usePayment } from "@/hooks";

export interface PendingPaymentPanelProps {
  order: Order;
}

/**
 * Pedido `pending_payment` pago via PIX/boleto: mostra o QR/linha digitável da
 * cobrança (GET /payments/:id, com polling pro `paid` do webhook) e um botão pra
 * gerar uma cobrança nova se a anterior expirou/falhou ou nunca existiu.
 */
export function PendingPaymentPanel({ order }: PendingPaymentPanelProps) {
  const qc = useQueryClient();
  const paymentQuery = usePayment(order.paymentId, { poll: true });
  const createPayment = useCreatePayment();

  // Depois de gerar uma cobrança nova, o pedido é reinvalidado e `order.paymentId`
  // passa a apontar pra ela — a partir daí a query com polling é a fonte da verdade
  // (pega o `paid` do webhook). Até lá, mostra o resultado imediato do POST /payments.
  const liveMatchesOrder =
    paymentQuery.data != null && paymentQuery.data.id === order.paymentId;
  const payment = liveMatchesOrder
    ? paymentQuery.data
    : (createPayment.data ?? paymentQuery.data);
  const methodLabel = order.paymentMethod === "pix" ? "PIX" : "boleto";

  // Cobrança nova criada ou confirmada → recarrega o pedido (novo paymentId / novo status).
  useEffect(() => {
    if (createPayment.isSuccess || payment?.status === "paid") {
      void qc.invalidateQueries({ queryKey: orderKeys.detail(order.id) });
    }
  }, [createPayment.isSuccess, payment?.status, qc, order.id]);

  const regenerate = () => {
    createPayment.mutate({
      orderId: order.id,
      method: order.paymentMethod,
      amount: order.total,
      currency: order.currency,
    });
  };

  const pixExpired =
    payment != null &&
    payment.method === "pix" &&
    payment.status === "pending" &&
    payment.pixExpiresAt != null &&
    new Date(payment.pixExpiresAt).getTime() < Date.now();

  const needsNewCharge =
    !order.paymentId ||
    (paymentQuery.isError && !createPayment.data) ||
    pixExpired ||
    (payment != null && ["failed", "cancelled"].includes(payment.status));

  return (
    <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <h3 className="text-sm font-semibold text-text-primary">
        Pagamento pendente
      </h3>
      <p className="mt-1 text-sm text-text-secondary">
        Seu pedido está reservado. Finalize o pagamento via {methodLabel} para
        confirmá-lo.
      </p>

      {paymentQuery.isLoading && !payment ? (
        <p className="mt-4 text-sm text-text-secondary">
          Carregando dados do pagamento…
        </p>
      ) : null}

      {payment && payment.status !== "paid" && !pixExpired ? (
        <PaymentInstructions payment={payment} className="mt-4 max-w-md" />
      ) : null}

      {needsNewCharge ? (
        <div className="mt-4">
          {pixExpired ? (
            <p className="mb-2 text-sm text-text-secondary">
              O código PIX anterior expirou. Gere um novo para pagar.
            </p>
          ) : null}
          <Button onClick={regenerate} loading={createPayment.isPending}>
            Gerar novo código {methodLabel}
          </Button>
          {createPayment.isError ? (
            <p className="mt-2 text-sm text-error">
              {createPayment.error instanceof Error
                ? createPayment.error.message
                : "Não foi possível gerar o pagamento."}
            </p>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => void paymentQuery.refetch()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
          disabled={paymentQuery.isFetching}
        >
          {paymentQuery.isFetching ? "Verificando…" : "Já paguei — atualizar status"}
        </button>
      )}
    </section>
  );
}
