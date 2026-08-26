import type {
  AddCartItemRequest,
  Cart,
  CouponValidationResult,
  SelectShippingRequest,
  UpdateCartItemRequest,
} from "@/contracts";
import type { CartRepository } from "@/repositories/interfaces";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/http-client";
import { getCartId, setCartId } from "@/lib/cart-storage";

/**
 * Enquanto anônimo, o backend cria um carrinho e devolve `cart.id` — precisa
 * voltar no header X-Cart-Id nas próximas chamadas para não perder o carrinho
 * (e para o merge automático no login funcionar). Ver AGENTS.md §1/§5.
 */
function cartHeaders(): Record<string, string> | undefined {
  const id = getCartId();
  return id ? { "X-Cart-Id": id } : undefined;
}

function persist(cart: Cart): Cart {
  setCartId(cart.id);
  return cart;
}

export class ApiCartRepository implements CartRepository {
  async getCart(): Promise<Cart> {
    const cart = await apiGet<Cart>("/cart", undefined, { headers: cartHeaders() });
    return persist(cart);
  }

  async addItem(input: AddCartItemRequest): Promise<Cart> {
    const cart = await apiPost<Cart>("/cart/items", input, { headers: cartHeaders() });
    return persist(cart);
  }

  async updateItemQuantity(itemId: string, input: UpdateCartItemRequest): Promise<Cart> {
    const cart = await apiPatch<Cart>(`/cart/items/${itemId}`, input, {
      headers: cartHeaders(),
    });
    return persist(cart);
  }

  async removeItem(itemId: string): Promise<Cart> {
    const cart = await apiDelete<Cart>(`/cart/items/${itemId}`, { headers: cartHeaders() });
    return persist(cart);
  }

  async clear(): Promise<Cart> {
    const cart = await apiDelete<Cart>("/cart", { headers: cartHeaders() });
    return persist(cart);
  }

  async applyCoupon(
    code: string,
  ): Promise<{ cart: Cart; validation: CouponValidationResult }> {
    const result = await apiPost<{ cart: Cart; validation: CouponValidationResult }>(
      "/cart/coupon",
      { code },
      { headers: cartHeaders() },
    );
    persist(result.cart);
    return result;
  }

  async removeCoupon(): Promise<Cart> {
    const cart = await apiDelete<Cart>("/cart/coupon", { headers: cartHeaders() });
    return persist(cart);
  }

  async selectShipping(input: SelectShippingRequest): Promise<Cart> {
    const cart = await apiPut<Cart>("/cart/shipping", input, { headers: cartHeaders() });
    return persist(cart);
  }
}
