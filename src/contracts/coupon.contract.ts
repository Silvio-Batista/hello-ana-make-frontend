/**
 * Tipos de cupom suportados.
 */
export type CouponType =
  | "percentage"
  | "fixed_amount"
  | "free_shipping"
  | "category"
  | "product";

/**
 * Status possíveis na validação de cupom.
 */
export type CouponValidationStatus =
  | "valid"
  | "invalid"
  | "expired"
  | "not_started"
  | "usage_limit_reached"
  | "min_order_not_met"
  | "not_applicable"
  | "already_used"
  | "inactive";

/**
 * Cupom de desconto.
 */
export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  /** Valor percentual (0–100) ou valor fixo em moeda, conforme o tipo. */
  value: number;
  description?: string;
  /** IDs de categorias elegíveis (tipo category). */
  categoryIds?: string[];
  /** IDs de produtos elegíveis (tipo product). */
  productIds?: string[];
  minOrderValue?: number;
  maxDiscountValue?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Resultado da validação de um cupom para um pedido/carrinho.
 */
export interface CouponValidationResult {
  status: CouponValidationStatus;
  coupon?: Coupon;
  discountAmount: number;
  message: string;
}
