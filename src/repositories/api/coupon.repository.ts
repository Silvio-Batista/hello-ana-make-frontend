import type {
  Coupon,
  CouponValidationResult,
  CreateCouponInput,
  UpdateCouponInput,
} from "@/contracts";
import type { CouponRepository } from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiCouponRepository implements CouponRepository {
  getByCode(_code: string): Promise<Coupon | null> {
    return notImplemented("ApiCouponRepository.getByCode");
  }

  validate(
    _code: string,
    _cartSubtotal: number,
    _productIds?: string[],
  ): Promise<CouponValidationResult> {
    return notImplemented("ApiCouponRepository.validate");
  }

  list(): Promise<Coupon[]> {
    return notImplemented("ApiCouponRepository.list");
  }

  getById(_id: string): Promise<Coupon | null> {
    return notImplemented("ApiCouponRepository.getById");
  }

  create(_input: CreateCouponInput): Promise<Coupon> {
    return notImplemented("ApiCouponRepository.create");
  }

  update(_id: string, _input: UpdateCouponInput): Promise<Coupon> {
    return notImplemented("ApiCouponRepository.update");
  }

  remove(_id: string): Promise<void> {
    return notImplemented("ApiCouponRepository.remove");
  }
}
