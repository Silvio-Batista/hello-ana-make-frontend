"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui";
import { useAuthStore } from "@/stores";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const isAdmin = isAuthenticated && user?.role === "admin";

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAdmin) {
      router.replace("/admin/login");
    }
  }, [hasHydrated, isAdmin, router]);

  if (!hasHydrated) {
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
