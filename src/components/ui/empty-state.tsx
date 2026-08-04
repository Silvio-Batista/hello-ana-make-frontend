import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  } & Pick<ButtonProps, "variant">;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-lg font-semibold text-text-primary">
        {title}
      </h3>
      {description ? (
        <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      ) : null}
      {action ? (
        action.href ? (
          <a href={action.href}>
            <Button variant={action.variant ?? "primary"}>{action.label}</Button>
          </a>
        ) : (
          <Button
            variant={action.variant ?? "primary"}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )
      ) : null}
    </div>
  );
}
