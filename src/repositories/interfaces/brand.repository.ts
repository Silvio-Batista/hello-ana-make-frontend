import type {
  Brand,
  CreateBrandInput,
  UpdateBrandInput,
} from "@/contracts";

/**
 * Repositório de marcas.
 */
export interface BrandRepository {
  list(): Promise<Brand[]>;
  getById(id: string): Promise<Brand | null>;
  create(input: CreateBrandInput): Promise<Brand>;
  update(id: string, input: UpdateBrandInput): Promise<Brand>;
  remove(id: string): Promise<void>;
}
