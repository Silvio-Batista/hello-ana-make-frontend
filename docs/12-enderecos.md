# 12 — Endereços

Contrato: `src/contracts/address.contract.ts` · input: `AddressInput` no repositório

---

## Lógica de negócio

- Endereços pertencem ao `userId` autenticado.
- Apenas o dono lista/edita/remove.
- `isDefault=true`: no máximo **um** por usuário; ao setar default, limpar flag dos demais.
- Ao criar o primeiro endereço, marcar como default automaticamente.
- `country` default `"BR"`.
- `zipCode`: 8 dígitos; validar formato.
- `state`: UF com 2 letras.
- Usado no checkout como `shippingAddressId` / `billingAddressId`.
- Snapshot do endereço é **copiado** para o pedido (alterações posteriores não mudam pedidos antigos).

### Casos extremos

- Remover endereço default → promover outro mais recente, ou ficar sem default.
- Remover endereço em uso só em pedidos antigos: ok (snapshot).
- Não permitir remover se for o único e houver checkout em andamento? **Não necessário** — checkout exige seleção válida no submit.

---

## Modelos

```ts
interface Address {
  id: string;
  userId?: string;
  label?: string;
  recipientName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

type AddressInput = Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">;
```

---

## Endpoints API

### `GET /api/v1/addresses`

**Auth:** cliente  

**Sucesso `200`:**

```json
{
  "items": [
    {
      "id": "addr-001",
      "userId": "user-001",
      "label": "Casa",
      "recipientName": "Ana Silva",
      "street": "Av. Paulista",
      "number": "1000",
      "complement": "Apto 12",
      "neighborhood": "Bela Vista",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01310100",
      "country": "BR",
      "phone": "11999990000",
      "isDefault": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/v1/addresses/{id}`

**Auth:** cliente  
**Sucesso `200`:** `Address`  
**Erros:** `404`, `403`

---

### `POST /api/v1/addresses`

**Auth:** cliente  

**Body:**

```json
{
  "label": "Trabalho",
  "recipientName": "Ana Silva",
  "street": "Rua Augusta",
  "number": "500",
  "complement": "Sala 3",
  "neighborhood": "Consolação",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01305000",
  "country": "BR",
  "phone": "11999990000",
  "isDefault": false
}
```

**Sucesso `201`:** `Address`

---

### `PUT /api/v1/addresses/{id}` / `PATCH /api/v1/addresses/{id}`

**Auth:** cliente  
**Body:** parcial ou completo de `AddressInput`  
**Sucesso `200`:** `Address`

---

### `DELETE /api/v1/addresses/{id}`

**Auth:** cliente  
**Sucesso `204`**

---

### `POST /api/v1/addresses/{id}/default`

**Auth:** cliente  
**Sucesso `200`:** `Address` com `isDefault: true`
