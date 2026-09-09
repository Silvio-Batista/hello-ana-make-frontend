import type { HomepageSettings } from "@/contracts";
import { settingsRepository } from "@/lib/container";

export const settingsService = {
  getHomepage(): Promise<HomepageSettings> {
    return settingsRepository.getHomepage();
  },
};
