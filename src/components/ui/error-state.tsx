import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Não foi possível carregar o conteúdo. Tente novamente.",
  icon,
  onRetry,
  retryLabel = "Tentar novamente",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-error/10 text-error">
        {icon ?? <AlertCircle className="size-6" aria-hidden />}
      </div>
      <h3 className="font-display text-lg font-semibold text-text-primary">
        {title}
      </h3>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
