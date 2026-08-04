/**
 * Tipos de promoção de campanha.
 */
export type PromotionType =
  | "direct_discount"
  | "buy_x_get_y"
  | "progressive"
  | "flash_sale"
  | "kit"
  | "campaign";

/**
 * Faixa de desconto progressivo (ex.: compre 2 ganhe 10%, compre 3 ganhe 15%).
 */
export interface ProgressiveDiscountTier {
  minQuantity: number;
  discountPercentage: number;
}

/**
 * Regra buy X get Y.
 */
export interface BuyXGetYRule {
  buyQuantity: number;
  getQuantity: number;
  /** Se true, o item grátis é o de menor valor. */
  applyToCheapest: boolean;
  /** Percentual de desconto nos itens "get" (100 = grátis). */
  getDiscountPercentage: number;
}

/**
 * Item de kit promocional.
 */
export interface KitItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

/**
 * Promoção / campanha de marketing.
 */
export interface Promotion {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: PromotionType;
  /** Desconto percentual ou valor fixo (direct_discount / flash_sale). */
  discountPercentage?: number;
  discountAmount?: number;
  buyXGetY?: BuyXGetYRule;
  progressiveTiers?: ProgressiveDiscountTier[];
  kitItems?: KitItem[];
  kitPrice?: number;
  /** Produtos elegíveis; vazio/undefined = todos (conforme regras do tipo). */
  productIds?: string[];
  categoryIds?: string[];
  brandIds?: string[];
  bannerImage?: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}
