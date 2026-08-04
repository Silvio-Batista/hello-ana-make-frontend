"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Input } from "@/components/ui";
import { useAuth, useSignupPromotion } from "@/hooks";

export default function CadastroPage() {
  const router = useRouter();
  const { register } = useAuth();
  const promo = useSignupPromotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const discount =
    promo.data?.discountPercentage ?? 10;
  const couponCode = promo.data?.couponCode ?? "BEMVINDA10";

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!acceptTerms) {
      setError("Aceite os termos para continuar.");
      return;
    }
    try {
      await register.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        acceptTerms,
        acceptMarketing,
        referralCode: couponCode,
      });
      router.push("/conta");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível criar a conta.",
      );
    }
  };

  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-text-primary">
        Criar conta
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Cadastre-se e ganhe{" "}
        <span className="font-semibold text-primary">{discount}% OFF</span> na
        primeira compra com o cupom{" "}
        <span className="font-semibold text-text-primary">{couponCode}</span>.
      </p>

      <div className="mt-4 rounded-xl border border-primary/20 bg-primary-light/50 px-3 py-2.5 text-xs text-primary-dark">
        {promo.data?.message ??
          "Cadastre-se e ganhe 10% de desconto na primeira compra."}
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <Input
          label="Nome completo"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
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
          label="Telefone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          placeholder="(11) 99999-9999"
        />
        <Input
          label="Senha"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          hint="Mínimo de 6 caracteres"
          required
          minLength={6}
        />
        <Checkbox
          name="acceptTerms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          label="Aceito os termos de uso e a política de privacidade"
        />
        <Checkbox
          name="acceptMarketing"
          checked={acceptMarketing}
          onChange={(e) => setAcceptMarketing(e.target.checked)}
          label="Quero receber novidades e ofertas por e-mail"
        />
        {error ? (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" loading={register.isPending} className="w-full">
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}
