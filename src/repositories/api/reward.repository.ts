import type {
  CreateRewardTierInput,
  RewardProgress,
  RewardTier,
  UpdateRewardTierInput,
} from "@/contracts";
import type { RewardRepository } from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiRewardRepository implements RewardRepository {
  getTiers(): Promise<RewardTier[]> {
    return notImplemented("ApiRewardRepository.getTiers");
  }

  getProgress(_eligibleAmount: number): Promise<RewardProgress> {
    return notImplemented("ApiRewardRepository.getProgress");
  }

  createTier(_input: CreateRewardTierInput): Promise<RewardTier> {
    return notImplemented("ApiRewardRepository.createTier");
  }

  updateTier(
    _id: string,
    _input: UpdateRewardTierInput,
  ): Promise<RewardTier> {
    return notImplemented("ApiRewardRepository.updateTier");
  }

  removeTier(_id: string): Promise<void> {
    return notImplemented("ApiRewardRepository.removeTier");
  }
}
