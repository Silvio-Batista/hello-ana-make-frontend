import type {
  CreateProductInput,
  Product,
  ProductFilters,
  ProductInventory,
  ProductListParams,
  ProductListResponse,
  ProductPricing,
  UpdateProductInput,
} from "@/contracts";
import type { ProductRepository } from "@/repositories/interfaces";
import { getBrandById, getCategoryById, products } from "@/mocks";
import { delay } from "@/repositories/utils";

/** Store mutável em memória (mesma referência do seed). */
let productStore = products;
let productSeq = products.length + 1;

function computePricing(
  variants: Product["variants"],
): ProductPricing {
  const fullPrices = variants.map((v) => v.price);
  const priceFrom = Math.min(...fullPrices);
  const priceTo = Math.max(...fullPrices);
  const promoPrices = variants
    .map((v) => v.promotionalPrice)
    .filter((p): p is number => p !== undefined);
  const onSale = promoPrices.length > 0;
  const bestPromo = onSale ? Math.min(...promoPrices) : undefined;
  const discountPercentage =
    onSale && bestPromo !== undefined
      ? Math.round(((priceFrom - bestPromo) / priceFrom) * 100)
      : undefined;

  return {
    priceFrom,
    priceTo,
    promotionalPriceFrom: onSale ? Math.min(...promoPrices) : undefined,
    promotionalPriceTo: onSale ? Math.max(...promoPrices) : undefined,
    currency: "BRL",
    discountPercentage,
  };
}

function computeInventory(
  variants: Product["variants"],
): ProductInventory {
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
  const lowStockThreshold = 10;
  return {
    totalStock,
    isInStock: totalStock > 0,
    lowStockThreshold,
    isLowStock: totalStock > 0 && totalStock <= lowStockThreshold,
  };
}

function buildFromInput(input: CreateProductInput, id: string, now: string): Product {
  const variants = input.variants.map((v) => ({
    ...v,
    isAvailable: v.stock > 0,
  }));

  return {
    id,
    slug: input.slug,
    name: input.name,
    shortDescription: input.shortDescription,
    description: input.description,
    ingredients: input.ingredients,
    howToUse: input.howToUse,
    benefits: input.benefits,
    technicalInfo: input.technicalInfo,
    brand: getBrandById(input.brandId),
    category: getCategoryById(input.categoryId),
    images: input.images,
    variants,
    pricing: computePricing(variants),
    inventory: computeInventory(variants),
    rating: { average: 0, count: 0 },
    badges: input.badges ?? [],
    promotion: input.promotion,
    isFavorite: false,
    isFeatured: input.isFeatured,
    isNew: input.isNew,
    isBestseller: input.isBestseller,
    createdAt: now,
    updatedAt: now,
  };
}

function matchesSearch(product: Product, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return (
    product.name.toLowerCase().includes(q) ||
    product.slug.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q) ||
    product.shortDescription.toLowerCase().includes(q) ||
    product.brand.name.toLowerCase().includes(q)
  );
}

function applyFilters(items: Product[], filters?: ProductFilters): Product[] {
  if (!filters) return items;
  let result = items;

  if (filters.categoryIds?.length) {
    result = result.filter((p) => filters.categoryIds!.includes(p.category.id));
  }
  if (filters.brandIds?.length) {
    result = result.filter((p) => filters.brandIds!.includes(p.brand.id));
  }
  if (filters.priceMin !== undefined) {
    result = result.filter((p) => p.pricing.priceFrom >= filters.priceMin!);
  }
  if (filters.priceMax !== undefined) {
    result = result.filter((p) => p.pricing.priceFrom <= filters.priceMax!);
  }
  if (filters.inStockOnly) {
    result = result.filter((p) => p.inventory.isInStock);
  }
  if (filters.isFeatured) {
    result = result.filter((p) => p.isFeatured);
  }
  if (filters.isNew) {
    result = result.filter((p) => p.isNew);
  }
  if (filters.isBestseller) {
    result = result.filter((p) => p.isBestseller);
  }
  if (filters.onSale) {
    result = result.filter(
      (p) => p.pricing.promotionalPriceFrom !== undefined || !!p.promotion,
    );
  }
  if (filters.ratingMin !== undefined) {
    result = result.filter((p) => p.rating.average >= filters.ratingMin!);
  }
  if (filters.search) {
    result = result.filter((p) => matchesSearch(p, filters.search!));
  }
  if (filters.colors?.length) {
    result = result.filter((p) =>
      p.variants.some(
        (v) => v.attributes.color && filters.colors!.includes(v.attributes.color),
      ),
    );
  }

  return result;
}

