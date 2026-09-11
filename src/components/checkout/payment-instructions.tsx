"use client";

import { useState } from "react";
import { Check, Copy, FileText } from "lucide-react";
import type { CreatePaymentResponse } from "@/contracts";
import { cn } from "@/lib/utils";

export interface PaymentInstructionsProps {
  payment: CreatePaymentResponse;
  className?: string;
}

function formatExpiry(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard bloqueado (http, permissão) — o código continua visível pra copiar na mão.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
    >
      {copied ? (
        <>
          <Check className="size-4" aria-hidden />
          Copiado
        </>
      ) : (
        <>
          <Copy className="size-4" aria-hidden />
          Copiar código
        </>
      )}
    </button>
  );
}

/**
 * Renderiza o "como pagar" de uma cobrança PIX/boleto ainda não paga (QR code,
 * copia-e-cola, linha digitável, link do boleto). Compartilhado entre a tela de
 * confirmação do checkout e o painel de pagamento pendente do pedido.
 */
export function PaymentInstructions({ payment, className }: PaymentInstructionsProps) {
  if (payment.status === "paid") return null;

  if (payment.method === "pix") {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-surface/60 p-4 text-left",
          className,
        )}
      >
        <p className="text-sm font-semibold text-text-primary">Pague com PIX</p>
        {payment.pixQrCodeUrl ? (
          <img
            src={payment.pixQrCodeUrl}
            alt="QR Code PIX"
            className="mx-auto mt-3 size-40 rounded-lg border border-border bg-white p-2"
          />
        ) : null}
        {payment.pixQrCode ? (
          <>
            <code className="mt-3 block break-all rounded-lg bg-white p-3 text-xs text-text-secondary">
              {payment.pixQrCode}
            </code>
            <CopyButton value={payment.pixQrCode} />
          </>
        ) : null}
        {payment.pixExpiresAt ? (
          <p className="mt-2 text-xs text-text-secondary">
            Expira em {formatExpiry(payment.pixExpiresAt)}
          </p>
        ) : null}
      </div>
    );
  }

  if (payment.method === "boleto") {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-surface/60 p-4 text-left",
          className,
        )}
      >
        <p className="text-sm font-semibold text-text-primary">Boleto bancário</p>
        {payment.boletoBarcode ? (
          <>
            <code className="mt-3 block break-all rounded-lg bg-white p-3 text-xs text-text-secondary">
              {payment.boletoBarcode}
            </code>
            <CopyButton value={payment.boletoBarcode} />
          </>
        ) : null}
        {payment.boletoUrl ? (
          <a
            href={payment.boletoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <FileText className="size-4" aria-hidden />
            Visualizar boleto
          </a>
        ) : null}
      </div>
    );
  }

  return null;
}
