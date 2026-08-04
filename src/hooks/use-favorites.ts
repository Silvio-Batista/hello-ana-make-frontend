"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProductListParams } from "@/contracts";
import { favoriteRepository } from "@/lib/container";

export const favoriteKeys = {
  all: ["favorites"] as const,
  list: (params?: ProductListParams) => [...favoriteKeys.all, "list", params] as const,
  ids: () => [...favoriteKeys.all, "ids"] as const,
  has: (productId: string) => [...favoriteKeys.all, "has", productId] as const,
};

export function useFavorites(params?: ProductListParams) {
  return useQuery({
    queryKey: favoriteKeys.list(params),
    queryFn: () => favoriteRepository.list(params),
  });
}

export function useFavoriteIds() {
  return useQuery({
    queryKey: favoriteKeys.ids(),
    queryFn: () => favoriteRepository.getIds(),
  });
}

export function useIsFavorite(productId: string) {
  return useQuery({
    queryKey: favoriteKeys.has(productId),
    queryFn: () => favoriteRepository.has(productId),
    enabled: Boolean(productId),
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      isFavorite,
    }: {
      productId: string;
      isFavorite: boolean;
    }) => {
      if (isFavorite) {
        await favoriteRepository.remove(productId);
      } else {
        await favoriteRepository.add(productId);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}
