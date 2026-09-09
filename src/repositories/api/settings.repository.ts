import type { HomepageSettings } from "@/contracts";
import type { SettingsRepository } from "@/repositories/interfaces";
import { apiGet } from "@/lib/http-client";

interface PublicSettingsResponse {
  homepage: HomepageSettings;
}

export class ApiSettingsRepository implements SettingsRepository {
  async getHomepage(): Promise<HomepageSettings> {
    const settings = await apiGet<PublicSettingsResponse>("/settings", undefined, {
      auth: false,
    });
    return settings.homepage;
  }
}
