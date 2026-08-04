import type {
  CreateProductInput,
  Product,
  ProductListParams,
  ProductListResponse,
  UpdateProductInput,
} from "@/contracts";
import { productRepository } from "@/lib/container";

export const productService = {
  list(params?: ProductListParams): Promise<ProductListResponse> {
    return productRepository.list(params);
  },

  getById(id: string): Promise<Product | null> {
    return productRepository.getById(id);
  },

  getBySlug(slug: string): Promise<Product | null> {
    return productRepository.getBySlug(slug);
  },

  getFeatured(limit?: number): Promise<Product[]> {
    return productRepository.getFeatured(limit);
  },

  getNewArrivals(limit?: number): Promise<Product[]> {
    return productRepository.getNewArrivals(limit);
  },

  getBestsellers(limit?: number): Promise<Product[]> {
    return productRepository.getBestsellers(limit);
  },

  getOnSale(params?: ProductListParams): Promise<ProductListResponse> {
    return productRepository.list({
      ...params,
      filters: {
        ...params?.filters,
        onSale: true,
      },
    });
  },

  getRelated(productId: string, limit?: number): Promise<Product[]> {
    return productRepository.getRelated(productId, limit);
  },

  search(query: string, params?: ProductListParams): Promise<ProductListResponse> {
    return productRepository.search(query, params);
  },

  create(input: CreateProductInput): Promise<Product> {
    return productRepository.create(input);
  },

  update(id: string, input: UpdateProductInput): Promise<Product> {
    return productRepository.update(id, input);
  },

  remove(id: string): Promise<void> {
    return productRepository.remove(id);
  },
};
