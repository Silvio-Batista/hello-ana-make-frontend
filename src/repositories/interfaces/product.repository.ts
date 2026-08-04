import type {
  CreateProductInput,
  Product,
  ProductListParams,
  ProductListResponse,
  UpdateProductInput,
} from "@/contracts";

/**
 * Repositório de produtos.
 */
export interface ProductRepository {
  list(params?: ProductListParams): Promise<ProductListResponse>;
  getById(id: string): Promise<Product | null>;
  getBySlug(slug: string): Promise<Product | null>;
  getFeatured(limit?: number): Promise<Product[]>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  getBestsellers(limit?: number): Promise<Product[]>;
  getRelated(productId: string, limit?: number): Promise<Product[]>;
  search(query: string, params?: ProductListParams): Promise<ProductListResponse>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product>;
  remove(id: string): Promise<void>;
}
