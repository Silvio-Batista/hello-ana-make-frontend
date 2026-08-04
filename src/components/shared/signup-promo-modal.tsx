"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Copy, Gift } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const signupSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z
    .string()
    .min(1, "Informe seu e-mail")
    .email("E-mail inválido"),
  acceptTerms: z.boolean().refine((value) => value === true, {
    message: "Aceite os termos para continuar",
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export interface SignupPromoModalProps {
  open: boolean;
  onClose: () => void;
  couponCode?: string;
  discountPercent?: number;
  onSubmit?: (data: { name: string; email: string }) => Promise<void> | void;
  className?: string;
}

export function SignupPromoModal({
  open,
  onClose,
  couponCode = "BEMVINDA10",
  discountPercent = 10,
  onSubmit,
  className,
}: SignupPromoModalProps) {
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      acceptTerms: false,
    },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit?.({ name: values.name, email: values.email });
    setSuccess(true);
  });

  const handleClose = () => {
    onClose();
    window.setTimeout(() => {
      setSuccess(false);
      setCopied(false);
      reset();
    }, 200);
  };

  const copyCoupon = async () => {
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={success ? "Cupom liberado!" : `Ganhe ${discountPercent}% OFF`}
      description={
        success
          ? "Use o cupom abaixo na sua primeira compra."
          : "Cadastre-se e receba um desconto exclusivo na primeira compra."
      }
      className={cn(className)}
    >
      {success ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-success/10 text-success">
            <Gift className="size-6" aria-hidden />
          </div>
          <div className="flex w-full items-center gap-2 rounded-xl border border-dashed border-primary bg-primary-light/50 px-4 py-3">
            <code className="flex-1 text-lg font-semibold tracking-widest text-primary-dark">
              {couponCode}
            </code>
            <Button
              type="button"
              variant="soft"
              size="sm"
              onClick={copyCoupon}
              leftIcon={
                copied ? (
                  <Check className="size-4" aria-hidden />
                ) : (
                  <Copy className="size-4" aria-hidden />
                )
              }
            >
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>
          <Button variant="primary" className="w-full" onClick={handleClose}>
            Continuar comprando
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Nome"
            placeholder="Como podemos te chamar?"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="E-mail"
            type="email"
            placeholder="voce@email.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Checkbox
            label="Aceito receber novidades e ofertas por e-mail"
            error={errors.acceptTerms?.message}
            {...register("acceptTerms")}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Quero meu desconto
          </Button>
        </form>
      )}
    </Modal>
  );
}
