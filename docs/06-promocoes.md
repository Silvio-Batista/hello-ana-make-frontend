# 06 — Promoções

Contrato: `src/contracts/promotion.contract.ts`

---

## Lógica de negócio

Promoções são **campanhas de catálogo/carrinho**, distintas de cupons (código digitável).

### Tipos (`PromotionType`)

| type | Regra |
|------|--------|
| `direct_discount` | % (`discountPercentage`) ou valor (`discountAmount`) em produtos/categorias/marcas elegíveis |
| `buy_x_get_y` | Compre X, ganhe Y com `getDiscountPercentage` (100 = grátis); se `applyToCheapest`, desconto nos itens mais baratos |
| `progressive` | Faixas por quantidade (`progressiveTiers`): maior faixa atingida vence |
| `flash_sale` | Desconto agressivo com janela curta `startsAt`–`endsAt` |
| `kit` | Conjunto `kitItems` com `kitPrice` fechado |
| `campaign` | Agrupamento editorial (banner/coleção); desconto opcional |

### Elegibilidade

- `productIds` / `categoryIds` / `brandIds` vazios ou omitidos → conforme tipo: campanhas editoriais podem valer “todos”; descontos devem exigir escopo explícito (recomendado).
- Só aplica se `isActive` e `now ∈ [startsAt, endsAt]`.
- `priority` maior vence em conflito (não somar dois % no mesmo item — escolher a de maior prioridade, ou a de maior benefício; **sugerido: maior `priority`, desempate pelo maior desconto**).

### Interação com preços de variante

- Flash/direct podem materializar-se em `variant.promotionalPrice` ou em `Product.promotion`.
- No checkout, o motor de preço deve recalcular promoções ativas + cupom.

### Progressivo (exemplo)

```
tiers: [{ minQuantity: 2, 10% }, { minQuantity: 3, 15% }, { minQuantity: 5, 20% }]
quantidade elegível na categoria = 4 → aplica 15%
```

### Buy X Get Y

```
buyQuantity=1, getQuantity=1, getDiscountPercentage=100, applyToCheapest=true
→ a cada 2 itens elegíveis, o mais barato fica grátis (ou 100% off)
```

### Kit

- Cliente adiciona todos os `kitItems` (ou SKU kit); preço cobrado = `kitPrice` em vez da soma.

### Casos extremos

- Promoção expirada: não listar em “ativas”; manter histórico admin.
- Sobreposição kit + cupom: cupom aplica sobre o valor do kit (subtotal).
- Estoque insuficiente para “get Y”: não conceder item grátis sem estoque; reduzir benefício ou alertar.

---

## Modelos

```ts
type PromotionType =
  | "direct_discount"
  | "buy_x_get_y"
  | "progressive"
  | "flash_sale"
  | "kit"
  | "campaign";

interface ProgressiveDiscountTier {
  minQuantity: number;
  discountPercentage: number;
}

interface BuyXGetYRule {
  buyQuantity: number;
  getQuantity: number;
  applyToCheapest: boolean;
  getDiscountPercentage: number;
}

interface KitItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

interface Promotion {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: PromotionType;
  discountPercentage?: number;
  discountAmount?: number;
  buyXGetY?: BuyXGetYRule;
  progressiveTiers?: ProgressiveDiscountTier[];
  kitItems?: KitItem[];
  kitPrice?: number;
  productIds?: string[];
  categoryIds?: string[];
  brandIds?: string[];
  bannerImage?: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## Endpoints API

### `GET /api/v1/promotions`

**Auth:** público  

**Query:** `activeOnly=true` (default), `type=flash_sale`

**Sucesso `200`:**

```json
{
  "items": [
    {
      "id": "promo-flash-agosto",
      "slug": "flash-sale-agosto",
      "name": "Flash Sale Agosto",
      "description": "Até 30% off em selecionados por tempo limitado.",
      "type": "flash_sale",
      "discountPercentage": 30,
      "productIds": ["prod-001", "prod-003"],
      "bannerImage": "https://…",
      "startsAt": "2026-08-01T00:00:00.000Z",
      "endsAt": "2026-08-10T23:59:59.000Z",
      "isActive": true,
      "priority": 100,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/v1/promotions/{slug}`

**Auth:** público  
**Sucesso `200`:** `Promotion`  
**Erros:** `404`

---

### `POST /api/v1/promotions/preview` (opcional)

Calcula desconto promocional para um conjunto de itens (sem cupom).

**Body:**

```json
{
  "items": [
    { "productId": "prod-001", "variantId": "var-001-a", "quantity": 2 }
  ]
}
```

**Sucesso `200`:**

```json
{
  "discountAmount": 15.5,
  "appliedPromotionIds": ["promo-progressive"],
  "lines": [
    {
      "productId": "prod-001",
      "variantId": "var-001-a",
      "unitEffectivePrice": 39.9,
      "lineDiscount": 7.98
    }
  ]
}
```

---

## Admin

CRUD em [14-admin.md](./14-admin.md).
