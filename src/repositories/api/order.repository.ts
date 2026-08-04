import type {
  AdminOrderListParams,
  CreateOrderRequest,
  Order,
  UpdateOrderStatusRequest,
} from "@/contracts";
import type {
  OrderListParams,
  OrderListResponse,
  OrderRepository,
} from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiOrderRepository implements OrderRepository {
  create(_request: CreateOrderRequest): Promise<Order> {
    return notImplemented("ApiOrderRepository.create");
  }

  getById(_id: string): Promise<Order | null> {
    return notImplemented("ApiOrderRepository.getById");
  }

  getByOrderNumber(_orderNumber: string): Promise<Order | null> {
    return notImplemented("ApiOrderRepository.getByOrderNumber");
  }

  listMine(_params?: OrderListParams): Promise<OrderListResponse> {
    return notImplemented("ApiOrderRepository.listMine");
  }

  cancel(_id: string, _reason?: string): Promise<Order> {
    return notImplemented("ApiOrderRepository.cancel");
  }

  listAll(_params?: AdminOrderListParams): Promise<OrderListResponse> {
    return notImplemented("ApiOrderRepository.listAll");
  }

  updateStatus(
    _id: string,
    _request: UpdateOrderStatusRequest,
  ): Promise<Order> {
    return notImplemented("ApiOrderRepository.updateStatus");
  }
}
