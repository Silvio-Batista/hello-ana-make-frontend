# 07 — Recompensas (brindes por valor)

Contrato: `src/contracts/reward.contract.ts` · lógica: `src/services/reward.service.ts` · tiers: `src/mocks/rewards.ts`

---

## Lógica de negócio

Programa de **brindes progressivos** baseado no valor elegível do carrinho.

### Valor elegível

```
eligibleAmount = subtotal - couponDiscount
```

- **Inclui** preços promocionais já embutidos nas linhas.
- **Exclui** frete e tax.
- Cupom `free_shipping` não reduz `eligibleAmount` (desconto monetário = 0).

### Faixas padrão (configuráveis no admin)

| minimumAmount | Brinde |
|---------------|--------|
| 50 | Mini Batom |
| 100 | Gloss |
| 150 | Kit Skincare |
| 250 | Caixa Especial |

### Regra do nível

- Ordenar tiers ativos por `minimumAmount` asc.
- **`currentReward`** = maior tier com `eligibleAmount >= minimumAmount` (**highest unlocked wins**).
- Apenas **um** brinde: o do nível mais alto desbloqueado (não acumula Mini Batom + Gloss).
- **`nextReward`** = próximo tier acima do elegível.
- `isUnlocked = currentReward != null`.

### Progresso UI

```
previousThreshold = currentReward?.minimumAmount ?? 0
nextThreshold     = nextReward?.minimumAmount ?? previousThreshold
span              = max(nextThreshold - previousThreshold, 1)
progressPercentage =
  se nextReward:  min(100, round((eligible - previous) / span * 100))
  se current e sem next: 100
  senão: min(100, round(eligible / firstTier.minimum * 100))

amountRemaining = nextReward ? max(0, next.minimum - eligible) : 0
```

### No pedido

- Ao confirmar pedido pago, registrar o brinde conquistado (`rewardTierId` / snapshot do gift) no pedido.
- Reservar/baixa estoque do brinde se controlado; se sem estoque do brinde → conceder o **próximo inferior disponível** ou notificar admin (definir política: **sugerido: downgrade automático + log**).

### Casos extremos

- `eligibleAmount = 0` → nenhum brinde, progress em direção ao primeiro tier.
- Após aplicar cupom forte, cliente pode **perder** o tier (ex.: cai de 100 para 90).
- Tier `isActive=false` ignorado.
- Mudança de tiers no admin não altera pedidos já faturados.

---

## Modelos

```ts
interface CartRewardGift {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface RewardTier {
  id: string;
  minimumAmount: number;
  reward: CartRewardGift;
  isActive: boolean;
  sortOrder: number;
}

interface RewardProgress {
  cartEligibleAmount: number;
  currentReward?: RewardTier;
  nextReward?: RewardTier;
  amountRemaining: number;
  progressPercentage: number;
  isUnlocked: boolean;
}
```

---

## Endpoints API

### `GET /api/v1/rewards/tiers`

**Auth:** público  

**Sucesso `200`:**

```json
{
  "items": [
    {
      "id": "reward-50",
      "minimumAmount": 50,
      "isActive": true,
      "sortOrder": 1,
      "reward": {
        "id": "gift-mini-batom",
        "name": "Mini Batom",
        "description": "Mini batom Ana Glow em tom surpresa",
        "image": "https://…"
      }
    },
    {
      "id": "reward-100",
      "minimumAmount": 100,
      "isActive": true,
      "sortOrder": 2,
      "reward": {
        "id": "gift-gloss",
        "name": "Gloss",
        "description": "Gloss exclusivo Hello Ana",
        "image": "https://…"
      }
    },
    {
      "id": "reward-150",
      "minimumAmount": 150,
      "isActive": true,
      "sortOrder": 3,
      "reward": {
        "id": "gift-kit-skincare",
        "name": "Kit Skincare",
        "description": "Kit com amostras Skin Ritual",
        "image": "https://…"
      }
    },
    {
      "id": "reward-250",
      "minimumAmount": 250,
      "isActive": true,
      "sortOrder": 4,
      "reward": {
        "id": "gift-caixa-especial",
        "name": "Caixa Especial",
        "description": "Caixa especial Hello Ana com produtos selecionados",
        "image": "https://…"
      }
    }
  ]
}
```

---

### `GET /api/v1/rewards/progress`

**Auth:** público / cliente  

**Query:** `eligibleAmount=149.90`  

Alternativa: sem query, calcular a partir do carrinho atual (`X-Cart-Id` / user).

**Sucesso `200`:**

```json
{
  "cartEligibleAmount": 149.9,
  "currentReward": {
    "id": "reward-100",
    "minimumAmount": 100,
    "isActive": true,
    "sortOrder": 2,
    "reward": {
      "id": "gift-gloss",
      "name": "Gloss",
      "description": "Gloss exclusivo Hello Ana",
      "image": "https://…"
    }
  },
  "nextReward": {
    "id": "reward-150",
    "minimumAmount": 150,
    "isActive": true,
    "sortOrder": 3,
    "reward": {
      "id": "gift-kit-skincare",
      "name": "Kit Skincare",
      "description": "Kit com amostras Skin Ritual",
      "image": "https://…"
    }
  },
  "amountRemaining": 0.1,
  "progressPercentage": 100,
  "isUnlocked": true
}
```

*(No exemplo acima, com elegível 149,90 o progress entre 100 e 150 ≈ 99,8% — arredondar conforme fórmula.)*

**Exemplo R$ 250+:** `currentReward` = Caixa Especial, `nextReward` omitido, `progressPercentage` = 100, `amountRemaining` = 0.

---

## Admin

CRUD de tiers em [14-admin.md](./14-admin.md) — `/api/v1/admin/reward-tiers`.
