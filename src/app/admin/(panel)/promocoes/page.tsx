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
  useAdminPromotions,
  useCreatePromotion,
  useRemovePromotion,
  useUpdatePromotion,
} from "@/hooks/use-admin";
import type {
  CreatePromotionInput,
  Promotion,
  PromotionType,
} from "@/contracts";
import { slugify } from "@/lib/utils";

const PROMOTION_TYPES: { value: PromotionType; label: string }[] = [
  { value: "direct_discount", label: "Desconto direto" },
  { value: "flash_sale", label: "Flash sale" },
  { value: "buy_x_get_y", label: "Leve X pague Y" },
  { value: "progressive", label: "Progressiva" },
  { value: "kit", label: "Kit" },
  { value: "campaign", label: "Campanha" },
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

interface PromotionFormState {
  name: string;
  slug: string;
  type: PromotionType;
  description: string;
  discountPercentage: string;
  discountAmount: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  priority: number;
}

function emptyForm(): PromotionFormState {
  const now = new Date();
  const end = new Date();
  end.setMonth(end.getMonth() + 1);
  return {
    name: "",
    slug: "",
    type: "direct_discount",
    description: "",
    discountPercentage: "10",
    discountAmount: "",
    startsAt: toDatetimeLocal(now.toISOString()),
    endsAt: toDatetimeLocal(end.toISOString()),
    isActive: true,
    priority: 0,
  };
}

export default function AdminPromotionsPage() {
  const { toast } = useToast();
  const { data: promotions = [], isLoading } = useAdminPromotions();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const removePromotion = useRemovePromotion();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState<PromotionFormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) {
      setForm(emptyForm());
      setSlugTouched(false);
      return;
    }
    setForm({
      name: editing.name,
      slug: editing.slug,
      type: editing.type,
      description: editing.description,
      discountPercentage:
        editing.discountPercentage !== undefined
          ? String(editing.discountPercentage)
          : "",
      discountAmount:
        editing.discountAmount !== undefined
          ? String(editing.discountAmount)
          : "",
      startsAt: toDatetimeLocal(editing.startsAt),
      endsAt: toDatetimeLocal(editing.endsAt),
      isActive: editing.isActive,
      priority: editing.priority,
    });
    setSlugTouched(true);
  }, [editing]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const input: CreatePromotionInput = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      type: form.type,
      description: form.description.trim(),
      discountPercentage: form.discountPercentage
        ? Number(form.discountPercentage)
        : undefined,
      discountAmount: form.discountAmount
        ? Number(form.discountAmount)
        : undefined,
      startsAt: fromDatetimeLocal(form.startsAt),
      endsAt: fromDatetimeLocal(form.endsAt),
      isActive: form.isActive,
      priority: Number(form.priority),
    };

    try {
      if (editing) {
        await updatePromotion.mutateAsync({ id: editing.id, input });
        toast("Promoção atualizada.", "success");
      } else {
        await createPromotion.mutateAsync(input);
        toast("Promoção criada.", "success");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao salvar promoção.",
        "error",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await removePromotion.mutateAsync(deleteId);
      toast("Promoção removida.", "success");
      setDeleteId(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao remover promoção.",
        "error",
      );
    }
  };

  const columns: DataTableColumn<Promotion>[] = [
    {
      key: "name",
      header: "Nome",
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-text-secondary">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      render: (row) =>
        PROMOTION_TYPES.find((t) => t.value === row.type)?.label ?? row.type,
    },
    {
      key: "discount",
      header: "Desconto",
      render: (row) => {
        if (row.discountPercentage !== undefined)
          return `${row.discountPercentage}%`;
        if (row.discountAmount !== undefined)
          return `R$ ${row.discountAmount}`;
        return "—";
      },
    },
    {
      key: "priority",
      header: "Prioridade",
      render: (row) => row.priority,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "neutral"}>
          {row.isActive ? "Ativa" : "Inativa"}
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
        title="Promoções"
        description="Campanhas e descontos da loja"
        actions={
          <Button
            leftIcon={<Plus className="size-4" />}
            onClick={() => {
              setEditing(null);
              setForm(emptyForm());
              setSlugTouched(false);
              setModalOpen(true);
            }}
          >
            Nova promoção
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={promotions}
        getRowKey={(row) => row.id}
        loading={isLoading}
        emptyTitle="Nenhuma promoção"
      />

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Editar promoção" : "Nova promoção"}
        className="max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <Input
            label="Nome"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((prev) => ({
                ...prev,
                name,
                slug: slugTouched ? prev.slug : slugify(name),
              }));
            }}
            required
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((prev) => ({ ...prev, slug: e.target.value }));
            }}
            required
          />
          <Select
            label="Tipo"
            options={PROMOTION_TYPES}
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                type: e.target.value as PromotionType,
              }))
            }
          />
          <Textarea
            label="Descrição"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Desconto (%)"
              type="number"
              min={0}
              max={100}
              value={form.discountPercentage}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  discountPercentage: e.target.value,
                }))
              }
            />
            <Input
              label="Desconto (R$)"
              type="number"
              min={0}
              step="0.01"
              value={form.discountAmount}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  discountAmount: e.target.value,
                }))
              }
            />
          </div>
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
          <Input
            label="Prioridade"
            type="number"
            value={form.priority}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                priority: Number(e.target.value),
              }))
            }
          />
          <Checkbox
            label="Ativa"
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
              loading={createPromotion.isPending || updatePromotion.isPending}
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
        title="Excluir promoção?"
        confirmLabel="Excluir"
        loading={removePromotion.isPending}
      />
    </div>
  );
}
