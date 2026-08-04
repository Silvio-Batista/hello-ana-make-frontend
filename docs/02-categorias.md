# 02 — Categorias

Contrato: `src/contracts/category.contract.ts`

---

## Lógica de negócio

- Categorias suportam **hierarquia** via `parentId` (null = raiz).
- Apenas categorias `isActive=true` aparecem na loja.
- `productCount` = quantidade de produtos ativos na categoria (e opcionalmente subcategorias — definir se conta recursivo; sugerido: **direto + filhos** na listagem pública).
- `sortOrder` controla ordem de exibição (ascendente).
- Slug único globalmente.
- Excluir categoria com produtos: bloquear (**409**) ou exigir reassociação; soft-delete recomendado.
- Ao desativar pai, considerar desativar/ocultar filhos na loja.

### Casos extremos

- Ciclo de parent (`A → B → A`) → rejeitar na validação.
- Categoria sem imagem: permitir com placeholder no frontend.
- Filtro de produtos por `categoryIds` deve incluir IDs de filhos se o frontend enviar só o pai (ou documentar que o client envia a árvore expandida). **Sugerido no backend:** ao filtrar por categoria, incluir descendentes.

---

## Modelo

```ts
interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  parentId?: string;
  productCount?: number;
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## Endpoints API

### `GET /api/v1/categories`

**Auth:** público  

**Query:** `flat=true|false` (default flat list), `includeInactive=false`

**Sucesso `200`:**

```json
{
  "items": [
    {
      "id": "cat-maquiagem",
      "slug": "maquiagem",
      "name": "Maquiagem",
      "description": "Make para todos os momentos.",
      "image": "https://…",
      "parentId": null,
      "productCount": 48,
      "isActive": true,
      "sortOrder": 1,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "cat-boca",
      "slug": "boca",
      "name": "Boca",
      "description": "Batons, glosses e lip tints.",
      "image": "https://…",
      "parentId": "cat-maquiagem",
      "productCount": 18,
      "isActive": true,
      "sortOrder": 1,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

**Árvore (`tree=true`):**

```json
{
  "items": [
    {
      "id": "cat-maquiagem",
      "slug": "maquiagem",
      "name": "Maquiagem",
      "description": "…",
      "image": "https://…",
      "isActive": true,
      "sortOrder": 1,
      "productCount": 48,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z",
      "children": [
        {
          "id": "cat-boca",
          "slug": "boca",
          "name": "Boca",
          "description": "…",
          "image": "https://…",
          "parentId": "cat-maquiagem",
          "isActive": true,
          "sortOrder": 1,
          "productCount": 18,
          "createdAt": "2026-01-01T00:00:00.000Z",
          "updatedAt": "2026-01-01T00:00:00.000Z",
          "children": []
        }
      ]
    }
  ]
}
```

---

### `GET /api/v1/categories/{slug}`

**Auth:** público  
**Sucesso `200`:** `Category`  
**Erros:** `404` `NOT_FOUND`

---

## Admin

Ver [14-admin.md](./14-admin.md) — `POST/PUT/DELETE /api/v1/admin/categories`.
