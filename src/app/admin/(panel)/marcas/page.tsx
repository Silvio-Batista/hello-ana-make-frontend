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
  useAdminBrands,
  useCreateBrand,
  useRemoveBrand,
  useUpdateBrand,
} from "@/hooks/use-admin";
import type { Brand, CreateBrandInput } from "@/contracts";
import { slugify } from "@/lib/utils";

interface BrandFormState {
  name: string;
  slug: string;
  description: string;
  logo: string;
  website: string;
  isActive: boolean;
}

const emptyForm = (): BrandFormState => ({
  name: "",
  slug: "",
  description: "",
  logo: "",
  website: "",
  isActive: true,
});

export default function AdminBrandsPage() {
  const { toast } = useToast();
  const { data: brands = [], isLoading } = useAdminBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const removeBrand = useRemoveBrand();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form, setForm] = useState<BrandFormState>(emptyForm);
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
      description: editing.description ?? "",
      logo: editing.logo ?? "",
      website: editing.website ?? "",
      isActive: editing.isActive,
    });
    setSlugTouched(true);
  }, [editing]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setSlugTouched(false);
    setModalOpen(true);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const input: CreateBrandInput = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description.trim() || undefined,
      logo: form.logo.trim() || undefined,
      website: form.website.trim() || undefined,
      isActive: form.isActive,
    };

    try {
      if (editing) {
        await updateBrand.mutateAsync({ id: editing.id, input });
        toast("Marca atualizada.", "success");
      } else {
        await createBrand.mutateAsync(input);
        toast("Marca criada.", "success");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao salvar marca.",
        "error",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await removeBrand.mutateAsync(deleteId);
      toast("Marca removida.", "success");
      setDeleteId(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao remover marca.",
        "error",
      );
    }
  };

  const columns: DataTableColumn<Brand>[] = [
    {
      key: "name",
      header: "Marca",
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-text-secondary">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "website",
      header: "Site",
      render: (row) =>
        row.website ? (
          <a
            href={row.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Link
          </a>
        ) : (
          "—"
        ),
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
        title="Marcas"
        description="Gerencie as marcas do catálogo"
        actions={
          <Button leftIcon={<Plus className="size-4" />} onClick={openCreate}>
            Nova marca
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={brands}
        getRowKey={(row) => row.id}
        loading={isLoading}
        emptyTitle="Nenhuma marca"
      />

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Editar marca" : "Nova marca"}
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
          />
          <Input
            label="URL do logo"
            value={form.logo}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, logo: e.target.value }))
            }
          />
          <Input
            label="Website"
            value={form.website}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, website: e.target.value }))
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
              loading={createBrand.isPending || updateBrand.isPending}
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
        title="Excluir marca?"
        confirmLabel="Excluir"
        loading={removeBrand.isPending}
      />
    </div>
  );
}
