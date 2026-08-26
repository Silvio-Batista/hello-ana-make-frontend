import type {
  AddCartItemRequest,
  Cart,
  CouponValidationResult,
  SelectShippingRequest,
  UpdateCartItemRequest,
} from "@/contracts";

/**
 * Repositório do carrinho — sincronizado com o backend (/cart), com suporte
 * a carrinho guest via X-Cart-Id (ver AGENTS.md §1 e §5).
 */
export interface CartRepository {
  getCart(): Promise<Cart>;
  addItem(input: AddCartItemRequest): Promise<Cart>;
  updateItemQuantity(itemId: string, input: UpdateCartItemRequest): Promise<Cart>;
  removeItem(itemId: string): Promise<Cart>;
  clear(): Promise<Cart>;
  applyCoupon(code: string): Promise<{ cart: Cart; validation: CouponValidationResult }>;
  removeCoupon(): Promise<Cart>;
  selectShipping(input: SelectShippingRequest): Promise<Cart>;
}
