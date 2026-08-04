"use client";

import type { ProductVariant } from "@/contracts";
import { cn } from "@/lib/utils";

export interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (variantId: string) => void;
  className?: string;
  required?: boolean;
}

function hasColors(variants: ProductVariant[]): boolean {
  return variants.some((v) => v.attributes.colorHex || v.attributes.color);
}

function buttonLabel(variant: ProductVariant): string {
  return (
    variant.attributes.volume ??
    variant.attributes.size ??
    variant.attributes.fragrance ??
    variant.attributes.shade ??
    variant.name
  );
}

function buttonGroupLabel(variants: ProductVariant[]): string {
  if (variants.some((v) => v.attributes.volume)) return "Volume";
  if (variants.some((v) => v.attributes.size)) return "Tamanho";
  if (variants.some((v) => v.attributes.fragrance)) return "Fragrância";
  return "Opção";
}

export function VariantSelector({
  variants,
  selectedId,
  onSelect,
  className,
  required = true,
}: VariantSelectorProps) {
  if (variants.length === 0) return null;

  const selected = variants.find((v) => v.id === selectedId);
  const useColors = hasColors(variants);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {required && !selectedId ? (
        <p className="text-xs text-text-secondary" role="status">
          Selecione uma opção para continuar
        </p>
      ) : null}

      {useColors ? (
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-text-primary">
            Cor
            {selected?.attributes.color ? (
              <span className="ml-1 font-normal text-text-secondary">
                — {selected.attributes.color}
              </span>
            ) : null}
          </legend>
          <div className="flex flex-wrap gap-2" role="listbox" aria-label="Cores">
            {variants.map((variant) => {
              const hex = variant.attributes.colorHex ?? "#ccc";
              const label =
                variant.attributes.color ??
                variant.attributes.shade ??
                variant.name;
              const isSelected = variant.id === selectedId;

              return (
                <button
                  key={variant.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-label={label}
                  disabled={!variant.isAvailable}
                  onClick={() => onSelect(variant.id)}
                  title={label}
                  className={cn(
                    "relative size-9 rounded-full border-2 transition-transform",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    isSelected
                      ? "scale-110 border-primary"
                      : "border-border hover:scale-105",
                    !variant.isAvailable && "opacity-40",
                  )}
                  style={{ backgroundColor: hex }}
                >
                  {!variant.isAvailable ? (
                    <span
                      className="absolute inset-0 flex items-center justify-center"
                      aria-hidden
                    >
                      <span className="h-px w-full rotate-45 bg-text-primary/60" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : (
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-text-primary">
            {buttonGroupLabel(variants)}
          </legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isSelected = variant.id === selectedId;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={!variant.isAvailable}
                  onClick={() => onSelect(variant.id)}
                  className={cn(
                    "rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    isSelected
                      ? "border-primary bg-primary-light text-primary-dark"
                      : "border-border bg-white text-text-primary hover:border-primary",
                    !variant.isAvailable &&
                      "cursor-not-allowed opacity-40 line-through",
                  )}
                >
                  {buttonLabel(variant)}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
