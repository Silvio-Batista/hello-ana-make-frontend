"use client";

import { Package } from "lucide-react";
import { OrderCard } from "@/components/account";
import { EmptyState, ErrorState, Spinner } from "@/components/ui";
import { useOrders } from "@/hooks";

export default function PedidosPage() {
  const orders = useOrders({ page: 1, pageSize: 20 });

  return (
    <div>
      <h2 className="mb-4 font-display text-xl font-semibold text-text-primary">
        Meus pedidos
      </h2>

      {orders.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Carregando pedidos" />
        </div>
      ) : orders.isError ? (
        <ErrorState
          title="Não foi possível carregar os pedidos"
          onRetry={() => void orders.refetch()}
        />
      ) : !orders.data?.items.length ? (
        <EmptyState
          icon={<Package className="size-6" aria-hidden />}
          title="Você ainda não fez pedidos"
          description="Que tal escolher um batom ou uma paleta para começar?"
          action={{ label: "Ver produtos", href: "/", variant: "primary" }}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.data.items.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
