# 10 — Pagamentos

Contrato: `src/contracts/payment.contract.ts`  
Stubs: Asaas / Mercado Pago / Stripe (`src/repositories/api/payment.repository.ts`)

---

## Lógica de negócio

### Métodos (`PaymentMethod`)

| method | Uso na loja |
|--------|-------------|
| `pix` | Primário — QR + copia-e-cola |
| `credit_card` | Cartão crédito (tokenizado) |
| `boleto` | Boleto bancário |
| `debit_card` | Opcional |
| `wallet` | Opcional (MP Wallet etc.) |
| `store_credit` | Crédito interno futuro |

MVP: **Pix, credit_card, boleto**.

### Status (`PaymentStatus`)

`pending` → `processing` → `authorized` → `paid`  
Falhas: `failed` | `cancelled`  
Pós-pago: `refunded` | `partially_refunded`

### Gateway-agnostic

Interface `PaymentGateway`:

- `createPayment`
- `getPaymentStatus`
- `refundPayment?`
- `cancelPayment?`

Configurar gateway ativo em settings (`asaas` | `mercadopago` | `stripe` | `mock`).

### Regras por método

**Pix**

- Gera QR / payload EMV; `pixExpiresAt` (ex.: 30 min).
- Webhook `paid` → pedido `paid`.
- Expiração sem pagamento → `failed` / pedido `cancelled` (job).

**Cartão**

- Nunca receber PAN completo; apenas `token` do frontend/SDK.
- `installments` ≥ 1; regras de juros em settings.
- 3DS: retornar `redirectUrl` se necessário.

**Boleto**

- Retornar `boletoUrl` + `boletoBarcode`.
- Vencimento típico D+1–D+3; webhook de liquidação.

### Valores

- `amount` deve bater com `order.total` (± 0.01).
- Moeda `BRL`.

### Casos extremos

- Pagamento duplicado no mesmo pedido: retornar o payment existente se ainda `pending`.
- Reembolso parcial: `partially_refunded`; total: `refunded` + pedido `refunded`.
- Webhook fora de ordem: idempotente por `transactionId`.

---

## Modelos

```ts
type PaymentMethod =
  | "credit_card"
  | "debit_card"
  | "pix"
  | "boleto"
  | "wallet"
  | "store_credit";

type PaymentStatus =
  | "pending"
  | "processing"
  | "authorized"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

interface CardPaymentData {
  token: string;
  installments: number;
  holderName: string;
  brand?: string;
  lastFourDigits?: string;
}

interface PixPaymentData {
  expiresInSeconds?: number;
}

interface CreatePaymentRequest {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  card?: CardPaymentData;
  pix?: PixPaymentData;
  returnUrl?: string;
  metadata?: Record<string, string>;
}

interface CreatePaymentResponse {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  pixQrCode?: string;
  pixQrCodeUrl?: string;
  pixExpiresAt?: string;
  boletoUrl?: string;
  boletoBarcode?: string;
  redirectUrl?: string;
  transactionId?: string;
  message?: string;
  createdAt: string;
}
```

---

## Endpoints API

### `POST /api/v1/payments`

**Auth:** cliente  

**Body (Pix):**

```json
{
  "orderId": "ord-007",
  "method": "pix",
  "amount": 86.72,
  "currency": "BRL",
  "pix": { "expiresInSeconds": 1800 }
}
```

**Body (Cartão):**

```json
{
  "orderId": "ord-007",
  "method": "credit_card",
  "amount": 86.72,
  "currency": "BRL",
  "card": {
    "token": "tok_abc123",
    "installments": 3,
    "holderName": "ANA SILVA",
    "brand": "visa",
    "lastFourDigits": "4242"
  },
  "returnUrl": "https://loja.com/checkout/retorno"
}
```

**Body (Boleto):**

```json
{
  "orderId": "ord-007",
  "method": "boleto",
  "amount": 86.72,
  "currency": "BRL"
}
```

**Sucesso `201` (Pix):**

```json
{
  "id": "pay-001",
  "orderId": "ord-007",
  "method": "pix",
  "status": "pending",
  "amount": 86.72,
  "currency": "BRL",
  "pixQrCode": "00020126580014br.gov.bcb.pix…",
  "pixQrCodeUrl": "https://api…/qr.png",
  "pixExpiresAt": "2026-08-04T12:30:00.000Z",
  "transactionId": "asaas_pay_xyz",
  "createdAt": "2026-08-04T12:00:00.000Z"
}
```

**Erros:**

```json
{ "message": "Falha ao processar pagamento.", "code": "PAYMENT_FAILED", "errors": {} }
```

```json
{ "message": "Valor diverge do total do pedido.", "code": "PAYMENT_AMOUNT_MISMATCH", "errors": {} }
```

---

### `GET /api/v1/payments/{id}`

**Auth:** cliente (dono do pedido) / admin  
**Sucesso `200`:** `CreatePaymentResponse`

---

### `POST /api/v1/payments/{id}/refund`

**Auth:** admin  

**Body:**

```json
{ "amount": 86.72 }
```

(`amount` omitido = reembolso total)

**Sucesso `200`:** payment com status `refunded` / `partially_refunded`

---

### `POST /api/v1/payments/{id}/cancel`

**Auth:** cliente (se `pending`) ou admin  
**Sucesso `200`:** `status: "cancelled"`

---

### `POST /api/v1/webhooks/payments/{gateway}`

**Auth:** assinatura do gateway (não JWT)  

Gateways: `asaas` | `mercadopago` | `stripe`

**Responsabilidade:** validar assinatura, mapear evento → atualizar payment + order.

**Resposta:** `200 { "received": true }` sempre que possível (evitar retries infinitos após processar).
