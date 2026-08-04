"use client";

import { useState, type FormEvent } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import {
  Button,
  Checkbox,
  EmptyState,
  ErrorState,
  Input,
  Select,
  Spinner,
} from "@/components/ui";
import {
  useAddresses,
  useCreateAddress,
  useRemoveAddress,
  useSetDefaultAddress,
} from "@/hooks";
import { BRAZIL_STATES, formatZipCode } from "@/lib/order-status";
import type { AddressInput } from "@/repositories/interfaces";
import { cn } from "@/lib/utils";

const emptyForm = (): AddressInput => ({
  label: "Casa",
  recipientName: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "SP",
  zipCode: "",
  country: "BR",
  phone: "",
  isDefault: false,
});

export default function EnderecosPage() {
  const addresses = useAddresses();
  const createAddress = useCreateAddress();
  const removeAddress = useRemoveAddress();
  const setDefault = useSetDefaultAddress();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof AddressInput>(
    key: K,
    value: AddressInput[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const zip = form.zipCode.replace(/\D/g, "");
    if (zip.length !== 8) {
      setError("CEP inválido.");
      return;
    }
    try {
      await createAddress.mutateAsync({
        ...form,
        zipCode: formatZipCode(zip),
        recipientName: form.recipientName.trim(),
      });
      setForm(emptyForm());
      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível salvar.",
      );
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Endereços
        </h2>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Plus className="size-4" aria-hidden />}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancelar" : "Novo endereço"}
        </Button>
      </div>

      {showForm ? (
        <form
          onSubmit={onSubmit}
          className="mb-6 grid gap-4 rounded-2xl border border-border bg-white p-5 sm:grid-cols-2"
        >
          <Input
            label="Apelido"
            name="label"
            value={form.label ?? ""}
            onChange={(e) => updateField("label", e.target.value)}
          />
          <Input
            label="Destinatário"
            name="recipientName"
            value={form.recipientName}
            onChange={(e) => updateField("recipientName", e.target.value)}
            required
          />
          <Input
            label="CEP"
            name="zipCode"
            value={form.zipCode}
            onChange={(e) =>
              updateField("zipCode", formatZipCode(e.target.value))
            }
            required
          />
          <Input
            label="Telefone"
            name="phone"
            value={form.phone ?? ""}
            onChange={(e) => updateField("phone", e.target.value)}
          />
          <div className="sm:col-span-2">
            <Input
              label="Rua"
              name="street"
              value={form.street}
              onChange={(e) => updateField("street", e.target.value)}
              required
            />
          </div>
          <Input
            label="Número"
            name="number"
            value={form.number}
            onChange={(e) => updateField("number", e.target.value)}
            required
          />
          <Input
            label="Complemento"
            name="complement"
            value={form.complement ?? ""}
            onChange={(e) => updateField("complement", e.target.value)}
          />
          <Input
            label="Bairro"
            name="neighborhood"
            value={form.neighborhood}
            onChange={(e) => updateField("neighborhood", e.target.value)}
            required
          />
          <Input
            label="Cidade"
            name="city"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            required
          />
          <Select
            label="Estado"
            name="state"
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
            options={BRAZIL_STATES.map((s) => ({
              value: s.value,
              label: s.label,
            }))}
          />
          <div className="sm:col-span-2">
            <Checkbox
              name="isDefault"
              label="Definir como padrão"
              checked={form.isDefault}
              onChange={(e) => updateField("isDefault", e.target.checked)}
            />
          </div>
          {error ? (
            <p className="sm:col-span-2 text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="sm:col-span-2">
            <Button type="submit" loading={createAddress.isPending}>
              Salvar endereço
            </Button>
          </div>
        </form>
      ) : null}

      {addresses.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Carregando endereços" />
        </div>
      ) : addresses.isError ? (
        <ErrorState
          title="Não foi possível carregar os endereços"
          onRetry={() => void addresses.refetch()}
        />
      ) : !addresses.data?.length ? (
        <EmptyState
          icon={<MapPin className="size-6" aria-hidden />}
          title="Nenhum endereço salvo"
          description="Adicione um endereço para agilizar suas próximas compras."
          action={{
            label: "Adicionar",
            onClick: () => setShowForm(true),
            variant: "primary",
          }}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {addresses.data.map((address) => (
            <li
              key={address.id}
              className={cn(
                "rounded-2xl border bg-white p-4 sm:p-5",
                address.isDefault ? "border-primary/40" : "border-border",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {address.label ?? "Endereço"}
                    {address.isDefault ? (
                      <span className="ml-2 text-xs font-medium text-primary">
                        Padrão
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {address.recipientName}
                    <br />
                    {address.street}, {address.number}
                    {address.complement ? ` — ${address.complement}` : ""}
                    <br />
                    {address.neighborhood} · {address.city}/{address.state}
                    <br />
                    CEP {address.zipCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!address.isDefault ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={setDefault.isPending}
                      onClick={() => void setDefault.mutateAsync(address.id)}
                    >
                      Tornar padrão
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Remover endereço"
                    loading={removeAddress.isPending}
                    onClick={() => {
                      if (window.confirm("Remover este endereço?")) {
                        void removeAddress.mutateAsync(address.id);
                      }
                    }}
                    leftIcon={<Trash2 className="size-4" aria-hidden />}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
