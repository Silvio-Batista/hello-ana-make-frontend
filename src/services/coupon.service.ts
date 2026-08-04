import type {
  Coupon,
  CouponValidationResult,
  CreateCouponInput,
  UpdateCouponInput,
} from "@/contracts";
import { couponRepository } from "@/lib/container";

export const couponService = {
  validate(
    code: string,
    cartSubtotal: number,
    productIds?: string[],
  ): Promise<CouponValidationResult> {
    return couponRepository.validate(code, cartSubtotal, productIds);
  },

  list(): Promise<Coupon[]> {
    return couponRepository.list();
  },

  getById(id: string): Promise<Coupon | null> {
    return couponRepository.getById(id);
  },

  getByCode(code: string): Promise<Coupon | null> {
    return couponRepository.getByCode(code);
  },

  create(input: CreateCouponInput): Promise<Coupon> {
    return couponRepository.create(input);
  },

  update(id: string, input: UpdateCouponInput): Promise<Coupon> {
    return couponRepository.update(id, input);
  },

  remove(id: string): Promise<void> {
    return couponRepository.remove(id);
  },
};
