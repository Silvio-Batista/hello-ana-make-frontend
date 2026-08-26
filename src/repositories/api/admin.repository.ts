import type {
  AdminCustomer,
  AdminCustomerListParams,
  AdminCustomerListResponse,
  AdminDashboardStats,
  StoreIntegrationsSettings,
  StoreSettings,
  UploadImageResponse,
} from "@/contracts";
import type { AdminRepository } from "@/repositories/interfaces";
import { apiGet, apiPatch, apiPost, apiPut, getOrNull } from "@/lib/http-client";

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

  listCustomers(
    params: AdminCustomerListParams = {},
  ): Promise<AdminCustomerListResponse> {
    return apiGet<AdminCustomerListResponse>("/admin/customers", {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
    });
  }

  getCustomerById(id: string): Promise<AdminCustomer | null> {
    return getOrNull<AdminCustomer>(`/admin/customers/${id}`);
  }

  uploadImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return apiPost<UploadImageResponse>("/admin/uploads", formData);
  }
}
