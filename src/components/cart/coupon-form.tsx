"use client";

import { useState, type FormEvent } from "react";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CouponFormProps {
  appliedCode?: string | null;
  message?: string | null;
  onApply: (code: string) => Promise<boolean> | boolean;
  onRemove?: () => void;
  className?: string;
}

export function CouponForm({
  appliedCode,
  message,
  onApply,
  onRemove,
  className,
}: CouponFormProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const ok = await onApply(code);
      if (ok) {
        setCode("");
        setError(null);
      } else {
        setError("Cupom inválido ou não aplicável");
      }
    } finally {
      setLoading(false);
    }
  };

  if (appliedCode) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="flex items-center justify-between gap-2 rounded-xl border border-success/30 bg-success/5 px-3 py-2.5">
          <div className="flex items-center gap-2 text-sm">
            <Tag className="size-4 text-success" aria-hidden />
            <span className="font-medium text-text-primary">{appliedCode}</span>
          </div>
          {onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs font-medium text-text-secondary hover:text-error"
            >
              Remover
            </button>
          ) : null}
        </div>
        {message ? (
          <p className="text-xs text-success">{message}</p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2">
        <Input
          name="coupon"
          placeholder="Cupom de desconto"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          leftAddon={<Tag className="size-4" aria-hidden />}
          aria-label="Código do cupom"
          error={error ?? undefined}
        />
        <Button
          type="submit"
          variant="outline"
          loading={loading}
          disabled={!code.trim()}
          className="shrink-0"
        >
          Aplicar
        </Button>
      </div>
      {!error && message ? (
        <p className="text-xs text-text-secondary">{message}</p>
      ) : error && message ? (
        <p className="text-xs text-error">{message}</p>
      ) : null}
    </form>
  );
}
