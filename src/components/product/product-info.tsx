"use client";

import { useState, type FormEvent } from "react";
import { Heart, ShoppingBag, Truck } from "lucide-react";
import type { Product, ProductVariant } from "@/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceDisplay } from "@/components/ui/price-display";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { StarRating } from "@/components/ui/star-rating";
import { useToast } from "@/components/ui/toast";
import { useAddCartItem } from "@/hooks/use-cart";
import { useToggleFavorite } from "@/hooks/use-favorites";
import { cn, formatCurrency } from "@/lib/utils";
import { useUiStore } from "@/stores";
import { VariantSelector } from "./variant-selector";

export interface ProductInfoProps {
  product: Product;
  className?: string;
}

export function ProductInfo({ product, className }: ProductInfoProps) {
  const addItem = useAddCartItem();
  const setMiniCartOpen = useUiStore((s) => s.setMiniCartOpen);
  const toggleFavorite = useToggleFavorite();
  const { toast } = useToast();

  const defaultVariant =
    product.variants.find((v) => v.isAvailable) ?? product.variants[0] ?? null;

  const [selectedId, setSelectedId] = useState<string | null>(
    product.variants.length === 1 ? (defaultVariant?.id ?? null) : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [shippingMessage, setShippingMessage] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState(false);

  const selected: ProductVariant | null =
    product.variants.find((v) => v.id === selectedId) ?? null;

  const displayPrice = selected?.price ?? product.pricing.priceFrom;
  const displayPromo =
    selected?.promotionalPrice ??
    (product.pricing.promotionalPriceFrom != null &&
    product.pricing.promotionalPriceFrom < product.pricing.priceFrom
      ? product.pricing.promotionalPriceFrom
      : undefined);

  const stock = selected?.stock ?? product.inventory.totalStock;
  const inStock = selected
    ? selected.isAvailable && selected.stock > 0
    : product.inventory.isInStock;

  const handleAddToCart = async () => {
    if (!selected) {
      setSelectionError(true);
      return;
    }
    setSelectionError(false);

    try {
      await addItem.mutateAsync({
        productId: product.id,
        variantId: selected.id,
        quantity,
      });
      setMiniCartOpen(true);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Não foi possível adicionar o produto.",
        "error",
      );
    }
  };

  const handleShippingStub = (event: FormEvent) => {
    event.preventDefault();
    const digits = cep.replace(/\D/g, "");
    if (digits.length < 8) {
      setShippingMessage("Informe um CEP válido com 8 dígitos.");
      return;
    }
    setShippingMessage(
      `Frete estimado para ${digits.slice(0, 5)}-${digits.slice(5)}: a partir de ${formatCurrency(12.9)} · 3 a 7 dias úteis.`,
    );
  };

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div>
        <p className="text-sm font-medium tracking-wide text-text-secondary uppercase">
          {product.brand.name}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-text-primary md:text-3xl">
          {product.name}
        </h1>
        <div className="mt-2">
          <StarRating
            rating={product.rating.average}
            reviewCount={product.rating.count}
            showValue
            size="sm"
          />
        </div>
      </div>

      <PriceDisplay
        price={displayPrice}
        promotionalPrice={displayPromo}
        size="lg"
        showInstallments
      />

      <p className="text-sm leading-relaxed text-text-secondary">
        {product.shortDescription}
      </p>

      <VariantSelector
        variants={product.variants}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setSelectionError(false);
          setQuantity(1);
        }}
      />
      {selectionError ? (
        <p className="text-xs text-error" role="alert">
          Selecione uma variante antes de adicionar ao carrinho.
        </p>
      ) : null}

      <div className="flex items-center gap-2 text-sm">
        {inStock ? (
          <span className="font-medium text-success">
            Em estoque
            {selected ? ` · ${stock} un.` : null}
          </span>
        ) : (
          <span className="font-medium text-error">Indisponível</span>
        )}
        {product.inventory.isLowStock && inStock ? (
          <span className="text-warning">· Últimas unidades</span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={Math.max(1, selected?.stock ?? 10)}
          disabled={!inStock}
        />
        <Button
          variant="primary"
          size="lg"
          className="min-w-[180px] flex-1"
          leftIcon={<ShoppingBag className="size-4" aria-hidden />}
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          Adicionar ao carrinho
        </Button>
        <Button
          variant="outline"
          size="lg"
          aria-label={
            product.isFavorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
          onClick={() =>
            toggleFavorite.mutate({
              productId: product.id,
              isFavorite: product.isFavorite,
            })
          }
          leftIcon={
            <Heart
              className="size-4"
              fill={product.isFavorite ? "currentColor" : "none"}
              aria-hidden
            />
          }
          className={cn(product.isFavorite && "text-primary border-primary")}
        >
          Favoritar
        </Button>
      </div>

      <form
        onSubmit={handleShippingStub}
        className="rounded-2xl border border-border bg-surface p-4"
      >
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-text-primary">
          <Truck className="size-4 text-primary" aria-hidden />
          Calcular frete
        </div>
        <div className="flex gap-2">
          <Input
            name="cep"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            inputMode="numeric"
            maxLength={9}
            aria-label="CEP"
          />
          <Button type="submit" variant="soft" className="shrink-0">
            Calcular
          </Button>
        </div>
        {shippingMessage ? (
          <p className="mt-2 text-xs text-text-secondary">{shippingMessage}</p>
        ) : null}
      </form>
    </div>
  );
}
