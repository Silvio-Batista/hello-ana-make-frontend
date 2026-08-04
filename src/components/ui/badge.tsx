import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  sale: "bg-error/10 text-error",
  new: "bg-primary-light text-primary-dark",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  neutral: "bg-nude text-text-secondary",
  gold: "bg-champagne text-gold",
} as const;

export type BadgeVariant = keyof typeof variants;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold tracking-wide uppercase",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
