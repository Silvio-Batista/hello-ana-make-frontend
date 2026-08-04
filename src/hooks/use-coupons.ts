"use client";

import { useMutation } from "@tanstack/react-query";
import { couponService } from "@/services/coupon.service";

export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({
      code,
      cartSubtotal,
      productIds,
    }: {
      code: string;
      cartSubtotal: number;
      productIds?: string[];
    }) => couponService.validate(code, cartSubtotal, productIds),
  });
}
