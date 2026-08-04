"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AccountNav } from "@/components/account";
import { StoreShell } from "@/components/layout";
import { Button, Container, Spinner } from "@/components/ui";
import { useAuth } from "@/hooks";

export default function ContaLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, hasHydrated, user, logout } = useAuth();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/login?redirect=/conta");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return (
      <StoreShell>
        <div className="flex justify-center py-24">
          <Spinner label="Carregando conta" />
        </div>
      </StoreShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <StoreShell>
        <Container className="py-16 text-center">
          <p className="text-sm text-text-secondary">
            Redirecionando para o login…
          </p>
          <Link href="/login?redirect=/conta" className="mt-4 inline-block">
            <Button variant="outline">Ir para login</Button>
          </Link>
        </Container>
      </StoreShell>
    );
  }

  return (
    <StoreShell>
      <Container className="py-8 md:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
              Olá, {user?.name.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              void logout.mutateAsync().then(() => router.push("/"));
            }}
            loading={logout.isPending}
          >
            Sair
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-white p-2">
              <AccountNav />
            </div>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </StoreShell>
  );
}