function sortProducts(
  items: Product[],
  sortBy: ProductListParams["sortBy"] = "relevance",
): Product[] {
  const sorted = [...items];
  switch (sortBy) {
    case "price_asc":
      return sorted.sort((a, b) => a.pricing.priceFrom - b.pricing.priceFrom);
    case "price_desc":
      return sorted.sort((a, b) => b.pricing.priceFrom - a.pricing.priceFrom);
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "bestseller":
      return sorted.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));
    case "rating":
      return sorted.sort((a, b) => b.rating.average - a.rating.average);
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    case "name_desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name, "pt-BR"));
    default:
      return sorted;
  }
}

function paginate(
  items: Product[],
  page: number,
  pageSize: number,
  filters?: ProductFilters,
): ProductListResponse {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
    filters,
  };
}

export class MockProductRepository implements ProductRepository {
  async list(params: ProductListParams = {}): Promise<ProductListResponse> {
    await delay();
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 12;
    const filtered = sortProducts(
      applyFilters(productStore, params.filters),
      params.sortBy,
    );
    return paginate(filtered, page, pageSize, params.filters);
  }

  async getById(id: string): Promise<Product | null> {
    await delay();
    return productStore.find((p) => p.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Product | null> {
    await delay();
    return productStore.find((p) => p.slug === slug) ?? null;
  }

  async getFeatured(limit = 8): Promise<Product[]> {
    await delay();
    return productStore.filter((p) => p.isFeatured).slice(0, limit);
  }

  async getNewArrivals(limit = 8): Promise<Product[]> {
    await delay();
    return [...productStore]
      .filter((p) => p.isNew)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  }

  async getBestsellers(limit = 8): Promise<Product[]> {
    await delay();
    return productStore
      .filter((p) => p.isBestseller)
      .sort((a, b) => b.rating.count - a.rating.count)
      .slice(0, limit);
  }

  /** Extra helper for sale listings (also available via list filters.onSale). */
  async getOnSale(limit = 8): Promise<Product[]> {
    await delay();
    return productStore
      .filter((p) => p.pricing.promotionalPriceFrom !== undefined)
      .slice(0, limit);
  }

  async getRelated(productId: string, limit = 4): Promise<Product[]> {
    await delay();
    const product = productStore.find((p) => p.id === productId);
    if (!product) return [];
    return productStore
      .filter(
        (p) =>
          p.id !== productId &&
          (p.brand.id === product.brand.id ||
            p.category.id === product.category.id),
      )
      .slice(0, limit);
  }

  async search(
    query: string,
    params: ProductListParams = {},
  ): Promise<ProductListResponse> {
    await delay();
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 12;
    const filters: ProductFilters = { ...params.filters, search: query };
    const filtered = sortProducts(
      applyFilters(productStore, filters),
      params.sortBy,
    );
    return paginate(filtered, page, pageSize, filters);
  }

  async create(input: CreateProductInput): Promise<Product> {
    await delay();
    const now = new Date().toISOString();
    const id = `prod-${String(productSeq).padStart(3, "0")}`;
    productSeq += 1;
    const product = buildFromInput(input, id, now);
    productStore.unshift(product);
    return product;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    await delay();
    const index = productStore.findIndex((p) => p.id === id);
    if (index < 0) throw new Error("Produto não encontrado.");
    const current = productStore[index]!;
    const merged: CreateProductInput = {
      name: input.name ?? current.name,
      slug: input.slug ?? current.slug,
      shortDescription: input.shortDescription ?? current.shortDescription,
      description: input.description ?? current.description,
      brandId: input.brandId ?? current.brand.id,
      categoryId: input.categoryId ?? current.category.id,
      images: input.images ?? current.images,
      variants: input.variants ?? current.variants,
      ingredients: input.ingredients ?? current.ingredients,
      howToUse: input.howToUse ?? current.howToUse,
      benefits: input.benefits ?? current.benefits,
      technicalInfo: input.technicalInfo ?? current.technicalInfo,
      badges: input.badges ?? current.badges,
      isFeatured: input.isFeatured ?? current.isFeatured,
      isNew: input.isNew ?? current.isNew,
      isBestseller: input.isBestseller ?? current.isBestseller,
      promotion: input.promotion ?? current.promotion,
    };
    const now = new Date().toISOString();
    const updated: Product = {
      ...buildFromInput(merged, id, current.createdAt),
      rating: current.rating,
      isFavorite: current.isFavorite,
      createdAt: current.createdAt,
      updatedAt: now,
    };
    productStore[index] = updated;
    return updated;
  }

  async remove(id: string): Promise<void> {
    await delay();
    const index = productStore.findIndex((p) => p.id === id);
    if (index < 0) throw new Error("Produto não encontrado.");
    productStore.splice(index, 1);
  }
}
