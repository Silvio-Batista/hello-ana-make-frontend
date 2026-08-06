# 13 — Favoritos

Contrato de produto aninhado; interface: `src/repositories/interfaces/favorite.repository.ts`

---

## Lógica de negócio

- Favoritos são por **usuário autenticado** (productId).
- `add` é idempotente (já favoritado → 200/204 sem erro).
- `remove` de item inexistente → 204 idempotente ou 404 (preferir **idempotente**).
- Listagem retorna `ProductListResponse` (produtos completos) com `isFavorite: true`.
- Produtos inativos/removidos: ocultar da lista ou manter com flag indisponível — **sugerido: filtrar inativos**.
- Em listagens de catálogo, popular `isFavorite` via set de IDs do usuário.

### Casos extremos

- Guest: frontend guarda localmente; sync no login (merge union de IDs).
- Limite opcional (ex.: 100 favoritos) → `422` `FAVORITES_LIMIT`.

---

## Modelos

Sem contrato próprio além de:

```ts
interface FavoriteRepository {
  list(params?: ProductListParams): Promise<ProductListResponse>;
  add(productId: string): Promise<void>;
  remove(productId: string): Promise<void>;
  has(productId: string): Promise<boolean>;
  getIds(): Promise<string[]>;
}
```

Resposta de listagem = `ProductListResponse` (ver [01-produtos.md](./01-produtos.md)).

---

## Endpoints API

### `GET /api/v1/favorites`

**Auth:** cliente  

**Query:** `page`, `pageSize`, `sortBy` (mesmos de produtos)

**Sucesso `200`:**

```json
{
  "items": [
    {
      "id": "prod-001",
      "slug": "batom-matte-rosa-nude",
      "name": "Batom Matte Rosa Nude",
      "shortDescription": "…",
      "description": "…",
      "brand": { "id": "brand-ana-glow", "slug": "ana-glow", "name": "Ana Glow", "isActive": true, "createdAt": "…", "updatedAt": "…" },
      "category": { "id": "cat-boca", "slug": "boca", "name": "Boca", "description": "…", "image": "…", "isActive": true, "createdAt": "…", "updatedAt": "…" },
      "images": [],
      "variants": [],
      "pricing": { "priceFrom": 49.9, "priceTo": 49.9, "currency": "BRL" },
      "inventory": { "totalStock": 25, "isInStock": true, "isLowStock": false },
      "rating": { "average": 4.7, "count": 128 },
      "badges": [],
      "isFavorite": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

---

### `GET /api/v1/favorites/ids`

**Auth:** cliente  

**Sucesso `200`:**

```json
{
  "ids": ["prod-001", "prod-014"]
}
```

Útil para hidratar coração nos cards sem carregar produtos completos.

---

### `POST /api/v1/favorites/{productId}`

**Auth:** cliente  
**Sucesso `204`** (ou `200 { "ok": true }`)  
**Erros:** `404` produto inexistente

---

### `DELETE /api/v1/favorites/{productId}`

**Auth:** cliente  
**Sucesso `204`**

---

### `GET /api/v1/favorites/{productId}/check`

**Auth:** cliente  

```json
{ "isFavorite": true }
```
