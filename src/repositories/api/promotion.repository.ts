import type {
  CreatePromotionInput,
  Promotion,
  UpdatePromotionInput,
} from "@/contracts";
import type { PromotionRepository } from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiPromotionRepository implements PromotionRepository {
  listActive(): Promise<Promotion[]> {
    return notImplemented("ApiPromotionRepository.listActive");
  }

  listAll(): Promise<Promotion[]> {
    return notImplemented("ApiPromotionRepository.listAll");
  }

  getById(_id: string): Promise<Promotion | null> {
    return notImplemented("ApiPromotionRepository.getById");
  }

  getBySlug(_slug: string): Promise<Promotion | null> {
    return notImplemented("ApiPromotionRepository.getBySlug");
  }

  getForProduct(_productId: string): Promise<Promotion[]> {
    return notImplemented("ApiPromotionRepository.getForProduct");
  }

  getForCategory(_categoryId: string): Promise<Promotion[]> {
    return notImplemented("ApiPromotionRepository.getForCategory");
  }

  create(_input: CreatePromotionInput): Promise<Promotion> {
    return notImplemented("ApiPromotionRepository.create");
  }

  update(_id: string, _input: UpdatePromotionInput): Promise<Promotion> {
    return notImplemented("ApiPromotionRepository.update");
  }

  remove(_id: string): Promise<void> {
    return notImplemented("ApiPromotionRepository.remove");
  }
}
