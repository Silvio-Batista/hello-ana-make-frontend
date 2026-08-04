"use client";

import { useCartStore } from "@/stores/cart.store";
import { rewardKeys, useRewardProgress } from "@/hooks/use-rewards";

export function useCart() {
  const items = useCartStore((s) => s.items);
  const savedForLater = useCartStore((s) => s.savedForLater);
  const couponCode = useCartStore((s) => s.couponCode);
  const couponDiscount = useCartStore((s) => s.couponDiscount);
  const couponMessage = useCartStore((s) => s.couponMessage);
  const freeShippingFromCoupon = useCartStore((s) => s.freeShippingFromCoupon);
  const shippingOption = useCartStore((s) => s.shippingOption);
  const shippingCep = useCartStore((s) => s.shippingCep);

  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const setShipping = useCartStore((s) => s.setShipping);
  const saveForLater = useCartStore((s) => s.saveForLater);
  const moveToCart = useCartStore((s) => s.moveToCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getEligibleAmount = useCartStore((s) => s.getEligibleAmount);
  const getTotals = useCartStore((s) => s.getTotals);

  const subtotal = getSubtotal();
  const eligibleAmount = getEligibleAmount();
  const totals = getTotals();

  const rewardProgress = useRewardProgress(eligibleAmount);

  return {
    items,
    savedForLater,
    couponCode,
    couponDiscount,
    couponMessage,
    freeShippingFromCoupon,
    shippingOption,
    shippingCep,
    subtotal,
    eligibleAmount,
    totals,
    rewardProgress,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    setShipping,
    saveForLater,
    moveToCart,
    itemCount: totals.itemCount,
  };
}

/** Reexport das keys de reward para invalidação no carrinho. */
export { rewardKeys };
