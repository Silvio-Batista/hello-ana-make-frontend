import type { Product, ProductListParams, ProductListResponse } from "@/contracts";

/**
 * Repositório de favoritos do usuário.
 */
export interface FavoriteRepository {
  list(params?: ProductListParams): Promise<ProductListResponse>;
  add(productId: string): Promise<void>;
  remove(productId: string): Promise<void>;
  has(productId: string): Promise<boolean>;
  getIds(): Promise<string[]>;
}
