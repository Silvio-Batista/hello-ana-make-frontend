"use client";

import { useEffect, useMemo, useRef } from "react";
import { Button, Spinner } from "@/components/ui";
import { useAddresses, useCart, useShippingQuote } from "@/hooks";
import { formatCurrency, cn } from "@/lib/utils";
import { useCheckoutStore } from "@/stores";

export function ShippingStep() {
  const { items, subtotal, setShipping } = useCart();

  const addressId = useCheckoutStore((s) => s.addressId);
  const newAddress = useCheckoutStore((s) => s.newAddress);
  const shippingOptionId = useCheckoutStore((s) => s.shippingOptionId);
  const setShippingOptionId = useCheckoutStore((s) => s.setShippingOptionId);
  const nextStep = useCheckoutStore((s) => s.nextStep);
  const prevStep = useCheckoutStore((s) => s.prevStep);

  const addressesQuery = useAddresses(Boolean(addressId));
  const selectedAddress = addressesQuery.data?.find((a) => a.id === addressId);

  const zipCode = newAddress?.zipCode ?? selectedAddress?.zipCode ?? "";

  // Chave por conteúdo (não a referência de `items`, que muda a cada resposta do
  // servidor mesmo sem mudança real) — evita recotar frete a cada `setShipping`,
  // que já escreve no carrinho e faria `items` mudar de novo, num loop.
  const itemsKey = items.map((item) => `${item.variantId}:${item.quantity}`).join(",");

  const quoteRequest = useMemo(() => {
    const digits = zipCode.replace(/\D/g, "");
    if (digits.length < 8 || items.length === 0) return null;
    return {
      zipCode: digits,
      subtotal,
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipCode, itemsKey, subtotal]);

  const quote = useShippingQuote(quoteRequest);

  // Ref pro `setShipping` mais recente — o efeito de sincronização só deve reagir
  // à cotação/seleção mudando, nunca à identidade da função em si.
  const setShippingRef = useRef(setShipping);
  useEffect(() => {
    setShippingRef.current = setShipping;
  }, [setShipping]);

  useEffect(() => {
    const options = quote.data?.options;
    if (!options?.length) return;
    if (shippingOptionId && options.some((o) => o.id === shippingOptionId)) {
      const current = options.find((o) => o.id === shippingOptionId);
      if (current) void setShippingRef.current(current, zipCode);
      return;
    }
    const preferred = options.find((o) => o.isFree) ?? options[0];
    if (preferred) {
      setShippingOptionId(preferred.id);
      void setShippingRef.current(preferred, zipCode);
    }
  }, [quote.data, shippingOptionId, setShippingOptionId, zipCode]);

  const continueNext = async () => {
    if (!shippingOptionId) return;
    const option = quote.data?.options.find((o) => o.id === shippingOptionId);
    if (option) await setShipping(option, zipCode);
    nextStep();
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold text-text-primary">
        Opções de entrega
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        CEP {zipCode || "—"} · escolha a melhor opção para você
      </p>

      {quote.isLoading || (!quote.data && quote.isFetching) ? (
        <div className="flex justify-center py-10">
          <Spinner label="Calculando frete" />
        </div>
      ) : quote.isError ? (
        <p className="mt-6 text-sm text-error" role="alert">
          Não foi possível calcular o frete. Verifique o CEP e tente novamente.
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-2">
          {(quote.data?.options ?? []).map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => {
                  setShippingOptionId(option.id);
                  void setShipping(option, zipCode);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors",
                  shippingOptionId === option.id
                    ? "border-primary bg-primary-light/40"
                    : "border-border hover:border-primary/40",
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {option.serviceName}
                    <span className="ml-2 font-normal text-text-secondary">
                      · {option.provider}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {option.estimatedDaysMin === option.estimatedDaysMax
                      ? `${option.estimatedDaysMin} dias úteis`
                      : `${option.estimatedDaysMin}–${option.estimatedDaysMax} dias úteis`}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-text-primary">
                  {option.isFree || option.price === 0
                    ? "Grátis"
                    : formatCurrency(option.price)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button
          type="button"
          onClick={continueNext}
          disabled={!shippingOptionId}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
