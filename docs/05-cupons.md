# 05 — Cupons

Contrato: `src/contracts/coupon.contract.ts` · validação mock: `src/repositories/mock/coupon.repository.ts`

---

## Lógica de negócio

### Tipos (`CouponType`)

| type | Comportamento |
|------|----------------|
| `percentage` | `discount = subtotal × (value/100)`, limitado por `maxDiscountValue` e pelo subtotal |
| `fixed_amount` | `discount = value`, limitado ao subtotal / `maxDiscountValue` |
| `free_shipping` | `discountAmount = 0`; aplica frete grátis (zera shipping no carrinho) |
| `category` | Desconto só sobre linhas cuja categoria ∈ `categoryIds` (base = soma elegível) |
| `product` | Desconto só se algum `productId` do carrinho ∈ `productIds`; base = linhas elegíveis |

Para `percentage`/`fixed_amount` sem escopo: base = **subtotal do carrinho**.

### Ordem de validação (status)

Avaliar nesta ordem; retornar o **primeiro** status que falhar:

1. Código não existe → `invalid`
2. `isActive === false` → `inactive`
3. `now < startsAt` → `not_started`
4. `now > endsAt` → `expired`
5. `usageLimit` definido e `usageCount >= usageLimit` → `usage_limit_reached`
6. Limite por usuário (`perUserLimit`) ou cupom de primeira compra já usado → `already_used`
7. `cartSubtotal < minOrderValue` → `min_order_not_met`
8. Escopo category/product sem itens elegíveis → `not_applicable`
9. Caso contrário → `valid`

### Status (`CouponValidationStatus`)

| status | Mensagem sugerida |
|--------|-------------------|
| `valid` | Cupom aplicado com sucesso! |
| `invalid` | Cupom inválido. |
| `expired` | Este cupom expirou. |
| `not_started` | Este cupom ainda não está válido. |
| `usage_limit_reached` | Limite de uso deste cupom esgotado. |
| `min_order_not_met` | Valor mínimo de R$ X não atingido. |
| `not_applicable` | Cupom não se aplica aos produtos do carrinho. |
| `already_used` | Cupom válido apenas para a primeira compra. / Já utilizado. |
| `inactive` | Este cupom está inativo. |

### Cálculo do desconto (quando `valid`)

```
se type == free_shipping:
  discountAmount = 0
  freeShipping = true

se type == percentage:
  base = subtotalElegivel
  discountAmount = base * value / 100

se type == fixed_amount:
  discountAmount = value

se type == category | product:
  base = Σ lineTotal das linhas elegíveis
  // value interpreta-se como % se cupom "percentual de escopo",
  // ou valor fixo — no frontend atual `value` é número genérico;
  // sugerido: category/product usam `value` como percentual (igual percentage)
  discountAmount = base * value / 100

se maxDiscountValue definido:
  discountAmount = min(discountAmount, maxDiscountValue)

discountAmount = min(discountAmount, subtotal)
discountAmount = round(discountAmount, 2)
```

### Cupom de boas-vindas (signup)

- Código padrão: **`BEMVINDA10`**
- Tipo: `percentage`, `value: 10`
- `minOrderValue`: 50 (mock)
- `maxDiscountValue`: 50
- **Somente primeira compra** do usuário (`already_used` se já tiver pedido `paid+`)
- Gerado/atribuído no cadastro — ver [11-auth-clientes.md](./11-auth-clientes.md)

### Consumo do uso

- Incrementar `usageCount` e registro por usuário **somente** quando o pedido for **pago** (não na criação `pending_payment`), para evitar burnout por abandono.
- Se pedido cancelado antes do pagamento, não consumir.

### Casos extremos

- Código case-insensitive; persistir UPPERCASE.
- Cupom + promoção de produto: desconto de cupom incide sobre subtotal **já com** preços promocionais das variantes.
- `free_shipping` + regra de frete grátis por valor: ambos zeram frete (idempotente).
- Um cupom por carrinho/pedido.

---

## Modelos

```ts
type CouponType =
  | "percentage"
  | "fixed_amount"
  | "free_shipping"
  | "category"
  | "product";

type CouponValidationStatus =
  | "valid"
  | "invalid"
  | "expired"
  | "not_started"
  | "usage_limit_reached"
  | "min_order_not_met"
  | "not_applicable"
  | "already_used"
  | "inactive";

interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  description?: string;
  categoryIds?: string[];
  productIds?: string[];
  minOrderValue?: number;
  maxDiscountValue?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CouponValidationResult {
  status: CouponValidationStatus;
  coupon?: Coupon;
  discountAmount: number;
  message: string;
}
```

Flag auxiliar sugerida no admin/modelo interno: `firstPurchaseOnly: boolean`.

---

## Endpoints API

### `POST /api/v1/coupons/validate`

**Auth:** público / cliente (cliente necessário para `already_used` / primeira compra)

**Body:**

```json
{
  "code": "BEMVINDA10",
  "cartSubtotal": 120.5,
  "productIds": ["prod-001", "prod-003"],
  "categoryIds": ["cat-boca"]
}
```

**Sucesso `200` (válido):**

```json
{
  "status": "valid",
  "discountAmount": 12.05,
  "message": "Cupom aplicado com sucesso!",
  "coupon": {
    "id": "cpn-bemvinda10",
    "code": "BEMVINDA10",
    "type": "percentage",
    "value": 10,
    "description": "10% de desconto na primeira compra",
    "minOrderValue": 50,
    "maxDiscountValue": 50,
    "usageCount": 0,
    "startsAt": "2025-01-01T00:00:00.000Z",
    "endsAt": "2027-12-31T23:59:59.000Z",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Sucesso `200` (inválido — preferível não usar HTTP error para status de domínio):**

```json
{
  "status": "expired",
  "discountAmount": 0,
  "message": "Este cupom expirou.",
  "coupon": {
    "id": "cpn-expired",
    "code": "VERAO25",
    "type": "percentage",
    "value": 25,
    "usageCount": 100,
    "startsAt": "2025-01-01T00:00:00.000Z",
    "endsAt": "2025-03-31T23:59:59.000Z",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### `GET /api/v1/me/coupons`

**Auth:** cliente  

Lista cupons disponíveis para o usuário (ativos, não expirados, elegíveis / carteira).

```json
{
  "items": [
    {
      "id": "cpn-bemvinda10",
      "code": "BEMVINDA10",
      "type": "percentage",
      "value": 10,
      "description": "10% de desconto na primeira compra",
      "minOrderValue": 50,
      "isActive": true,
      "startsAt": "2025-01-01T00:00:00.000Z",
      "endsAt": "2027-12-31T23:59:59.000Z",
      "usageCount": 0,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/v1/coupons/{code}`

**Auth:** público (não expor dados sensíveis de usage interno se necessário)  
**Sucesso `200`:** `Coupon` resumido  
**Erros:** `404`

---

## Admin

CRUD completo em [14-admin.md](./14-admin.md).
