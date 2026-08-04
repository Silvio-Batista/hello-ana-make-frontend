# Hello Ana Make — Blueprint da API Backend

Documentação de lógica de negócio e contratos REST para implementação do backend Laravel do e-commerce **Hello Ana Make**.

O frontend (Next.js) consome JSON em **camelCase**. O Laravel pode persistir em `snake_case` e serializar via Resources/API transformers para camelCase.

**Base URL sugerida:** `https://api.helloanamake.com/api/v1`  
**Contratos TypeScript de referência:** `src/contracts/`

---

## Índice

| # | Domínio | Arquivo |
|---|---------|---------|
| 01 | Produtos | [01-produtos.md](./01-produtos.md) |
| 02 | Categorias | [02-categorias.md](./02-categorias.md) |
| 03 | Marcas | [03-marcas.md](./03-marcas.md) |
| 04 | Carrinho | [04-carrinho.md](./04-carrinho.md) |
| 05 | Cupons | [05-cupons.md](./05-cupons.md) |
| 06 | Promoções | [06-promocoes.md](./06-promocoes.md) |
| 07 | Recompensas (brindes) | [07-recompensas.md](./07-recompensas.md) |
| 08 | Frete | [08-frete.md](./08-frete.md) |
| 09 | Checkout e pedidos | [09-checkout-pedidos.md](./09-checkout-pedidos.md) |
| 10 | Pagamentos | [10-pagamentos.md](./10-pagamentos.md) |
| 11 | Auth / clientes | [11-auth-clientes.md](./11-auth-clientes.md) |
| 12 | Endereços | [12-enderecos.md](./12-enderecos.md) |
| 13 | Favoritos | [13-favoritos.md](./13-favoritos.md) |
| 14 | Admin | [14-admin.md](./14-admin.md) |
| 15 | Configurações da loja | [15-configuracoes.md](./15-configuracoes.md) |

---

## Visão da arquitetura

```
┌─────────────────┐     Bearer JWT      ┌──────────────────┐
│  Next.js Store  │ ──────────────────► │  Laravel API     │
│  (frontend)     │     /api/v1/*       │  (este blueprint)│
└─────────────────┘                     └────────┬─────────┘
                                                 │
                    ┌────────────────────────────┼────────────────────────────┐
                    ▼                            ▼                            ▼
             ┌─────────────┐            ┌──────────────┐            ┌────────────────┐
             │ SuperFrete  │            │ Gateway PG   │            │ Storage/S3     │
             │ (frete)     │            │ Asaas/MP/…   │            │ (imagens)      │
             └─────────────┘            └──────────────┘            └────────────────┘
```

### Princípios

- **API versionada** sob `/api/v1`.
- **Stateless** com JWT (access + refresh).
- **Adapters** para frete (`ShippingProvider`) e pagamento (`PaymentGateway`) — gateway-agnostic.
- **Snapshots** no pedido: preços, nomes, imagens e totais congelados no momento da compra.
- **Carrinho** pode ser guest (token/`cartId` em cookie/header) ou vinculado ao usuário autenticado; no merge pós-login, unificar itens.

---

## Autenticação

| Tipo | Header | Uso |
|------|--------|-----|
| Público | — | Catálogo, cotação de frete, signup promo |
| Cliente | `Authorization: Bearer <accessToken>` | Carrinho sync, checkout, pedidos, endereços, favoritos |
| Admin | `Authorization: Bearer <accessToken>` + `role=admin` no JWT/claims | CRUD admin, dashboard, settings |

### Sessão (`AuthSession`)

```json
{
  "user": {
    "id": "user-001",
    "email": "ana.silva@email.com",
    "name": "Ana Silva",
    "phone": "11999990000",
    "document": "12345678901",
    "avatarUrl": null,
    "birthDate": "1995-05-20",
    "emailVerified": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "def50200...",
  "expiresAt": "2026-08-11T12:00:00.000Z"
}
```

### Claims JWT sugeridos

