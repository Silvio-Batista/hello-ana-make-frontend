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
  Textarea,
  useToast,
} from "@/components/ui";
import {
  useAdminRewardTiers,
  useCreateRewardTier,
  useRemoveRewardTier,
  useUpdateRewardTier,
} from "@/hooks/use-admin";
import type { CreateRewardTierInput, RewardTier } from "@/contracts";
import { formatCurrency } from "@/lib/utils";

interface RewardFormState {
  minimumAmount: number;
  rewardName: string;
  rewardDescription: string;
  rewardImage: string;
  isActive: boolean;
  sortOrder: number;
}

const emptyForm = (): RewardFormState => ({
  minimumAmount: 100,
  rewardName: "",
  rewardDescription: "",
  rewardImage: "",
  isActive: true,
  sortOrder: 0,
});

export default function AdminRewardsPage() {
  const { toast } = useToast();
  const { data: tiers = [], isLoading } = useAdminRewardTiers();
  const createTier = useCreateRewardTier();
  const updateTier = useUpdateRewardTier();
  const removeTier = useRemoveRewardTier();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RewardTier | null>(null);
  const [form, setForm] = useState<RewardFormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) {
      setForm(emptyForm());
      return;
    }
    setForm({
      minimumAmount: editing.minimumAmount,
      rewardName: editing.reward.name,
      rewardDescription: editing.reward.description,
      rewardImage: editing.reward.image,
      isActive: editing.isActive,
      sortOrder: editing.sortOrder,
    });
  }, [editing]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const input: CreateRewardTierInput = {
      minimumAmount: Number(form.minimumAmount),
      reward: {
        name: form.rewardName.trim(),
        description: form.rewardDescription.trim(),
        image: form.rewardImage.trim(),
      },
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder),
    };

    try {
      if (editing) {
        await updateTier.mutateAsync({ id: editing.id, input });
        toast("Nível de recompensa atualizado.", "success");
      } else {
        await createTier.mutateAsync(input);
        toast("Nível de recompensa criado.", "success");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao salvar recompensa.",
        "error",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await removeTier.mutateAsync(deleteId);
      toast("Nível removido.", "success");
      setDeleteId(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao remover nível.",
        "error",
      );
    }
  };

  const sorted = [...tiers].sort((a, b) => a.sortOrder - b.sortOrder);

  const columns: DataTableColumn<RewardTier>[] = [
    {
      key: "minimum",
      header: "Valor mínimo",
      render: (row) => formatCurrency(row.minimumAmount),
    },
    {
      key: "reward",
      header: "Brinde",
      render: (row) => (
        <div>
          <p className="font-medium">{row.reward.name}</p>
          <p className="text-xs text-text-secondary line-clamp-1">
            {row.reward.description}
          </p>
        </div>
      ),
    },
    {
      key: "sort",
      header: "Ordem",
      render: (row) => row.sortOrder,
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
        title="Recompensas"
        description="Faixas de brindes por valor do carrinho"
        actions={
          <Button
            leftIcon={<Plus className="size-4" />}
            onClick={() => {
              setEditing(null);
              setForm(emptyForm());
              setModalOpen(true);
            }}
          >
            Novo nível
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={sorted}
        getRowKey={(row) => row.id}
        loading={isLoading}
        emptyTitle="Nenhum nível de recompensa"
      />

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Editar nível" : "Novo nível"}
        className="max-w-lg"
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <Input
            label="Valor mínimo do carrinho"
            type="number"
            min={0}
            step="0.01"
            value={form.minimumAmount}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                minimumAmount: Number(e.target.value),
              }))
            }
            required
          />
          <Input
            label="Nome do brinde"
            value={form.rewardName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rewardName: e.target.value }))
            }
            required
          />
          <Textarea
            label="Descrição do brinde"
            value={form.rewardDescription}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                rewardDescription: e.target.value,
              }))
            }
            required
          />
          <Input
            label="URL da imagem"
            value={form.rewardImage}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rewardImage: e.target.value }))
            }
            required
          />
          <Input
            label="Ordem"
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                sortOrder: Number(e.target.value),
              }))
            }
          />
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
              loading={createTier.isPending || updateTier.isPending}
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
        title="Excluir nível de recompensa?"
        confirmLabel="Excluir"
        loading={removeTier.isPending}
      />
    </div>
  );
}
