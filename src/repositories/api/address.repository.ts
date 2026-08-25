import type { Address } from "@/contracts";
import type {
  AddressInput,
  AddressRepository,
} from "@/repositories/interfaces";
import { apiDelete, apiGet, apiPost, apiPut, getOrNull } from "@/lib/http-client";

export class ApiAddressRepository implements AddressRepository {
  async list(): Promise<Address[]> {
    const { items } = await apiGet<{ items: Address[] }>("/addresses");
    return items;
  }

  getById(id: string): Promise<Address | null> {
    return getOrNull<Address>(`/addresses/${id}`);
  }

  create(data: AddressInput): Promise<Address> {
    return apiPost<Address>("/addresses", data);
  }

  update(id: string, data: Partial<AddressInput>): Promise<Address> {
    return apiPut<Address>(`/addresses/${id}`, data);
  }

  async remove(id: string): Promise<void> {
    await apiDelete(`/addresses/${id}`);
  }

  setDefault(id: string): Promise<Address> {
    return apiPost<Address>(`/addresses/${id}/default`);
  }
}
