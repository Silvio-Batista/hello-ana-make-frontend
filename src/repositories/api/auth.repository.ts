import type {
  AuthSession,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  SignupPromotionResponse,
  User,
} from "@/contracts";
import type { AuthRepository } from "@/repositories/interfaces";
import { apiGet, apiPatch, apiPost, ApiError } from "@/lib/http-client";
import { useAuthStore } from "@/stores/auth.store";

interface RawSignupPromotion {
  success: boolean;
  message: string;
  couponCode?: string;
  discountPercentage?: number;
}

export class ApiAuthRepository implements AuthRepository {
  login(request: LoginRequest): Promise<AuthSession> {
    return apiPost<AuthSession>("/auth/login", request, { auth: false });
  }

  register(request: RegisterRequest): Promise<AuthSession> {
    const { email, password, name, phone, document, birthDate, acceptTerms, acceptMarketing } =
      request;
    return apiPost<AuthSession>(
      "/auth/register",
      { email, password, name, phone, document, birthDate, acceptTerms, acceptMarketing },
      { auth: false },
    );
  }

  async logout(): Promise<void> {
    await apiPost<void>("/auth/logout");
  }

  refreshSession(refreshToken: string): Promise<AuthSession> {
    return apiPost<AuthSession>("/auth/refresh", { refreshToken }, { auth: false });
  }

  async getCurrentUser(): Promise<User | null> {
    if (!useAuthStore.getState().session?.accessToken) return null;
    try {
      return await apiGet<User>("/auth/me");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return null;
      throw err;
    }
  }

  updateProfile(
    data: Partial<Pick<User, "name" | "phone" | "document" | "avatarUrl" | "birthDate">>,
  ): Promise<User> {
    return apiPatch<User>("/auth/me", data);
  }

  forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }> {
    return apiPost<{ message: string }>("/auth/forgot-password", request, { auth: false });
  }

  resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiPost<{ message: string }>(
      "/auth/reset-password",
      { token, password: newPassword, passwordConfirmation: newPassword },
      { auth: false },
    );
  }

  async getSignupPromotion(): Promise<SignupPromotionResponse | null> {
    const response = await apiGet<RawSignupPromotion>("/auth/signup-promotion", undefined, {
      auth: false,
    });
    return response.success ? response : null;
  }
}
