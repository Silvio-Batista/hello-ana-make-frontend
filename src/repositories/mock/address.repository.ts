import type { Address } from "@/contracts";
import type {
  AddressInput,
  AddressRepository,
} from "@/repositories/interfaces";
import {
  addresses as seedAddresses,
  requireCurrentUserId,
} from "@/mocks";
import { delay } from "@/repositories/utils";

let addressStore: Address[] = [...seedAddresses];
let addressSeq = seedAddresses.length + 1;

export class MockAddressRepository implements AddressRepository {
  async list(): Promise<Address[]> {
    await delay();
    const userId = requireCurrentUserId();
    return addressStore.filter((a) => a.userId === userId);
  }

  async getById(id: string): Promise<Address | null> {
    await delay();
    const userId = requireCurrentUserId();
    return (
      addressStore.find((a) => a.id === id && a.userId === userId) ?? null
    );
  }

  async create(data: AddressInput): Promise<Address> {
    await delay();
    const userId = requireCurrentUserId();
    const now = new Date().toISOString();

    if (data.isDefault) {
      addressStore = addressStore.map((a) =>
        a.userId === userId ? { ...a, isDefault: false } : a,
      );
    }

    const address: Address = {
      id: `addr-${String(addressSeq).padStart(3, "0")}`,
      userId,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    addressSeq += 1;
    addressStore = [...addressStore, address];
    return address;
  }

  async update(id: string, data: Partial<AddressInput>): Promise<Address> {
    await delay();
    const userId = requireCurrentUserId();
    const current = addressStore.find(
      (a) => a.id === id && a.userId === userId,
    );
    if (!current) throw new Error("Endereço não encontrado.");

    if (data.isDefault) {
      addressStore = addressStore.map((a) =>
        a.userId === userId ? { ...a, isDefault: false } : a,
      );
    }

    const updated: Address = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    addressStore = addressStore.map((a) => (a.id === id ? updated : a));
    return updated;
  }

  async remove(id: string): Promise<void> {
    await delay();
    const userId = requireCurrentUserId();
    const exists = addressStore.some((a) => a.id === id && a.userId === userId);
    if (!exists) throw new Error("Endereço não encontrado.");
    addressStore = addressStore.filter((a) => a.id !== id);
  }

  async setDefault(id: string): Promise<Address> {
    await delay();
    const userId = requireCurrentUserId();
    const current = addressStore.find(
      (a) => a.id === id && a.userId === userId,
    );
    if (!current) throw new Error("Endereço não encontrado.");

    addressStore = addressStore.map((a) => {
      if (a.userId !== userId) return a;
      return {
        ...a,
        isDefault: a.id === id,
        updatedAt: new Date().toISOString(),
      };
    });

    return addressStore.find((a) => a.id === id)!;
  }
}
