"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Package,
  ShoppingBag,
  Ticket,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  DataTable,
  PageHeader,
  StatsCard,
  type DataTableColumn,
} from "@/components/admin";
import { Badge } from "@/components/ui";
import { useAdminOrders, useAdminStats } from "@/hooks/use-admin";
import type { Order, OrderStatus } from "@/contracts";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import { formatCurrency } from "@/lib/utils";
import type { BadgeVariant } from "@/components/ui";

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

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({
    page: 1,
    pageSize: 8,
  });

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
      key: "createdAt",
      header: "Data",
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral da loja Hello Ana Make"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title="Pedidos"
          value={stats?.totalOrders ?? 0}
          description={`${stats?.ordersToday ?? 0} hoje`}
          icon={<ShoppingBag className="size-5" />}
          loading={statsLoading}
        />
        <StatsCard
          title="Receita do mês"
          value={formatCurrency(stats?.revenueMonth ?? 0)}
          description={`Total: ${formatCurrency(stats?.revenueTotal ?? 0)}`}
          icon={<TrendingUp className="size-5" />}
          loading={statsLoading}
        />
        <StatsCard
          title="Produtos"
          value={stats?.productsCount ?? 0}
          icon={<Package className="size-5" />}
          loading={statsLoading}
        />
        <StatsCard
          title="Estoque baixo"
          value={stats?.lowStockCount ?? 0}
          icon={<AlertTriangle className="size-5" />}
          loading={statsLoading}
        />
        <StatsCard
          title="Pendentes"
          value={stats?.pendingOrders ?? 0}
          icon={<Clock className="size-5" />}
          loading={statsLoading}
        />
        <StatsCard
          title="Cupons ativos"
          value={stats?.activeCoupons ?? 0}
          description={`${stats?.activePromotions ?? 0} promoções ativas`}
          icon={<Ticket className="size-5" />}
          loading={statsLoading}
        />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            Pedidos recentes
          </h2>
          <Link
            href="/admin/pedidos"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <DataTable
          columns={columns}
          rows={ordersData?.items ?? []}
          getRowKey={(row) => row.id}
          loading={ordersLoading}
          emptyTitle="Nenhum pedido ainda"
        />
      </div>
    </div>
  );
}
