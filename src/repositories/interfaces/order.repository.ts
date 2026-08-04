import type {
  AdminOrderListParams,
  CreateOrderRequest,
  Order,
  OrderStatus,
  UpdateOrderStatusRequest,
} from "@/contracts";

/**
 * Parâmetros de listagem de pedidos do usuário.
 */
export interface OrderListParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
}

/**
 * Resposta paginada de pedidos.
 */
export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Repositório de pedidos.
 */
export interface OrderRepository {
  create(request: CreateOrderRequest): Promise<Order>;
  getById(id: string): Promise<Order | null>;
  getByOrderNumber(orderNumber: string): Promise<Order | null>;
  listMine(params?: OrderListParams): Promise<OrderListResponse>;
  cancel(id: string, reason?: string): Promise<Order>;
  listAll(params?: AdminOrderListParams): Promise<OrderListResponse>;
  updateStatus(id: string, request: UpdateOrderStatusRequest): Promise<Order>;
}
