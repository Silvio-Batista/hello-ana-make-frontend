# 15 — Configurações da loja

Configurações globais persistidas (key/value ou JSON document único). Editáveis pelo admin; subset público para a storefront.

---

## Lógica de negócio

- Uma “loja” = um registro de settings (single-tenant nesta fase).
- Valores tipados; validar ranges (ex.: frete grátis ≥ 0).
- Alterações afetam cotações/checkout imediatamente (cache curto, TTL ≤ 60s).
- Segredos de gateway (**nunca** retornar API keys no GET público; mascarar no admin: `asaas_***`).

### Grupos sugeridos

| Grupo | Exemplos |
|-------|----------|
| `store` | nome, CNPJ, e-mail suporte, telefone, redes |
| `checkout` | métodos de pagamento habilitados, parcelas máx. |
| `shipping` | CEP origem, peso/dimensões default, limiares frete grátis |
| `rewards` | programa ativo on/off |
| `coupons` | signup promo ativa, código/template |
| `seo` | title default, description |
| `integrations` | gateway ativo, SuperFrete keys (secret) |

### Casos extremos

- Desabilitar Pix com pedidos pending: ok; novos checkouts não oferecem.
- `signupPromotionEnabled=false` → `GET /auth/signup-promotion` retorna inativo.

---

## Modelo (StoreSettings)

```ts
interface StoreSettings {
  store: {
    name: string;
    legalName?: string;
    document?: string; // CNPJ
    email: string;
    phone?: string;
    instagramUrl?: string;
    address?: Partial<Address>;
  };
  checkout: {
    enabledPaymentMethods: PaymentMethod[];
    maxInstallments: number;
    minInstallmentAmount: number;
    allowGuestCheckout: boolean; // false no MVP (login obrigatório)
  };
  shipping: {
    originZipCode: string;
    defaultWeightGrams: number;
    defaultWidthCm: number;
    defaultHeightCm: number;
    defaultLengthCm: number;
    freeShippingThresholds: {
      PAC?: number | null;
      SEDEX?: number | null;
      EXPRESSA?: number | null;
    };
  };
  rewards: {
    enabled: boolean;
  };
  signupPromotion: {
    enabled: boolean;
    couponCode: string;
    discountPercentage: number;
    message: string;
    expiresAt?: string;
  };
  currency: "BRL";
  timezone: string; // "America/Sao_Paulo"
  updatedAt: string;
}

interface PublicStoreSettings {
  store: Pick<StoreSettings["store"], "name" | "email" | "phone" | "instagramUrl">;
  checkout: {
    enabledPaymentMethods: PaymentMethod[];
    maxInstallments: number;
  };
  rewards: { enabled: boolean };
  signupPromotion: StoreSettings["signupPromotion"];
  currency: "BRL";
}
```

---

## Endpoints API

### `GET /api/v1/settings`

**Auth:** público  

Retorna apenas campos seguros (`PublicStoreSettings`).

**Sucesso `200`:**

```json
{
  "store": {
    "name": "Hello Ana Make",
    "email": "contato@helloanamake.com",
    "phone": "11999990000",
    "instagramUrl": "https://instagram.com/helloanamake"
  },
  "checkout": {
    "enabledPaymentMethods": ["pix", "credit_card", "boleto"],
    "maxInstallments": 6
  },
  "rewards": { "enabled": true },
  "signupPromotion": {
    "enabled": true,
    "couponCode": "BEMVINDA10",
    "discountPercentage": 10,
    "message": "Cadastre-se e ganhe 10% de desconto na primeira compra.",
    "expiresAt": "2027-12-31T23:59:59.000Z"
  },
  "currency": "BRL"
}
```

---

### `GET /api/v1/admin/settings`

**Auth:** admin  

**Sucesso `200`:** `StoreSettings` completo (secrets mascarados).

```json
{
  "store": {
    "name": "Hello Ana Make",
    "legalName": "Hello Ana Make LTDA",
    "document": "00000000000000",
    "email": "contato@helloanamake.com",
    "phone": "11999990000",
    "instagramUrl": "https://instagram.com/helloanamake"
  },
  "checkout": {
    "enabledPaymentMethods": ["pix", "credit_card", "boleto"],
    "maxInstallments": 6,
    "minInstallmentAmount": 30,
    "allowGuestCheckout": false
  },
  "shipping": {
    "originZipCode": "01310100",
    "defaultWeightGrams": 200,
    "defaultWidthCm": 16,
    "defaultHeightCm": 10,
    "defaultLengthCm": 20,
    "freeShippingThresholds": {
      "PAC": 149,
      "SEDEX": 249,
      "EXPRESSA": null
    }
  },
  "rewards": { "enabled": true },
  "signupPromotion": {
    "enabled": true,
    "couponCode": "BEMVINDA10",
    "discountPercentage": 10,
    "message": "Cadastre-se e ganhe 10% de desconto na primeira compra.",
    "expiresAt": "2027-12-31T23:59:59.000Z"
  },
  "integrations": {
    "paymentGateway": "asaas",
    "shippingProvider": "superfrete",
    "asaasApiKey": "asa_****",
    "superfreteToken": "sf_****"
  },
  "currency": "BRL",
  "timezone": "America/Sao_Paulo",
  "updatedAt": "2026-08-04T12:00:00.000Z"
}
```

---

### `PUT /api/v1/admin/settings`

**Auth:** admin  

**Body:** parcial ou completo (merge profundo no servidor).

```json
{
  "checkout": {
    "maxInstallments": 10,
    "enabledPaymentMethods": ["pix", "credit_card"]
  },
  "shipping": {
    "freeShippingThresholds": { "PAC": 129 }
  },
  "signupPromotion": {
    "enabled": true,
    "discountPercentage": 10,
    "couponCode": "BEMVINDA10"
  }
}
```

**Sucesso `200`:** `StoreSettings` atualizado  

**Erros:** `422` `VALIDATION_ERROR`

---

### `PATCH /api/v1/admin/settings/integrations`

**Auth:** admin  

Atualiza apenas secrets/tokens sem expor o restante.

```json
{
  "paymentGateway": "asaas",
  "asaasApiKey": "nova_chave_secreta",
  "shippingProvider": "superfrete",
  "superfreteToken": "novo_token"
}
```

**Sucesso `200`:**

```json
{
  "paymentGateway": "asaas",
  "shippingProvider": "superfrete",
  "asaasApiKey": "asa_****",
  "superfreteToken": "sf_****",
  "updatedAt": "2026-08-04T12:05:00.000Z"
}
```
