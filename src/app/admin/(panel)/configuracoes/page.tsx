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
  useUpdateAdminIntegrations,
  useUpdateAdminSettings,
} from "@/hooks/use-admin";
import type { PaymentMethod, StoreSettings } from "@/contracts";
import { PAYMENT_METHOD_LABELS } from "@/lib/order-status";

const PAYMENT_METHODS: PaymentMethod[] = [
  "credit_card",
  "debit_card",
  "pix",
  "boleto",
  "wallet",
  "store_credit",
];

function togglePaymentMethod(
  methods: string[],
  method: PaymentMethod,
  enabled: boolean,
): string[] {
  if (enabled) return methods.includes(method) ? methods : [...methods, method];
  return methods.filter((m) => m !== method);
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useAdminSettings();
  const updateSettings = useUpdateAdminSettings();
  const updateIntegrations = useUpdateAdminIntegrations();
  const [form, setForm] = useState<StoreSettings | null>(null);

  const [paymentGateway, setPaymentGateway] = useState("");
  const [shippingProvider, setShippingProvider] = useState("");
  const [asaasApiKey, setAsaasApiKey] = useState("");
  const [superfreteToken, setSuperfreteToken] = useState("");

  useEffect(() => {
    if (settings) {
      setForm(settings);
      setPaymentGateway(settings.integrations.paymentGateway);
      setShippingProvider(settings.integrations.shippingProvider);
    }
  }, [settings]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    try {
      await updateSettings.mutateAsync({
        store: form.store,
        checkout: form.checkout,
        shipping: form.shipping,
        rewards: form.rewards,
        signupPromotion: form.signupPromotion,
        currency: form.currency,
        timezone: form.timezone,
      });
      toast("Configurações salvas.", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao salvar configurações.",
        "error",
      );
    }
  };

  const onSubmitIntegrations = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await updateIntegrations.mutateAsync({
        paymentGateway,
        shippingProvider,
        ...(asaasApiKey.trim() ? { asaasApiKey: asaasApiKey.trim() } : {}),
        ...(superfreteToken.trim() ? { superfreteToken: superfreteToken.trim() } : {}),
      });
      setAsaasApiKey("");
      setSuperfreteToken("");
      toast("Integrações atualizadas.", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao salvar integrações.",
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
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Preferências gerais da loja"
      />

      <form
        onSubmit={onSubmit}
        className="max-w-2xl space-y-6 rounded-xl border border-border bg-white p-5"
      >
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Loja</h3>
          <Input
            label="Nome da loja"
            value={form.store.name}
            onChange={(e) =>
              setForm((prev) =>
                prev ? { ...prev, store: { ...prev.store, name: e.target.value } } : prev,
              )
            }
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="E-mail de contato"
              type="email"
              value={form.store.email}
              onChange={(e) =>
                setForm((prev) =>
                  prev ? { ...prev, store: { ...prev.store, email: e.target.value } } : prev,
                )
              }
              required
            />
            <Input
              label="Telefone"
              value={form.store.phone ?? ""}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? { ...prev, store: { ...prev.store, phone: e.target.value || undefined } }
                    : prev,
                )
              }
            />
          </div>
          <Input
            label="Instagram URL"
            value={form.store.instagramUrl ?? ""}
            onChange={(e) =>
              setForm((prev) =>
                prev
                  ? {
                      ...prev,
                      store: { ...prev.store, instagramUrl: e.target.value || undefined },
                    }
                  : prev,
              )
            }
          />
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-text-primary">Checkout</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PAYMENT_METHODS.map((method) => (
              <Checkbox
                key={method}
                label={PAYMENT_METHOD_LABELS[method]}
                checked={form.checkout.enabledPaymentMethods.includes(method)}
                onChange={(e) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          checkout: {
                            ...prev.checkout,
                            enabledPaymentMethods: togglePaymentMethod(
                              prev.checkout.enabledPaymentMethods,
                              method,
                              e.target.checked,
                            ),
                          },
                        }
                      : prev,
                  )
                }
              />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Parcelas máximas"
              type="number"
              min={1}
              value={form.checkout.maxInstallments}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        checkout: {
                          ...prev.checkout,
                          maxInstallments: Number(e.target.value),
                        },
                      }
                    : prev,
                )
              }
            />
            <Input
              label="Valor mínimo da parcela (R$)"
              type="number"
              min={0}
              step="0.01"
              value={form.checkout.minInstallmentAmount}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        checkout: {
                          ...prev.checkout,
                          minInstallmentAmount: Number(e.target.value),
                        },
                      }
                    : prev,
                )
              }
            />
          </div>
          <Checkbox
            label="Permitir checkout como convidado"
            checked={form.checkout.allowGuestCheckout}
            onChange={(e) =>
              setForm((prev) =>
                prev
                  ? {
                      ...prev,
                      checkout: { ...prev.checkout, allowGuestCheckout: e.target.checked },
                    }
                  : prev,
              )
            }
          />
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Frete grátis a partir de (R$)
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {(["PAC", "SEDEX", "EXPRESSA"] as const).map((service) => (
              <Input
                key={service}
                label={service}
                type="number"
                min={0}
                step="0.01"
                value={form.shipping.freeShippingThresholds[service] ?? ""}
                placeholder="Sem frete grátis"
                onChange={(e) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          shipping: {
                            ...prev.shipping,
                            freeShippingThresholds: {
                              ...prev.shipping.freeShippingThresholds,
                              [service]: e.target.value === "" ? null : Number(e.target.value),
                            },
                          },
                        }
                      : prev,
                  )
                }
              />
            ))}
          </div>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-text-primary">Recompensas</h3>
          <Checkbox
            label="Programa de brindes por valor do carrinho ativo"
            checked={form.rewards.enabled}
            onChange={(e) =>
              setForm((prev) =>
                prev ? { ...prev, rewards: { enabled: e.target.checked } } : prev,
              )
            }
          />
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Promoção de cadastro
          </h3>
          <Checkbox
            label="Promoção ativa"
            checked={form.signupPromotion.enabled}
            onChange={(e) =>
              setForm((prev) =>
                prev
                  ? {
                      ...prev,
                      signupPromotion: { ...prev.signupPromotion, enabled: e.target.checked },
                    }
                  : prev,
              )
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Código do cupom"
              value={form.signupPromotion.couponCode}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        signupPromotion: {
                          ...prev.signupPromotion,
                          couponCode: e.target.value.toUpperCase(),
                        },
                      }
                    : prev,
                )
              }
            />
            <Input
              label="Desconto (%)"
              type="number"
              min={0}
              max={100}
              value={form.signupPromotion.discountPercentage}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        signupPromotion: {
                          ...prev.signupPromotion,
                          discountPercentage: Number(e.target.value),
                        },
                      }
                    : prev,
                )
              }
            />
          </div>
          <Input
            label="Mensagem"
            value={form.signupPromotion.message}
            onChange={(e) =>
              setForm((prev) =>
                prev
                  ? {
                      ...prev,
                      signupPromotion: { ...prev.signupPromotion, message: e.target.value },
                    }
                  : prev,
              )
            }
          />
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Moeda"
              value={form.currency}
              onChange={(e) =>
                setForm((prev) => (prev ? { ...prev, currency: e.target.value } : prev))
              }
              required
            />
            <Input
              label="Fuso horário"
              value={form.timezone}
              onChange={(e) =>
                setForm((prev) => (prev ? { ...prev, timezone: e.target.value } : prev))
              }
              required
            />
          </div>
        </section>

        <div className="flex justify-end pt-2">
          <Button type="submit" loading={updateSettings.isPending}>
            Salvar configurações
          </Button>
        </div>
      </form>

      <form
        onSubmit={onSubmitIntegrations}
        className="max-w-2xl space-y-4 rounded-xl border border-border bg-white p-5"
      >
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Integrações</h3>
          <p className="mt-1 text-xs text-text-secondary">
            Chaves e tokens ficam mascarados após salvos — preencha apenas para substituir o
            valor atual.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Gateway de pagamento"
            value={paymentGateway}
            onChange={(e) => setPaymentGateway(e.target.value)}
            placeholder="mock ou asaas"
          />
          <Input
            label="Provedor de frete"
            value={shippingProvider}
            onChange={(e) => setShippingProvider(e.target.value)}
            placeholder="mock ou superfrete"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Chave da API Asaas"
            type="password"
            value={asaasApiKey}
            onChange={(e) => setAsaasApiKey(e.target.value)}
            placeholder={
              form.integrations.asaasApiKey ? "Já configurada — digite para substituir" : "Não configurada"
            }
          />
          <Input
            label="Token SuperFrete"
            type="password"
            value={superfreteToken}
            onChange={(e) => setSuperfreteToken(e.target.value)}
            placeholder={
              form.integrations.superfreteToken
                ? "Já configurado — digite para substituir"
                : "Não configurado"
            }
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" loading={updateIntegrations.isPending}>
            Salvar integrações
          </Button>
        </div>
      </form>
    </div>
  );
}
