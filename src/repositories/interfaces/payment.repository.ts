import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentGateway,
} from "@/contracts";

export type { PaymentGateway };

/**
 * Repositório de pagamentos (fachada sobre PaymentGateway).
 */
export interface PaymentRepository {
  createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse>;
  getPaymentStatus(paymentId: string): Promise<CreatePaymentResponse>;
  refundPayment?(paymentId: string, amount?: number): Promise<CreatePaymentResponse>;
  cancelPayment?(paymentId: string): Promise<CreatePaymentResponse>;
}
