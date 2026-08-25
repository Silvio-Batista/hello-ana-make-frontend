import type {
  AdminOrderListParams,
  CreateOrderRequest,
  Order,
  OrderItem,
  UpdateOrderStatusRequest,
} from "@/contracts";
import type {
  OrderListParams,
  OrderListResponse,
  OrderRepository,
} from "@/repositories/interfaces";
import {
  addresses,
  orders as seedOrders,
  products,
  requireCurrentUserId,
  users,
} from "@/mocks";
import { delay } from "@/repositories/utils";

/** Store mutável compartilhado com o seed. */
let orderStore = seedOrders;
let orderSeq = seedOrders.length + 1;

function matchesAdminSearch(order: Order, search: string): boolean {
  const q = search.toLowerCase().trim();
  if (!q) return true;
  if (order.orderNumber.toLowerCase().includes(q)) return true;
  const user = users.find((u) => u.id === order.userId);
  if (!user) return false;
  return (
    user.email.toLowerCase().includes(q) ||
    user.name.toLowerCase().includes(q)
  );
}

function paginateOrders(
  items: Order[],
  page: number,
  pageSize: number,
): OrderListResponse {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

/** Exposto para o admin calcular métricas no mesmo store. */
export function getMockOrderStore(): Order[] {
  return orderStore;
}

export class MockOrderRepository implements OrderRepository {
  async create(request: CreateOrderRequest): Promise<Order> {
    await delay();
    const userId = requireCurrentUserId();
    const shippingAddress = addresses.find(
      (a) => a.id === request.shippingAddressId && a.userId === userId,
    );
    if (!shippingAddress) {
      throw new Error("Endereço de entrega não encontrado.");
    }

    const billingAddress = request.billingAddressId
      ? addresses.find(
          (a) => a.id === request.billingAddressId && a.userId === userId,
        )
      : undefined;

    const items: OrderItem[] = request.items.map((item, index) => {
      const product = products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant) {
        throw new Error(
          `Produto ou variante inválidos: ${item.productId}/${item.variantId}`,
        );
      }
      const unitPrice = variant.price;
      const promotionalPrice = variant.promotionalPrice;
      const effective = promotionalPrice ?? unitPrice;
      return {
        id: `oi-new-${Date.now()}-${index}`,
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        variantId: variant.id,
        variantSku: variant.sku,
        variantName: variant.name,
        attributes: variant.attributes,
        image: variant.image ?? product.images[0]?.url ?? "",
        unitPrice,
        promotionalPrice,
        quantity: item.quantity,
        lineTotal: Math.round(effective * item.quantity * 100) / 100,
      };
    });

    const subtotal =
      Math.round(items.reduce((sum, i) => sum + i.lineTotal, 0) * 100) / 100;
    const now = new Date().toISOString();

    const order: Order = {
      id: `ord-${String(orderSeq).padStart(3, "0")}`,
      orderNumber: `HA-2026-${String(orderSeq).padStart(4, "0")}`,
      userId,
      status: "pending_payment",
      items,
      shippingAddress,
      billingAddress,
      subtotal,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: subtotal,
      currency: "BRL",
      couponCode: request.couponCode,
      paymentMethod: request.paymentMethod,
      paymentStatus: "pending",
      shippingOptionId: request.shippingOptionId,
      notes: request.notes,
      createdAt: now,
      updatedAt: now,
    };

    orderSeq += 1;
    orderStore.unshift(order);
    return order;
  }

  async getById(id: string): Promise<Order | null> {
    await delay();
    const userId = requireCurrentUserId();
    return (
      orderStore.find((o) => o.id === id && o.userId === userId) ?? null
    );
  }

  async getByOrderNumber(orderNumber: string): Promise<Order | null> {
    await delay();
    const userId = requireCurrentUserId();
    return (
      orderStore.find(
        (o) => o.orderNumber === orderNumber && o.userId === userId,
      ) ?? null
    );
  }

  async listMine(params: OrderListParams = {}): Promise<OrderListResponse> {
    await delay();
    const userId = requireCurrentUserId();
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    let items = orderStore.filter((o) => o.userId === userId);
    if (params.status) {
      items = items.filter((o) => o.status === params.status);
    }
    items = items.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return paginateOrders(items, page, pageSize);
  }

  async cancel(id: string, reason?: string): Promise<Order> {
    await delay();
    const userId = requireCurrentUserId();
    const index = orderStore.findIndex(
      (o) => o.id === id && o.userId === userId,
    );
    if (index < 0) throw new Error("Pedido não encontrado.");
    const order = orderStore[index]!;
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      throw new Error("Este pedido não pode ser cancelado.");
    }
    const updated: Order = {
      ...order,
      status: "cancelled",
      paymentStatus: "cancelled",
      notes: reason
        ? [order.notes, `Cancelado: ${reason}`].filter(Boolean).join(" | ")
        : order.notes,
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orderStore[index] = updated;
    return updated;
  }

  async listAll(params: AdminOrderListParams = {}): Promise<OrderListResponse> {
    await delay();
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    let items = [...orderStore];

    if (params.status) {
      items = items.filter((o) => o.status === params.status);
    }
    if (params.search) {
      items = items.filter((o) => matchesAdminSearch(o, params.search!));
    }
    if (params.from) {
      const fromTs = new Date(params.from).getTime();
      items = items.filter((o) => new Date(o.createdAt).getTime() >= fromTs);
    }
    if (params.to) {
      const toTs = new Date(params.to).getTime();
      items = items.filter((o) => new Date(o.createdAt).getTime() <= toTs);
    }

    items = items.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return paginateOrders(items, page, pageSize);
  }

  async updateStatus(
    id: string,
    request: UpdateOrderStatusRequest,
  ): Promise<Order> {
    await delay();
    const index = orderStore.findIndex((o) => o.id === id);
    if (index < 0) throw new Error("Pedido não encontrado.");
    const order = orderStore[index]!;
    const now = new Date().toISOString();
    const updated: Order = {
      ...order,
      status: request.status,
      trackingCode: request.trackingCode ?? order.trackingCode,
      trackingUrl: request.trackingUrl ?? order.trackingUrl,
      notes: request.notes ?? order.notes,
      updatedAt: now,
      shippedAt:
        request.status === "shipped" || request.status === "in_transit"
          ? (order.shippedAt ?? now)
          : order.shippedAt,
      deliveredAt:
        request.status === "delivered" ? (order.deliveredAt ?? now) : order.deliveredAt,
      cancelledAt:
        request.status === "cancelled" ? (order.cancelledAt ?? now) : order.cancelledAt,
      paidAt:
        request.status === "paid" ||
        ["processing", "shipped", "in_transit", "delivered"].includes(
          request.status,
        )
          ? (order.paidAt ?? now)
          : order.paidAt,
      paymentStatus:
        request.status === "cancelled"
          ? "cancelled"
          : request.status === "refunded"
            ? "refunded"
            : request.status === "pending_payment"
              ? order.paymentStatus
              : "paid",
    };
    orderStore[index] = updated;
    return updated;
  }
}
