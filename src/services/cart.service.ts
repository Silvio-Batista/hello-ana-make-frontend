import type {
  AddCartItemRequest,
  Cart,
  CouponValidationResult,
  SelectShippingRequest,
} from "@/contracts";
import { cartRepository } from "@/lib/container";

export const cartService = {
  getCart(): Promise<Cart> {
    return cartRepository.getCart();
  },

  addItem(input: AddCartItemRequest): Promise<Cart> {
    return cartRepository.addItem(input);
  },

  updateItemQuantity(itemId: string, quantity: number): Promise<Cart> {
    return cartRepository.updateItemQuantity(itemId, { quantity });
  },

  removeItem(itemId: string): Promise<Cart> {
    return cartRepository.removeItem(itemId);
  },

  clear(): Promise<Cart> {
    return cartRepository.clear();
  },

  applyCoupon(code: string): Promise<{ cart: Cart; validation: CouponValidationResult }> {
    return cartRepository.applyCoupon(code);
  },

  removeCoupon(): Promise<Cart> {
    return cartRepository.removeCoupon();
  },

  selectShipping(input: SelectShippingRequest): Promise<Cart> {
    return cartRepository.selectShipping(input);
  },
};
