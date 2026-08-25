"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateOrderRequest } from "@/contracts";
import type { OrderListParams } from "@/repositories/interfaces";
import { orderRepository } from "@/lib/container";
import { checkoutService, type CreateOrderPayment } from "@/services/checkout.service";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: OrderListParams) => [...orderKeys.lists(), params] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
  byNumber: (orderNumber: string) =>
    [...orderKeys.all, "number", orderNumber] as const,
};

export function useOrders(params?: OrderListParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderRepository.listMine(params),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderRepository.getById(id),
    enabled: Boolean(id),
  });
}

export function useOrderByNumber(orderNumber: string) {
  return useQuery({
    queryKey: orderKeys.byNumber(orderNumber),
    queryFn: () => orderRepository.getByOrderNumber(orderNumber),
    enabled: Boolean(orderNumber),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      payment,
    }: {
      request: CreateOrderRequest;
      payment?: CreateOrderPayment;
    }) => checkoutService.createOrder(request, payment),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      orderRepository.cancel(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
