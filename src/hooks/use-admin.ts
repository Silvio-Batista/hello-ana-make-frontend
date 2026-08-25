"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminOrderListParams,
  CreateBrandInput,
  CreateCategoryInput,
  CreateCouponInput,
  CreateProductInput,
  CreatePromotionInput,
  CreateRewardTierInput,
  ProductListParams,
  StoreIntegrationsSettings,
  StoreSettings,
  UpdateBrandInput,
  UpdateCategoryInput,
  UpdateCouponInput,
  UpdateOrderStatusRequest,
  UpdateProductInput,
  UpdatePromotionInput,
  UpdateRewardTierInput,
} from "@/contracts";
import { adminService } from "@/services/admin.service";
import { brandService } from "@/services/brand.service";
import { couponService } from "@/services/coupon.service";
import { productService } from "@/services/product.service";
import { rewardService } from "@/services/reward.service";
import { orderRepository } from "@/lib/container";

export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  settings: () => [...adminKeys.all, "settings"] as const,
  products: (params?: ProductListParams) =>
    [...adminKeys.all, "products", params] as const,
  product: (id: string) => [...adminKeys.all, "product", id] as const,
  categories: () => [...adminKeys.all, "categories"] as const,
  brands: () => [...adminKeys.all, "brands"] as const,
  coupons: () => [...adminKeys.all, "coupons"] as const,
  promotions: () => [...adminKeys.all, "promotions"] as const,
  rewards: () => [...adminKeys.all, "rewards"] as const,
  orders: (params?: AdminOrderListParams) =>
    [...adminKeys.all, "orders", params] as const,
  order: (id: string) => [...adminKeys.all, "order", id] as const,
};

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminService.getDashboardStats(),
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: adminKeys.settings(),
    queryFn: () => adminService.getSettings(),
  });
}

export function useUpdateAdminSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Omit<StoreSettings, "integrations" | "updatedAt">>) =>
      adminService.updateSettings(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.settings() });
    },
  });
}

export function useUpdateAdminIntegrations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<StoreIntegrationsSettings>) =>
      adminService.updateIntegrations(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.settings() });
    },
  });
}

export function useAdminProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: adminKeys.products(params),
    queryFn: () => productService.list(params),
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: adminKeys.product(id),
    queryFn: () => productService.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => productService.create(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) =>
      productService.update(id, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useRemoveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: adminKeys.categories(),
    queryFn: () => adminService.listCategories(),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      adminService.createCategory(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.categories() });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      adminService.updateCategory(id, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.categories() });
    },
  });
}

export function useRemoveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.removeCategory(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.categories() });
    },
  });
}

export function useAdminBrands() {
  return useQuery({
    queryKey: adminKeys.brands(),
    queryFn: () => brandService.list(),
  });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBrandInput) => brandService.create(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.brands() });
    },
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBrandInput }) =>
      brandService.update(id, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.brands() });
    },
  });
}

export function useRemoveBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => brandService.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.brands() });
    },
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: adminKeys.coupons(),
    queryFn: () => couponService.list(),
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCouponInput) => couponService.create(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.coupons() });
    },
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCouponInput }) =>
      couponService.update(id, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.coupons() });
    },
  });
}

export function useRemoveCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponService.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.coupons() });
    },
  });
}

export function useAdminPromotions() {
  return useQuery({
    queryKey: adminKeys.promotions(),
    queryFn: () => adminService.listPromotions(),
  });
}

export function useCreatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePromotionInput) =>
      adminService.createPromotion(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.promotions() });
    },
  });
}

export function useUpdatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePromotionInput }) =>
      adminService.updatePromotion(id, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.promotions() });
    },
  });
}

export function useRemovePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.removePromotion(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.promotions() });
    },
  });
}

export function useAdminRewardTiers() {
  return useQuery({
    queryKey: adminKeys.rewards(),
    queryFn: () => rewardService.getTiers(),
  });
}

export function useCreateRewardTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRewardTierInput) =>
      rewardService.createTier(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.rewards() });
    },
  });
}

export function useUpdateRewardTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateRewardTierInput;
    }) => rewardService.updateTier(id, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.rewards() });
    },
  });
}

export function useRemoveRewardTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rewardService.removeTier(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.rewards() });
    },
  });
}

export function useAdminOrders(params?: AdminOrderListParams) {
  return useQuery({
    queryKey: adminKeys.orders(params),
    queryFn: () => adminService.listOrders(params),
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: adminKeys.order(id),
    queryFn: () => orderRepository.getById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdateOrderStatusRequest;
    }) => adminService.updateOrderStatus(id, request),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: adminKeys.orders() });
      void qc.invalidateQueries({ queryKey: adminKeys.order(vars.id) });
      void qc.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}
