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
  couponMessage?: string;
  freeShipping: boolean;
  shippingOptionId?: string;
  /** subtotal - desconto de cupom (sem frete) — usar em GET /rewards/progress. */
  rewardEligibleAmount: number;
  updatedAt: string;
}

/** POST /cart/items */
export interface AddCartItemRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

/** PATCH /cart/items/:itemId */
export interface UpdateCartItemRequest {
  quantity: number;
}

/** PUT /cart/shipping */
export interface SelectShippingRequest {
  shippingOptionId: string;
  zipCode: string;
}
