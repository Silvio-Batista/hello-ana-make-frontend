"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin";
import {
  Badge,
  Button,
  Input,
  Select,
  Skeleton,
  Textarea,
  useToast,
  type BadgeVariant,
} from "@/components/ui";
import { useAdminOrder, useRefundOrder, useUpdateOrderStatus } from "@/hooks/use-admin";
import type { OrderStatus } from "@/contracts";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/order-status";
import { formatCurrency } from "@/lib/utils";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

function statusVariant(status: OrderStatus): BadgeVariant {
  switch (status) {
    case "delivered":
    case "paid":
      return "success";
    case "pending_payment":
      return "warning";
    case "cancelled":
    case "refunded":
    case "returned":
      return "sale";
    default:
      return "new";
  }
}

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { toast } = useToast();
  const { data: order, isLoading } = useAdminOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const refundOrder = useRefundOrder();

  const [status, setStatus] = useState<OrderStatus>("pending_payment");
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  useEffect(() => {
    if (!order) return;
    setStatus(order.status);
    setTrackingCode(order.trackingCode ?? "");
    setTrackingUrl(order.trackingUrl ?? "");
    setNotes(order.notes ?? "");
  }, [order]);

  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await updateStatus.mutateAsync({
        id,
        request: {
          status,
          trackingCode: trackingCode.trim() || undefined,
          trackingUrl: trackingUrl.trim() || undefined,
          notes: notes.trim() || undefined,
        },
      });
      toast("Pedido atualizado com sucesso.", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao atualizar pedido.",
        "error",
      );
    }
  };

  const onRefund = async () => {
    if (!order) return;
    try {
      await refundOrder.mutateAsync({
        id: order.id,
        amount: refundAmount ? Number(refundAmount) : undefined,
      });
      toast("Reembolso realizado com sucesso.", "success");
      setRefundAmount("");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao reembolsar pedido.",
        "error",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <p className="text-sm text-text-secondary">Pedido não encontrado.</p>
        <Link
          href="/admin/pedidos"
          className="mt-2 inline-block text-sm text-primary hover:underline"
        >
          Voltar aos pedidos
        </Link>
      </div>
    );
  }

  const address = order.shippingAddress;

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <PageHeader
        title={`Pedido ${order.orderNumber}`}
        description={`Criado em ${new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "long",
          timeStyle: "short",
        }).format(new Date(order.createdAt))}`}
        actions={
          <Badge variant={statusVariant(order.status)}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">
            Itens
          </h2>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {item.productName}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {item.variantName} · Qtd {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {formatCurrency(item.lineTotal)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Desconto</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Frete</span>
              <span>{formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-text-primary">
              Cliente e entrega
            </h2>
            <p className="text-sm font-medium">{address.recipientName}</p>
            <p className="mt-1 text-sm text-text-secondary">
              {address.street}, {address.number}
              {address.complement ? ` — ${address.complement}` : ""}
            </p>
            <p className="text-sm text-text-secondary">
              {address.neighborhood} · {address.city}/{address.state}
            </p>
            <p className="text-sm text-text-secondary">CEP {address.zipCode}</p>
            {address.phone ? (
              <p className="mt-2 text-sm text-text-secondary">{address.phone}</p>
            ) : null}
          </section>

          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-text-primary">
              Pagamento
            </h2>
            <p className="text-sm">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </p>
            <p className="mt-1 text-sm text-text-secondary capitalize">
              Status: {order.paymentStatus}
            </p>
            {order.couponCode ? (
              <p className="mt-1 text-sm text-text-secondary">
                Cupom: {order.couponCode}
              </p>
            ) : null}
          </section>

          {["paid", "partially_refunded"].includes(order.paymentStatus) ? (
            <section className="rounded-xl border border-border bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-text-primary">
                Reembolso
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <Input
                  label="Valor (vazio = total)"
                  type="number"
                  min={0}
                  step="0.01"
                  max={order.total}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder={String(order.total)}
                  className="sm:max-w-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  loading={refundOrder.isPending}
                  onClick={onRefund}
                >
                  Reembolsar
                </Button>
              </div>
            </section>
          ) : null}

          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-text-primary">
              Atualizar status
            </h2>
            <form onSubmit={onSave} className="space-y-3">
              <Select
                label="Status"
                options={STATUS_OPTIONS}
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
              />
              <Input
                label="Código de rastreio"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
              />
              <Input
                label="URL de rastreio"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
              />
              <Textarea
                label="Observações"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button type="submit" loading={updateStatus.isPending}>
                Salvar
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
