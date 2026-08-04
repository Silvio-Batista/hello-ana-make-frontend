# 01 — Produtos

Contrato: `src/contracts/product.contract.ts`

---

## Lógica de negócio

### Catálogo

- Produto possui **variantes** (SKU) com preço, estoque e atributos próprios (cor, tom, volume, etc.).
- Preço efetivo de venda da variante: `promotionalPrice ?? price`.
- `pricing` do produto é agregado das variantes ativas:
  - `priceFrom` / `priceTo` = min/max de `price`
  - `promotionalPriceFrom` / `promotionalPriceTo` = min/max de `promotionalPrice` (quando houver)
  - `discountPercentage` = maior desconto percentual entre variantes com promo
- `inventory.totalStock` = soma dos `stock` das variantes; `isInStock` se `totalStock > 0`.
- `isLowStock` se `totalStock <= lowStockThreshold` (default sugerido: 5).
- Produtos inativos (`isActive=false` no admin) **não** aparecem em listagens públicas.
- Variante com `stock === 0` ou `isAvailable=false` não pode ser adicionada ao carrinho.
- `isFavorite` só é `true` se o cliente autenticado favoritou; em público/guest → `false`.
- Slug único; listagem por slug retorna 404 se inexistente/inativo.
- Reviews/rating: `rating.average` e `rating.count` são agregados; distribuição opcional 1–5.

### Filtros e ordenação

Filtros (`ProductFilters`): categorias, marcas, faixa de preço (pelo preço efetivo), atributos de variante, estoque, featured/new/bestseller, onSale (tem `promotionalPrice`), rating mínimo, busca textual, tags.

Ordenação (`sortBy`):

| Valor | Critério |
|-------|----------|
| `relevance` | Score de busca / featured (default) |
| `price_asc` / `price_desc` | Preço efetivo mínimo |
| `newest` | `createdAt` desc |
| `bestseller` | Métrica de vendas / flag |
| `rating` | `rating.average` desc |
| `name_asc` / `name_desc` | Nome |

### Casos extremos

- Produto sem variantes → não listar / 422 no admin.
- Busca vazia → listagem padrão.
- `page`/`pageSize` inválidos → defaults ou 422.
- Ao atualizar preço/estoque, carrinhos com o item devem revalidar disponibilidade e `maxQuantity` no próximo GET/sync.

---

## Modelos

```ts
interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
}

interface ProductVariantAttributes {
  color?: string;
  colorHex?: string;
  size?: string;
  volume?: string;
  fragrance?: string;
  shade?: string;
}

interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  attributes: ProductVariantAttributes;
  price: number;
  promotionalPrice?: number;
  stock: number;
  image?: string;
  isAvailable: boolean;
}

interface ProductPricing {
  priceFrom: number;
  priceTo: number;
  promotionalPriceFrom?: number;
  promotionalPriceTo?: number;
  currency: string; // "BRL"
  discountPercentage?: number;
}

interface ProductInventory {
  totalStock: number;
  isInStock: boolean;
  lowStockThreshold?: number;
  isLowStock: boolean;
}

interface ProductRating {
  average: number;
  count: number;
  distribution?: Record<"1"|"2"|"3"|"4"|"5", number>;
}

interface ProductBadge {
  id: string;
  label: string;
  type: "new" | "bestseller" | "exclusive" | "limited" | "sale" | "eco" | "vegan" | "custom";
  color?: string;
}

interface ProductPromotion {
  id: string;
  label: string;
  type: "percentage" | "fixed_amount" | "buy_x_get_y" | "flash_sale";
  value: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  ingredients?: string;
  howToUse?: string;
  benefits?: string[];
  technicalInfo?: Record<string, string>;
  brand: Brand;       // objeto aninhado
  category: Category; // objeto aninhado
  images: ProductImage[];
  variants: ProductVariant[];
  pricing: ProductPricing;
  inventory: ProductInventory;
  rating: ProductRating;
  badges: ProductBadge[];
  promotion?: ProductPromotion;
  isFavorite: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## Endpoints API

### `GET /api/v1/products`

**Auth:** público (favoritos preenchidos se Bearer presente)

**Query:**

```
page=1
pageSize=20
sortBy=relevance
categoryIds[]=cat-boca
brandIds[]=brand-001
priceMin=20
priceMax=200
inStockOnly=true
isFeatured=true
isNew=true
isBestseller=true
onSale=true
ratingMin=4
search=batom
colors[]=Rosa
```

**Sucesso `200`:**

```json
{
  "items": [
    {
      "id": "prod-001",
      "slug": "batom-matte-rosa-nude",
      "name": "Batom Matte Rosa Nude",
      "shortDescription": "Acabamento matte de longa duração.",
      "description": "…",
      "brand": {
        "id": "brand-ana-glow",
        "slug": "ana-glow",
        "name": "Ana Glow",
        "isActive": true,
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-01-01T00:00:00.000Z"
      },
      "category": {
        "id": "cat-boca",
        "slug": "boca",
        "name": "Boca",
        "description": "…",
        "image": "https://…",
        "isActive": true,
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-01-01T00:00:00.000Z"
      },
      "images": [
        {
          "id": "img-1",
          "url": "https://…",
          "alt": "Batom Rosa Nude",
          "sortOrder": 0,
          "isPrimary": true
        }
      ],
      "variants": [
        {
          "id": "var-001-a",
          "sku": "AG-BM-RN-01",
          "name": "Rosa Nude",
          "attributes": { "color": "Rosa Nude", "colorHex": "#C4877A", "shade": "Nude" },
          "price": 49.9,
          "promotionalPrice": 39.9,
          "stock": 25,
          "isAvailable": true
        }
      ],
      "pricing": {
        "priceFrom": 49.9,
        "priceTo": 49.9,
        "promotionalPriceFrom": 39.9,
        "promotionalPriceTo": 39.9,
        "currency": "BRL",
        "discountPercentage": 20
      },
      "inventory": {
        "totalStock": 25,
        "isInStock": true,
        "lowStockThreshold": 5,
        "isLowStock": false
      },
      "rating": { "average": 4.7, "count": 128 },
      "badges": [{ "id": "b1", "label": "Mais vendido", "type": "bestseller" }],
      "isFavorite": false,
      "isFeatured": true,
      "isNew": false,
      "isBestseller": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 20,
  "totalPages": 3
}
```

---

### `GET /api/v1/products/{slug}`

**Auth:** público  
**Sucesso `200`:** objeto `Product` completo.  
**Erros:** `404` `NOT_FOUND`.

---

### `GET /api/v1/products/{id}/related`

**Auth:** público  
**Query:** `limit=8`  
**Regra:** mesma categoria / marca, exclui o produto atual, ativos e em estoque preferencialmente.

```json
{
  "items": []
}
```

---

### `GET /api/v1/products/{id}/reviews` (opcional fase 1)

**Auth:** público  
Paginação padrão. Criação exige cliente autenticado (endpoint separado).

---

## Admin

CRUD em [14-admin.md](./14-admin.md) (`/api/v1/admin/products`).
