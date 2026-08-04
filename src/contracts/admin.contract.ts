import type { Coupon } from "./coupon.contract";
import type { OrderStatus } from "./order.contract";
import type {
  ProductBadge,
  ProductImage,
  ProductPromotion,
  ProductVariant,
} from "./product.contract";
import type { Promotion } from "./promotion.contract";
import type { CartRewardGift } from "./reward.contract";

/**
 * Métricas do painel administrativo.
 */
export interface AdminDashboardStats {
  totalOrders: number;
  ordersToday: number;
  revenueTotal: number;
  revenueMonth: number;
  productsCount: number;
  lowStockCount: number;
  pendingOrders: number;
  activeCoupons: number;
  activePromotions: number;
}

/**
 * Filtros de listagem admin de pedidos.
 */
export interface AdminOrderListParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
  /** Número do pedido, e-mail ou nome. */
  search?: string;
  from?: string;
  to?: string;
}

/**
 * Atualização de status / rastreio de pedido.
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  trackingCode?: string;
  trackingUrl?: string;
  notes?: string;
}

/**
 * Payload para criação de produto (marca/categoria por id).
 */
export interface CreateProductInput {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  brandId: string;
  categoryId: string;
  images: ProductImage[];
  variants: ProductVariant[];
  ingredients?: string;
  howToUse?: string;
  benefits?: string[];
  technicalInfo?: Record<string, string>;
  badges?: ProductBadge[];
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  promotion?: ProductPromotion;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  isActive: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

/** Cupom sem id, contagem de uso e timestamps. */
export type CreateCouponInput = Omit<
  Coupon,
  "id" | "usageCount" | "createdAt" | "updatedAt"
>;

export interface UpdateCouponInput extends Partial<CreateCouponInput> {}

/** Promoção sem id e timestamps. */
export type CreatePromotionInput = Omit<
  Promotion,
  "id" | "createdAt" | "updatedAt"
>;

export interface UpdatePromotionInput extends Partial<CreatePromotionInput> {}

export interface CreateBrandInput {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
}

export interface UpdateBrandInput extends Partial<CreateBrandInput> {}

export interface CreateRewardTierInput {
  minimumAmount: number;
  reward: Omit<CartRewardGift, "id">;
  isActive: boolean;
  sortOrder: number;
}

export interface UpdateRewardTierInput extends Partial<CreateRewardTierInput> {}

/**
 * Configurações gerais da loja.
 */
export interface StoreSettings {
  storeName: string;
  freeShippingMinimum: number;
  announcementText: string;
  announcementEnabled: boolean;
  signupDiscountPercentage: number;
  signupCouponPrefix: string;
  contactEmail: string;
  contactWhatsapp?: string;
  instagramUrl?: string;
  currency: string;
}