```json
{
  "sub": "user-001",
  "email": "ana.silva@email.com",
  "role": "customer",
  "exp": 1723377600
}
```

Roles: `customer` | `admin`.

Rotas admin sem `role=admin` → **403** `{ "message": "Acesso negado.", "code": "FORBIDDEN" }`.

Token inválido/expirado → **401** `{ "message": "Não autenticado.", "code": "UNAUTHENTICATED" }`.

---

## Paginação padrão

Query params: `page` (default `1`), `pageSize` (default `20`, máx. sugerido `100`).

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "pageSize": 20,
  "totalPages": 0
}
```

`totalPages = ceil(total / pageSize)` (mínimo 0 quando vazio; frontend mock usa `max(1, …)` — preferir `0` quando `total === 0`).

---

## Erros padrão

HTTP status + corpo:

```json
{
  "message": "Este cupom expirou.",
  "code": "COUPON_EXPIRED",
  "errors": {}
}
```

Validação Laravel (`422`):

```json
{
  "message": "Os dados enviados são inválidos.",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": ["O campo e-mail é obrigatório."],
    "password": ["A senha deve ter no mínimo 6 caracteres."]
  }
}
```

### Códigos comuns

| code | HTTP | Significado |
|------|------|-------------|
| `UNAUTHENTICATED` | 401 | Sem token / token inválido |
| `FORBIDDEN` | 403 | Sem permissão |
| `NOT_FOUND` | 404 | Recurso inexistente |
| `VALIDATION_ERROR` | 422 | Campos inválidos |
| `CONFLICT` | 409 | Conflito (e-mail duplicado, estoque, etc.) |
| `COUPON_INVALID` | 422 | Cupom inexistente |
| `COUPON_EXPIRED` | 422 | Cupom expirado |
| `COUPON_INACTIVE` | 422 | Cupom inativo |
| `COUPON_MIN_ORDER` | 422 | Valor mínimo não atingido |
| `STOCK_UNAVAILABLE` | 409 | Estoque insuficiente |
| `ORDER_NOT_CANCELLABLE` | 422 | Status não permite cancelamento |
| `PAYMENT_FAILED` | 402/422 | Falha no gateway |

---

## Convenções JSON

- Datas: ISO 8601 UTC (`2026-08-04T12:00:00.000Z`).
- Moeda: `BRL`; valores monetários com 2 casas (number, não string).
- IDs: UUID ou string opaca (`prod-001`, `ord-001`).
- CEP: 8 dígitos sem máscara na API (`01310100`); frontend pode formatar.
- Códigos de cupom: normalizar para **UPPERCASE** no backend.

---

## Fluxo de checkout (resumo)

```
1. identification → 2. address → 3. shipping → 4. payment → 5. confirmation
```

Detalhes em [09-checkout-pedidos.md](./09-checkout-pedidos.md).

---

## Cálculos transversais (referência rápida)

| Conceito | Fórmula |
|----------|---------|
| Preço unitário efetivo | `promotionalPrice ?? unitPrice` |
| `lineTotal` | `effective × quantity` (arredondar 2 casas) |
| `subtotal` | Σ `lineTotal` |
| Desconto cupom | ver [05-cupons.md](./05-cupons.md); limitado ao subtotal |
| Frete | cotação; `0` se frete grátis (cupom ou regra) |
| `total` | `subtotal − discount + shipping + tax` (`tax` = 0 por enquanto) |
| Elegível brindes | `subtotal − couponDiscount` (**sem frete**) |

---

## Headers úteis

| Header | Uso |
|--------|-----|
| `Authorization: Bearer …` | Auth |
| `X-Cart-Id: …` | Carrinho guest |
| `Accept: application/json` | Sempre |
| `Content-Type: application/json` | Bodies JSON |
| `Idempotency-Key: …` | Criação de pedido/pagamento (recomendado) |

---

## Ambiente frontend

```env
NEXT_PUBLIC_DATA_SOURCE=api
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

O prefixo `/v1` pode ficar no Laravel (`Route::prefix('v1')`) ou na URL base.
