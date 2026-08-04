import type {
  Brand,
  CreateBrandInput,
  UpdateBrandInput,
} from "@/contracts";
import type { BrandRepository } from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiBrandRepository implements BrandRepository {
  list(): Promise<Brand[]> {
    return notImplemented("ApiBrandRepository.list");
  }

  getById(_id: string): Promise<Brand | null> {
    return notImplemented("ApiBrandRepository.getById");
  }

  create(_input: CreateBrandInput): Promise<Brand> {
    return notImplemented("ApiBrandRepository.create");
  }

  update(_id: string, _input: UpdateBrandInput): Promise<Brand> {
    return notImplemented("ApiBrandRepository.update");
  }

  remove(_id: string): Promise<void> {
    return notImplemented("ApiBrandRepository.remove");
  }
}
