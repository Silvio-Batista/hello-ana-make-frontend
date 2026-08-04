"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DataTable,
  PageHeader,
  type DataTableColumn,
} from "@/components/admin";
import { Badge, Input, Select, type BadgeVariant } from "@/components/ui";
import { useAdminOrders } from "@/hooks/use-admin";
import type { Order, OrderStatus } from "@/contracts";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import { formatCurrency } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

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
    case "shipped":
    case "in_transit":
    case "processing":
      return "new";
    default:
      return "neutral";
  }
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default function AdminOrdersPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const params = useMemo(
    () => ({
      page: 1,
      pageSize: 50,
      status: (status || undefined) as OrderStatus | undefined,
      search: search || undefined,
    }),
    [status, search],
  );

  const { data, isLoading } = useAdminOrders(params);

  const columns: DataTableColumn<Order>[] = [
    {
      key: "orderNumber",
      header: "Pedido",
      render: (row) => (
        <Link
          href={`/admin/pedidos/${row.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.orderNumber}
        </Link>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (row) => formatCurrency(row.total),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={statusVariant(row.status)}>
          {ORDER_STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
    {
      key: "payment",
      header: "Pagamento",
      render: (row) => (
        <span className="capitalize text-text-secondary">
          {row.paymentStatus}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Data",
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <Link
          href={`/admin/pedidos/${row.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Detalhes
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Pedidos"
        description="Gerencie e acompanhe os pedidos da loja"
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Buscar por número, e-mail ou nome…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setSearch(searchInput.trim());
          }}
          className="sm:max-w-sm"
        />
        <Select
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="sm:max-w-xs"
        />
        <button
          type="button"
          onClick={() => setSearch(searchInput.trim())}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark sm:self-start"
        >
          Buscar
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        getRowKey={(row) => row.id}
        loading={isLoading}
        emptyTitle="Nenhum pedido encontrado"
        emptyDescription="Ajuste os filtros ou aguarde novos pedidos."
      />
    </div>
  );
}
