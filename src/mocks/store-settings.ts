import type { StoreSettings } from "@/contracts";

/** Configurações padrão da loja (mock mutável, espelha o shape real do backend). */
export const defaultStoreSettings: StoreSettings = {
  store: {
    name: "Hello Ana Make",
    email: "contato@helloanamake.com.br",
    phone: "5511999990000",
    instagramUrl: "https://instagram.com/helloanamake",
  },
  checkout: {
    enabledPaymentMethods: ["credit_card", "pix", "boleto"],
    maxInstallments: 6,
    minInstallmentAmount: 20,
    allowGuestCheckout: false,
  },
  shipping: {
    originZipCode: "01310100",
    defaultWeightGrams: 300,
    defaultWidthCm: 15,
    defaultHeightCm: 10,
    defaultLengthCm: 20,
    freeShippingThresholds: {
      PAC: 149,
      SEDEX: 249,
      EXPRESSA: null,
    },
  },
  rewards: {
    enabled: true,
  },
  signupPromotion: {
    enabled: true,
    couponCode: "BEMVINDA10",
    discountPercentage: 10,
    message: "Cadastre-se e ganhe 10% de desconto na primeira compra.",
    expiresAt: "2027-12-31T23:59:59.000Z",
  },
  integrations: {
    paymentGateway: "mock",
    shippingProvider: "mock",
    asaasApiKey: undefined,
    superfreteToken: undefined,
  },
  currency: "BRL",
  timezone: "America/Sao_Paulo",
  updatedAt: new Date().toISOString(),
};
