import type {
  AuthSession,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  SignupPromotionResponse,
  User,
} from "@/contracts";
import type { AuthRepository } from "@/repositories/interfaces";
import {
  mockPasswords,
  setCurrentUserId,
  users as seedUsers,
} from "@/mocks";
import { delay } from "@/repositories/utils";

let userStore: User[] = [...seedUsers];
const passwordStore: Record<string, string> = { ...mockPasswords };
let accessToken: string | null = "mock-token-user-001";
let refreshTokenStore: string | null = "mock-refresh-user-001";

function buildSession(user: User): AuthSession {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  accessToken = `mock-token-${user.id}`;
  refreshTokenStore = `mock-refresh-${user.id}`;
  setCurrentUserId(user.id);
  return {
    user,
    accessToken,
    refreshToken: refreshTokenStore,
    expiresAt,
  };
}

export class MockAuthRepository implements AuthRepository {
  async login(request: LoginRequest): Promise<AuthSession> {
    await delay();
    const email = request.email.trim().toLowerCase();
    const user = userStore.find((u) => u.email.toLowerCase() === email);
    const expected = passwordStore[email];
    if (!user || !expected || expected !== request.password) {
      throw new Error("E-mail ou senha inválidos.");
    }
    return buildSession(user);
  }

  async register(request: RegisterRequest): Promise<AuthSession> {
    await delay();
    if (!request.acceptTerms) {
      throw new Error("É necessário aceitar os termos de uso.");
    }
    const email = request.email.trim().toLowerCase();
    if (userStore.some((u) => u.email.toLowerCase() === email)) {
      throw new Error("E-mail já cadastrado.");
    }

    const now = new Date().toISOString();
    const user: User = {
      id: `user-${String(userStore.length + 1).padStart(3, "0")}`,
      name: request.name,
      email,
      phone: request.phone,
      document: request.document,
      birthDate: request.birthDate,
      role: "customer",
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    userStore = [...userStore, user];
    passwordStore[email] = request.password;
    return buildSession(user);
  }

  async logout(): Promise<void> {
    await delay();
    accessToken = null;
    refreshTokenStore = null;
    setCurrentUserId(null);
  }

  async refreshSession(refreshToken: string): Promise<AuthSession> {
    await delay();
    const userId = refreshToken.replace("mock-refresh-", "");
    const user = userStore.find((u) => u.id === userId);
    if (!user || refreshToken !== `mock-refresh-${user.id}`) {
      throw new Error("Sessão inválida.");
    }
    return buildSession(user);
  }

  async getCurrentUser(): Promise<User | null> {
    await delay();
    if (!accessToken) return null;
    const userId = accessToken.replace("mock-token-", "");
    return userStore.find((u) => u.id === userId) ?? null;
  }

  async updateProfile(
    data: Partial<
      Pick<User, "name" | "phone" | "document" | "avatarUrl" | "birthDate">
    >,
  ): Promise<User> {
    await delay();
    const current = await this.getCurrentUser();
    if (!current) throw new Error("Usuário não autenticado.");
    const updated: User = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    userStore = userStore.map((u) => (u.id === current.id ? updated : u));
    return updated;
  }

  async forgotPassword(
    request: ForgotPasswordRequest,
  ): Promise<{ message: string }> {
    await delay();
    void request.email;
    return {
      message:
        "Se o e-mail existir, enviaremos um link de recuperação.",
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    await delay();
    if (!token || newPassword.length < 6) {
      throw new Error("Token ou senha inválidos.");
    }
    return { message: "Senha redefinida com sucesso." };
  }

  async getSignupPromotion(): Promise<SignupPromotionResponse | null> {
    await delay();
    return {
      success: true,
      message: "Cadastre-se e ganhe 10% de desconto na primeira compra.",
      couponCode: "BEMVINDA10",
      discountPercentage: 10,
      expiresAt: "2027-12-31T23:59:59.000Z",
    };
  }
}
