"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button, Checkbox, Input, Select, Spinner } from "@/components/ui";
import { useAddresses, useAuth } from "@/hooks";
import { BRAZIL_STATES, formatZipCode } from "@/lib/order-status";
import type { AddressInput } from "@/repositories/interfaces";
import { useCheckoutStore } from "@/stores";
import { cn } from "@/lib/utils";

const emptyAddress = (recipientName: string): AddressInput => ({
  recipientName,
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "SP",
  zipCode: "",
  country: "BR",
  phone: "",
  isDefault: true,
  label: "Entrega",
});

export function AddressStep() {
  const { isAuthenticated, user } = useAuth();
  const identification = useCheckoutStore((s) => s.identification);
  const addressId = useCheckoutStore((s) => s.addressId);
  const newAddress = useCheckoutStore((s) => s.newAddress);
  const setAddressId = useCheckoutStore((s) => s.setAddressId);
  const setNewAddress = useCheckoutStore((s) => s.setNewAddress);
  const nextStep = useCheckoutStore((s) => s.nextStep);
  const prevStep = useCheckoutStore((s) => s.prevStep);

  const addressesQuery = useAddresses(isAuthenticated);
  const saved = addressesQuery.data ?? [];

  const [useNew, setUseNew] = useState(
    !addressId || saved.length === 0 || Boolean(newAddress),
  );
  const [form, setForm] = useState<AddressInput>(
    newAddress ?? emptyAddress(identification.name || user?.name || ""),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setUseNew(true);
      return;
    }
    if (addressesQuery.isSuccess && saved.length === 0) {
      setUseNew(true);
    }
  }, [isAuthenticated, addressesQuery.isSuccess, saved.length]);

  useEffect(() => {
    if (addressId && saved.some((a) => a.id === addressId)) {
      setUseNew(false);
    }
  }, [addressId, saved]);

  const updateField = <K extends keyof AddressInput>(
    key: K,
    value: AddressInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!useNew && addressId) {
      setNewAddress(null);
      nextStep();
      return;
    }

    const zip = form.zipCode.replace(/\D/g, "");
    if (
      !form.recipientName.trim() ||
      !form.street.trim() ||
      !form.number.trim() ||
      !form.neighborhood.trim() ||
      !form.city.trim() ||
      !form.state ||
      zip.length !== 8
    ) {
      setError("Preencha todos os campos obrigatórios do endereço.");
      return;
    }

    setAddressId(null);
    setNewAddress({
      ...form,
      zipCode: formatZipCode(zip),
      country: "BR",
      recipientName: form.recipientName.trim(),
    });
    nextStep();
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold text-text-primary">
        Endereço de entrega
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        Para onde devemos enviar seu pedido?
      </p>

      {isAuthenticated && addressesQuery.isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Carregando endereços" />
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
          {isAuthenticated && saved.length > 0 ? (
            <div className="flex flex-col gap-2">
              {saved.map((address) => (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => {
                    setUseNew(false);
                    setAddressId(address.id);
                    setNewAddress(null);
                  }}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-colors",
                    !useNew && addressId === address.id
                      ? "border-primary bg-primary-light/40"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <p className="text-sm font-medium text-text-primary">
                    {address.label ?? "Endereço"}
                    {address.isDefault ? (
                      <span className="ml-2 text-xs font-normal text-primary">
                        Padrão
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {address.street}, {address.number}
                    {address.complement ? ` — ${address.complement}` : ""}
                    <br />
                    {address.neighborhood} · {address.city}/{address.state}
                    <br />
                    CEP {address.zipCode}
                  </p>
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setUseNew(true);
                  setAddressId(null);
                }}
                className={cn(
                  "rounded-xl border border-dashed p-3 text-left text-sm font-medium transition-colors",
                  useNew
                    ? "border-primary bg-primary-light/30 text-primary"
                    : "border-border text-text-secondary hover:border-primary/40",
                )}
              >
                + Usar outro endereço
              </button>
            </div>
          ) : null}

          {useNew || !isAuthenticated || saved.length === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Nome do destinatário"
                  name="recipientName"
                  value={form.recipientName}
                  onChange={(e) => updateField("recipientName", e.target.value)}
                  required
                />
              </div>
              <Input
                label="CEP"
                name="zipCode"
                value={form.zipCode}
                onChange={(e) =>
                  updateField("zipCode", formatZipCode(e.target.value))
                }
                placeholder="00000-000"
                inputMode="numeric"
                required
              />
              <Input
                label="Telefone"
                name="phone"
                value={form.phone ?? ""}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="(11) 99999-9999"
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
                required
              />
              {isAuthenticated ? (
                <div className="sm:col-span-2">
                  <Checkbox
                    name="isDefault"
                    label="Definir como endereço padrão"
                    checked={form.isDefault}
                    onChange={(e) => updateField("isDefault", e.target.checked)}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={prevStep}>
              Voltar
            </Button>
            <Button type="submit">Continuar</Button>
          </div>
        </form>
      )}
    </div>
  );
}
