import type { ProductListParams, ProductListResponse } from "@/contracts";
import type { FavoriteRepository } from "@/repositories/interfaces";
import { products } from "@/mocks";
import { delay } from "@/repositories/utils";

/** In-memory Set of favorited product IDs. */
const favoriteIds = new Set<string>(["prod-001", "prod-003", "prod-012"]);

export class MockFavoriteRepository implements FavoriteRepository {
  async list(params: ProductListParams = {}): Promise<ProductListResponse> {
    await delay();
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 12;
    const items = products
      .filter((p) => favoriteIds.has(p.id))
      .map((p) => ({ ...p, isFavorite: true }));
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async add(productId: string): Promise<void> {
    await delay();
    if (!products.some((p) => p.id === productId)) {
      throw new Error("Produto não encontrado.");
    }
    favoriteIds.add(productId);
  }

  async remove(productId: string): Promise<void> {
    await delay();
    favoriteIds.delete(productId);
  }

  async has(productId: string): Promise<boolean> {
    await delay();
    return favoriteIds.has(productId);
  }

  async getIds(): Promise<string[]> {
    await delay();
    return [...favoriteIds];
  }

  /** Extra helper: toggle favorite state. */
  async toggle(productId: string): Promise<{ favorited: boolean }> {
    await delay();
    if (favoriteIds.has(productId)) {
      favoriteIds.delete(productId);
      return { favorited: false };
    }
    if (!products.some((p) => p.id === productId)) {
      throw new Error("Produto não encontrado.");
    }
    favoriteIds.add(productId);
    return { favorited: true };
  }
}
