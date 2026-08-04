# 04 — Carrinho

Contratos: `src/contracts/cart.contract.ts` · cálculos em `src/services/cart.service.ts`

---

## Lógica de negócio

### Identidade do carrinho

- **Guest:** `X-Cart-Id` (UUID) criado no primeiro `POST` item; persistir no browser.
- **Autenticado:** carrinho vinculado a `userId`; no login, **merge** guest → user (somar quantidades da mesma variante até `maxQuantity`/estoque).

### Itens

- Cada linha = uma **variante** (`productId` + `variantId`).
- Ao adicionar variante já existente → incrementar `quantity`.
- `quantity` ∈ `[1, maxQuantity]`; `maxQuantity = min(stock, limiteLoja)` (ex.: 10).
- `unitPrice` / `promotionalPrice` / snapshot de nome/imagem gravados no item; **revalidar** preços no checkout (fonte da verdade = estoque/preço atual no servidor).
- `lineTotal = (promotionalPrice ?? unitPrice) × quantity` (2 casas).
- Item indisponível: `isAvailable=false`; não pode avançar checkout até remover/ajustar.

### Totais (`CartTotals`)

```
subtotal  = Σ lineTotal
discount  = min(couponDiscount, subtotal)   // cupom %/fixo
shipping  = freeShipping ? 0 : shippingPrice
tax       = 0  // reservado
total     = max(0, subtotal - discount + shipping + tax)
itemCount = Σ quantity
currency  = "BRL"
```

### Cupom no carrinho

- Campo `couponCode` opcional.
- Aplicar via validação ([05-cupons.md](./05-cupons.md)).
- Cupom `free_shipping` → `discount` monetário = 0, flag frete grátis.
- Remover cupom zera desconto / free shipping do cupom.

### Recompensas

Valor elegível para brindes (**não** é campo do cart, mas derivado):

```
eligibleAmount = subtotal - discount   // SEM frete
```

Ver [07-recompensas.md](./07-recompensas.md).

### Casos extremos

- Estoque caiu após add → no GET, ajustar `maxQuantity`/`quantity` e marcar indisponível.
- Carrinho vazio: totais zerados; checkout redireciona.
- Aplicar cupom com carrinho vazio → `422`.
- Dois cupons: **apenas um** por vez.
- Merge: se guest e user têm o mesmo `variantId`, soma e cap no estoque.

---

## Modelos

```ts
interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  variantSku: string;
  variantName: string;
  attributes: ProductVariantAttributes;
  image: string;
  unitPrice: number;
  promotionalPrice?: number;
  quantity: number;
  maxQuantity: number;
  isAvailable: boolean;
  lineTotal: number;
}

interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  currency: string;
}

interface Cart {
  id: string;
  items: CartItem[];
  totals: CartTotals;
  couponCode?: string;
  updatedAt: string;
}
```

Campos extras sugeridos na resposta (não no contrato TS atual, mas úteis):

```ts
{
  freeShipping?: boolean;
  couponMessage?: string;
  couponStatus?: CouponValidationStatus;
  rewardEligibleAmount?: number;
  shippingOptionId?: string;
}
```

---

## Endpoints API

### `GET /api/v1/cart`

**Auth:** público (com `X-Cart-Id`) ou cliente  

**Sucesso `200`:**

```json
{
  "id": "cart-abc123",
  "items": [
    {
      "id": "ci-001",
      "productId": "prod-001",
      "productSlug": "batom-matte-rosa-nude",
      "productName": "Batom Matte Rosa Nude",
      "variantId": "var-001-a",
      "variantSku": "AG-BM-RN-01",
      "variantName": "Rosa Nude",
      "attributes": { "color": "Rosa Nude", "colorHex": "#C4877A" },
      "image": "https://…",
      "unitPrice": 49.9,
      "promotionalPrice": 39.9,
      "quantity": 2,
      "maxQuantity": 25,
      "isAvailable": true,
      "lineTotal": 79.8
    }
  ],
  "totals": {
    "subtotal": 79.8,
    "discount": 7.98,
    "shipping": 14.9,
    "tax": 0,
    "total": 86.72,
    "itemCount": 2,
    "currency": "BRL"
  },
  "couponCode": "BEMVINDA10",
  "updatedAt": "2026-08-04T12:00:00.000Z"
}
```

---

### `POST /api/v1/cart/items`

**Auth:** público / cliente  

**Body:**

```json
{
  "productId": "prod-001",
  "variantId": "var-001-a",
  "quantity": 1
}
```

**Sucesso `200`:** `Cart` atualizado  
**Erros:**

```json
{ "message": "Estoque insuficiente.", "code": "STOCK_UNAVAILABLE", "errors": {} }
```

```json
{ "message": "Variante não encontrada.", "code": "NOT_FOUND", "errors": {} }
```

---

### `PATCH /api/v1/cart/items/{itemId}`

**Body:**

```json
{ "quantity": 3 }
```

**Sucesso `200`:** `Cart`  
**Erros:** `422` quantidade inválida; `404` item.

---

### `DELETE /api/v1/cart/items/{itemId}`

**Sucesso `200`:** `Cart` (ou `204` + próximo GET).

---

### `DELETE /api/v1/cart`

Limpa todos os itens e cupom.  
**Sucesso `200`:** carrinho vazio.

---

### `POST /api/v1/cart/coupon`

**Body:**

```json
{ "code": "ANA15" }
```

**Sucesso `200`:**

```json
{
  "cart": { "...": "Cart" },
  "validation": {
    "status": "valid",
    "discountAmount": 11.97,
    "message": "Cupom aplicado com sucesso!",
    "coupon": { "id": "cpn-ana15", "code": "ANA15", "type": "percentage", "value": 15 }
  }
}
```

**Erros / status não válidos:** retornar `200` com `validation.status != valid` **ou** `422` com `code` mapeado — **sugerido:** `422` + corpo de erro padrão usando códigos `COUPON_*`, e também espelhar `CouponValidationResult` em `errors.validation` se útil ao frontend.

---

### `DELETE /api/v1/cart/coupon`

**Sucesso `200`:** `Cart` sem cupom.

---

### `PUT /api/v1/cart/shipping`

Associa opção de frete cotada (opcional; checkout também envia `shippingOptionId`).

```json
{
  "shippingOptionId": "ship-pac",
  "zipCode": "01310100"
}
```

**Sucesso `200`:** `Cart` com `totals.shipping` atualizado.
