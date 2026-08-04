import type {
  CreateProductInput,
  Product,
  ProductListParams,
  ProductListResponse,
  UpdateProductInput,
} from "@/contracts";
import type { ProductRepository } from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiProductRepository implements ProductRepository {
  list(_params?: ProductListParams): Promise<ProductListResponse> {
    return notImplemented("ApiProductRepository.list");
  }

  getById(_id: string): Promise<Product | null> {
    return notImplemented("ApiProductRepository.getById");
  }

  getBySlug(_slug: string): Promise<Product | null> {
    return notImplemented("ApiProductRepository.getBySlug");
  }

  getFeatured(_limit?: number): Promise<Product[]> {
    return notImplemented("ApiProductRepository.getFeatured");
  }

  getNewArrivals(_limit?: number): Promise<Product[]> {
    return notImplemented("ApiProductRepository.getNewArrivals");
  }

  getBestsellers(_limit?: number): Promise<Product[]> {
    return notImplemented("ApiProductRepository.getBestsellers");
  }

  getRelated(_productId: string, _limit?: number): Promise<Product[]> {
    return notImplemented("ApiProductRepository.getRelated");
  }

  search(
    _query: string,
    _params?: ProductListParams,
  ): Promise<ProductListResponse> {
    return notImplemented("ApiProductRepository.search");
  }

  create(_input: CreateProductInput): Promise<Product> {
    return notImplemented("ApiProductRepository.create");
  }

  update(_id: string, _input: UpdateProductInput): Promise<Product> {
    return notImplemented("ApiProductRepository.update");
  }

  remove(_id: string): Promise<void> {
    return notImplemented("ApiProductRepository.remove");
  }
}
