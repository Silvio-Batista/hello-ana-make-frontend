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
import type { User } from "./auth.contract";

/**
 * Métricas do painel administrativo (GET /admin/dashboard).
 */
export interface AdminDashboardStats {
  period: { from: string; to: string };
  ordersCount: number;
  /** Pedidos com status paid|processing|shipped|in_transit|delivered. */
  ordersPaidCount: number;
  revenue: number;
  averageTicket: number;
  newCustomers: number;
  /** Produtos ativos com 0 < estoque <= 5. */
  productsLowStock: number;
  ordersByStatus: Record<OrderStatus, number>;
  topProducts: { productId: string; name: string; unitsSold: number }[];
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
 * Cliente no painel admin (GET /admin/customers).
 */
export interface AdminCustomer extends User {
  ordersCount: number;
}

/**
 * Filtros de listagem admin de clientes.
 */
export interface AdminCustomerListParams {
  page?: number;
  pageSize?: number;
  /** Filtra por nome/e-mail (contains, case-insensitive). */
  search?: string;
}

export interface AdminCustomerListResponse {
  items: AdminCustomer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Resposta de upload de imagem (POST /admin/uploads).
 */
export interface UploadImageResponse {
  url: string;
  mimeType: string;
  size: number;
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
 * Chaves/segredos de integração — vêm mascarados do backend (ex.: "asaas_****"),
 * nunca em texto puro. Atualizados via PATCH /admin/settings/integrations (substituição direta).
 */
export interface StoreIntegrationsSettings {
  paymentGateway: string;
  shippingProvider: string;
  asaasApiKey?: string;
  superfreteToken?: string;
}

/**
 * Configurações gerais da loja (GET/PUT /admin/settings).
 */
export interface StoreSettings {
  store: {
    name: string;
    legalName?: string;
    document?: string;
    email: string;
    phone?: string;
    instagramUrl?: string;
  };
  checkout: {
    enabledPaymentMethods: string[];
    maxInstallments: number;
    minInstallmentAmount: number;
    allowGuestCheckout: boolean;
  };
  shipping: {
    originZipCode: string;
    defaultWeightGrams: number;
    defaultWidthCm: number;
    defaultHeightCm: number;
    defaultLengthCm: number;
    /** Valor mínimo para frete grátis por serviço; null/undefined = sem frete grátis. */
    freeShippingThresholds: {
      PAC?: number | null;
      SEDEX?: number | null;
      EXPRESSA?: number | null;
    };
  };
  rewards: {
    enabled: boolean;
  };
  signupPromotion: {
    enabled: boolean;
    couponCode: string;
    discountPercentage: number;
    message: string;
    expiresAt?: string;
  };
  integrations: StoreIntegrationsSettings;
  currency: string;
  timezone: string;
  updatedAt: string;
}
