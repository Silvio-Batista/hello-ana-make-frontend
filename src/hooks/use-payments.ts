"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreatePaymentRequest, TokenizeCardRequest } from "@/contracts";
import { paymentRepository } from "@/lib/container";

export const paymentKeys = {
  all: ["payments"] as const,
  detail: (id: string) => [...paymentKeys.all, "detail", id] as const,
};

/** POST /payments/tokenize-card — gera o creditCardToken usado em POST /payments. */
export function useTokenizeCard() {
  return useMutation({
    mutationFn: (request: TokenizeCardRequest) => paymentRepository.tokenizeCard(request),
  });
}

/** POST /payments — cria (ou reaproveita, se ainda pendente) a cobrança de um pedido. */
export function useCreatePayment() {
  return useMutation({
    mutationFn: (request: CreatePaymentRequest) => paymentRepository.createPayment(request),
  });
}

/**
 * GET /payments/:id — status/dados da cobrança. Com `poll`, refaz a cada 5s
 * enquanto a cobrança está `pending`/`processing` (pra pegar o `paid` que chega
 * pelo webhook do gateway sem o usuário recarregar a página).
 */
export function usePayment(paymentId: string | undefined, opts?: { poll?: boolean }) {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId ?? ""),
    queryFn: () => paymentRepository.getPaymentStatus(paymentId as string),
    enabled: Boolean(paymentId),
    refetchInterval: opts?.poll
      ? (query) => {
          const status = query.state.data?.status;
          return status === "pending" || status === "processing" ? 5000 : false;
        }
      : false,
  });
}
