import type { ShippingOption, ShippingQuoteResponse } from "@/contracts";

export interface ShippingRateTemplate {
  id: string;
  provider: string;
  serviceName: string;
  serviceCode: string;
  basePrice: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  freeAbove: number | null;
}

/** PAC, SEDEX e Expressa (SuperFrete). */
export const shippingRates: ShippingRateTemplate[] = [
  {
    id: "ship-pac",
    provider: "Correios",
    serviceName: "PAC",
    serviceCode: "PAC",
    basePrice: 14.9,
    estimatedDaysMin: 6,
    estimatedDaysMax: 12,
    freeAbove: 149,
  },
  {
    id: "ship-sedex",
    provider: "Correios",
    serviceName: "SEDEX",
    serviceCode: "SEDEX",
    basePrice: 24.9,
    estimatedDaysMin: 2,
    estimatedDaysMax: 5,
    freeAbove: 249,
  },
  {
    id: "ship-expressa",
    provider: "SuperFrete",
    serviceName: "Expressa",
    serviceCode: "EXPRESSA",
    basePrice: 34.9,
    estimatedDaysMin: 1,
    estimatedDaysMax: 2,
    freeAbove: null,
  },
];

export function buildShippingQuote(
  zipCode: string,
  subtotal = 0,
): ShippingQuoteResponse {
  const options: ShippingOption[] = shippingRates.map((rate) => {
    const isFree = rate.freeAbove !== null && subtotal >= rate.freeAbove;
    return {
      id: rate.id,
      provider: rate.provider,
      serviceName: rate.serviceName,
      serviceCode: rate.serviceCode,
      price: isFree ? 0 : rate.basePrice,
      currency: "BRL",
      estimatedDaysMin: rate.estimatedDaysMin,
      estimatedDaysMax: rate.estimatedDaysMax,
      isFree,
    };
  });

  return {
    zipCode,
    options,
    quotedAt: new Date().toISOString(),
  };
}
