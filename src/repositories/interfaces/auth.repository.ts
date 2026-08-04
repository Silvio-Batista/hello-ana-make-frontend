import type {
  AuthSession,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  SignupPromotionResponse,
  User,
} from "@/contracts";

/**
 * Repositório de autenticação e perfil.
 */
export interface AuthRepository {
  login(request: LoginRequest): Promise<AuthSession>;
  register(request: RegisterRequest): Promise<AuthSession>;
  logout(): Promise<void>;
  refreshSession(refreshToken: string): Promise<AuthSession>;
  getCurrentUser(): Promise<User | null>;
  updateProfile(data: Partial<Pick<User, "name" | "phone" | "document" | "avatarUrl" | "birthDate">>): Promise<User>;
  forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }>;
  resetPassword(token: string, newPassword: string): Promise<{ message: string }>;
  getSignupPromotion(): Promise<SignupPromotionResponse | null>;
}
