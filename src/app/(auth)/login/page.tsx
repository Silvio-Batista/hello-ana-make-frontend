"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Checkbox, Input, Spinner } from "@/components/ui";
import { useAuth } from "@/hooks";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/conta";
  const { login, isAuthenticated, hasHydrated } = useAuth();

  const [email, setEmail] = useState("ana.silva@email.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [hasHydrated, isAuthenticated, redirectTo, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await login.mutateAsync({
        email: email.trim(),
        password,
        rememberMe,
      });
      router.push(redirectTo);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível entrar.",
      );
    }
  };

  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-text-primary">
        Entrar
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Acesse sua conta Hello Ana Make
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          label="Senha"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <div className="flex items-center justify-between gap-3">
          <Checkbox
            name="remember"
            label="Manter conectada"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link
            href="/recuperar-senha"
            className="text-xs font-medium text-primary hover:underline"
          >
            Esqueci a senha
          </Link>
        </div>
        {error ? (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" loading={login.isPending} className="w-full">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
      <p className="mt-3 text-center text-xs text-text-secondary">
        Demo: ana.silva@email.com / helloana123
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-10">
          <Spinner label="Carregando" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
