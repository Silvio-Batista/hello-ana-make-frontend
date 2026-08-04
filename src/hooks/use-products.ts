"use client";

import { useQuery } from "@tanstack/react-query";
import type { ProductListParams } from "@/contracts";
import { productService } from "@/services/product.service";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: ProductListParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (idOrSlug: string) => [...productKeys.details(), idOrSlug] as const,
  bestsellers: (limit?: number) => [...productKeys.all, "bestsellers", limit] as const,
  onSale: (params?: ProductListParams) => [...productKeys.all, "on-sale", params] as const,
  newArrivals: (limit?: number) => [...productKeys.all, "new-arrivals", limit] as const,
  related: (productId: string, limit?: number) =>
    [...productKeys.all, "related", productId, limit] as const,
  search: (query: string, params?: ProductListParams) =>
    [...productKeys.all, "search", query, params] as const,
};

export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.list(params),
  });
}

/** Busca por slug; se não encontrar, tenta por id. */
export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: productKeys.detail(idOrSlug),
    queryFn: async () => {
      const bySlug = await productService.getBySlug(idOrSlug);
      if (bySlug) return bySlug;
      return productService.getById(idOrSlug);
    },
    enabled: Boolean(idOrSlug),
  });
}

export function useBestsellers(limit = 8) {
  return useQuery({
    queryKey: productKeys.bestsellers(limit),
    queryFn: () => productService.getBestsellers(limit),
  });
}

export function useOnSale(params?: ProductListParams) {
  return useQuery({
    queryKey: productKeys.onSale(params),
    queryFn: () => productService.getOnSale(params),
  });
}

export function useNewArrivals(limit = 8) {
  return useQuery({
    queryKey: productKeys.newArrivals(limit),
    queryFn: () => productService.getNewArrivals(limit),
  });
}

export function useRelated(productId: string, limit = 4) {
  return useQuery({
    queryKey: productKeys.related(productId, limit),
    queryFn: () => productService.getRelated(productId, limit),
    enabled: Boolean(productId),
  });
}

export function useSearch(query: string, params?: ProductListParams) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: productKeys.search(trimmed, params),
    queryFn: () => productService.search(trimmed, params),
    enabled: trimmed.length >= 2,
  });
}
