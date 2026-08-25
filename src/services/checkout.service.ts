import type {
  CreateOrderRequest,
  CreatePaymentRequest,
  CreatePaymentResponse,
  Order,
} from "@/contracts";
import { orderRepository, paymentRepository } from "@/lib/container";

export interface CheckoutResult {
  order: Order;
  payment?: CreatePaymentResponse;
}

export type CreateOrderPayment = Omit<
  CreatePaymentRequest,
  "orderId" | "amount" | "currency" | "method"
> & {
  amount?: number;
  currency?: string;
};

/**
 * Orquestra a criação do pedido e, opcionalmente, o pagamento inicial.
 */
export async function createOrder(
  request: CreateOrderRequest,
  payment?: CreateOrderPayment,
): Promise<CheckoutResult> {
  const order = await orderRepository.create(request);

  if (!payment) {
    return { order };
  }

  const paymentResponse = await paymentRepository.createPayment({
    orderId: order.id,
    method: request.paymentMethod,
    amount: payment.amount ?? order.total,
    currency: payment.currency ?? order.currency,
    card: payment.card,
    pix: payment.pix,
    returnUrl: payment.returnUrl,
    metadata: payment.metadata,
  });

  return { order, payment: paymentResponse };
}

export const checkoutService = {
  createOrder,
  getOrder(id: string): Promise<Order | null> {
    return orderRepository.getById(id);
  },
  getOrderByNumber(orderNumber: string): Promise<Order | null> {
    return orderRepository.getByOrderNumber(orderNumber);
  },
};
