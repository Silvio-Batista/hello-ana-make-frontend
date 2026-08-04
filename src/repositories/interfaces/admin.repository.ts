import type { AdminDashboardStats, StoreSettings } from "@/contracts";

/**
 * Repositório administrativo (dashboard e configurações).
 */
export interface AdminRepository {
  getDashboardStats(): Promise<AdminDashboardStats>;
  getSettings(): Promise<StoreSettings>;
  updateSettings(input: Partial<StoreSettings>): Promise<StoreSettings>;
}
