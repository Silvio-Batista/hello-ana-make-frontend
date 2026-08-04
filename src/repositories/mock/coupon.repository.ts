import type {
  Coupon,
  CouponValidationResult,
  CreateCouponInput,
  UpdateCouponInput,
} from "@/contracts";
import type { CouponRepository } from "@/repositories/interfaces";
import {
  coupons,
  firstPurchaseOnlyCodes,
  firstPurchaseUserIds,
  getCurrentUserId,
} from "@/mocks";
import { delay } from "@/repositories/utils";

let couponStore = coupons;
let couponSeq = coupons.length + 1;

export class MockCouponRepository implements CouponRepository {
  async getByCode(code: string): Promise<Coupon | null> {
    await delay();
    const normalized = code.trim().toUpperCase();
    return couponStore.find((c) => c.code.toUpperCase() === normalized) ?? null;
  }

  async validate(
    code: string,
    cartSubtotal: number,
    productIds?: string[],
  ): Promise<CouponValidationResult> {
    await delay();
    const coupon = await this.getByCode(code);

    if (!coupon) {
      return {
        status: "invalid",
        discountAmount: 0,
        message: "Cupom inválido.",
      };
    }

    if (!coupon.isActive) {
      return {
        status: "inactive",
        coupon,
        discountAmount: 0,
        message: "Este cupom está inativo.",
      };
    }

    const now = Date.now();
    if (now < new Date(coupon.startsAt).getTime()) {
      return {
        status: "not_started",
        coupon,
        discountAmount: 0,
        message: "Este cupom ainda não está válido.",
      };
    }

    if (now > new Date(coupon.endsAt).getTime()) {
      return {
        status: "expired",
        coupon,
        discountAmount: 0,
        message: "Este cupom expirou.",
      };
    }

    if (
      coupon.usageLimit !== undefined &&
      coupon.usageCount >= coupon.usageLimit
    ) {
      return {
        status: "usage_limit_reached",
        coupon,
        discountAmount: 0,
        message: "Limite de uso deste cupom esgotado.",
      };
    }

    const userId = getCurrentUserId();
    if (
      firstPurchaseOnlyCodes.has(coupon.code.toUpperCase()) &&
      userId &&
      !firstPurchaseUserIds.has(userId)
    ) {
      return {
        status: "already_used",
        coupon,
        discountAmount: 0,
        message: "Cupom válido apenas para a primeira compra.",
      };
    }

    if (
      coupon.minOrderValue !== undefined &&
      cartSubtotal < coupon.minOrderValue
    ) {
      return {
        status: "min_order_not_met",
        coupon,
        discountAmount: 0,
        message: `Valor mínimo de R$ ${coupon.minOrderValue.toFixed(2)} não atingido.`,
      };
    }

    if (coupon.type === "product" && coupon.productIds?.length && productIds) {
      const eligible = productIds.some((id) => coupon.productIds!.includes(id));
      if (!eligible) {
        return {
          status: "not_applicable",
          coupon,
          discountAmount: 0,
          message: "Cupom não se aplica aos produtos do carrinho.",
        };
      }
    }

    if (coupon.type === "free_shipping") {
      return {
        status: "valid",
        coupon,
        discountAmount: 0,
        message: "Frete grátis aplicado!",
      };
    }

    let discountAmount =
      coupon.type === "percentage"
        ? (cartSubtotal * coupon.value) / 100
        : coupon.value;

    if (coupon.maxDiscountValue !== undefined) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountValue);
    }

    discountAmount = Math.min(discountAmount, cartSubtotal);
    discountAmount = Math.round(discountAmount * 100) / 100;

    return {
      status: "valid",
      coupon,
      discountAmount,
      message: "Cupom aplicado com sucesso!",
    };
  }

  async list(): Promise<Coupon[]> {
    await delay();
    return [...couponStore].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async getById(id: string): Promise<Coupon | null> {
    await delay();
    return couponStore.find((c) => c.id === id) ?? null;
  }

  async create(input: CreateCouponInput): Promise<Coupon> {
    await delay();
    const now = new Date().toISOString();
    const coupon: Coupon = {
      ...input,
      id: `cpn-${String(couponSeq).padStart(3, "0")}`,
      code: input.code.toUpperCase(),
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    couponSeq += 1;
    couponStore.unshift(coupon);
    return coupon;
  }

  async update(id: string, input: UpdateCouponInput): Promise<Coupon> {
    await delay();
    const index = couponStore.findIndex((c) => c.id === id);
    if (index < 0) throw new Error("Cupom não encontrado.");
    const current = couponStore[index]!;
    const updated: Coupon = {
      ...current,
      ...input,
      id: current.id,
      code: input.code ? input.code.toUpperCase() : current.code,
      usageCount: current.usageCount,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    couponStore[index] = updated;
    return updated;
  }

  async remove(id: string): Promise<void> {
    await delay();
    const index = couponStore.findIndex((c) => c.id === id);
    if (index < 0) throw new Error("Cupom não encontrado.");
    couponStore.splice(index, 1);
  }
}
