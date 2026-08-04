import type { ProductVariantAttributes } from "./product.contract";

/**
 * Item do carrinho vinculado a uma variante de produto.
 */
export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  variantSku: string;
  variantName: string;
  attributes: ProductVariantAttributes;
  image: string;
  unitPrice: number;
  promotionalPrice?: number;
  quantity: number;
  maxQuantity: number;
  isAvailable: boolean;
  lineTotal: number;
}

/**
 * Totais calculados do carrinho.
 */
export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  currency: string;
}

/**
 * Carrinho de compras do cliente.
 */
export interface Cart {
  id: string;
  items: CartItem[];
  totals: CartTotals;
  couponCode?: string;
  updatedAt: string;
}
