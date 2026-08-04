"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Product, ProductBadge as ProductBadgeType } from "@/contracts";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/ui/price-display";
import { useToggleFavorite } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import { useCartStore, useUiStore } from "@/stores";

function badgeVariant(type: ProductBadgeType["type"]): BadgeVariant {
  switch (type) {
    case "sale":
      return "sale";
    case "new":
      return "new";
    case "bestseller":
    case "exclusive":
      return "gold";
    case "limited":
      return "warning";
    case "eco":
    case "vegan":
      return "success";
    default:
      return "neutral";
  }
}

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setMiniCartOpen = useUiStore((s) => s.setMiniCartOpen);
  const toggleFavorite = useToggleFavorite();

  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];
  const availableVariants = product.variants.filter((v) => v.isAvailable);
  const singleVariant =
    availableVariants.length === 1 ? availableVariants[0] : null;

  const price = product.pricing.priceFrom;
  const promo =
    product.pricing.promotionalPriceFrom != null &&
    product.pricing.promotionalPriceFrom < price
      ? product.pricing.promotionalPriceFrom
      : undefined;

  const handleFavorite = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite.mutate({
      productId: product.id,
      isFavorite: product.isFavorite,
    });
  };

  const handleQuickAdd = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!singleVariant) return;

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantId: singleVariant.id,
      variantSku: singleVariant.sku,
      variantName: singleVariant.name,
      attributes: singleVariant.attributes,
      image: singleVariant.image ?? primaryImage?.url ?? "",
      unitPrice: singleVariant.price,
      promotionalPrice: singleVariant.promotionalPrice,
      maxQuantity: singleVariant.stock,
      isAvailable: singleVariant.isAvailable,
      quantity: 1,
    });
    setMiniCartOpen(true);
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white",
        className,
      )}
    >
      <Link
        href={`/produtos/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-nude"
      >
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : null}

        {product.badges.length > 0 ? (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badges.slice(0, 2).map((badge) => (
              <Badge key={badge.id} variant={badgeVariant(badge.type)}>
                {badge.label}
              </Badge>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleFavorite}
          aria-label={
            product.isFavorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
          className={cn(
            "absolute top-2 right-2 flex size-9 items-center justify-center rounded-full",
            "bg-white/90 text-text-secondary shadow-sm backdrop-blur-sm",
            "transition-colors hover:text-primary",
            product.isFavorite && "text-primary",
          )}
        >
          <Heart
            className="size-4"
            fill={product.isFavorite ? "currentColor" : "none"}
            aria-hidden
          />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-3.5">
        <p className="text-xs font-medium tracking-wide text-text-secondary uppercase">
          {product.brand.name}
        </p>
        <Link
          href={`/produtos/${product.slug}`}
          className="line-clamp-2 text-sm font-medium text-text-primary transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <PriceDisplay
          price={price}
          promotionalPrice={promo}
          size="sm"
          showInstallments={false}
          className="mt-auto"
        />

        {singleVariant ? (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.inventory.isInStock}
            className={cn(
              "mt-2 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl",
              "bg-primary-light text-sm font-medium text-primary-dark",
              "transition-colors hover:bg-primary hover:text-white",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            <Plus className="size-4" aria-hidden />
            Adicionar
          </button>
        ) : (
          <Link
            href={`/produtos/${product.slug}`}
            className={cn(
              "mt-2 inline-flex h-9 w-full items-center justify-center rounded-xl",
              "border border-border text-sm font-medium text-text-primary",
              "transition-colors hover:border-primary hover:text-primary",
            )}
          >
            Ver opções
          </Link>
        )}
      </div>
    </article>
  );
}
