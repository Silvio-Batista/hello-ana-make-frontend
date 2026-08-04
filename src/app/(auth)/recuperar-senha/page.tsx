"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/hooks";

export default function RecuperarSenhaPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const result = await forgotPassword.mutateAsync({
        email: email.trim(),
      });
      setSuccess(result.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar o e-mail.",
      );
    }
  };

  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-text-primary">
        Recuperar senha
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Informe seu e-mail e enviaremos um link para redefinir a senha.
      </p>

      {success ? (
        <div className="mt-6 rounded-xl border border-success/30 bg-success/5 p-4 text-sm text-success">
          {success}
        </div>
      ) : (
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
          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            loading={forgotPassword.isPending}
            className="w-full"
          >
            Enviar link
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
