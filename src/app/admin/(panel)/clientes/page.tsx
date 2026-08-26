"use client";

import { useMemo, useState } from "react";
import {
  DataTable,
  PageHeader,
  type DataTableColumn,
} from "@/components/admin";
import { Badge, Input, Modal, Skeleton } from "@/components/ui";
import { useAdminCustomer, useAdminCustomers } from "@/hooks/use-admin";
import type { AdminCustomer } from "@/contracts";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(iso));
}

interface CustomerDetailModalProps {
  id: string | null;
  onClose: () => void;
}

function CustomerDetailModal({ id, onClose }: CustomerDetailModalProps) {
  const { data: customer, isLoading } = useAdminCustomer(id ?? "");

  return (
    <Modal open={Boolean(id)} onClose={onClose} title="Cliente" className="max-w-lg">
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ) : customer ? (
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-text-primary">{customer.name}</p>
            <p className="text-text-secondary">{customer.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-text-secondary">Telefone</p>
              <p>{customer.phone ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Documento</p>
              <p>{customer.document ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Pedidos</p>
              <p>{customer.ordersCount}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">E-mail verificado</p>
              <Badge variant={customer.emailVerified ? "success" : "neutral"}>
                {customer.emailVerified ? "Sim" : "Não"}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Cliente desde</p>
            <p>{formatDate(customer.createdAt)}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-text-secondary">Cliente não encontrado.</p>
      )}
    </Modal>
  );
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const params = useMemo(
    () => ({ page: 1, pageSize: 50, search: search || undefined }),
    [search],
  );

  const { data, isLoading } = useAdminCustomers(params);

  const columns: DataTableColumn<AdminCustomer>[] = [
    {
      key: "name",
      header: "Cliente",
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedId(row.id)}
          className="text-left"
        >
          <p className="font-medium text-primary hover:underline">{row.name}</p>
          <p className="text-xs text-text-secondary">{row.email}</p>
        </button>
      ),
    },
    {
      key: "phone",
      header: "Telefone",
      render: (row) => row.phone ?? "—",
    },
    {
      key: "ordersCount",
      header: "Pedidos",
      render: (row) => row.ordersCount,
    },
    {
      key: "createdAt",
      header: "Cliente desde",
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Consulte os clientes cadastrados na loja"
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Buscar por nome ou e-mail…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setSearch(searchInput.trim());
          }}
          className="sm:max-w-sm"
        />
        <button
          type="button"
          onClick={() => setSearch(searchInput.trim())}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark sm:self-start"
        >
          Buscar
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        getRowKey={(row) => row.id}
        loading={isLoading}
        emptyTitle="Nenhum cliente encontrado"
        emptyDescription="Ajuste a busca para tentar novamente."
      />

      <CustomerDetailModal id={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
