"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { RewardProgressBar } from "@/components/rewards/reward-progress-bar";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { useUiStore } from "@/stores";

export function MiniCart() {
  const miniCartOpen = useUiStore((s) => s.miniCartOpen);
  const setMiniCartOpen = useUiStore((s) => s.setMiniCartOpen);
  const {
    items,
    totals,
    subtotal,
    rewardProgress,
    updateQuantity,
    removeItem,
  } = useCart();

  const close = () => setMiniCartOpen(false);

  return (
    <Drawer
      open={miniCartOpen}
      onClose={close}
      title="Seu carrinho"
      footer={
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-semibold text-text-primary tabular-nums">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <Link href="/carrinho" onClick={close} className="block">
              <Button variant="outline" className="w-full">
                Ver carrinho
              </Button>
            </Link>
            <Link href="/checkout" onClick={close} className="block">
              <Button variant="primary" className="w-full">
                Finalizar compra
              </Button>
            </Link>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="size-6" aria-hidden />}
          title="Carrinho vazio"
          description="Explore nossos produtos e adicione seus favoritos."
          action={{
            label: "Continuar comprando",
            href: "/",
            variant: "soft",
          }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <RewardProgressBar
            progress={rewardProgress.data}
            isLoading={rewardProgress.isLoading}
            compact
          />

          <ul className="flex flex-col gap-4">
            {items.map((item) => {
              const unit =
                item.promotionalPrice != null &&
                item.promotionalPrice < item.unitPrice
                  ? item.promotionalPrice
                  : item.unitPrice;

              return (
                <li key={item.id} className="flex gap-3">
                  <Link
                    href={`/produtos/${item.productSlug}`}
                    onClick={close}
                    className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-nude"
                  >
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/produtos/${item.productSlug}`}
                          onClick={close}
                          className="line-clamp-2 text-sm font-medium text-text-primary hover:text-primary"
                        >
                          {item.productName}
                        </Link>
                        <p className="text-xs text-text-secondary">
                          {item.variantName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remover ${item.productName}`}
                        className="rounded-lg p-1 text-text-secondary transition-colors hover:bg-secondary hover:text-error"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.id, qty)}
                        max={item.maxQuantity}
                        min={1}
                      />
                      <span className="text-sm font-semibold tabular-nums text-text-primary">
                        {formatCurrency(unit * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {totals.discount > 0 ? (
            <p className="text-xs text-success">
              Desconto aplicado: −{formatCurrency(totals.discount)}
            </p>
          ) : null}
        </div>
      )}
    </Drawer>
  );
}
