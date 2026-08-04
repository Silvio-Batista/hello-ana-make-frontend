import type {
  Product,
  ProductBadge,
  ProductImage,
  ProductVariant,
} from "@/contracts";
import { getBrandById } from "./brands";
import { getCategoryById } from "./categories";

type VariantInput = {
  id: string;
  sku: string;
  name: string;
  color?: string;
  colorHex?: string;
  size?: string;
  volume?: string;
  price: number;
  promotionalPrice?: number;
  stock: number;
  image?: string;
};

type ProductInput = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  brandId: string;
  categoryId: string;
  seed: string;
  variants: VariantInput[];
  badges?: ProductBadge[];
  ratingAverage: number;
  ratingCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  promotionLabel?: string;
  promotionValue?: number;
  createdAt: string;
  ingredients?: string;
  howToUse?: string;
  benefits?: string[];
};

function buildImages(seed: string, name: string): ProductImage[] {
  return [1, 2, 3].map((n, index) => ({
    id: `${seed}-img-${n}`,
    url: `https://picsum.photos/seed/${seed}-${n}/800/800`,
    alt: index === 0 ? name : `${name} — vista ${n}`,
    sortOrder: index,
    isPrimary: index === 0,
  }));
}

function buildVariants(inputs: VariantInput[]): ProductVariant[] {
  return inputs.map((v) => ({
    id: v.id,
    sku: v.sku,
    name: v.name,
    attributes: {
      color: v.color,
      colorHex: v.colorHex,
      size: v.size,
      volume: v.volume,
    },
    price: v.price,
    promotionalPrice: v.promotionalPrice,
    stock: v.stock,
    image: v.image,
    isAvailable: v.stock > 0,
  }));
}

export function buildProduct(input: ProductInput): Product {
  const variants = buildVariants(input.variants);
  const fullPrices = variants.map((v) => v.price);
  const priceFrom = Math.min(...fullPrices);
  const priceTo = Math.max(...fullPrices);
  const promoPrices = variants
    .map((v) => v.promotionalPrice)
    .filter((p): p is number => p !== undefined);
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
  const onSale = promoPrices.length > 0;
  const bestPromo = onSale ? Math.min(...promoPrices) : undefined;
  const discountPercentage =
    onSale && bestPromo !== undefined
      ? Math.round(((priceFrom - bestPromo) / priceFrom) * 100)
      : undefined;

  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    shortDescription: input.shortDescription,
    description: input.description,
    ingredients: input.ingredients,
    howToUse: input.howToUse,
    benefits: input.benefits,
    brand: getBrandById(input.brandId),
    category: getCategoryById(input.categoryId),
    images: buildImages(input.seed, input.name),
    variants,
    pricing: {
      priceFrom,
      priceTo,
      promotionalPriceFrom: onSale ? Math.min(...promoPrices) : undefined,
      promotionalPriceTo: onSale ? Math.max(...promoPrices) : undefined,
      currency: "BRL",
      discountPercentage,
    },
    inventory: {
      totalStock,
      isInStock: totalStock > 0,
      lowStockThreshold: 10,
      isLowStock: totalStock > 0 && totalStock <= 10,
    },
    rating: {
      average: input.ratingAverage,
      count: input.ratingCount,
    },
    badges: input.badges ?? [],
    promotion:
      onSale && input.promotionLabel
        ? {
            id: `promo-${input.id}`,
            label: input.promotionLabel,
            type: "percentage",
            value: input.promotionValue ?? discountPercentage ?? 0,
            startsAt: "2026-01-01T00:00:00.000Z",
            endsAt: "2026-12-31T23:59:59.000Z",
            isActive: true,
          }
        : undefined,
    isFavorite: false,
    isFeatured: input.isFeatured,
    isNew: input.isNew,
    isBestseller: input.isBestseller,
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
  };
}

export const badgeNew: ProductBadge = {
  id: "badge-new",
  label: "Novo",
  type: "new",
  color: "#2D6A4F",
};

export const badgeBestseller: ProductBadge = {
  id: "badge-bestseller",
  label: "Bestseller",
  type: "bestseller",
  color: "#9B2226",
};

export const badgeSale: ProductBadge = {
  id: "badge-sale",
  label: "Promoção",
  type: "sale",
  color: "#E63946",
};
