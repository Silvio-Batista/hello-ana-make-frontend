import type {
  AuthSession,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  SignupPromotionResponse,
  User,
} from "@/contracts";
import type { AuthRepository } from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiAuthRepository implements AuthRepository {
  login(_request: LoginRequest): Promise<AuthSession> {
    return notImplemented("ApiAuthRepository.login");
  }

  register(_request: RegisterRequest): Promise<AuthSession> {
    return notImplemented("ApiAuthRepository.register");
  }

  logout(): Promise<void> {
    return notImplemented("ApiAuthRepository.logout");
  }

  refreshSession(_refreshToken: string): Promise<AuthSession> {
    return notImplemented("ApiAuthRepository.refreshSession");
  }

  getCurrentUser(): Promise<User | null> {
    return notImplemented("ApiAuthRepository.getCurrentUser");
  }

  updateProfile(
    _data: Partial<
      Pick<User, "name" | "phone" | "document" | "avatarUrl" | "birthDate">
    >,
  ): Promise<User> {
    return notImplemented("ApiAuthRepository.updateProfile");
  }

  forgotPassword(
    _request: ForgotPasswordRequest,
  ): Promise<{ message: string }> {
    return notImplemented("ApiAuthRepository.forgotPassword");
  }

  resetPassword(
    _token: string,
    _newPassword: string,
  ): Promise<{ message: string }> {
    return notImplemented("ApiAuthRepository.resetPassword");
  }

  getSignupPromotion(): Promise<SignupPromotionResponse | null> {
    return notImplemented("ApiAuthRepository.getSignupPromotion");
  }
}
