import type { HomepageSettings } from "@/contracts";
import type { SettingsRepository } from "@/repositories/interfaces";
import { getMockSettingsStore } from "@/repositories/mock/admin.repository";
import { delay } from "@/repositories/utils";

export class MockSettingsRepository implements SettingsRepository {
  async getHomepage(): Promise<HomepageSettings> {
    await delay();
    return getMockSettingsStore().homepage;
  }
}
