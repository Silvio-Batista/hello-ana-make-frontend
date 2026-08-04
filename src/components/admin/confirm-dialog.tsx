"use client";

import { Button, Modal } from "@/components/ui";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
  variant?: "danger" | "default";
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  loading,
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          loading={loading}
          className={
            variant === "danger"
              ? "bg-error hover:bg-error/90 shadow-error/20"
              : undefined
          }
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
