"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/admin";
import {
  Button,
  Checkbox,
  Input,
  Skeleton,
  useToast,
} from "@/components/ui";
import {
  useAdminSettings,
  useUpdateAdminSettings,
} from "@/hooks/use-admin";
import type { StoreSettings } from "@/contracts";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useAdminSettings();
  const updateSettings = useUpdateAdminSettings();
  const [form, setForm] = useState<StoreSettings | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    try {
      await updateSettings.mutateAsync(form);
      toast("Configurações salvas.", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao salvar configurações.",
        "error",
      );
    }
  };

  if (isLoading || !form) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Preferências gerais da loja"
      />

      <form
        onSubmit={onSubmit}
        className="max-w-2xl space-y-4 rounded-xl border border-border bg-white p-5"
      >
        <Input
          label="Nome da loja"
          value={form.storeName}
          onChange={(e) =>
            setForm((prev) =>
              prev ? { ...prev, storeName: e.target.value } : prev,
            )
          }
          required
        />
        <Input
          label="Frete grátis a partir de (R$)"
          type="number"
          min={0}
          step="0.01"
          value={form.freeShippingMinimum}
          onChange={(e) =>
            setForm((prev) =>
              prev
                ? { ...prev, freeShippingMinimum: Number(e.target.value) }
                : prev,
            )
          }
          required
        />
        <Input
          label="Texto do anúncio"
          value={form.announcementText}
          onChange={(e) =>
            setForm((prev) =>
              prev ? { ...prev, announcementText: e.target.value } : prev,
            )
          }
        />
        <Checkbox
          label="Anúncio ativo"
          checked={form.announcementEnabled}
          onChange={(e) =>
            setForm((prev) =>
              prev
                ? { ...prev, announcementEnabled: e.target.checked }
                : prev,
            )
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Desconto de cadastro (%)"
            type="number"
            min={0}
            max={100}
            value={form.signupDiscountPercentage}
            onChange={(e) =>
              setForm((prev) =>
                prev
                  ? {
                      ...prev,
                      signupDiscountPercentage: Number(e.target.value),
                    }
                  : prev,
              )
            }
          />
          <Input
            label="Prefixo do cupom de cadastro"
            value={form.signupCouponPrefix}
            onChange={(e) =>
              setForm((prev) =>
                prev
                  ? { ...prev, signupCouponPrefix: e.target.value }
                  : prev,
              )
            }
          />
        </div>
        <Input
          label="E-mail de contato"
          type="email"
          value={form.contactEmail}
          onChange={(e) =>
            setForm((prev) =>
              prev ? { ...prev, contactEmail: e.target.value } : prev,
            )
          }
          required
        />
        <Input
          label="WhatsApp"
          value={form.contactWhatsapp ?? ""}
          onChange={(e) =>
            setForm((prev) =>
              prev
                ? { ...prev, contactWhatsapp: e.target.value || undefined }
                : prev,
            )
          }
        />
        <Input
          label="Instagram URL"
          value={form.instagramUrl ?? ""}
          onChange={(e) =>
            setForm((prev) =>
              prev
                ? { ...prev, instagramUrl: e.target.value || undefined }
                : prev,
            )
          }
        />
        <Input
          label="Moeda"
          value={form.currency}
          onChange={(e) =>
            setForm((prev) =>
              prev ? { ...prev, currency: e.target.value } : prev,
            )
          }
          required
        />
        <div className="flex justify-end pt-2">
          <Button type="submit" loading={updateSettings.isPending}>
            Salvar configurações
          </Button>
        </div>
      </form>
    </div>
  );
}
