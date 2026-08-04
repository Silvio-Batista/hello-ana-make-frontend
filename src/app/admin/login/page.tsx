"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores";

export default function AdminLoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("admin@helloana.make");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const session = await authService.login({
        email: email.trim(),
        password,
        rememberMe: true,
      });

      if (session.user.role !== "admin") {
        setError("Acesso restrito a administradores");
        return;
      }

      setSession(session);
      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível entrar.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2D2027] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Hello Ana Make"
            width={56}
            height={56}
            className="rounded-xl object-contain"
          />
          <h1 className="mt-4 text-xl font-semibold text-text-primary">
            Admin Hello Ana Make
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Acesse o painel administrativo
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
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
          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" loading={loading} className="w-full">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-text-secondary">
          Demo: admin@helloana.make / admin123
        </p>
      </div>
    </div>
  );
}
