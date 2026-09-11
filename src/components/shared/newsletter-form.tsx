"use client";

import { useState } from "react";
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
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  // Feedback de verdade: só mostra sucesso se o onSubmit realmente resolver — antes
  // disso, o formulário "confirmava" a inscrição mesmo sem onSubmit nenhum (nem chamada
  // de API), então parecia funcionar mas não salvava o e-mail em lugar nenhum.
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const submit = handleSubmit(async (values) => {
    setFeedback(null);
    try {
      await onSubmit?.(values.email);
      setFeedback({ type: "success", message: "Inscrição confirmada!" });
      reset();
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Não foi possível confirmar a inscrição.",
      });
    }
  });

  return (
    <form onSubmit={submit} className={cn("flex w-full flex-col gap-2", className)} noValidate>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start">
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
      </div>
      {feedback ? (
        <p
          role="status"
          className={cn(
            "text-sm",
            feedback.type === "success" ? "text-success" : "text-error",
          )}
        >
          {feedback.message}
        </p>
      ) : null}
    </form>
  );
}
