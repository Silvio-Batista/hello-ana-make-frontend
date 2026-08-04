"use client";

import { Gift } from "lucide-react";
import type { RewardProgress } from "@/contracts";
import { cn, formatCurrency } from "@/lib/utils";

export interface RewardProgressBarProps {
  progress: RewardProgress | undefined;
  isLoading?: boolean;
  className?: string;
  compact?: boolean;
}

export function RewardProgressBar({
  progress,
  isLoading = false,
  className,
  compact = false,
}: RewardProgressBarProps) {
  if (isLoading && !progress) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-xl bg-primary-light/60 p-3",
          className,
        )}
        aria-hidden
      >
        <div className="mb-2 h-3 w-3/4 rounded bg-primary/20" />
        <div className="h-2 w-full rounded-full bg-primary/15" />
      </div>
    );
  }

  if (!progress) return null;

  const { isUnlocked, nextReward, currentReward, amountRemaining, progressPercentage } =
    progress;

  const message =
    nextReward && amountRemaining > 0
      ? `Faltam ${formatCurrency(amountRemaining)} para ${nextReward.reward.name}`
      : isUnlocked && currentReward
        ? "Você desbloqueou seu brinde!"
        : "Adicione produtos para ganhar brindes";

  return (
    <div
      className={cn(
        "rounded-xl border border-primary/20 bg-primary-light/40",
        compact ? "p-2.5" : "p-3.5",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className={cn("flex items-start gap-2", compact ? "mb-1.5" : "mb-2.5")}>
        <Gift
          className={cn(
            "shrink-0 text-primary",
            compact ? "size-4 mt-0.5" : "size-5 mt-0.5",
          )}
          aria-hidden
        />
        <p
          className={cn(
            "font-medium text-text-primary",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {message}
        </p>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/80"
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso do brinde"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
        />
      </div>
      {currentReward && isUnlocked && !compact ? (
        <p className="mt-2 text-xs text-text-secondary">
          Brinde atual:{" "}
          <span className="font-medium text-primary-dark">
            {currentReward.reward.name}
          </span>
        </p>
      ) : null}
    </div>
  );
}
