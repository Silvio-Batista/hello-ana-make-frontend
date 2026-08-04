"use client";

import Image from "next/image";
import { Check, Lock } from "lucide-react";
import type { RewardProgress, RewardTier } from "@/contracts";
import { cn, formatCurrency } from "@/lib/utils";

export interface RewardTiersProps {
  tiers: RewardTier[];
  progress?: RewardProgress;
  className?: string;
}

export function RewardTiers({ tiers, progress, className }: RewardTiersProps) {
  const sorted = [...tiers]
    .filter((t) => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (sorted.length === 0) return null;

  const eligible = progress?.cartEligibleAmount ?? 0;

  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {sorted.map((tier) => {
        const unlocked = eligible >= tier.minimumAmount;
        const isCurrent = progress?.currentReward?.id === tier.id;
        const isNext = progress?.nextReward?.id === tier.id;

        return (
          <li
            key={tier.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-3 transition-colors",
              unlocked
                ? "border-success/30 bg-success/5"
                : isNext
                  ? "border-primary/30 bg-primary-light/30"
                  : "border-border bg-white",
            )}
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-nude">
              <Image
                src={tier.reward.image}
                alt={tier.reward.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {tier.reward.name}
                </p>
                {unlocked ? (
                  <Check className="size-4 shrink-0 text-success" aria-label="Desbloqueado" />
                ) : (
                  <Lock className="size-3.5 shrink-0 text-text-secondary" aria-hidden />
                )}
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs text-text-secondary">
                {tier.reward.description}
              </p>
              <p className="mt-1 text-xs font-medium text-text-secondary">
                A partir de {formatCurrency(tier.minimumAmount)}
                {isCurrent ? " · Atual" : null}
                {isNext ? " · Próximo" : null}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
