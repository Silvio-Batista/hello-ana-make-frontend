import type {
  Brand,
  CreateBrandInput,
  UpdateBrandInput,
} from "@/contracts";
import type { BrandRepository } from "@/repositories/interfaces";
import { apiDelete, apiGet, apiPost, apiPut, getOrNull } from "@/lib/http-client";

export class ApiBrandRepository implements BrandRepository {
  async list(): Promise<Brand[]> {
    const { items } = await apiGet<{ items: Brand[] }>("/brands", undefined, {
      auth: false,
    });
    return items;
  }

  async getById(id: string): Promise<Brand | null> {
    const items = await this.list();
    return items.find((b) => b.id === id) ?? null;
  }

  getBySlug(slug: string): Promise<Brand | null> {
    return getOrNull<Brand>(`/brands/${slug}`, undefined, { auth: false });
  }

  create(input: CreateBrandInput): Promise<Brand> {
    return apiPost<Brand>("/admin/brands", input);
  }

  update(id: string, input: UpdateBrandInput): Promise<Brand> {
    return apiPut<Brand>(`/admin/brands/${id}`, input);
  }

  async remove(id: string): Promise<void> {
    await apiDelete(`/admin/brands/${id}`);
  }
}
