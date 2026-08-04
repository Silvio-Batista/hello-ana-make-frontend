import type {
  Brand,
  CreateBrandInput,
  UpdateBrandInput,
} from "@/contracts";
import type { BrandRepository } from "@/repositories/interfaces";
import { brands } from "@/mocks";
import { delay } from "@/repositories/utils";

let brandStore = brands;
let brandSeq = brands.length + 1;

export class MockBrandRepository implements BrandRepository {
  async list(): Promise<Brand[]> {
    await delay();
    return [...brandStore].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  async getById(id: string): Promise<Brand | null> {
    await delay();
    return brandStore.find((b) => b.id === id) ?? null;
  }

  async create(input: CreateBrandInput): Promise<Brand> {
    await delay();
    const now = new Date().toISOString();
    const brand: Brand = {
      id: `brand-${String(brandSeq).padStart(3, "0")}`,
      slug: input.slug,
      name: input.name,
      description: input.description,
      logo: input.logo,
      website: input.website,
      isActive: input.isActive,
      createdAt: now,
      updatedAt: now,
    };
    brandSeq += 1;
    brandStore.push(brand);
    return brand;
  }

  async update(id: string, input: UpdateBrandInput): Promise<Brand> {
    await delay();
    const index = brandStore.findIndex((b) => b.id === id);
    if (index < 0) throw new Error("Marca não encontrada.");
    const current = brandStore[index]!;
    const updated: Brand = {
      ...current,
      ...input,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    brandStore[index] = updated;
    return updated;
  }

  async remove(id: string): Promise<void> {
    await delay();
    const index = brandStore.findIndex((b) => b.id === id);
    if (index < 0) throw new Error("Marca não encontrada.");
    brandStore.splice(index, 1);
  }
}
