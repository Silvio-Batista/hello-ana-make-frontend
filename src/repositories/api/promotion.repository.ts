import type {
  CreatePromotionInput,
  Promotion,
  UpdatePromotionInput,
} from "@/contracts";
import type { PromotionRepository } from "@/repositories/interfaces";
import { apiDelete, apiGet, apiPost, apiPut, getOrNull } from "@/lib/http-client";

export class ApiPromotionRepository implements PromotionRepository {
  async listActive(): Promise<Promotion[]> {
    const { items } = await apiGet<{ items: Promotion[] }>(
      "/promotions",
      undefined,
      { auth: false },
    );
    return items;
  }

  async listAll(): Promise<Promotion[]> {
    // Uso admin: /promotions é público e activeOnly=false exporia promoções inativas/futuras
    // sem autenticação, então a listagem completa vem da rota protegida (Bearer + role=admin).
    const all: Promotion[] = [];
    let page = 1;
    for (;;) {
      const { items, totalPages } = await apiGet<{
        items: Promotion[];
        totalPages: number;
      }>("/admin/promotions", { page, pageSize: 100 });
      all.push(...items);
      if (page >= totalPages) break;
      page += 1;
    }
    return all;
  }

  async getById(id: string): Promise<Promotion | null> {
    const items = await this.listAll();
    return items.find((p) => p.id === id) ?? null;
  }

  getBySlug(slug: string): Promise<Promotion | null> {
    return getOrNull<Promotion>(`/promotions/${slug}`, undefined, { auth: false });
  }

  async getForProduct(productId: string): Promise<Promotion[]> {
    const items = await this.listActive();
    return items.filter(
      (p) => !p.productIds?.length || p.productIds.includes(productId),
    );
  }

  async getForCategory(categoryId: string): Promise<Promotion[]> {
    const items = await this.listActive();
    return items.filter(
      (p) => !p.categoryIds?.length || p.categoryIds.includes(categoryId),
    );
  }

  create(input: CreatePromotionInput): Promise<Promotion> {
    return apiPost<Promotion>("/admin/promotions", input);
  }

  update(id: string, input: UpdatePromotionInput): Promise<Promotion> {
    return apiPut<Promotion>(`/admin/promotions/${id}`, input);
  }

  async remove(id: string): Promise<void> {
    await apiDelete(`/admin/promotions/${id}`);
  }
}
