"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartTotals, ShippingOption } from "@/contracts";
import {
  calculateLineTotal,
  calculateSubtotal,
  getEligibleAmount,
  recalculateTotals,
} from "@/services/cart.service";
import { couponService } from "@/services/coupon.service";

/** Payload para adicionar item (id e lineTotal são derivados). */
export type AddCartItemInput = Omit<CartItem, "id" | "lineTotal" | "quantity"> & {
  quantity?: number;
  id?: string;
};

interface CartState {
  items: CartItem[];
  savedForLater: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  couponMessage: string | null;
  freeShippingFromCoupon: boolean;
  shippingOption: ShippingOption | null;
  shippingCep: string | null;

  addItem: (input: AddCartItemInput) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  setShipping: (option: ShippingOption | null, cep?: string | null) => void;
  saveForLater: (itemId: string) => void;
  moveToCart: (itemId: string) => void;

  getSubtotal: () => number;
  getEligibleAmount: () => number;
  getTotals: () => CartTotals;
}

function withLineTotal(item: Omit<CartItem, "lineTotal">): CartItem {
  return {
    ...item,
    lineTotal: calculateLineTotal(item),
  };
}

function createItemId(variantId: string): string {
  return `cart-${variantId}-${Date.now()}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      couponCode: null,
      couponDiscount: 0,
      couponMessage: null,
      freeShippingFromCoupon: false,
      shippingOption: null,
      shippingCep: null,

      addItem: (input) => {
        const quantity = Math.max(1, input.quantity ?? 1);
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.variantId === input.variantId,
          );

          if (existingIndex >= 0) {
            const items = [...state.items];
            const current = items[existingIndex]!;
            const nextQty = Math.min(current.maxQuantity, current.quantity + quantity);
            items[existingIndex] = withLineTotal({ ...current, quantity: nextQty });
            return { items };
          }

          const newItem = withLineTotal({
            id: input.id ?? createItemId(input.variantId),
            productId: input.productId,
            productSlug: input.productSlug,
            productName: input.productName,
            variantId: input.variantId,
            variantSku: input.variantSku,
            variantName: input.variantName,
            attributes: input.attributes,
            image: input.image,
            unitPrice: input.unitPrice,
            promotionalPrice: input.promotionalPrice,
            quantity: Math.min(input.maxQuantity, quantity),
            maxQuantity: input.maxQuantity,
            isAvailable: input.isAvailable,
          });

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id !== itemId) return item;
              const nextQty = Math.max(0, Math.min(item.maxQuantity, quantity));
              if (nextQty <= 0) return null;
              return withLineTotal({ ...item, quantity: nextQty });
            })
            .filter((item): item is CartItem => item !== null),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          couponCode: null,
          couponDiscount: 0,
          couponMessage: null,
          freeShippingFromCoupon: false,
          shippingOption: null,
        });
      },

      applyCoupon: async (code) => {
        const trimmed = code.trim();
        if (!trimmed) return false;

        const subtotal = get().getSubtotal();
        const productIds = get().items.map((item) => item.productId);
        const result = await couponService.validate(trimmed, subtotal, productIds);

        if (result.status !== "valid" || !result.coupon) {
          set({
            couponCode: null,
            couponDiscount: 0,
            couponMessage: result.message,
            freeShippingFromCoupon: false,
          });
          return false;
        }

        set({
          couponCode: result.coupon.code,
          couponDiscount: result.discountAmount,
          couponMessage: result.message,
          freeShippingFromCoupon: result.coupon.type === "free_shipping",
        });
        return true;
      },

      removeCoupon: () => {
        set({
          couponCode: null,
          couponDiscount: 0,
          couponMessage: null,
          freeShippingFromCoupon: false,
        });
      },

      setShipping: (option, cep) => {
        set((state) => ({
          shippingOption: option,
          shippingCep: cep !== undefined ? cep : state.shippingCep,
        }));
      },

      saveForLater: (itemId) => {
        set((state) => {
          const item = state.items.find((i) => i.id === itemId);
          if (!item) return state;
          return {
            items: state.items.filter((i) => i.id !== itemId),
            savedForLater: [...state.savedForLater, item],
          };
        });
      },

      moveToCart: (itemId) => {
        set((state) => {
          const item = state.savedForLater.find((i) => i.id === itemId);
          if (!item) return state;

          const existingIndex = state.items.findIndex(
            (i) => i.variantId === item.variantId,
          );

          let items: CartItem[];
          if (existingIndex >= 0) {
            items = [...state.items];
            const current = items[existingIndex]!;
            const nextQty = Math.min(
              current.maxQuantity,
              current.quantity + item.quantity,
            );
            items[existingIndex] = withLineTotal({ ...current, quantity: nextQty });
          } else {
            items = [...state.items, item];
          }

          return {
            items,
            savedForLater: state.savedForLater.filter((i) => i.id !== itemId),
          };
        });
      },

      getSubtotal: () => calculateSubtotal(get().items),

      getEligibleAmount: () => {
        const { items, couponDiscount } = get();
        return getEligibleAmount(calculateSubtotal(items), couponDiscount);
      },

      getTotals: () => {
        const {
          items,
          couponDiscount,
          freeShippingFromCoupon,
          shippingOption,
        } = get();
        const shippingPrice = shippingOption?.price ?? 0;
        const freeShipping =
          freeShippingFromCoupon || Boolean(shippingOption?.isFree);
        return recalculateTotals(
          items,
          couponDiscount,
          shippingPrice,
          freeShipping,
        );
      },
    }),
    {
      name: "hello-ana-cart",
      partialize: (state) => ({
        items: state.items,
        savedForLater: state.savedForLater,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
        couponMessage: state.couponMessage,
        freeShippingFromCoupon: state.freeShippingFromCoupon,
        shippingOption: state.shippingOption,
        shippingCep: state.shippingCep,
      }),
    },
  ),
);
