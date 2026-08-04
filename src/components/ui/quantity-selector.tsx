"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  disabled = false,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className={cn(
        "inline-flex h-10 items-center rounded-xl border border-border bg-white",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={disabled || value <= min}
        aria-label="Diminuir quantidade"
        className="flex size-10 items-center justify-center rounded-l-xl text-text-secondary transition-colors hover:bg-secondary hover:text-text-primary disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <span
        className="min-w-8 text-center text-sm font-medium text-text-primary tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={disabled || value >= max}
        aria-label="Aumentar quantidade"
        className="flex size-10 items-center justify-center rounded-r-xl text-text-secondary transition-colors hover:bg-secondary hover:text-text-primary disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
