import type {
  CreateRewardTierInput,
  RewardProgress,
  RewardTier,
  UpdateRewardTierInput,
} from "@/contracts";
import type { RewardRepository } from "@/repositories/interfaces";
import { rewardTiers } from "@/mocks";
import { delay } from "@/repositories/utils";

let tierStore = rewardTiers;
let tierSeq = rewardTiers.length + 1;

function resolveProgress(eligibleAmount: number): RewardProgress {
  const tiers = [...tierStore]
    .filter((t) => t.isActive)
    .sort((a, b) => a.minimumAmount - b.minimumAmount);

  const currentReward = [...tiers]
    .reverse()
    .find((t) => eligibleAmount >= t.minimumAmount);

  const nextReward = tiers.find((t) => t.minimumAmount > eligibleAmount);

  const previousThreshold = currentReward?.minimumAmount ?? 0;
  const nextThreshold = nextReward?.minimumAmount ?? previousThreshold;
  const span = Math.max(nextThreshold - previousThreshold, 1);
  const progressed = eligibleAmount - previousThreshold;

  const progressPercentage = nextReward
    ? Math.min(100, Math.round((progressed / span) * 100))
    : currentReward
      ? 100
      : Math.min(
          100,
          Math.round((eligibleAmount / (tiers[0]?.minimumAmount ?? 50)) * 100),
        );

  const amountRemaining = nextReward
    ? Math.max(0, Number((nextReward.minimumAmount - eligibleAmount).toFixed(2)))
    : 0;

  return {
    cartEligibleAmount: Number(eligibleAmount.toFixed(2)),
    currentReward,
    nextReward,
    amountRemaining,
    progressPercentage,
    isUnlocked: Boolean(currentReward),
  };
}

export class MockRewardRepository implements RewardRepository {
  async getTiers(): Promise<RewardTier[]> {
    await delay();
    return [...tierStore]
      .filter((t) => t.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getProgress(eligibleAmount: number): Promise<RewardProgress> {
    await delay(80);
    return resolveProgress(Math.max(0, eligibleAmount));
  }

  async createTier(input: CreateRewardTierInput): Promise<RewardTier> {
    await delay();
    const tier: RewardTier = {
      id: `reward-${String(tierSeq).padStart(3, "0")}`,
      minimumAmount: input.minimumAmount,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
      reward: {
        id: `gift-${String(tierSeq).padStart(3, "0")}`,
        name: input.reward.name,
        description: input.reward.description,
        image: input.reward.image,
      },
    };
    tierSeq += 1;
    tierStore.push(tier);
    return tier;
  }

  async updateTier(
    id: string,
    input: UpdateRewardTierInput,
  ): Promise<RewardTier> {
    await delay();
    const index = tierStore.findIndex((t) => t.id === id);
    if (index < 0) throw new Error("Faixa de brinde não encontrada.");
    const current = tierStore[index]!;
    const updated: RewardTier = {
      ...current,
      minimumAmount: input.minimumAmount ?? current.minimumAmount,
      isActive: input.isActive ?? current.isActive,
      sortOrder: input.sortOrder ?? current.sortOrder,
      reward: input.reward
        ? {
            id: current.reward.id,
            name: input.reward.name ?? current.reward.name,
            description:
              input.reward.description ?? current.reward.description,
            image: input.reward.image ?? current.reward.image,
          }
        : current.reward,
    };
    tierStore[index] = updated;
    return updated;
  }

  async removeTier(id: string): Promise<void> {
    await delay();
    const index = tierStore.findIndex((t) => t.id === id);
    if (index < 0) throw new Error("Faixa de brinde não encontrada.");
    tierStore.splice(index, 1);
  }
}
