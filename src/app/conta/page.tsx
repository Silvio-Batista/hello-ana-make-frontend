"use client";

import Link from "next/link";
import {
  Gift,
  Heart,
  MapPin,
  Package,
  Settings,
  Tag,
} from "lucide-react";
import { OrderCard } from "@/components/account";
import { Button, EmptyState, Spinner } from "@/components/ui";
import { useAuth, useOrders } from "@/hooks";
import { formatCurrency } from "@/lib/utils";

const SHORTCUTS = [
  { href: "/conta/pedidos", label: "Pedidos", icon: Package },
  { href: "/conta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/conta/enderecos", label: "Endereços", icon: MapPin },
  { href: "/conta/cupons", label: "Cupons", icon: Tag },
  { href: "/conta/recompensas", label: "Recompensas", icon: Gift },
  { href: "/conta/configuracoes", label: "Configurações", icon: Settings },
] as const;

export default function ContaPage() {
  const { user } = useAuth();
  const orders = useOrders({ page: 1, pageSize: 1 });
  const lastOrder = orders.data?.items[0];

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-primary-light/60 to-white p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Bem-vinda de volta{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Gerencie pedidos, favoritos e recompensas em um só lugar.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-text-primary">
            Último pedido
          </h2>
          <Link
            href="/conta/pedidos"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>
        {orders.isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : lastOrder ? (
          <OrderCard order={lastOrder} />
        ) : (
          <EmptyState
            title="Nenhum pedido ainda"
            description="Quando você comprar, o histórico aparece aqui."
            action={{ label: "Ir às compras", href: "/", variant: "primary" }}
          />
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-text-primary">
          Atalhos
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SHORTCUTS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-white p-4 transition-colors hover:border-primary/40"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {lastOrder ? (
        <p className="text-xs text-text-secondary">
          Último total: {formatCurrency(lastOrder.total)}
        </p>
      ) : (
        <Link href="/">
          <Button variant="soft">Explorar produtos</Button>
        </Link>
      )}
    </div>
  );
}
