"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail")
    .email("E-mail inválido"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export interface NewsletterFormProps {
  onSubmit?: (email: string) => Promise<void> | void;
  className?: string;
  buttonLabel?: string;
}

export function NewsletterForm({
  onSubmit,
  className,
  buttonLabel = "Assinar",
}: NewsletterFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit?.(values.email);
    reset();
  });

  return (
    <form
      onSubmit={submit}
      className={cn("flex w-full flex-col gap-3 sm:flex-row sm:items-start", className)}
      noValidate
    >
      <div className="flex-1">
        <Input
          type="email"
          placeholder="Seu melhor e-mail"
          autoComplete="email"
          leftAddon={<Mail className="size-4" aria-hidden />}
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <Button type="submit" loading={isSubmitting} className="sm:mt-0 sm:shrink-0">
        {buttonLabel}
      </Button>
      {isSubmitSuccessful && !errors.email ? (
        <p className="sr-only" role="status">
          Inscrição realizada com sucesso
        </p>
      ) : null}
    </form>
  );
}
