import type {
  Brand,
  CreateBrandInput,
  UpdateBrandInput,
} from "@/contracts";
import { brandRepository } from "@/lib/container";

export const brandService = {
  list(): Promise<Brand[]> {
    return brandRepository.list();
  },

  getById(id: string): Promise<Brand | null> {
    return brandRepository.getById(id);
  },

  create(input: CreateBrandInput): Promise<Brand> {
    return brandRepository.create(input);
  },

  update(id: string, input: UpdateBrandInput): Promise<Brand> {
    return brandRepository.update(id, input);
  },

  remove(id: string): Promise<void> {
    return brandRepository.remove(id);
  },
};
