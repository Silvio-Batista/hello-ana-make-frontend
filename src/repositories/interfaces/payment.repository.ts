import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentGateway,
  TokenizeCardRequest,
  TokenizeCardResponse,
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
  /** POST /payments/tokenize-card — gera o creditCardToken usado em createPayment. */
  tokenizeCard(request: TokenizeCardRequest): Promise<TokenizeCardResponse>;
}
