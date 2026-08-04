import type {
  Coupon,
  CouponValidationResult,
  CreateCouponInput,
  UpdateCouponInput,
} from "@/contracts";

/**
 * Repositório de cupons.
 */
export interface CouponRepository {
  getByCode(code: string): Promise<Coupon | null>;
  validate(
    code: string,
    cartSubtotal: number,
    productIds?: string[],
  ): Promise<CouponValidationResult>;
  list(): Promise<Coupon[]>;
  getById(id: string): Promise<Coupon | null>;
  create(input: CreateCouponInput): Promise<Coupon>;
  update(id: string, input: UpdateCouponInput): Promise<Coupon>;
  remove(id: string): Promise<void>;
}
