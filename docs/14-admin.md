# 14 — Admin

Todas as rotas sob `/api/v1/admin/*` exigem **Bearer JWT** com `role=admin`.

Sem role → `403 FORBIDDEN`.

---

## Lógica de negócio

- Painel operacional da loja Hello Ana Make.
- CRUD dos domínios + atualização de status de pedidos + dashboard.
- Soft-delete preferível a hard-delete em produtos/categorias/marcas.
- Uploads de imagem: multipart → URL pública (S3/local).
- Auditoria sugerida: `adminId`, `action`, `entity`, `before/after`, `createdAt`.

### Dashboard (stats)

Métricas sugeridas (período query `from`/`to`, default últimos 30 dias):

- `ordersCount`, `ordersPaidCount`
- `revenue` (soma `total` de pedidos paid+)
- `averageTicket`
- `newCustomers`
- `productsLowStock`
- `topProducts[]` (id, name, unitsSold)
- `ordersByStatus` map
- `conversion` opcional

---

## Endpoints — Dashboard

### `GET /api/v1/admin/dashboard`

**Auth:** admin  

**Query:** `from=2026-07-01&to=2026-08-04`

**Sucesso `200`:**

```json
{
  "period": { "from": "2026-07-01", "to": "2026-08-04" },
  "ordersCount": 128,
  "ordersPaidCount": 110,
  "revenue": 45890.5,
  "averageTicket": 417.18,
  "newCustomers": 34,
  "productsLowStock": 7,
  "ordersByStatus": {
    "pending_payment": 5,
    "paid": 8,
    "processing": 12,
    "shipped": 20,
    "in_transit": 15,
    "delivered": 60,
    "cancelled": 6,
    "refunded": 2,
    "returned": 0
  },
  "topProducts": [
    { "productId": "prod-001", "name": "Batom Matte Rosa Nude", "unitsSold": 86 }
  ]
}
```

---

## Produtos

### `GET /api/v1/admin/products`

Paginação + filtros incl. `includeInactive=true`.

### `POST /api/v1/admin/products`

**Body (exemplo resumido):**

```json
{
  "slug": "novo-produto",
  "name": "Novo Produto",
  "shortDescription": "…",
  "description": "…",
  "brandId": "brand-ana-glow",
  "categoryId": "cat-boca",
  "isFeatured": false,
  "isNew": true,
  "isActive": true,
  "images": [
    { "url": "https://…", "alt": "…", "sortOrder": 0, "isPrimary": true }
  ],
  "variants": [
    {
      "sku": "AG-NEW-01",
      "name": "Único",
      "attributes": {},
      "price": 59.9,
      "promotionalPrice": 49.9,
      "stock": 100,
      "isAvailable": true
    }
  ],
  "badges": []
}
```

**Sucesso `201`:** `Product`

### `PUT /api/v1/admin/products/{id}`

### `DELETE /api/v1/admin/products/{id}` → soft-delete / `isActive=false`

---

## Categorias

- `GET|POST /api/v1/admin/categories`
- `PUT|DELETE /api/v1/admin/categories/{id}`

**Body create:**

```json
{
  "slug": "olhos",
  "name": "Olhos",
  "description": "Sombras, máscaras e delineadores.",
  "image": "https://…",
  "parentId": "cat-maquiagem",
  "isActive": true,
  "sortOrder": 2
}
```

---

## Marcas

- `GET|POST /api/v1/admin/brands`
- `PUT|DELETE /api/v1/admin/brands/{id}`

```json
{
  "slug": "lumina-beauty",
  "name": "Lumina Beauty",
  "description": "…",
  "logo": "https://…",
  "website": "https://…",
  "isActive": true
}
```

---

## Cupons

- `GET|POST /api/v1/admin/coupons`
- `PUT|DELETE /api/v1/admin/coupons/{id}`

```json
{
  "code": "ANA15",
  "type": "percentage",
  "value": 15,
  "description": "15% de desconto Hello Ana",
  "minOrderValue": 80,
  "maxDiscountValue": 80,
  "usageLimit": 500,
  "perUserLimit": 1,
  "firstPurchaseOnly": false,
  "startsAt": "2025-01-01T00:00:00.000Z",
  "endsAt": "2027-06-30T23:59:59.000Z",
  "isActive": true
}
```

---

## Promoções

- `GET|POST /api/v1/admin/promotions`
- `PUT|DELETE /api/v1/admin/promotions/{id}`

Payload = `Promotion` sem `id`/`createdAt`/`updatedAt` no create.

---

## Reward tiers

- `GET|POST /api/v1/admin/reward-tiers`
- `PUT|DELETE /api/v1/admin/reward-tiers/{id}`

```json
{
  "minimumAmount": 50,
  "isActive": true,
  "sortOrder": 1,
  "reward": {
    "name": "Mini Batom",
    "description": "Mini batom Ana Glow em tom surpresa",
    "image": "https://…"
  }
}
```

Validar `minimumAmount` únicos entre ativos.

---

## Pedidos

### `GET /api/v1/admin/orders`

**Query:** `page`, `pageSize`, `status`, `search` (orderNumber/email), `from`, `to`

### `GET /api/v1/admin/orders/{id}`

### `PATCH /api/v1/admin/orders/{id}/status`

**Body:**

```json
{
  "status": "processing",
  "trackingCode": null,
  "trackingUrl": null,
  "notes": "Separado no estoque"
}
```

Para `shipped`:

```json
{
  "status": "shipped",
  "trackingCode": "SF123456789BR",
  "trackingUrl": "https://…"
}
```

**Regras:** só aceitar transições documentadas em [09-checkout-pedidos.md](./09-checkout-pedidos.md).

**Erros:**

```json
{
  "message": "Transição de status não permitida.",
  "code": "INVALID_STATUS_TRANSITION",
  "errors": {}
}
```

### `POST /api/v1/admin/orders/{id}/refund`

Dispara reembolso no gateway + status `refunded`.

---

## Clientes (leitura)

### `GET /api/v1/admin/customers`

Paginação; busca por nome/email.

### `GET /api/v1/admin/customers/{id}`

Detalhe + contagem de pedidos.

---

## Configurações

Ver [15-configuracoes.md](./15-configuracoes.md) — `GET|PUT /api/v1/admin/settings`.

---

## Upload

### `POST /api/v1/admin/uploads`

**Auth:** admin  
`multipart/form-data` field `file`

**Sucesso `201`:**

```json
{
  "url": "https://cdn…/uploads/abc.webp",
  "mimeType": "image/webp",
  "size": 102400
}
```
