import type { AdminDashboardStats, StoreSettings } from "@/contracts";
import type { AdminRepository } from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiAdminRepository implements AdminRepository {
  getDashboardStats(): Promise<AdminDashboardStats> {
    return notImplemented("ApiAdminRepository.getDashboardStats");
  }

  getSettings(): Promise<StoreSettings> {
    return notImplemented("ApiAdminRepository.getSettings");
  }

  updateSettings(_input: Partial<StoreSettings>): Promise<StoreSettings> {
    return notImplemented("ApiAdminRepository.updateSettings");
  }
}
