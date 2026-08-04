import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/contracts";
import type { CategoryRepository } from "@/repositories/interfaces";
import { categories } from "@/mocks";
import { delay } from "@/repositories/utils";

let categoryStore = categories;
let categorySeq = categories.length + 1;

export class MockCategoryRepository implements CategoryRepository {
  async list(): Promise<Category[]> {
    await delay();
    return [...categoryStore]
      .filter((c) => c.isActive)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async getById(id: string): Promise<Category | null> {
    await delay();
    return categoryStore.find((c) => c.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Category | null> {
    await delay();
    return categoryStore.find((c) => c.slug === slug) ?? null;
  }

  async getChildren(parentId: string): Promise<Category[]> {
    await delay();
    return categoryStore.filter((c) => c.parentId === parentId && c.isActive);
  }

  async getTree(): Promise<Category[]> {
    await delay();
    return this.list();
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    await delay();
    const now = new Date().toISOString();
    const category: Category = {
      id: `cat-${String(categorySeq).padStart(3, "0")}`,
      slug: input.slug,
      name: input.name,
      description: input.description,
      image: input.image,
      parentId: input.parentId,
      productCount: 0,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
      createdAt: now,
      updatedAt: now,
    };
    categorySeq += 1;
    categoryStore.push(category);
    return category;
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    await delay();
    const index = categoryStore.findIndex((c) => c.id === id);
    if (index < 0) throw new Error("Categoria não encontrada.");
    const current = categoryStore[index]!;
    const updated: Category = {
      ...current,
      ...input,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    categoryStore[index] = updated;
    return updated;
  }

  async remove(id: string): Promise<void> {
    await delay();
    const index = categoryStore.findIndex((c) => c.id === id);
    if (index < 0) throw new Error("Categoria não encontrada.");
    categoryStore.splice(index, 1);
  }
}
