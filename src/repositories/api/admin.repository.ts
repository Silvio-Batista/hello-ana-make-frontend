import type {
  AdminDashboardStats,
  StoreIntegrationsSettings,
  StoreSettings,
} from "@/contracts";
import type { AdminRepository } from "@/repositories/interfaces";
import { apiGet, apiPatch, apiPut } from "@/lib/http-client";

export class ApiAdminRepository implements AdminRepository {
  getDashboardStats(): Promise<AdminDashboardStats> {
    return apiGet<AdminDashboardStats>("/admin/dashboard");
  }

  getSettings(): Promise<StoreSettings> {
    return apiGet<StoreSettings>("/admin/settings");
  }

  updateSettings(
    input: Partial<Omit<StoreSettings, "integrations" | "updatedAt">>,
  ): Promise<StoreSettings> {
    return apiPut<StoreSettings>("/admin/settings", input);
  }

  updateIntegrations(
    input: Partial<StoreIntegrationsSettings>,
  ): Promise<StoreIntegrationsSettings & { updatedAt: string }> {
    return apiPatch<StoreIntegrationsSettings & { updatedAt: string }>(
      "/admin/settings/integrations",
      input,
    );
  }
}
