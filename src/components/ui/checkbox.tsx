import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, id, label, error, disabled, ...props }, ref) => {
    const checkboxId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            "inline-flex cursor-pointer items-start gap-2.5",
            disabled && "cursor-not-allowed opacity-60",
            className,
          )}
        >
          <span className="relative mt-0.5 inline-flex size-5 shrink-0">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              disabled={disabled}
              aria-invalid={Boolean(error)}
              className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-md border border-border bg-white transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed"
              {...props}
            />
            <Check
              className="pointer-events-none absolute inset-0 m-auto size-3.5 text-white opacity-0 peer-checked:opacity-100"
              strokeWidth={3}
              aria-hidden
            />
          </span>
          {label ? (
            <span className="text-sm text-text-primary">{label}</span>
          ) : null}
        </label>
        {error ? (
          <p className="pl-7 text-xs text-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
