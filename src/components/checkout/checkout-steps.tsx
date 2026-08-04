"use client";

import { Check } from "lucide-react";
import type { CheckoutStep } from "@/stores";
import { cn } from "@/lib/utils";

const STEPS: { step: CheckoutStep; label: string }[] = [
  { step: 1, label: "Identificação" },
  { step: 2, label: "Endereço" },
  { step: 3, label: "Entrega" },
  { step: 4, label: "Pagamento" },
  { step: 5, label: "Confirmação" },
];

export interface CheckoutStepsProps {
  current: CheckoutStep;
  className?: string;
}

export function CheckoutSteps({ current, className }: CheckoutStepsProps) {
  return (
    <nav aria-label="Etapas do checkout" className={cn("w-full", className)}>
      <ol className="flex items-start justify-between gap-1 sm:gap-2">
        {STEPS.map(({ step, label }, index) => {
          const done = step < current;
          const active = step === current;

          return (
            <li
              key={step}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1.5",
                index < STEPS.length - 1 && "relative",
              )}
            >
              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-4 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-0.5",
                    done || active ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:size-9",
                  done && "bg-primary text-white",
                  active && "bg-primary text-white ring-4 ring-primary/20",
                  !done && !active && "bg-nude text-text-secondary",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="size-4" aria-hidden /> : step}
              </span>
              <span
                className={cn(
                  "hidden text-center text-[11px] font-medium sm:block sm:text-xs",
                  active || done ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
