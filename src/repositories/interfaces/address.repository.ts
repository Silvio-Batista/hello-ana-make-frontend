import type { Address } from "@/contracts";

/**
 * Dados para criar/atualizar endereço (sem campos gerados pelo servidor).
 */
export type AddressInput = Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">;

/**
 * Repositório de endereços do usuário.
 */
export interface AddressRepository {
  list(): Promise<Address[]>;
  getById(id: string): Promise<Address | null>;
  create(data: AddressInput): Promise<Address>;
  update(id: string, data: Partial<AddressInput>): Promise<Address>;
  remove(id: string): Promise<void>;
  setDefault(id: string): Promise<Address>;
}
