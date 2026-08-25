import type {
  CreateRewardTierInput,
  RewardProgress,
  RewardTier,
  UpdateRewardTierInput,
} from "@/contracts";
import type { RewardRepository } from "@/repositories/interfaces";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";

export class ApiRewardRepository implements RewardRepository {
  async getTiers(): Promise<RewardTier[]> {
    const { items } = await apiGet<{ items: RewardTier[] }>(
      "/rewards/tiers",
      undefined,
      { auth: false },
    );
    return items;
  }

  getProgress(eligibleAmount: number): Promise<RewardProgress> {
    return apiGet<RewardProgress>(
      "/rewards/progress",
      { eligibleAmount },
      { auth: false },
    );
  }

  createTier(input: CreateRewardTierInput): Promise<RewardTier> {
    return apiPost<RewardTier>("/admin/reward-tiers", input);
  }

  updateTier(id: string, input: UpdateRewardTierInput): Promise<RewardTier> {
    return apiPut<RewardTier>(`/admin/reward-tiers/${id}`, input);
  }

  async removeTier(id: string): Promise<void> {
    await apiDelete(`/admin/reward-tiers/${id}`);
  }
}
