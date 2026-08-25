import type { ProductListParams, ProductListResponse } from "@/contracts";
import type { FavoriteRepository } from "@/repositories/interfaces";
import { apiDelete, apiGet, apiPost } from "@/lib/http-client";

export class ApiFavoriteRepository implements FavoriteRepository {
  list(params?: ProductListParams): Promise<ProductListResponse> {
    return apiGet<ProductListResponse>("/favorites", {
      page: params?.page,
      pageSize: params?.pageSize,
      sortBy: params?.sortBy,
    });
  }

  async add(productId: string): Promise<void> {
    await apiPost(`/favorites/${productId}`);
  }

  async remove(productId: string): Promise<void> {
    await apiDelete(`/favorites/${productId}`);
  }

  async has(productId: string): Promise<boolean> {
    const { isFavorite } = await apiGet<{ isFavorite: boolean }>(
      `/favorites/${productId}/check`,
    );
    return isFavorite;
  }

  async getIds(): Promise<string[]> {
    const { ids } = await apiGet<{ ids: string[] }>("/favorites/ids");
    return ids;
  }
}
