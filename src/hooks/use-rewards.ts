"use client";

import { useQuery } from "@tanstack/react-query";
import { rewardService } from "@/services/reward.service";

export const rewardKeys = {
  all: ["rewards"] as const,
  tiers: () => [...rewardKeys.all, "tiers"] as const,
  progress: (eligibleAmount: number) =>
    [...rewardKeys.all, "progress", eligibleAmount] as const,
};

export function useRewardTiers() {
  return useQuery({
    queryKey: rewardKeys.tiers(),
    queryFn: () => rewardService.getTiers(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRewardProgress(eligibleAmount: number) {
  return useQuery({
    queryKey: rewardKeys.progress(eligibleAmount),
    queryFn: () => rewardService.getProgress(eligibleAmount),
    placeholderData: (previous) => previous,
  });
}
