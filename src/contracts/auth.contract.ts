/**
 * Usuário autenticado da loja.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  document?: string;
  avatarUrl?: string;
  birthDate?: string;
  /** Não retornado pelo backend real hoje; populado apenas pelos dados mock. */
  role?: "customer" | "admin";
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Sessão de autenticação.
 */
export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

/**
 * Credenciais de login.
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Dados de cadastro.
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  document?: string;
  birthDate?: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
  /** Código promocional de indicação / boas-vindas. */
  referralCode?: string;
}

/**
 * Solicitação de recuperação de senha.
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Resposta de promoção/benefício ao se cadastrar.
 */
export interface SignupPromotionResponse {
  success: boolean;
  message: string;
  couponCode?: string;
  discountPercentage?: number;
  discountAmount?: number;
  pointsBonus?: number;
  expiresAt?: string;
}
