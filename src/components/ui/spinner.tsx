import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const;

export interface SpinnerProps {
  size?: keyof typeof sizes;
  className?: string;
  label?: string;
}

export function Spinner({
  size = "md",
  className,
  label = "Carregando",
}: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label={label}
      className={cn("animate-spin text-primary", sizes[size], className)}
    />
  );
}
