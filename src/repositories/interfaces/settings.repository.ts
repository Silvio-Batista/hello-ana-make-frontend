import type { HomepageSettings } from "@/contracts";

/** Configurações públicas usadas fora do admin (GET /settings, sem autenticação). */
export interface SettingsRepository {
  getHomepage(): Promise<HomepageSettings>;
}
