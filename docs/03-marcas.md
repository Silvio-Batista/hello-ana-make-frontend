# 03 — Marcas

Contrato: `src/contracts/brand.contract.ts`

---

## Lógica de negócio

- Marcas ativas (`isActive=true`) aparecem em filtros e páginas de marca.
- Slug único.
- Produtos referenciam uma marca; ao desativar marca, produtos somem do filtro público (ou ficam ocultos conforme regra da loja — sugerido: **ocultar produtos de marca inativa**).
- `logo` e `website` opcionais.

### Casos extremos

- Exclusão com produtos associados → **409** `BRAND_HAS_PRODUCTS`.
- Nome duplicado: permitir; slug deve ser único.

---

## Modelo

```ts
interface Brand {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## Endpoints API

### `GET /api/v1/brands`

**Auth:** público  

**Sucesso `200`:**

```json
{
  "items": [
    {
      "id": "brand-ana-glow",
      "slug": "ana-glow",
      "name": "Ana Glow",
      "description": "Linha própria Hello Ana Make.",
      "logo": "https://…",
      "website": "https://helloanamake.com",
      "isActive": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/v1/brands/{slug}`

**Auth:** público  
**Sucesso `200`:** `Brand`  
**Erros:** `404` `NOT_FOUND`

---

## Admin

Ver [14-admin.md](./14-admin.md) — CRUD em `/api/v1/admin/brands`.
