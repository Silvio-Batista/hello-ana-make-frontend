import type { AdminDashboardStats, StoreSettings } from "@/contracts";
import type { AdminRepository } from "@/repositories/interfaces";
import {
  coupons,
  defaultStoreSettings,
  products,
  promotions,
} from "@/mocks";
import {
  countPendingOrders,
  getMockOrderStore,
} from "@/repositories/mock/order.repository";
import { delay } from "@/repositories/utils";

let settingsStore: StoreSettings = { ...defaultStoreSettings };

function isActiveInPeriod(
  isActive: boolean,
  startsAt: string,
  endsAt: string,
  now: number,
): boolean {
  return (
    isActive &&
    now >= new Date(startsAt).getTime() &&
    now <= new Date(endsAt).getTime()
  );
}

function isSameDay(iso: string, ref: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

function isSameMonth(iso: string, ref: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
  );
}

function isPaidRevenue(status: string, paymentStatus: string): boolean {
  if (["cancelled", "refunded", "returned"].includes(status)) return false;
  return paymentStatus === "paid" || paymentStatus === "authorized";
}

export class MockAdminRepository implements AdminRepository {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    await delay();
    const now = new Date();
    const nowTs = now.getTime();
    const orderStore = getMockOrderStore();

    const revenueOrders = orderStore.filter((o) =>
      isPaidRevenue(o.status, o.paymentStatus),
    );

    const revenueTotal =
      Math.round(
        revenueOrders.reduce((sum, o) => sum + o.total, 0) * 100,
      ) / 100;

    const revenueMonth =
      Math.round(
        revenueOrders
          .filter((o) => isSameMonth(o.createdAt, now))
          .reduce((sum, o) => sum + o.total, 0) * 100,
      ) / 100;

    return {
      totalOrders: orderStore.length,
      ordersToday: orderStore.filter((o) => isSameDay(o.createdAt, now)).length,
      revenueTotal,
      revenueMonth,
      productsCount: products.length,
      lowStockCount: products.filter((p) => p.inventory.isLowStock).length,
      pendingOrders: countPendingOrders(),
      activeCoupons: coupons.filter((c) =>
        isActiveInPeriod(c.isActive, c.startsAt, c.endsAt, nowTs),
      ).length,
      activePromotions: promotions.filter((p) =>
        isActiveInPeriod(p.isActive, p.startsAt, p.endsAt, nowTs),
      ).length,
    };
  }

  async getSettings(): Promise<StoreSettings> {
    await delay();
    return { ...settingsStore };
  }

  async updateSettings(
    input: Partial<StoreSettings>,
  ): Promise<StoreSettings> {
    await delay();
    settingsStore = { ...settingsStore, ...input };
    return { ...settingsStore };
  }
}
