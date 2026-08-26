import type {
  AdminOrderListParams,
  CreateOrderRequest,
  CreatePaymentResponse,
  Order,
  UpdateOrderStatusRequest,
} from "@/contracts";
import type {
  OrderListParams,
  OrderListResponse,
  OrderRepository,
} from "@/repositories/interfaces";
import { apiGet, apiPatch, apiPost, getOrNull } from "@/lib/http-client";

export class ApiOrderRepository implements OrderRepository {
  async create(request: CreateOrderRequest): Promise<Order> {
    const { order } = await apiPost<{ order: Order; payment?: CreatePaymentResponse }>(
      "/orders",
      request,
    );
    return order;
  }

  getById(id: string): Promise<Order | null> {
    return getOrNull<Order>(`/orders/${id}`);
  }

  getByOrderNumber(orderNumber: string): Promise<Order | null> {
    return getOrNull<Order>(`/orders/by-number/${orderNumber}`);
  }

  listMine(params: OrderListParams = {}): Promise<OrderListResponse> {
    return apiGet<OrderListResponse>("/orders", {
      page: params.page,
      pageSize: params.pageSize,
      status: params.status,
    });
  }

  cancel(id: string, reason?: string): Promise<Order> {
    return apiPost<Order>(`/orders/${id}/cancel`, { reason });
  }

  listAll(params: AdminOrderListParams = {}): Promise<OrderListResponse> {
    return apiGet<OrderListResponse>("/admin/orders", {
      page: params.page,
      pageSize: params.pageSize,
      status: params.status,
      search: params.search,
      from: params.from,
      to: params.to,
    });
  }

  updateStatus(id: string, request: UpdateOrderStatusRequest): Promise<Order> {
    return apiPatch<Order>(`/admin/orders/${id}/status`, request);
  }

  refund(id: string, amount?: number): Promise<CreatePaymentResponse> {
    return apiPost<CreatePaymentResponse>(`/admin/orders/${id}/refund`, { amount });
  }
}
