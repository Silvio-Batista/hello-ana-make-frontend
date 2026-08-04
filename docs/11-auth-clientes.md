# 11 — Auth e clientes

Contrato: `src/contracts/auth.contract.ts`

---

## Lógica de negócio

### Papéis

- `customer` — loja
- `admin` — painel (mesmo User model com `role`, ou guard separado)

### Cadastro (`register`)

- Campos obrigatórios: `name`, `email`, `password`, `acceptTerms=true`.
- Opcionais: `phone`, `document` (CPF), `birthDate`, `acceptMarketing`, `referralCode`.
- E-mail único (case-insensitive).
- Senha mínima 6 caracteres (alinhar ao mock; reforçar para 8+ em produção).
- `emailVerified=false` até confirmação (fluxo opcional fase 1).
- Após registro bem-sucedido: emitir `AuthSession` (login automático).

### Promoção de signup — 10% OFF primeira compra

- Endpoint público `GET /auth/signup-promotion` retorna oferta:
  - `couponCode`: `BEMVINDA10` (ou código único gerado por usuário)
  - `discountPercentage`: 10
- No cadastro, **atribuir/gerar** o cupom para o usuário (carteira).
- Política recomendada:
  - **Opção A (mock atual):** código compartilhado `BEMVINDA10` + regra `firstPurchaseOnly`.
  - **Opção B (melhor):** gerar código único `BV10-{userId curto}` com `perUserLimit=1`.
- Modal da loja usa essa resposta para copy comercial.

### Login

- E-mail + senha; `rememberMe` estende TTL do refresh.
- Credenciais inválidas → mensagem genérica (não revelar qual campo).

### Tokens

- `accessToken` curto (ex.: 15–60 min)
- `refreshToken` longo (ex.: 7–30 dias)
- `POST /auth/refresh` rotaciona tokens
- Logout invalida refresh (deny-list / family)

### Recuperação de senha

- `forgot-password`: sempre resposta genérica de sucesso (anti-enumeration).
- `reset-password`: token + nova senha.

### Perfil

- Cliente atualiza `name`, `phone`, `document`, `avatarUrl`, `birthDate`.
- E-mail: alteração com re-verificação (fase 2).

### Casos extremos

- Registro sem `acceptTerms` → `422`.
- Refresh inválido → `401`.
- Conta admin não deve usar rotas de “meus pedidos” misturadas sem cuidado — ok se `userId` próprio.

---

## Modelos

```ts
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  document?: string;
  avatarUrl?: string;
  birthDate?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  document?: string;
  birthDate?: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
  referralCode?: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface SignupPromotionResponse {
  success: boolean;
  message: string;
  couponCode?: string;
  discountPercentage?: number;
  discountAmount?: number;
  pointsBonus?: number;
  expiresAt?: string;
}
```

---

## Endpoints API

### `POST /api/v1/auth/register`

**Auth:** público  

**Body:**

```json
{
  "name": "Ana Silva",
  "email": "ana.silva@email.com",
  "password": "helloana123",
  "phone": "11999990000",
  "document": "12345678901",
  "birthDate": "1995-05-20",
  "acceptTerms": true,
  "acceptMarketing": true
}
```

**Sucesso `201`:** `AuthSession`  

**Erros:**

```json
{
  "message": "E-mail já cadastrado.",
  "code": "CONFLICT",
  "errors": { "email": ["E-mail já cadastrado."] }
}
```

```json
{
  "message": "É necessário aceitar os termos de uso.",
  "code": "VALIDATION_ERROR",
  "errors": { "acceptTerms": ["Aceite os termos para continuar."] }
}
```

---

### `POST /api/v1/auth/login`

**Auth:** público  

**Body:**

```json
{
  "email": "ana.silva@email.com",
  "password": "helloana123",
  "rememberMe": true
}
```

**Sucesso `200`:** `AuthSession`  

**Erros:** `401`

```json
{
  "message": "E-mail ou senha inválidos.",
  "code": "INVALID_CREDENTIALS",
  "errors": {}
}
```

---

### `POST /api/v1/auth/logout`

**Auth:** cliente  

**Body (opcional):**

```json
{ "refreshToken": "def50200…" }
```

**Sucesso `204`**

---

### `POST /api/v1/auth/refresh`

**Auth:** público (com refresh token)

**Body:**

```json
{ "refreshToken": "def50200…" }
```

**Sucesso `200`:** `AuthSession`  
**Erros:** `401` `UNAUTHENTICATED`

---

### `GET /api/v1/auth/me`

**Auth:** cliente  
**Sucesso `200`:** `User`  
**Erros:** `401`

---

### `PATCH /api/v1/auth/me`

**Auth:** cliente  

**Body:**

```json
{
  "name": "Ana S. Oliveira",
  "phone": "11988887777",
  "birthDate": "1995-05-20"
}
```

**Sucesso `200`:** `User`

---

### `POST /api/v1/auth/forgot-password`

**Auth:** público  

**Body:**

```json
{ "email": "ana.silva@email.com" }
```

**Sucesso `200`:**

```json
{
  "message": "Se o e-mail existir, enviaremos um link de recuperação."
}
```

---

### `POST /api/v1/auth/reset-password`

**Auth:** público  

**Body:**

```json
{
  "token": "reset-token-xyz",
  "password": "novaSenha123",
  "passwordConfirmation": "novaSenha123"
}
```

**Sucesso `200`:**

```json
{ "message": "Senha redefinida com sucesso." }
```

**Erros:** `422` token/senha inválidos.

---

### `GET /api/v1/auth/signup-promotion`

**Auth:** público  

**Sucesso `200`:**

```json
{
  "success": true,
  "message": "Cadastre-se e ganhe 10% de desconto na primeira compra.",
  "couponCode": "BEMVINDA10",
  "discountPercentage": 10,
  "expiresAt": "2027-12-31T23:59:59.000Z"
}
```

Se promoção desligada: `200` com `null` body ou `{ "success": false, "message": "…" }`.
