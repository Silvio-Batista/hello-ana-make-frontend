import type {
  CreateRewardTierInput,
  RewardProgress,
  RewardTier,
  UpdateRewardTierInput,
} from "@/contracts";

/**
 * Repositório do programa de brindes por valor do carrinho.
 */
export interface RewardRepository {
  getTiers(): Promise<RewardTier[]>;
  getProgress(eligibleAmount: number): Promise<RewardProgress>;
  createTier(input: CreateRewardTierInput): Promise<RewardTier>;
  updateTier(id: string, input: UpdateRewardTierInput): Promise<RewardTier>;
  removeTier(id: string): Promise<void>;
}
