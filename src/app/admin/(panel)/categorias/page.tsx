"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  ConfirmDialog,
  DataTable,
  ImageUploadField,
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
  useAdminCategories,
  useCreateCategory,
  useRemoveCategory,
  useUpdateCategory,
} from "@/hooks/use-admin";
import type { Category, CreateCategoryInput } from "@/contracts";
import { slugify } from "@/lib/utils";

interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string;
  isActive: boolean;
  sortOrder: number;
}

const emptyForm = (): CategoryFormState => ({
  name: "",
  slug: "",
  description: "",
  image: "",
  parentId: "",
  isActive: true,
  sortOrder: 0,
});

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const { data: categories = [], isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const removeCategory = useRemoveCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
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
      description: editing.description,
      image: editing.image,
      parentId: editing.parentId ?? "",
      isActive: editing.isActive,
      sortOrder: editing.sortOrder ?? 0,
    });
    setSlugTouched(true);
  }, [editing]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setSlugTouched(false);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setModalOpen(true);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const input: CreateCategoryInput = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description.trim(),
      image: form.image.trim(),
      parentId: form.parentId || undefined,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder),
    };

    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, input });
        toast("Categoria atualizada.", "success");
      } else {
        await createCategory.mutateAsync(input);
        toast("Categoria criada.", "success");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao salvar categoria.",
        "error",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await removeCategory.mutateAsync(deleteId);
      toast("Categoria removida.", "success");
      setDeleteId(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao remover categoria.",
        "error",
      );
    }
  };

  const parentName = (id?: string) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  const columns: DataTableColumn<Category>[] = [
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
      key: "parent",
      header: "Pai",
      render: (row) => parentName(row.parentId),
    },
    {
      key: "sort",
      header: "Ordem",
      render: (row) => row.sortOrder ?? 0,
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
            onClick={() => openEdit(row)}
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

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <div>
      <PageHeader
        title="Categorias"
        description="Organize o catálogo por categorias"
        actions={
          <Button leftIcon={<Plus className="size-4" />} onClick={openCreate}>
            Nova categoria
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={categories}
        getRowKey={(row) => row.id}
        loading={isLoading}
        emptyTitle="Nenhuma categoria"
      />

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Editar categoria" : "Nova categoria"}
        className="max-w-lg"
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
          <Textarea
            label="Descrição"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
          <ImageUploadField
            label="Imagem"
            value={form.image}
            onChange={(image) => setForm((prev) => ({ ...prev, image }))}
            required
          />
          <Select
            label="Categoria pai (opcional)"
            value={form.parentId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, parentId: e.target.value }))
            }
            options={[
              { value: "", label: "Nenhuma" },
              ...categories
                .filter((c) => c.id !== editing?.id)
                .map((c) => ({ value: c.id, label: c.name })),
            ]}
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
            <Button type="submit" loading={isPending}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir categoria?"
        description="Produtos vinculados podem ser afetados."
        confirmLabel="Excluir"
        loading={removeCategory.isPending}
      />
    </div>
  );
}
