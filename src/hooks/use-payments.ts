"use client";

import { useMutation } from "@tanstack/react-query";
import type { TokenizeCardRequest } from "@/contracts";
import { paymentRepository } from "@/lib/container";

/** POST /payments/tokenize-card — gera o creditCardToken usado em POST /payments. */
export function useTokenizeCard() {
  return useMutation({
    mutationFn: (request: TokenizeCardRequest) => paymentRepository.tokenizeCard(request),
  });
}
