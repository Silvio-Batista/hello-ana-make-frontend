import type {
  AddCartItemRequest,
  Cart,
  CartItem,
  CouponValidationResult,
  SelectShippingRequest,
  UpdateCartItemRequest,
} from "@/contracts";
import type { CartRepository } from "@/repositories/interfaces";
import { products, shippingRates } from "@/mocks";
import { MockCouponRepository } from "@/repositories/mock/coupon.repository";
import { delay } from "@/repositories/utils";

const STORE_MAX_QTY = 10;

interface MockCartState {
  id: string;
  items: CartItem[];
  couponCode?: string;
  shippingOptionId?: string;
  updatedAt: string;
}

/** Store único em memória — carrinho guest/logado não é distinguido em modo mock. */
const state: MockCartState = {
  id: "cart-mock-001",
  items: [],
  updatedAt: new Date().toISOString(),
};

const couponRepo = new MockCouponRepository();

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function lineTotal(item: Pick<CartItem, "unitPrice" | "promotionalPrice" | "quantity">): number {
  return round2((item.promotionalPrice ?? item.unitPrice) * item.quantity);
}

function subtotalOf(items: CartItem[]): number {
  return round2(items.reduce((sum, item) => sum + lineTotal(item), 0));
}

function shippingPriceFor(optionId: string | undefined, subtotal: number): number {
  if (!optionId) return 0;
  const rate = shippingRates.find((r) => r.id === optionId);
  if (!rate) return 0;
  return rate.freeAbove !== null && subtotal >= rate.freeAbove ? 0 : rate.basePrice;
}

function touch(): void {
  state.updatedAt = new Date().toISOString();
}

async function buildCart(): Promise<Cart> {
  const subtotal = subtotalOf(state.items);
  let discount = 0;
  let freeShipping = false;
  let couponMessage: string | undefined;
  let couponCode = state.couponCode;

  if (couponCode) {
    const productIds = state.items.map((item) => item.productId);
    const validation = await couponRepo.validate(couponCode, subtotal, productIds);
    if (validation.status === "valid") {
      discount = validation.discountAmount;
      freeShipping = validation.coupon?.type === "free_shipping";
      couponMessage = validation.message;
    } else {
      // Cupom deixou de valer (ex.: carrinho mudou) — solta ele do carrinho.
      state.couponCode = undefined;
      couponCode = undefined;
    }
  }

  const shipping = freeShipping ? 0 : shippingPriceFor(state.shippingOptionId, subtotal);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = round2(Math.max(0, subtotal - discount + shipping));

  return {
    id: state.id,
    items: state.items,
    totals: {
      subtotal,
      discount: round2(discount),
      shipping: round2(shipping),
      tax: 0,
      total,
      itemCount,
      currency: "BRL",
    },
    couponCode,
    couponMessage,
    freeShipping,
    shippingOptionId: state.shippingOptionId,
    rewardEligibleAmount: round2(Math.max(0, subtotal - discount)),
    updatedAt: state.updatedAt,
  };
}

export class MockCartRepository implements CartRepository {
  async getCart(): Promise<Cart> {
    await delay();
    return buildCart();
  }

  async addItem(input: AddCartItemRequest): Promise<Cart> {
    await delay();
    const product = products.find((p) => p.id === input.productId);
    const variant = product?.variants.find((v) => v.id === input.variantId);
    if (!product || !variant) {
      throw new Error("Produto ou variante inválidos.");
    }

    const existing = state.items.find((item) => item.variantId === variant.id);
    const desiredQuantity = (existing?.quantity ?? 0) + input.quantity;
    if (!variant.isAvailable || desiredQuantity > variant.stock) {
      throw new Error("Estoque insuficiente.");
    }

    if (existing) {
      existing.quantity = Math.min(desiredQuantity, STORE_MAX_QTY);
      existing.lineTotal = lineTotal(existing);
    } else {
      const item: CartItem = {
        id: `cartitem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        variantId: variant.id,
        variantSku: variant.sku,
        variantName: variant.name,
        attributes: variant.attributes,
        image: variant.image ?? product.images[0]?.url ?? "",
        unitPrice: variant.price,
        promotionalPrice: variant.promotionalPrice,
        quantity: Math.min(input.quantity, STORE_MAX_QTY),
        maxQuantity: Math.min(variant.stock, STORE_MAX_QTY),
        isAvailable: variant.isAvailable,
        lineTotal: 0,
      };
      item.lineTotal = lineTotal(item);
      state.items.push(item);
    }

    touch();
    return buildCart();
  }

  async updateItemQuantity(itemId: string, input: UpdateCartItemRequest): Promise<Cart> {
    await delay();
    const item = state.items.find((i) => i.id === itemId);
    if (!item) throw new Error("Item não encontrado no carrinho.");
    if (input.quantity > item.maxQuantity) {
      throw new Error("Quantidade acima do estoque disponível.");
    }
    item.quantity = input.quantity;
    item.lineTotal = lineTotal(item);
    touch();
    return buildCart();
  }

  async removeItem(itemId: string): Promise<Cart> {
    await delay();
    const index = state.items.findIndex((i) => i.id === itemId);
    if (index >= 0) state.items.splice(index, 1);
    touch();
    return buildCart();
  }

  async clear(): Promise<Cart> {
    await delay();
    state.items = [];
    state.couponCode = undefined;
    state.shippingOptionId = undefined;
    touch();
    return buildCart();
  }

  async applyCoupon(
    code: string,
  ): Promise<{ cart: Cart; validation: CouponValidationResult }> {
    await delay();
    const subtotal = subtotalOf(state.items);
    if (subtotal <= 0) {
      throw new Error("O carrinho está vazio.");
    }
    const productIds = state.items.map((item) => item.productId);
    const validation = await couponRepo.validate(code, subtotal, productIds);
    if (validation.status !== "valid") {
      throw new Error(validation.message);
    }
    state.couponCode = validation.coupon?.code;
    touch();
    const cart = await buildCart();
    return { cart, validation };
  }

  async removeCoupon(): Promise<Cart> {
    await delay();
    state.couponCode = undefined;
    touch();
    return buildCart();
  }

  async selectShipping(input: SelectShippingRequest): Promise<Cart> {
    await delay();
    state.shippingOptionId = input.shippingOptionId;
    touch();
    return buildCart();
  }
}
