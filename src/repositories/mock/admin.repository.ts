import type {
  AdminDashboardStats,
  OrderStatus,
  StoreIntegrationsSettings,
  StoreSettings,
} from "@/contracts";
import type { AdminRepository } from "@/repositories/interfaces";
import { defaultStoreSettings, products, users } from "@/mocks";
import {
  getMockOrderStore,
} from "@/repositories/mock/order.repository";
import { delay } from "@/repositories/utils";

let settingsStore: StoreSettings = { ...defaultStoreSettings };

const ORDER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "in_transit",
  "delivered",
  "cancelled",
  "refunded",
  "returned",
];

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isPaidRevenue(status: string, paymentStatus: string): boolean {
  if (["cancelled", "refunded", "returned"].includes(status)) return false;
  return paymentStatus === "paid" || paymentStatus === "authorized";
}

function maskSecret(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const prefix = value.includes("_") ? value.split("_")[0] : value.slice(0, 4);
  return `${prefix}_****`;
}

function maskedSettings(): StoreSettings {
  return {
    ...settingsStore,
    integrations: {
      ...settingsStore.integrations,
      asaasApiKey: maskSecret(settingsStore.integrations.asaasApiKey),
      superfreteToken: maskSecret(settingsStore.integrations.superfreteToken),
    },
  };
}

export class MockAdminRepository implements AdminRepository {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    await delay();
    const now = new Date();
    const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const orderStore = getMockOrderStore();

    const paidOrders = orderStore.filter((o) => isPaidRevenue(o.status, o.paymentStatus));
    const revenue = round2(paidOrders.reduce((sum, o) => sum + o.total, 0));
    const averageTicket = paidOrders.length ? round2(revenue / paidOrders.length) : 0;

    const ordersByStatus = Object.fromEntries(
      ORDER_STATUSES.map((status) => [status, 0]),
    ) as Record<OrderStatus, number>;
    for (const order of orderStore) {
      ordersByStatus[order.status] += 1;
    }

    const unitsByProduct = new Map<string, { name: string; unitsSold: number }>();
    for (const order of orderStore) {
      for (const item of order.items) {
        const current = unitsByProduct.get(item.productId) ?? {
          name: item.productName,
          unitsSold: 0,
        };
        current.unitsSold += item.quantity;
        unitsByProduct.set(item.productId, current);
      }
    }
    const topProducts = [...unitsByProduct.entries()]
      .map(([productId, v]) => ({ productId, name: v.name, unitsSold: v.unitsSold }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 10);

    return {
      period: {
        from: from.toISOString().slice(0, 10),
        to: now.toISOString().slice(0, 10),
      },
      ordersCount: orderStore.length,
      ordersPaidCount: paidOrders.length,
      revenue,
      averageTicket,
      newCustomers: users.filter((u) => new Date(u.createdAt).getTime() >= from.getTime())
        .length,
      productsLowStock: products.filter((p) => p.inventory.isLowStock).length,
      ordersByStatus,
      topProducts,
    };
  }

  async getSettings(): Promise<StoreSettings> {
    await delay();
    return maskedSettings();
  }

  async updateSettings(
    input: Partial<Omit<StoreSettings, "integrations" | "updatedAt">>,
  ): Promise<StoreSettings> {
    await delay();
    settingsStore = {
      ...settingsStore,
      ...(input.store ? { store: { ...settingsStore.store, ...input.store } } : {}),
      ...(input.checkout
        ? { checkout: { ...settingsStore.checkout, ...input.checkout } }
        : {}),
      ...(input.shipping
        ? {
            shipping: {
              ...settingsStore.shipping,
              ...input.shipping,
              freeShippingThresholds: {
                ...settingsStore.shipping.freeShippingThresholds,
                ...input.shipping.freeShippingThresholds,
              },
            },
          }
        : {}),
      ...(input.rewards ? { rewards: { ...settingsStore.rewards, ...input.rewards } } : {}),
      ...(input.signupPromotion
        ? { signupPromotion: { ...settingsStore.signupPromotion, ...input.signupPromotion } }
        : {}),
      currency: input.currency ?? settingsStore.currency,
      timezone: input.timezone ?? settingsStore.timezone,
      updatedAt: new Date().toISOString(),
    };
    return maskedSettings();
  }

  async updateIntegrations(
    input: Partial<StoreIntegrationsSettings>,
  ): Promise<StoreIntegrationsSettings & { updatedAt: string }> {
    await delay();
    const integrations = { ...settingsStore.integrations, ...input };
    const updatedAt = new Date().toISOString();
    settingsStore = { ...settingsStore, integrations, updatedAt };
    return {
      paymentGateway: integrations.paymentGateway,
      shippingProvider: integrations.shippingProvider,
      asaasApiKey: maskSecret(integrations.asaasApiKey),
      superfreteToken: maskSecret(integrations.superfreteToken),
      updatedAt,
    };
  }
}
