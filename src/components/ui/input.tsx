import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      id,
      label,
      error,
      hint,
      leftAddon,
      rightAddon,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        ) : null}

        <div
          className={cn(
            "flex h-11 items-center gap-2 rounded-xl border bg-white px-3.5 transition-colors",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            error ? "border-error" : "border-border",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          {leftAddon ? (
            <span className="shrink-0 text-text-secondary">{leftAddon}</span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            className={cn(
              "h-full w-full bg-transparent text-sm text-text-primary outline-none",
              "placeholder:text-text-secondary/70",
              className,
            )}
            {...props}
          />
          {rightAddon ? (
            <span className="shrink-0 text-text-secondary">{rightAddon}</span>
          ) : null}
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-error" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-text-secondary">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
