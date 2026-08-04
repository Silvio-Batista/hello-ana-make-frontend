"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Input } from "@/components/ui";
import { useAuth } from "@/hooks";
import { authRepository } from "@/lib/container";
import { useAuthStore } from "@/stores";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const setSession = useAuthStore((s) => s.setSession);
  const session = useAuthStore((s) => s.session);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [marketing, setMarketing] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
  }, [user]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const updated = await authRepository.updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      if (session) {
        setSession({ ...session, user: updated });
      }
      setMessage("Dados atualizados com sucesso.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível salvar.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">
        Configurações
      </h2>
      <p className="mb-6 text-sm text-text-secondary">
        Atualize seus dados pessoais e preferências.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Nome"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="E-mail"
          name="email"
          value={user?.email ?? ""}
          disabled
          hint="O e-mail não pode ser alterado por aqui."
        />
        <Input
          label="Telefone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Checkbox
          name="marketing"
          label="Receber novidades e ofertas por e-mail"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
        />
        {message ? (
          <p className="text-sm text-success" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" loading={saving}>
          Salvar alterações
        </Button>
      </form>

      <div className="mt-10 border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-text-primary">Sessão</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Encerrar sessão neste dispositivo.
        </p>
        <Button
          className="mt-3"
          variant="outline"
          loading={logout.isPending}
          onClick={() => {
            void logout.mutateAsync().then(() => router.push("/"));
          }}
        >
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
