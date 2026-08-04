import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, label, error, hint, disabled, ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        ) : null}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : hint
                ? `${textareaId}-hint`
                : undefined
          }
          className={cn(
            "min-h-28 w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-text-primary",
            "placeholder:text-text-secondary/70 transition-colors outline-none resize-y",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error ? "border-error" : "border-border",
            className,
          )}
          {...props}
        />

        {error ? (
          <p
            id={`${textareaId}-error`}
            className="text-xs text-error"
            role="alert"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={`${textareaId}-hint`}
            className="text-xs text-text-secondary"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
