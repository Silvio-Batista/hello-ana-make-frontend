"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ShippingQuoteRequest } from "@/contracts";
import { shippingService } from "@/services/shipping.service";

export const shippingKeys = {
  all: ["shipping"] as const,
  quote: (request: ShippingQuoteRequest) =>
    [...shippingKeys.all, "quote", request] as const,
  tracking: (code: string) => [...shippingKeys.all, "tracking", code] as const,
};

export function useShippingQuote(request: ShippingQuoteRequest | null) {
  return useQuery({
    queryKey: shippingKeys.quote(request ?? { zipCode: "", items: [] }),
    queryFn: () => shippingService.calculateQuote(request!),
    enabled: Boolean(
      request?.zipCode &&
        request.zipCode.replace(/\D/g, "").length >= 8 &&
        request.items.length > 0,
    ),
  });
}

export function useCalculateShipping() {
  return useMutation({
    mutationFn: (request: ShippingQuoteRequest) =>
      shippingService.calculateQuote(request),
  });
}

export function useShippingTracking(trackingCode: string) {
  return useQuery({
    queryKey: shippingKeys.tracking(trackingCode),
    queryFn: () => shippingService.getTracking(trackingCode),
    enabled: Boolean(trackingCode),
  });
}
