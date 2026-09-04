"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Spinner } from "@/components/ui";
import { useAuth } from "@/hooks";

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const result = await resetPassword.mutateAsync({
        token,
        newPassword: password,
      });
      setSuccess(result.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível redefinir a senha.",
      );
    }
  };

  if (!token) {
    return (
      <>
        <h1 className="font-display text-2xl font-semibold text-text-primary">
          Link inválido
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Este link de redefinição de senha é inválido ou expirou. Solicite um
          novo link.
        </p>
        <p className="mt-6 text-center text-sm text-text-secondary">
          <Link
            href="/recuperar-senha"
            className="font-medium text-primary hover:underline"
          >
            Solicitar novo link
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-text-primary">
        Redefinir senha
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Escolha uma nova senha para sua conta.
      </p>

      {success ? (
        <div className="mt-6 rounded-xl border border-success/30 bg-success/5 p-4 text-sm text-success">
          {success} Redirecionando para o login...
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            label="Nova senha"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirmar nova senha"
            name="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            autoComplete="new-password"
            required
          />
          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            loading={resetPassword.isPending}
            className="w-full"
          >
            Redefinir senha
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Voltar ao login
        </Link>
      </p>
    </>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-10">
          <Spinner label="Carregando" />
        </div>
      }
    >
      <RedefinirSenhaForm />
    </Suspense>
  );
}
