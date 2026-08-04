import type { RewardTier } from "@/contracts";

/**
 * Regras de brinde por valor elegível do carrinho.
 * Elegível = subtotal − desconto de cupom (sem frete).
 */
export const rewardTiers: RewardTier[] = [
  {
    id: "reward-50",
    minimumAmount: 50,
    isActive: true,
    sortOrder: 1,
    reward: {
      id: "gift-mini-batom",
      name: "Mini Batom",
      description: "Mini batom Ana Glow em tom surpresa",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop",
    },
  },
  {
    id: "reward-100",
    minimumAmount: 100,
    isActive: true,
    sortOrder: 2,
    reward: {
      id: "gift-gloss",
      name: "Gloss Exclusivo",
      description: "Gloss Crystal Shine exclusivo Hello Ana",
      image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=200&h=200&fit=crop",
    },
  },
  {
    id: "reward-150",
    minimumAmount: 150,
    isActive: true,
    sortOrder: 3,
    reward: {
      id: "gift-kit-skincare",
      name: "Kit de Skincare",
      description: "Kit com amostras Skin Ritual",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop",
    },
  },
  {
    id: "reward-250",
    minimumAmount: 250,
    isActive: true,
    sortOrder: 4,
    reward: {
      id: "gift-caixa-especial",
      name: "Caixa Especial",
      description: "Caixa especial Hello Ana com produtos selecionados",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
    },
  },
];
