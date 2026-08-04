import type { ProductListParams, ProductListResponse } from "@/contracts";
import type { FavoriteRepository } from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiFavoriteRepository implements FavoriteRepository {
  list(_params?: ProductListParams): Promise<ProductListResponse> {
    return notImplemented("ApiFavoriteRepository.list");
  }

  add(_productId: string): Promise<void> {
    return notImplemented("ApiFavoriteRepository.add");
  }

  remove(_productId: string): Promise<void> {
    return notImplemented("ApiFavoriteRepository.remove");
  }

  has(_productId: string): Promise<boolean> {
    return notImplemented("ApiFavoriteRepository.has");
  }

  getIds(): Promise<string[]> {
    return notImplemented("ApiFavoriteRepository.getIds");
  }
}
