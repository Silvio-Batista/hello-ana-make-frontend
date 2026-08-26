import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/contracts";
import type { CategoryRepository } from "@/repositories/interfaces";
import { apiDelete, apiGet, apiPost, apiPut, getOrNull } from "@/lib/http-client";

export class ApiCategoryRepository implements CategoryRepository {
  async list(includeInactive = false): Promise<Category[]> {
    const { items } = await apiGet<{ items: Category[] }>(
      "/categories",
      { tree: false, includeInactive },
      { auth: false },
    );
    return items;
  }

  async getById(id: string): Promise<Category | null> {
    const items = await this.list();
    return items.find((c) => c.id === id) ?? null;
  }

  getBySlug(slug: string): Promise<Category | null> {
    return getOrNull<Category>(`/categories/${slug}`, undefined, { auth: false });
  }

  async getChildren(parentId: string): Promise<Category[]> {
    const items = await this.list();
    return items.filter((c) => c.parentId === parentId);
  }

  async getTree(): Promise<Category[]> {
    return this.list();
  }

  create(input: CreateCategoryInput): Promise<Category> {
    return apiPost<Category>("/admin/categories", input);
  }

  update(id: string, input: UpdateCategoryInput): Promise<Category> {
    return apiPut<Category>(`/admin/categories/${id}`, input);
  }

  async remove(id: string): Promise<void> {
    await apiDelete(`/admin/categories/${id}`);
  }
}
