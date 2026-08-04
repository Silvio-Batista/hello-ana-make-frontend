"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
} from "@/contracts";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export const authKeys = {
  all: ["auth"] as const,
  signupPromotion: () => [...authKeys.all, "signup-promotion"] as const,
  currentUser: () => [...authKeys.all, "current-user"] as const,
};

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const setSession = useAuthStore((s) => s.setSession);
  const logoutStore = useAuthStore((s) => s.logout);

  const loginMutation = useMutation({
    mutationFn: (request: LoginRequest) => authService.login(request),
    onSuccess: (sessionResult) => {
      setSession(sessionResult);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (request: RegisterRequest) => authService.register(request),
    onSuccess: (sessionResult) => {
      setSession(sessionResult);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logoutStore();
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (request: ForgotPasswordRequest) =>
      authService.forgotPassword(request),
  });

  return {
    user,
    session,
    isAuthenticated,
    hasHydrated,
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    forgotPassword: forgotPasswordMutation,
  };
}

export function useSignupPromotion() {
  return useQuery({
    queryKey: authKeys.signupPromotion(),
    queryFn: () => authService.getSignupPromotion(),
    staleTime: 10 * 60 * 1000,
  });
}
