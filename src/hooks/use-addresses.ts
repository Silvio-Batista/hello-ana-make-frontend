"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AddressInput } from "@/repositories/interfaces";
import { addressRepository } from "@/lib/container";

export const addressKeys = {
  all: ["addresses"] as const,
  lists: () => [...addressKeys.all, "list"] as const,
  detail: (id: string) => [...addressKeys.all, "detail", id] as const,
};

export function useAddresses(enabled = true) {
  return useQuery({
    queryKey: addressKeys.lists(),
    queryFn: () => addressRepository.list(),
    enabled,
  });
}

export function useAddress(id: string) {
  return useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => addressRepository.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddressInput) => addressRepository.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AddressInput>;
    }) => addressRepository.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

export function useRemoveAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressRepository.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressRepository.setDefault(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}
