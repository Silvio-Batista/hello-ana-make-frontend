import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      id,
      label,
      error,
      hint,
      options,
      placeholder,
      disabled,
      ...props
    },
    ref,
  ) => {
    const selectId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        ) : null}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-11 w-full appearance-none rounded-xl border bg-white px-3.5 pr-10 text-sm text-text-primary",
              "transition-colors outline-none",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-60",
              error ? "border-error" : "border-border",
              className,
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-text-secondary"
            aria-hidden
          />
        </div>

        {error ? (
          <p id={`${selectId}-error`} className="text-xs text-error" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-text-secondary">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
