import type {
  CreateRewardTierInput,
  RewardProgress,
  RewardTier,
  UpdateRewardTierInput,
} from "@/contracts";
import { rewardRepository } from "@/lib/container";

/**
 * Calcula progresso de brindes localmente (espelha a lógica do mock)
 * para atualização imediata da UI sem esperar a rede.
 */
export function computeProgress(
  eligibleAmount: number,
  tiers: RewardTier[],
): RewardProgress {
  const amount = Math.max(0, eligibleAmount);
  const sorted = [...tiers]
    .filter((t) => t.isActive)
    .sort((a, b) => a.minimumAmount - b.minimumAmount);

  const currentReward = [...sorted]
    .reverse()
    .find((t) => amount >= t.minimumAmount);

  const nextReward = sorted.find((t) => t.minimumAmount > amount);

  const previousThreshold = currentReward?.minimumAmount ?? 0;
  const nextThreshold = nextReward?.minimumAmount ?? previousThreshold;
  const span = Math.max(nextThreshold - previousThreshold, 1);
  const progressed = amount - previousThreshold;

  const progressPercentage = nextReward
    ? Math.min(100, Math.round((progressed / span) * 100))
    : currentReward
      ? 100
      : Math.min(
          100,
          Math.round((amount / (sorted[0]?.minimumAmount ?? 50)) * 100),
        );

  const amountRemaining = nextReward
    ? Math.max(0, Number((nextReward.minimumAmount - amount).toFixed(2)))
    : 0;

  return {
    cartEligibleAmount: Number(amount.toFixed(2)),
    currentReward,
    nextReward,
    amountRemaining,
    progressPercentage,
    isUnlocked: Boolean(currentReward),
  };
}

export const rewardService = {
  getTiers(): Promise<RewardTier[]> {
    return rewardRepository.getTiers();
  },

  getProgress(eligibleAmount: number): Promise<RewardProgress> {
    return rewardRepository.getProgress(Math.max(0, eligibleAmount));
  },

  createTier(input: CreateRewardTierInput): Promise<RewardTier> {
    return rewardRepository.createTier(input);
  },

  updateTier(id: string, input: UpdateRewardTierInput): Promise<RewardTier> {
    return rewardRepository.updateTier(id, input);
  },

  removeTier(id: string): Promise<void> {
    return rewardRepository.removeTier(id);
  },
};
