"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settings.service";

export const settingsKeys = {
  all: ["settings"] as const,
  homepage: () => [...settingsKeys.all, "homepage"] as const,
};

export function useHomepageSettings() {
  return useQuery({
    queryKey: settingsKeys.homepage(),
    queryFn: () => settingsService.getHomepage(),
    staleTime: 5 * 60 * 1000,
  });
}
