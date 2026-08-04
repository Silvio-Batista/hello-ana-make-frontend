"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showClose?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  showClose = true,
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    const timer = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        ?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 bg-text-primary/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-text-primary/10",
          "animate-fade-up",
          className,
        )}
      >
        {(title || showClose) && (
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              {title ? (
                <h2
                  id={titleId}
                  className="font-display text-xl font-semibold text-text-primary"
                >
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p
                  id={descId}
                  className="mt-1 text-sm text-text-secondary"
                >
                  {description}
                </p>
              ) : null}
            </div>
            {showClose ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar modal"
                className="rounded-xl p-1.5 text-text-secondary transition-colors hover:bg-secondary hover:text-text-primary"
              >
                <X className="size-5" />
              </button>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
