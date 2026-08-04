import type {
  AdminDashboardStats,
  AdminOrderListParams,
  Category,
  CreateCategoryInput,
  CreatePromotionInput,
  Order,
  Promotion,
  StoreSettings,
  UpdateCategoryInput,
  UpdateOrderStatusRequest,
  UpdatePromotionInput,
} from "@/contracts";
import type { OrderListResponse } from "@/repositories/interfaces";
import {
  adminRepository,
  categoryRepository,
  orderRepository,
  promotionRepository,
} from "@/lib/container";

export const adminService = {
  getDashboardStats(): Promise<AdminDashboardStats> {
    return adminRepository.getDashboardStats();
  },

  getSettings(): Promise<StoreSettings> {
    return adminRepository.getSettings();
  },

  updateSettings(input: Partial<StoreSettings>): Promise<StoreSettings> {
    return adminRepository.updateSettings(input);
  },

  listOrders(params?: AdminOrderListParams): Promise<OrderListResponse> {
    return orderRepository.listAll(params);
  },

  updateOrderStatus(
    id: string,
    request: UpdateOrderStatusRequest,
  ): Promise<Order> {
    return orderRepository.updateStatus(id, request);
  },

  listCategories(): Promise<Category[]> {
    return categoryRepository.list();
  },

  createCategory(input: CreateCategoryInput): Promise<Category> {
    return categoryRepository.create(input);
  },

  updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    return categoryRepository.update(id, input);
  },

  removeCategory(id: string): Promise<void> {
    return categoryRepository.remove(id);
  },

  listPromotions(): Promise<Promotion[]> {
    return promotionRepository.listAll();
  },

  createPromotion(input: CreatePromotionInput): Promise<Promotion> {
    return promotionRepository.create(input);
  },

  updatePromotion(
    id: string,
    input: UpdatePromotionInput,
  ): Promise<Promotion> {
    return promotionRepository.update(id, input);
  },

  removePromotion(id: string): Promise<void> {
    return promotionRepository.remove(id);
  },
};
