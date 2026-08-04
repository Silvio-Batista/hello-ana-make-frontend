import type {
  CreatePromotionInput,
  Promotion,
  UpdatePromotionInput,
} from "@/contracts";
import type { PromotionRepository } from "@/repositories/interfaces";
import { promotions } from "@/mocks";
import { delay } from "@/repositories/utils";

let promotionStore = promotions;
let promotionSeq = promotions.length + 1;

function isCurrentlyActive(promotion: Promotion): boolean {
  const now = Date.now();
  return (
    promotion.isActive &&
    now >= new Date(promotion.startsAt).getTime() &&
    now <= new Date(promotion.endsAt).getTime()
  );
}

export class MockPromotionRepository implements PromotionRepository {
  async listActive(): Promise<Promotion[]> {
    await delay();
    return promotionStore
      .filter(isCurrentlyActive)
      .sort((a, b) => b.priority - a.priority);
  }

  async listAll(): Promise<Promotion[]> {
    await delay();
    return [...promotionStore].sort((a, b) => b.priority - a.priority);
  }

  async getById(id: string): Promise<Promotion | null> {
    await delay();
    return promotionStore.find((p) => p.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Promotion | null> {
    await delay();
    return promotionStore.find((p) => p.slug === slug) ?? null;
  }

  async getForProduct(productId: string): Promise<Promotion[]> {
    await delay();
    return promotionStore.filter(
      (p) =>
        isCurrentlyActive(p) &&
        (!p.productIds?.length || p.productIds.includes(productId)),
    );
  }

  async getForCategory(categoryId: string): Promise<Promotion[]> {
    await delay();
    return promotionStore.filter(
      (p) =>
        isCurrentlyActive(p) &&
        (!p.categoryIds?.length || p.categoryIds.includes(categoryId)),
    );
  }

  async create(input: CreatePromotionInput): Promise<Promotion> {
    await delay();
    const now = new Date().toISOString();
    const promotion: Promotion = {
      ...input,
      id: `promo-${String(promotionSeq).padStart(3, "0")}`,
      createdAt: now,
      updatedAt: now,
    };
    promotionSeq += 1;
    promotionStore.unshift(promotion);
    return promotion;
  }

  async update(id: string, input: UpdatePromotionInput): Promise<Promotion> {
    await delay();
    const index = promotionStore.findIndex((p) => p.id === id);
    if (index < 0) throw new Error("Promoção não encontrada.");
    const current = promotionStore[index]!;
    const updated: Promotion = {
      ...current,
      ...input,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    promotionStore[index] = updated;
    return updated;
  }

  async remove(id: string): Promise<void> {
    await delay();
    const index = promotionStore.findIndex((p) => p.id === id);
    if (index < 0) throw new Error("Promoção não encontrada.");
    promotionStore.splice(index, 1);
  }
}
