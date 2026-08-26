import type {
  Coupon,
  CouponValidationResult,
  CreateCouponInput,
  UpdateCouponInput,
} from "@/contracts";
import type { CouponRepository } from "@/repositories/interfaces";
import { apiDelete, apiGet, apiPost, apiPut, getOrNull } from "@/lib/http-client";

export class ApiCouponRepository implements CouponRepository {
  getByCode(code: string): Promise<Coupon | null> {
    return getOrNull<Coupon>(`/coupons/${code}`, undefined, { auth: false });
  }

  validate(
    code: string,
    cartSubtotal: number,
    productIds?: string[],
  ): Promise<CouponValidationResult> {
    return apiPost<CouponValidationResult>(
      "/coupons/validate",
      { code, cartSubtotal, productIds },
      { auth: false },
    );
  }

  async list(): Promise<Coupon[]> {
    // GET /admin/coupons é paginado (default pageSize 20) mas essa lista precisa vir completa.
    const all: Coupon[] = [];
    let page = 1;
    for (;;) {
      const { items, totalPages } = await apiGet<{
        items: Coupon[];
        totalPages: number;
      }>("/admin/coupons", { page, pageSize: 100 });
      all.push(...items);
      if (page >= totalPages) break;
      page += 1;
    }
    return all;
  }

  async getById(id: string): Promise<Coupon | null> {
    const items = await this.list();
    return items.find((c) => c.id === id) ?? null;
  }

  create(input: CreateCouponInput): Promise<Coupon> {
    return apiPost<Coupon>("/admin/coupons", input);
  }

  update(id: string, input: UpdateCouponInput): Promise<Coupon> {
    return apiPut<Coupon>(`/admin/coupons/${id}`, input);
  }

  async remove(id: string): Promise<void> {
    await apiDelete(`/admin/coupons/${id}`);
  }
}
