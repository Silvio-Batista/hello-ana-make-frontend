# 09 — Checkout e pedidos

Contratos: `src/contracts/order.contract.ts` · labels: `src/lib/order-status.ts`

---

## Lógica de negócio

### Etapas do checkout (frontend)

| Step | Nome | Requisitos |
|------|------|------------|
| 1 | `identification` | Login ou cadastro (cliente autenticado) |
| 2 | `address` | `shippingAddressId` ou novo endereço |
| 3 | `shipping` | `shippingOptionId` de cotação válida |
| 4 | `payment` | `paymentMethod` (+ dados do gateway) |
| 5 | `confirmation` | Pedido criado; exibe resumo / redireciona |

Carrinho vazio → não iniciar checkout.

### Criação do pedido

1. Autenticar cliente.
2. Validar itens (estoque, preços atuais).
3. Revalidar cupom.
4. Validar endereço do usuário.
5. Revalidar frete (opção + CEP).
6. Calcular totais no servidor (nunca confiar só no client).
7. Reservar estoque (soft hold) ou baixa na confirmação de pagamento — **sugerido:** reserve em `pending_payment`, confirma em `paid`, libera em `cancelled`.
8. Criar pedido `status=pending_payment`, `paymentStatus=pending`.
9. Criar cobrança no gateway ([10-pagamentos.md](./10-pagamentos.md)).
10. Snapshot de itens + brinde (reward) no pedido.
11. Limpar carrinho após sucesso.

`orderNumber` formato sugerido: `HA-YYYY-####` (ex.: `HA-2026-0007`).

### Status do pedido (`OrderStatus`)

| status | Label PT |
|--------|----------|
| `pending_payment` | Aguardando pagamento |
| `paid` | Pago |
| `processing` | Em preparação |
| `shipped` | Enviado |
| `in_transit` | Em trânsito |
| `delivered` | Entregue |
| `cancelled` | Cancelado |
| `refunded` | Reembolsado |
| `returned` | Devolvido |

### Transições permitidas

```
pending_payment → paid
pending_payment → cancelled

paid → processing
paid → cancelled
paid → refunded

processing → shipped
processing → cancelled
processing → refunded

shipped → in_transit
shipped → delivered          (opcional pular in_transit)
shipped → returned

in_transit → delivered
in_transit → returned

delivered → returned
delivered → refunded         (após devolução parcial/total, conforme política)

returned → refunded

cancelled → (terminal; sem saída)
refunded  → (terminal)
```

**Cliente pode cancelar** se status ∈ `{ pending_payment, paid, processing }` (alinhado ao frontend).  
Não cancelar se ∈ `{ shipped, in_transit, delivered, cancelled, refunded, returned }`.

Webhooks de pagamento: `paid` / `failed` → atualizam `paymentStatus` e possivelmente `order.status`.

### Timestamps

| Campo | Quando |
|-------|--------|
| `paidAt` | status → `paid` |
| `shippedAt` | status → `shipped` |
| `deliveredAt` | status → `delivered` |
| `cancelledAt` | status → `cancelled` |

### Casos extremos

- Idempotency-Key no `POST /orders` evita pedido duplicado.
- Divergência de preço: rejeitar com `PRICE_CHANGED` e forçar refresh do carrinho.
- Cupom inválido na criação: `422` com status de cupom.
- Pedido sem itens: `422`.

---

## Modelos

```ts
type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "returned";

interface OrderItem {
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
  lineTotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  shippingOptionId?: string;
  trackingCode?: string;
  trackingUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

interface CreateOrderRequest {
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
  shippingAddressId: string;
  billingAddressId?: string;
  shippingOptionId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}
```

Campos extras sugeridos: `rewardTierId`, `rewardGift` snapshot.

---

## Endpoints API

### `POST /api/v1/orders`

**Auth:** cliente  
**Header:** `Idempotency-Key` (recomendado)

**Body:**

```json
{
  "items": [
    { "productId": "prod-001", "variantId": "var-001-a", "quantity": 2 }
  ],
  "shippingAddressId": "addr-001",
  "shippingOptionId": "ship-pac",
  "paymentMethod": "pix",
  "couponCode": "BEMVINDA10",
  "notes": "Deixar na portaria"
}
```

**Sucesso `201`:**

```json
{
  "order": {
    "id": "ord-007",
    "orderNumber": "HA-2026-0007",
    "userId": "user-001",
    "status": "pending_payment",
    "items": [
      {
        "id": "oi-001",
        "productId": "prod-001",
        "productSlug": "batom-matte-rosa-nude",
        "productName": "Batom Matte Rosa Nude",
        "variantId": "var-001-a",
        "variantSku": "AG-BM-RN-01",
        "variantName": "Rosa Nude",
        "attributes": { "color": "Rosa Nude" },
        "image": "https://…",
        "unitPrice": 49.9,
        "promotionalPrice": 39.9,
        "quantity": 2,
        "lineTotal": 79.8
      }
    ],
    "shippingAddress": {
      "id": "addr-001",
      "recipientName": "Ana Silva",
      "street": "Av. Paulista",
      "number": "1000",
      "neighborhood": "Bela Vista",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01310100",
      "country": "BR",
      "isDefault": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    },
    "subtotal": 79.8,
    "discount": 7.98,
    "shipping": 14.9,
    "tax": 0,
    "total": 86.72,
    "currency": "BRL",
    "couponCode": "BEMVINDA10",
    "paymentMethod": "pix",
    "paymentStatus": "pending",
    "shippingOptionId": "ship-pac",
    "createdAt": "2026-08-04T12:00:00.000Z",
    "updatedAt": "2026-08-04T12:00:00.000Z"
  },
  "payment": {
    "id": "pay-001",
    "orderId": "ord-007",
    "method": "pix",
    "status": "pending",
    "amount": 86.72,
    "currency": "BRL",
    "pixQrCode": "00020126…",
    "pixQrCodeUrl": "https://…",
    "pixExpiresAt": "2026-08-04T12:30:00.000Z",
    "createdAt": "2026-08-04T12:00:00.000Z"
  }
}
```

**Erros:** `401`, `422` `STOCK_UNAVAILABLE` / `COUPON_*` / `VALIDATION_ERROR`, `404` endereço.

---

### `GET /api/v1/orders`

**Auth:** cliente — listagem dos **meus** pedidos  

**Query:** `page`, `pageSize`, `status`

**Sucesso `200`:** paginação padrão com `items: Order[]`.

---

### `GET /api/v1/orders/{id}`

**Auth:** cliente (dono) ou admin  
**Sucesso `200`:** `Order`  
**Erros:** `404`, `403`

---

### `GET /api/v1/orders/by-number/{orderNumber}`

**Auth:** cliente (dono)  
**Sucesso `200`:** `Order`

---

### `POST /api/v1/orders/{id}/cancel`

**Auth:** cliente  

**Body:**

```json
{ "reason": "Desisti da compra" }
```

**Sucesso `200`:** `Order` com `status: "cancelled"`  

**Erros:**

```json
{
  "message": "Este pedido não pode ser cancelado.",
  "code": "ORDER_NOT_CANCELLABLE",
  "errors": {}
}
```

---

## Admin

Atualização de status, listagem global — [14-admin.md](./14-admin.md).
