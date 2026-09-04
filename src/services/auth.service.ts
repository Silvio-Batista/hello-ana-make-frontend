import type {
  AuthSession,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  SignupPromotionResponse,
} from "@/contracts";
import { authRepository } from "@/lib/container";

export const authService = {
  login(request: LoginRequest): Promise<AuthSession> {
    return authRepository.login(request);
  },

  register(request: RegisterRequest): Promise<AuthSession> {
    return authRepository.register(request);
  },

  logout(): Promise<void> {
    return authRepository.logout();
  },

  forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }> {
    return authRepository.forgotPassword(request);
  },

  resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return authRepository.resetPassword(token, newPassword);
  },

  getSignupPromotion(): Promise<SignupPromotionResponse | null> {
    return authRepository.getSignupPromotion();
  },

  getCurrentUser() {
    return authRepository.getCurrentUser();
  },

  refreshSession(refreshToken: string): Promise<AuthSession> {
    return authRepository.refreshSession(refreshToken);
  },
};
