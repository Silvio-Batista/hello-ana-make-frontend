import type { CartItem, CartTotals } from "@/contracts";

/** Preço unitário efetivo (promoção ou preço cheio). */
export function getUnitLinePrice(item: Pick<CartItem, "unitPrice" | "promotionalPrice">): number {
  return item.promotionalPrice ?? item.unitPrice;
}

/** Calcula o total da linha (preço efetivo × quantidade). */
export function calculateLineTotal(
  item: Pick<CartItem, "unitPrice" | "promotionalPrice" | "quantity">,
): number {
  return Math.round(getUnitLinePrice(item) * item.quantity * 100) / 100;
}

/** Soma dos totais de linha do carrinho. */
export function calculateSubtotal(items: CartItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + calculateLineTotal(item), 0) * 100) / 100;
}

/**
 * Recalcula totais do carrinho considerando cupom e frete.
 * Frete grátis zera o valor de shipping.
 */
export function recalculateTotals(
  items: CartItem[],
  couponDiscount: number,
  shippingPrice: number,
  freeShipping: boolean,
): CartTotals {
  const subtotal = calculateSubtotal(items);
  const discount = Math.min(Math.max(0, couponDiscount), subtotal);
  const shipping = freeShipping ? 0 : Math.max(0, shippingPrice);
  const tax = 0;
  const total = Math.round(Math.max(0, subtotal - discount + shipping + tax) * 100) / 100;

  return {
    subtotal,
    discount: Math.round(discount * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    currency: "BRL",
  };
}

/** Valor elegível para brindes = subtotal − desconto de cupom (sem frete). */
export function getEligibleAmount(subtotal: number, couponDiscount: number): number {
  return Math.max(0, Math.round((subtotal - Math.max(0, couponDiscount)) * 100) / 100);
}
