/**
 * Brinde associado a um nível de recompensa por valor do carrinho.
 */
export interface CartRewardGift {
  id: string;
  name: string;
  description: string;
  image: string;
}

/**
 * Faixa configurável do programa de brindes.
 * Valor elegível = subtotal dos produtos − desconto de cupom (sem frete).
 */
export interface RewardTier {
  id: string;
  minimumAmount: number;
  reward: CartRewardGift;
  isActive: boolean;
  sortOrder: number;
}

/**
 * Progresso de gamificação baseado no valor elegível do carrinho.
 */
export interface RewardProgress {
  cartEligibleAmount: number;
  currentReward?: RewardTier;
  nextReward?: RewardTier;
  amountRemaining: number;
  progressPercentage: number;
  isUnlocked: boolean;
}
