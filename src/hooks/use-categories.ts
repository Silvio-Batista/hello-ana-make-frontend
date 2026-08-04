"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryRepository } from "@/lib/container";

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  tree: () => [...categoryKeys.all, "tree"] as const,
  detail: (idOrSlug: string) => [...categoryKeys.all, "detail", idOrSlug] as const,
  children: (parentId: string) => [...categoryKeys.all, "children", parentId] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryRepository.list(),
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: () => categoryRepository.getTree(),
  });
}

export function useCategory(idOrSlug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(idOrSlug),
    queryFn: async () => {
      const bySlug = await categoryRepository.getBySlug(idOrSlug);
      if (bySlug) return bySlug;
      return categoryRepository.getById(idOrSlug);
    },
    enabled: Boolean(idOrSlug),
  });
}

export function useCategoryChildren(parentId: string) {
  return useQuery({
    queryKey: categoryKeys.children(parentId),
    queryFn: () => categoryRepository.getChildren(parentId),
    enabled: Boolean(parentId),
  });
}
