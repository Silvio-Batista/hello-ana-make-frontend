# 08 — Frete

Contrato: `src/contracts/shipping.contract.ts` · mock SuperFrete-ready: `src/mocks/shipping.ts`

---

## Lógica de negócio

### Provedor

- Abstração `ShippingProvider`: `quote`, `createShipment`, `getTracking`, `cancelShipment?`.
- Implementação alvo: **SuperFrete** (PAC, SEDEX, Expressa).
- Ambiente local/dev: mock com as mesmas opções.

### Opções mock / defaults

| serviceCode | provider | basePrice | prazo (dias) | frete grátis acima de |
|-------------|----------|-----------|--------------|------------------------|
| `PAC` | Correios | 14.90 | 6–12 | 149 |
| `SEDEX` | Correios | 24.90 | 2–5 | 249 |
| `EXPRESSA` | SuperFrete | 34.90 | 1–2 | — |

### Cotação

- Entrada: CEP destino + itens (quantidade + dimensões/peso opcionais) + `subtotal` opcional.
- `isFree = freeAbove != null && subtotal >= freeAbove` → `price = 0`.
- Cupom `free_shipping` (ver cupons) também força `price = 0` / `isFree = true` na opção escolhida (todas ou só a selecionada — **sugerido: zerar a opção selecionada no carrinho**).
- CEP inválido (≠ 8 dígitos) → `422` `INVALID_ZIP_CODE`.
- Sem cobertura → `200` com `options: []` ou `422` `SHIPPING_UNAVAILABLE`.

### Criação de envio

- Após pedido `paid`/`processing`, admin/sistema cria etiqueta via SuperFrete.
- Atualiza pedido: `trackingCode`, `trackingUrl`, status → `shipped`.

### Casos extremos

- Dimensões ausentes: usar defaults da loja (settings).
- Recotação se itens mudarem após quote (TTL sugerido 30–60 min).
- Cancelamento de etiqueta só se status `pending`/`labeled`.

---

## Modelos

```ts
interface ShippingQuoteItem {
  productId: string;
  variantId: string;
  quantity: number;
  weightGrams?: number;
  widthCm?: number;
  heightCm?: number;
  lengthCm?: number;
}

interface ShippingQuoteRequest {
  zipCode: string;
  items: ShippingQuoteItem[];
  subtotal?: number;
}

interface ShippingOption {
  id: string;
  provider: string;
  serviceName: string;
  serviceCode: string;
  price: number;
  currency: string;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  isFree: boolean;
}

interface ShippingQuoteResponse {
  zipCode: string;
  options: ShippingOption[];
  quotedAt: string;
}

interface ShipmentRequest {
  orderId: string;
  shippingOptionId: string;
  address: Address;
  items: ShippingQuoteItem[];
  invoiceNumber?: string;
}

interface ShipmentResponse {
  id: string;
  orderId: string;
  trackingCode: string;
  trackingUrl?: string;
  labelUrl?: string;
  provider: string;
  serviceName: string;
  price: number;
  status: "pending" | "labeled" | "shipped" | "in_transit" | "delivered" | "failed" | "cancelled";
  estimatedDeliveryAt?: string;
  createdAt: string;
}
```

---

## Endpoints API

### `POST /api/v1/shipping/quote`

**Auth:** público  

**Body:**

```json
{
  "zipCode": "01310100",
  "subtotal": 160,
  "items": [
    {
      "productId": "prod-001",
      "variantId": "var-001-a",
      "quantity": 2,
      "weightGrams": 80,
      "widthCm": 5,
      "heightCm": 3,
      "lengthCm": 8
    }
  ]
}
```

**Sucesso `200`:**

```json
{
  "zipCode": "01310100",
  "quotedAt": "2026-08-04T12:00:00.000Z",
  "options": [
    {
      "id": "ship-pac",
      "provider": "Correios",
      "serviceName": "PAC",
      "serviceCode": "PAC",
      "price": 0,
      "currency": "BRL",
      "estimatedDaysMin": 6,
      "estimatedDaysMax": 12,
      "isFree": true
    },
    {
      "id": "ship-sedex",
      "provider": "Correios",
      "serviceName": "SEDEX",
      "serviceCode": "SEDEX",
      "price": 24.9,
      "currency": "BRL",
      "estimatedDaysMin": 2,
      "estimatedDaysMax": 5,
      "isFree": false
    },
    {
      "id": "ship-expressa",
      "provider": "SuperFrete",
      "serviceName": "Expressa",
      "serviceCode": "EXPRESSA",
      "price": 34.9,
      "currency": "BRL",
      "estimatedDaysMin": 1,
      "estimatedDaysMax": 2,
      "isFree": false
    }
  ]
}
```

**Erros:**

```json
{ "message": "CEP inválido.", "code": "INVALID_ZIP_CODE", "errors": {} }
```

---

### `GET /api/v1/shipping/tracking/{trackingCode}`

**Auth:** cliente (dono do pedido) ou admin  

**Sucesso `200`:** `ShipmentResponse`

---

### `POST /api/v1/admin/shipping/shipments`

**Auth:** admin  

**Body:** `ShipmentRequest`  

**Sucesso `201`:**

```json
{
  "id": "shp-001",
  "orderId": "ord-001",
  "trackingCode": "SF123456789BR",
  "trackingUrl": "https://…",
  "labelUrl": "https://…/label.pdf",
  "provider": "SuperFrete",
  "serviceName": "PAC",
  "price": 14.9,
  "status": "labeled",
  "estimatedDeliveryAt": "2026-08-16T00:00:00.000Z",
  "createdAt": "2026-08-04T12:00:00.000Z"
}
```

---

### `POST /api/v1/admin/shipping/shipments/{id}/cancel`

**Auth:** admin  
**Sucesso `204`** ou shipment com `status: "cancelled"`.
