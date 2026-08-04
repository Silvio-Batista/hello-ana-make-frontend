"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  ConfirmDialog,
  DataTable,
  PageHeader,
  type DataTableColumn,
} from "@/components/admin";
import { Badge, Button, Input, useToast } from "@/components/ui";
import { useAdminProducts, useRemoveProduct } from "@/hooks/use-admin";
import type { Product } from "@/contracts";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      page: 1,
      pageSize: 100,
      filters: searchApplied ? { search: searchApplied } : undefined,
    }),
    [searchApplied],
  );

  const { data, isLoading } = useAdminProducts(params);
  const removeProduct = useRemoveProduct();

  const columns: DataTableColumn<Product>[] = [
    {
      key: "name",
      header: "Produto",
      render: (row) => (
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
          <p className="text-xs text-text-secondary">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "brand",
      header: "Marca",
      render: (row) => row.brand.name,
    },
    {
      key: "category",
      header: "Categoria",
      render: (row) => row.category.name,
    },
    {
      key: "price",
      header: "Preço",
      render: (row) =>
        formatCurrency(
          row.pricing.promotionalPriceFrom ?? row.pricing.priceFrom,
        ),
    },
    {
      key: "stock",
      header: "Estoque",
      render: (row) => (
        <span
          className={
            row.inventory.isLowStock ? "font-medium text-warning" : undefined
          }
        >
          {row.inventory.totalStock}
        </span>
      ),
    },
    {
      key: "flags",
      header: "Flags",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.isFeatured ? <Badge variant="gold">Destaque</Badge> : null}
          {row.isNew ? <Badge variant="new">Novo</Badge> : null}
          {row.isBestseller ? <Badge variant="success">Top</Badge> : null}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/produtos/${row.id}`}
            className="rounded-lg p-2 text-text-secondary hover:bg-secondary hover:text-primary"
            aria-label="Editar"
          >
            <Pencil className="size-4" />
          </Link>
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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await removeProduct.mutateAsync(deleteId);
      toast("Produto removido.", "success");
      setDeleteId(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao remover produto.",
        "error",
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Produtos"
        description="Cadastro e gestão do catálogo"
        actions={
          <Link href="/admin/produtos/novo">
            <Button leftIcon={<Plus className="size-4" />}>Novo produto</Button>
          </Link>
        }
      />

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Buscar produtos…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setSearchApplied(search.trim());
          }}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          onClick={() => setSearchApplied(search.trim())}
        >
          Buscar
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        getRowKey={(row) => row.id}
        loading={isLoading}
        emptyTitle="Nenhum produto encontrado"
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir produto?"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        loading={removeProduct.isPending}
      />
    </div>
  );
}
