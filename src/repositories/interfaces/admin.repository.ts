import type {
  AdminCustomer,
  AdminCustomerListParams,
  AdminCustomerListResponse,
  AdminDashboardStats,
  StoreIntegrationsSettings,
  StoreSettings,
  UploadImageResponse,
} from "@/contracts";

/**
 * Repositório administrativo (dashboard, configurações, clientes e uploads).
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
  /** GET /admin/customers — busca por nome/e-mail. */
  listCustomers(params?: AdminCustomerListParams): Promise<AdminCustomerListResponse>;
  /** GET /admin/customers/:id — null se não existir ou não for role=customer. */
  getCustomerById(id: string): Promise<AdminCustomer | null>;
  /** POST /admin/uploads — multipart/form-data, máx. 5MB, só image/*. */
  uploadImage(file: File): Promise<UploadImageResponse>;
}
