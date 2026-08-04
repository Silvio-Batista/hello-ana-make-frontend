import type {
  CreatePromotionInput,
  Promotion,
  UpdatePromotionInput,
} from "@/contracts";

/**
 * Repositório de promoções e campanhas.
 */
export interface PromotionRepository {
  listActive(): Promise<Promotion[]>;
  listAll(): Promise<Promotion[]>;
  getById(id: string): Promise<Promotion | null>;
  getBySlug(slug: string): Promise<Promotion | null>;
  getForProduct(productId: string): Promise<Promotion[]>;
  getForCategory(categoryId: string): Promise<Promotion[]>;
  create(input: CreatePromotionInput): Promise<Promotion>;
  update(id: string, input: UpdatePromotionInput): Promise<Promotion>;
  remove(id: string): Promise<void>;
}
