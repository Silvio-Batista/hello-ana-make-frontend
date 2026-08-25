"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui";
import { adminRepository } from "@/lib/container";
import { useAuthStore } from "@/stores";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);

  /**
   * O backend real não devolve `role` no usuário — só os dados mock têm esse campo.
   * Quando `role` está ausente, a única forma de confirmar acesso admin é testar
   * uma rota admin-only e observar se ela responde ou dá 401/403.
   */
  const roleKnown = user?.role !== undefined;
  const needsProbe = hasHydrated && isAuthenticated && !roleKnown;

  const probe = useQuery({
    queryKey: ["admin-guard-probe"],
    queryFn: () => adminRepository.getDashboardStats(),
    enabled: needsProbe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const isAdmin =
    isAuthenticated && (user?.role === "admin" || (!roleKnown && probe.isSuccess));

  const denied =
    hasHydrated &&
    isAuthenticated &&
    ((roleKnown && user?.role !== "admin") || (!roleKnown && probe.isError));

  useEffect(() => {
    if (!hasHydrated) return;
    if (denied) {
      logoutStore();
      router.replace("/admin/login");
      return;
    }
    if (!isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [hasHydrated, isAuthenticated, denied, router, logoutStore]);

  const stillProbing = needsProbe && probe.isLoading;

  if (!hasHydrated || stillProbing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2D2027]">
        <Spinner label="Carregando painel" className="text-white" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2D2027]">
        <p className="text-sm text-white/70">Redirecionando para o login…</p>
      </div>
    );
  }

  return <>{children}</>;
}
