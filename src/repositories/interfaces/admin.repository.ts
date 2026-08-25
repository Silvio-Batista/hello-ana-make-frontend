import type {
  AdminDashboardStats,
  StoreIntegrationsSettings,
  StoreSettings,
} from "@/contracts";

/**
 * Repositório administrativo (dashboard e configurações).
 */
export interface AdminRepository {
  getDashboardStats(): Promise<AdminDashboardStats>;
  getSettings(): Promise<StoreSettings>;
  /** PUT /admin/settings — merge por grupo (store/checkout/shipping/rewards/signupPromotion/currency/timezone). */
  updateSettings(input: Partial<Omit<StoreSettings, "integrations" | "updatedAt">>): Promise<StoreSettings>;
  /** PATCH /admin/settings/integrations — substituição direta, segredos retornam mascarados. */
  updateIntegrations(
    input: Partial<StoreIntegrationsSettings>,
  ): Promise<StoreIntegrationsSettings & { updatedAt: string }>;
}
