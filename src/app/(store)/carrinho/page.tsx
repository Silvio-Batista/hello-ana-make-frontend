"use client";

import Image from "next/image";
import Link from "next/link";
import { BookmarkPlus, ShoppingBag } from "lucide-react";
import { CartEmpty, CartItem, CartSummary } from "@/components/cart";
import { ProductGrid } from "@/components/product";
import { RewardProgressBar } from "@/components/rewards";
import { PageHeader } from "@/components/shared";
import { Button, Container, SectionHeading, Spinner } from "@/components/ui";
import { useBestsellers, useCart } from "@/hooks";
import { formatCurrency } from "@/lib/utils";

export default function CarrinhoPage() {
  const {
    items,
    savedForLater,
    couponCode,
    couponMessage,
    totals,
    rewardProgress,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    saveForLater,
    moveToCart,
  } = useCart();

  const bestsellers = useBestsellers(4);

  const isEmpty = items.length === 0;

  return (
    <>
      <PageHeader
        title="Carrinho"
        description={
          isEmpty
            ? "Seu carrinho está vazio por enquanto."
            : `${totals.itemCount} ${totals.itemCount === 1 ? "item" : "itens"} no seu carrinho`
        }
      />

      <Container className="py-8 md:py-10">
        {isEmpty ? (
          <CartEmpty />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div className="flex flex-col gap-6">
              <RewardProgressBar
                progress={rewardProgress.data}
                isLoading={rewardProgress.isLoading}
              />

              <div className="rounded-2xl border border-border bg-white px-4 sm:px-5">
                {items.map((item) => (
                  <div key={item.id} className="border-b border-border last:border-b-0">
                    <CartItem
                      item={item}
                      onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                      onRemove={() => removeItem(item.id)}
                    />
                    <div className="-mt-1 mb-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => saveForLater(item.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-primary"
                      >
                        <BookmarkPlus className="size-3.5" aria-hidden />
                        Salvar para depois
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {savedForLater.length > 0 ? (
                <section>
                  <h2 className="mb-3 font-display text-lg font-semibold text-text-primary">
                    Salvos para depois
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {savedForLater.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3"
                      >
                        <Link
                          href={`/produtos/${item.productSlug}`}
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
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text-primary">
                            {item.productName}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {item.variantName} ·{" "}
                            {formatCurrency(
                              (item.promotionalPrice ?? item.unitPrice) *
                                item.quantity,
                            )}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveToCart(item.id)}
                        >
                          Mover ao carrinho
                        </Button>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            <CartSummary
              totals={totals}
              couponCode={couponCode}
              couponMessage={couponMessage}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
              checkoutHref="/checkout"
              className="sticky top-24"
            />
          </div>
        )}

        <section className="mt-14">
          <SectionHeading
            title="Você também pode gostar"
            subtitle="Sugestões populares para completar seu look"
            action={{ label: "Ver todos", href: "/" }}
          />
          {bestsellers.isLoading ? (
            <div className="flex justify-center py-10">
              <Spinner label="Carregando recomendações" />
            </div>
          ) : bestsellers.data && bestsellers.data.length > 0 ? (
            <ProductGrid products={bestsellers.data} />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-text-secondary">
              <ShoppingBag className="size-5" aria-hidden />
              <p>Nenhuma recomendação disponível no momento.</p>
            </div>
          )}
        </section>
      </Container>
    </>
  );
}
