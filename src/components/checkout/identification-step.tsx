"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Checkbox, Input } from "@/components/ui";
import { useAuth } from "@/hooks";
import { useCheckoutStore } from "@/stores";

export function IdentificationStep() {
  const { isAuthenticated, user, login } = useAuth();
  const identification = useCheckoutStore((s) => s.identification);
  const setIdentification = useCheckoutStore((s) => s.setIdentification);
  const nextStep = useCheckoutStore((s) => s.nextStep);

  const [mode, setMode] = useState<"guest" | "login">(
    isAuthenticated ? "login" : "guest",
  );
  const [email, setEmail] = useState(
    identification.email || user?.email || "",
  );
  const [name, setName] = useState(identification.name || user?.name || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const continueAsGuest = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !name.trim()) {
      setError("Informe nome e e-mail para continuar.");
      return;
    }
    setIdentification({
      email: email.trim(),
      name: name.trim(),
      isGuest: true,
    });
    nextStep();
  };

  const continueWithLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (isAuthenticated && user) {
      setIdentification({
        email: user.email,
        name: user.name,
        isGuest: false,
      });
      nextStep();
      return;
    }

    try {
      const session = await login.mutateAsync({
        email: email.trim(),
        password,
        rememberMe,
      });
      setIdentification({
        email: session.user.email,
        name: session.user.name,
        isGuest: false,
      });
      nextStep();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível entrar.",
      );
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Identificação
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Você está conectada como{" "}
          <span className="font-medium text-text-primary">{user.name}</span> (
          {user.email}).
        </p>
        <Button
          className="mt-6"
          onClick={() => {
            setIdentification({
              email: user.email,
              name: user.name,
              isGuest: false,
            });
            nextStep();
          }}
        >
          Continuar
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold text-text-primary">
        Identificação
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        Entre na sua conta ou continue como convidada.
      </p>

      <div className="mt-5 flex gap-2 rounded-xl bg-surface p-1">
        <button
          type="button"
          onClick={() => {
            setMode("guest");
            setError(null);
          }}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "guest"
              ? "bg-white text-text-primary shadow-sm"
              : "text-text-secondary"
          }`}
        >
          Convidada
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "login"
              ? "bg-white text-text-primary shadow-sm"
              : "text-text-secondary"
          }`}
        >
          Entrar
        </button>
      </div>

      {mode === "guest" ? (
        <form onSubmit={continueAsGuest} className="mt-5 flex flex-col gap-4">
          <Input
            label="Nome completo"
            name="guest-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
          <Input
            label="E-mail"
            name="guest-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit">Continuar como convidada</Button>
          <p className="text-center text-xs text-text-secondary">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-medium text-primary hover:underline">
              Cadastre-se e ganhe 10% OFF
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={continueWithLogin} className="mt-5 flex flex-col gap-4">
          <Input
            label="E-mail"
            name="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Senha"
            name="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Checkbox
            name="remember"
            label="Manter conectada"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" loading={login.isPending}>
            Entrar e continuar
          </Button>
          <p className="text-center text-xs text-text-secondary">
            Demo: ana.silva@email.com / helloana123 ·{" "}
            <Link
              href="/recuperar-senha"
              className="font-medium text-primary hover:underline"
            >
              Esqueci a senha
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
