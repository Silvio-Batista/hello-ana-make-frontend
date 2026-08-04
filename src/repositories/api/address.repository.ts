import type { Address } from "@/contracts";
import type {
  AddressInput,
  AddressRepository,
} from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiAddressRepository implements AddressRepository {
  list(): Promise<Address[]> {
    return notImplemented("ApiAddressRepository.list");
  }

  getById(_id: string): Promise<Address | null> {
    return notImplemented("ApiAddressRepository.getById");
  }

  create(_data: AddressInput): Promise<Address> {
    return notImplemented("ApiAddressRepository.create");
  }

  update(_id: string, _data: Partial<AddressInput>): Promise<Address> {
    return notImplemented("ApiAddressRepository.update");
  }

  remove(_id: string): Promise<void> {
    return notImplemented("ApiAddressRepository.remove");
  }

  setDefault(_id: string): Promise<Address> {
    return notImplemented("ApiAddressRepository.setDefault");
  }
}
