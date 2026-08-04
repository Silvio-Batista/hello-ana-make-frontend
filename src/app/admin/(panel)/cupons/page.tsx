"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  ConfirmDialog,
  DataTable,
  PageHeader,
  type DataTableColumn,
} from "@/components/admin";
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Modal,
  Select,
  Textarea,
  useToast,
} from "@/components/ui";
import {
  useAdminCoupons,
  useCreateCoupon,
  useRemoveCoupon,
  useUpdateCoupon,
} from "@/hooks/use-admin";
import type { Coupon, CouponType, CreateCouponInput } from "@/contracts";
import { formatCurrency } from "@/lib/utils";

const COUPON_TYPES: { value: CouponType; label: string }[] = [
  { value: "percentage", label: "Percentual" },
  { value: "fixed_amount", label: "Valor fixo" },
  { value: "free_shipping", label: "Frete grátis" },
  { value: "category", label: "Categoria" },
  { value: "product", label: "Produto" },
];

function toDatetimeLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string): string {
  return new Date(value).toISOString();
}

interface CouponFormState {
  code: string;
  type: CouponType;
  value: number;
  description: string;
  minOrderValue: string;
  maxDiscountValue: string;
  usageLimit: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

function emptyForm(): CouponFormState {
  const now = new Date();
  const end = new Date();
  end.setMonth(end.getMonth() + 1);
  return {
    code: "",
    type: "percentage",
    value: 10,
    description: "",
    minOrderValue: "",
    maxDiscountValue: "",
    usageLimit: "",
    startsAt: toDatetimeLocal(now.toISOString()),
    endsAt: toDatetimeLocal(end.toISOString()),
    isActive: true,
  };
}

export default function AdminCouponsPage() {
  const { toast } = useToast();
  const { data: coupons = [], isLoading } = useAdminCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const removeCoupon = useRemoveCoupon();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponFormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) {
      setForm(emptyForm());
      return;
    }
    setForm({
      code: editing.code,
      type: editing.type,
      value: editing.value,
      description: editing.description ?? "",
      minOrderValue:
        editing.minOrderValue !== undefined
          ? String(editing.minOrderValue)
          : "",
      maxDiscountValue:
        editing.maxDiscountValue !== undefined
          ? String(editing.maxDiscountValue)
          : "",
      usageLimit:
        editing.usageLimit !== undefined ? String(editing.usageLimit) : "",
      startsAt: toDatetimeLocal(editing.startsAt),
      endsAt: toDatetimeLocal(editing.endsAt),
      isActive: editing.isActive,
    });
  }, [editing]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const input: CreateCouponInput = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      description: form.description.trim() || undefined,
      minOrderValue: form.minOrderValue
        ? Number(form.minOrderValue)
        : undefined,
      maxDiscountValue: form.maxDiscountValue
        ? Number(form.maxDiscountValue)
        : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      startsAt: fromDatetimeLocal(form.startsAt),
      endsAt: fromDatetimeLocal(form.endsAt),
      isActive: form.isActive,
    };

    try {
      if (editing) {
        await updateCoupon.mutateAsync({ id: editing.id, input });
        toast("Cupom atualizado.", "success");
      } else {
        await createCoupon.mutateAsync(input);
        toast("Cupom criado.", "success");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao salvar cupom.",
        "error",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await removeCoupon.mutateAsync(deleteId);
      toast("Cupom removido.", "success");
      setDeleteId(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao remover cupom.",
        "error",
      );
    }
  };

  const columns: DataTableColumn<Coupon>[] = [
    {
      key: "code",
      header: "Código",
      render: (row) => (
        <span className="font-mono font-semibold">{row.code}</span>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (row) =>
        COUPON_TYPES.find((t) => t.value === row.type)?.label ?? row.type,
    },
    {
      key: "value",
      header: "Valor",
      render: (row) =>
        row.type === "percentage"
          ? `${row.value}%`
          : row.type === "free_shipping"
            ? "Frete grátis"
            : formatCurrency(row.value),
    },
    {
      key: "usage",
      header: "Uso",
      render: (row) =>
        `${row.usageCount}${row.usageLimit ? ` / ${row.usageLimit}` : ""}`,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "neutral"}>
          {row.isActive ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Editar"
            className="rounded-lg p-2 text-text-secondary hover:bg-secondary hover:text-primary"
            onClick={() => {
              setEditing(row);
              setModalOpen(true);
            }}
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Excluir"
            className="rounded-lg p-2 text-text-secondary hover:bg-error/10 hover:text-error"
            onClick={() => setDeleteId(row.id)}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Cupons"
        description="Códigos de desconto e frete"
        actions={
          <Button
            leftIcon={<Plus className="size-4" />}
            onClick={() => {
              setEditing(null);
              setForm(emptyForm());
              setModalOpen(true);
            }}
          >
            Novo cupom
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={coupons}
        getRowKey={(row) => row.id}
        loading={isLoading}
        emptyTitle="Nenhum cupom"
      />

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Editar cupom" : "Novo cupom"}
        className="max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <Input
            label="Código"
            value={form.code}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                code: e.target.value.toUpperCase(),
              }))
            }
            required
          />
          <Select
            label="Tipo"
            options={COUPON_TYPES}
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                type: e.target.value as CouponType,
              }))
            }
          />
          <Input
            label="Valor"
            type="number"
            min={0}
            step="0.01"
            value={form.value}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, value: Number(e.target.value) }))
            }
            required
          />
          <Textarea
            label="Descrição"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Pedido mínimo"
              type="number"
              min={0}
              step="0.01"
              value={form.minOrderValue}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  minOrderValue: e.target.value,
                }))
              }
            />
            <Input
              label="Desconto máximo"
              type="number"
              min={0}
              step="0.01"
              value={form.maxDiscountValue}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  maxDiscountValue: e.target.value,
                }))
              }
            />
          </div>
          <Input
            label="Limite de uso"
            type="number"
            min={0}
            value={form.usageLimit}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, usageLimit: e.target.value }))
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Início"
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startsAt: e.target.value }))
              }
              required
            />
            <Input
              label="Fim"
              type="datetime-local"
              value={form.endsAt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, endsAt: e.target.value }))
              }
              required
            />
          </div>
          <Checkbox
            label="Ativo"
            checked={form.isActive}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, isActive: e.target.checked }))
            }
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={createCoupon.isPending || updateCoupon.isPending}
            >
              Salvar
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir cupom?"
        confirmLabel="Excluir"
        loading={removeCoupon.isPending}
      />
    </div>
  );
}
