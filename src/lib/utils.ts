import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatDiscountPercentage(
  price: number,
  promotionalPrice: number,
): number {
  if (price <= 0 || promotionalPrice >= price) return 0;
  return Math.round(((price - promotionalPrice) / price) * 100);
}

export function getInstallmentInfo(
  price: number,
  maxInstallments = 6,
  minInstallment = 20,
): { count: number; value: number; label: string } {
  const count = Math.min(
    maxInstallments,
    Math.max(1, Math.floor(price / minInstallment)),
  );
  const value = price / count;
  return {
    count,
    value,
    label:
      count > 1
        ? `ou ${count}x de ${formatCurrency(value)} sem juros`
        : `à vista por ${formatCurrency(price)}`,
  };
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
