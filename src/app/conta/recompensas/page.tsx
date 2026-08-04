"use client";

import { RewardProgressBar, RewardTiers } from "@/components/rewards";
import { Spinner } from "@/components/ui";
import { useCart, useRewardTiers } from "@/hooks";

export default function RecompensasPage() {
  const { rewardProgress } = useCart();
  const tiers = useRewardTiers();

  return (
    <div>
      <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
        Recompensas
      </h2>
      <p className="mb-6 text-sm text-text-secondary">
        Acompanhe o progresso dos brindes com base no valor elegível do seu
        carrinho.
      </p>

      <RewardProgressBar
        progress={rewardProgress.data}
        isLoading={rewardProgress.isLoading}
        className="mb-6"
      />

      {tiers.isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Carregando níveis" />
        </div>
      ) : tiers.data ? (
        <RewardTiers tiers={tiers.data} progress={rewardProgress.data} />
      ) : null}
    </div>
  );
}
