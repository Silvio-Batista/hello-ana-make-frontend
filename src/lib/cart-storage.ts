const CART_ID_KEY = "hello-ana-cart-id";

/** Id do carrinho guest, enviado como X-Cart-Id até o login mesclar no carrinho do usuário. */
export function getCartId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CART_ID_KEY);
}

export function setCartId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(CART_ID_KEY, id);
  else window.localStorage.removeItem(CART_ID_KEY);
}
