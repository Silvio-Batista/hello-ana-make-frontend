"use client";

import { useQuery } from "@tanstack/react-query";
import { brandRepository } from "@/lib/container";

export const brandKeys = {
  all: ["brands"] as const,
  lists: () => [...brandKeys.all, "list"] as const,
  detail: (slug: string) => [...brandKeys.all, "detail", slug] as const,
};

export function useBrands() {
  return useQuery({
    queryKey: brandKeys.lists(),
    queryFn: () => brandRepository.list(),
  });
}

export function useBrand(slug: string) {
  return useQuery({
    queryKey: brandKeys.detail(slug),
    queryFn: () => brandRepository.getBySlug(slug),
    enabled: Boolean(slug),
  });
}
