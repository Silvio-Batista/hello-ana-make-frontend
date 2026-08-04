import type { StoreSettings } from "@/contracts";

/** Configurações padrão da loja (mock mutável). */
export const defaultStoreSettings: StoreSettings = {
  storeName: "Hello Ana Make",
  freeShippingMinimum: 199,
  announcementText: "Frete grátis em compras acima de R$ 199",
  announcementEnabled: true,
  signupDiscountPercentage: 10,
  signupCouponPrefix: "BEMVINDA",
  contactEmail: "contato@helloanamake.com.br",
  contactWhatsapp: "5511999990000",
  instagramUrl: "https://instagram.com/helloanamake",
  currency: "BRL",
};
