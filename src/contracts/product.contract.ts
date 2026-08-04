import type { Brand } from "./brand.contract";
import type { Category } from "./category.contract";

/**
 * Imagem de produto com metadados de exibição.
 */
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
}

/**
 * Atributos típicos de variantes em cosméticos/beleza.
 */
export interface ProductVariantAttributes {
  color?: string;
  colorHex?: string;
  size?: string;
  volume?: string;
  fragrance?: string;
  shade?: string;
}

/**
 * Variante de produto (SKU com estoque e preço próprios).
 */
export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  attributes: ProductVariantAttributes;
  price: number;
  promotionalPrice?: number;
  stock: number;
  image?: string;
  isAvailable: boolean;
}

/**
 * Preços agregados do produto (faixa entre variantes).
 */
export interface ProductPricing {
  priceFrom: number;
  priceTo: number;
  promotionalPriceFrom?: number;
  promotionalPriceTo?: number;
  currency: string;
  discountPercentage?: number;
}

/**
 * Estoque agregado do produto.
 */
export interface ProductInventory {
  totalStock: number;
  isInStock: boolean;
  lowStockThreshold?: number;
  isLowStock: boolean;
}

/**
 * Avaliação agregada do produto.
 */
export interface ProductRating {
  average: number;
  count: number;
  distribution?: Record<1 | 2 | 3 | 4 | 5, number>;
}

/**
 * Selo visual exibido no card/detalhe do produto.
 */
export interface ProductBadge {
  id: string;
  label: string;
  type: "new" | "bestseller" | "exclusive" | "limited" | "sale" | "eco" | "vegan" | "custom";
  color?: string;
}

/**
 * Promoção vinculada ao produto.
 */
export interface ProductPromotion {
  id: string;
  label: string;
  type: "percentage" | "fixed_amount" | "buy_x_get_y" | "flash_sale";
  value: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

/**
 * Produto completo de e-commerce de beleza.
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  ingredients?: string;
  howToUse?: string;
  benefits?: string[];
  technicalInfo?: Record<string, string>;
  brand: Brand;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  pricing: ProductPricing;
  inventory: ProductInventory;
  rating: ProductRating;
  badges: ProductBadge[];
  promotion?: ProductPromotion;
  isFavorite: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filtros disponíveis para listagem de produtos.
 */
export interface ProductFilters {
  categoryIds?: string[];
  brandIds?: string[];
  priceMin?: number;
  priceMax?: number;
  colors?: string[];
  sizes?: string[];
  volumes?: string[];
  fragrances?: string[];
  shades?: string[];
  inStockOnly?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  onSale?: boolean;
  ratingMin?: number;
  search?: string;
  tags?: string[];
}

export type ProductSortBy =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "bestseller"
  | "rating"
  | "name_asc"
  | "name_desc";

/**
 * Parâmetros de listagem paginada de produtos.
 */
export interface ProductListParams {
  page?: number;
  pageSize?: number;
  sortBy?: ProductSortBy;
  filters?: ProductFilters;
}

/**
 * Resposta paginada de listagem de produtos.
 */
export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters?: ProductFilters;
}
