import type {
  CreateProductInput,
  Product,
  ProductListParams,
  ProductListResponse,
  UpdateProductInput,
} from "@/contracts";
import type { ProductRepository } from "@/repositories/interfaces";
import { apiDelete, apiGet, apiPost, apiPut, getOrNull, type QueryParams } from "@/lib/http-client";

function toProductQuery(params?: ProductListParams): QueryParams {
  const f = params?.filters;
  return {
    page: params?.page,
    pageSize: params?.pageSize,
    sortBy: params?.sortBy,
    categoryIds: f?.categoryIds,
    brandIds: f?.brandIds,
    priceMin: f?.priceMin,
    priceMax: f?.priceMax,
    ratingMin: f?.ratingMin,
    inStockOnly: f?.inStockOnly,
    isFeatured: f?.isFeatured,
    isNew: f?.isNew,
    isBestseller: f?.isBestseller,
    onSale: f?.onSale,
    search: f?.search,
    colors: f?.colors,
  };
}

export class ApiProductRepository implements ProductRepository {
  list(params?: ProductListParams): Promise<ProductListResponse> {
    return apiGet<ProductListResponse>("/products", toProductQuery(params), {
      auth: false,
    });
  }

  async getById(id: string): Promise<Product | null> {
    // Não existe GET /admin/products/:id no backend — pagina até achar (pageSize máx. 100).
    let page = 1;
    for (;;) {
      const { items, totalPages } = await apiGet<ProductListResponse>(
        "/admin/products",
        { includeInactive: true, pageSize: 100, page },
      );
      const found = items.find((p) => p.id === id);
      if (found) return found;
      if (page >= totalPages) return null;
      page += 1;
    }
  }

  getBySlug(slug: string): Promise<Product | null> {
    return getOrNull<Product>(`/products/${slug}`, undefined, { auth: false });
  }

  async getFeatured(limit = 8): Promise<Product[]> {
    const { items } = await this.list({ pageSize: limit, filters: { isFeatured: true } });
    return items;
  }

  async getNewArrivals(limit = 8): Promise<Product[]> {
    const { items } = await this.list({
      pageSize: limit,
      sortBy: "newest",
      filters: { isNew: true },
    });
    return items;
  }

  async getBestsellers(limit = 8): Promise<Product[]> {
    const { items } = await this.list({
      pageSize: limit,
      sortBy: "bestseller",
      filters: { isBestseller: true },
    });
    return items;
  }

  async getRelated(productId: string, limit = 8): Promise<Product[]> {
    const { items } = await apiGet<{ items: Product[] }>(
      `/products/${productId}/related`,
      { limit },
      { auth: false },
    );
    return items;
  }

  search(query: string, params?: ProductListParams): Promise<ProductListResponse> {
    return apiGet<ProductListResponse>(
      "/products",
      { ...toProductQuery(params), search: query },
      { auth: false },
    );
  }

  create(input: CreateProductInput): Promise<Product> {
    return apiPost<Product>("/admin/products", input);
  }

  update(id: string, input: UpdateProductInput): Promise<Product> {
    return apiPut<Product>(`/admin/products/${id}`, input);
  }

  async remove(id: string): Promise<void> {
    await apiDelete(`/admin/products/${id}`);
  }
}
