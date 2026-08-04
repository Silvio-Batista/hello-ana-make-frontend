"use client";

import { useState, type FormEvent } from "react";
import { CreditCard, FileText, QrCode } from "lucide-react";
import type { PaymentMethod } from "@/contracts";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useCheckoutStore } from "@/stores";

const METHODS: {
  id: Extract<PaymentMethod, "pix" | "credit_card" | "boleto">;
  label: string;
  description: string;
  icon: typeof QrCode;
}[] = [
  {
    id: "pix",
    label: "PIX",
    description: "Aprovação imediata",
    icon: QrCode,
  },
  {
    id: "credit_card",
    label: "Cartão de crédito",
    description: "Em até 6x sem juros",
    icon: CreditCard,
  },
  {
    id: "boleto",
    label: "Boleto bancário",
    description: "Vencimento em 3 dias úteis",
    icon: FileText,
  },
];

export interface PaymentStepProps {
  onSubmitOrder: () => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
}

export function PaymentStep({
  onSubmitOrder,
  isSubmitting,
  submitError,
}: PaymentStepProps) {
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const notes = useCheckoutStore((s) => s.notes);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const setNotes = useCheckoutStore((s) => s.setNotes);
  const prevStep = useCheckoutStore((s) => s.prevStep);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState("1");
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    if (!paymentMethod) {
      setLocalError("Selecione uma forma de pagamento.");
      return;
    }

    if (paymentMethod === "credit_card") {
      if (
        !cardName.trim() ||
        cardNumber.replace(/\D/g, "").length < 13 ||
        !cardExpiry.trim() ||
        cardCvv.length < 3
      ) {
        setLocalError("Preencha os dados do cartão.");
        return;
      }
    }

    await onSubmitOrder();
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold text-text-primary">
        Pagamento
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        Escolha como deseja pagar.
      </p>

      <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {METHODS.map((method) => {
            const Icon = method.icon;
            const selected = paymentMethod === method.id;
            return (
              <li key={method.id}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary-light/40"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-text-primary">
                      {method.label}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {method.description}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {paymentMethod === "credit_card" ? (
          <div className="grid gap-4 rounded-xl border border-border bg-surface/50 p-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Nome no cartão"
                name="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                autoComplete="cc-name"
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Número do cartão"
                name="cardNumber"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 16)
                      .replace(/(\d{4})(?=\d)/g, "$1 "),
                  )
                }
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="0000 0000 0000 0000"
              />
            </div>
            <Input
              label="Validade"
              name="cardExpiry"
              value={cardExpiry}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                setCardExpiry(
                  digits.length > 2
                    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                    : digits,
                );
              }}
              placeholder="MM/AA"
              autoComplete="cc-exp"
            />
            <Input
              label="CVV"
              name="cardCvv"
              value={cardCvv}
              onChange={(e) =>
                setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              inputMode="numeric"
              autoComplete="cc-csc"
            />
            <div className="sm:col-span-2">
              <Select
                label="Parcelas"
                name="installments"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                options={[1, 2, 3, 4, 5, 6].map((n) => ({
                  value: String(n),
                  label: n === 1 ? "1x sem juros" : `${n}x sem juros`,
                }))}
              />
            </div>
            <p className="sm:col-span-2 text-xs text-text-secondary">
              Em ambiente de demonstração os dados do cartão não são enviados a
              um gateway real.
            </p>
          </div>
        ) : null}

        {paymentMethod === "pix" ? (
          <p className="rounded-xl bg-surface px-4 py-3 text-sm text-text-secondary">
            Após confirmar o pedido, você verá o QR Code PIX para pagamento.
          </p>
        ) : null}

        {paymentMethod === "boleto" ? (
          <p className="rounded-xl bg-surface px-4 py-3 text-sm text-text-secondary">
            O boleto será gerado após a confirmação e enviado por e-mail.
          </p>
        ) : null}

        <Textarea
          label="Observações (opcional)"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Ex.: deixar com o porteiro"
        />

        {localError || submitError ? (
          <p className="text-sm text-error" role="alert">
            {localError ?? submitError}
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={prevStep}>
            Voltar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Finalizar pedido
          </Button>
        </div>
      </form>
    </div>
  );
}
