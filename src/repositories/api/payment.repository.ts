import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentGateway,
  TokenizeCardRequest,
  TokenizeCardResponse,
} from "@/contracts";
import type { PaymentRepository } from "@/repositories/interfaces";
import { apiGet, apiPost } from "@/lib/http-client";
import { notImplemented } from "@/repositories/utils";

export class ApiPaymentRepository implements PaymentRepository {
  createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    return apiPost<CreatePaymentResponse>("/payments", request);
  }

  getPaymentStatus(paymentId: string): Promise<CreatePaymentResponse> {
    return apiGet<CreatePaymentResponse>(`/payments/${paymentId}`);
  }

  refundPayment(paymentId: string, amount?: number): Promise<CreatePaymentResponse> {
    return apiPost<CreatePaymentResponse>(`/payments/${paymentId}/refund`, { amount });
  }

  cancelPayment(paymentId: string): Promise<CreatePaymentResponse> {
    return apiPost<CreatePaymentResponse>(`/payments/${paymentId}/cancel`);
  }

  tokenizeCard(request: TokenizeCardRequest): Promise<TokenizeCardResponse> {
    return apiPost<TokenizeCardResponse>("/payments/tokenize-card", request);
  }
}

export class AsaasPaymentGateway implements PaymentGateway, PaymentRepository {
  readonly name = "Asaas";

  createPayment(
    _request: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    return notImplemented("AsaasPaymentGateway.createPayment");
  }

  getPaymentStatus(_paymentId: string): Promise<CreatePaymentResponse> {
    return notImplemented("AsaasPaymentGateway.getPaymentStatus");
  }

  refundPayment(
    _paymentId: string,
    _amount?: number,
  ): Promise<CreatePaymentResponse> {
    return notImplemented("AsaasPaymentGateway.refundPayment");
  }

  cancelPayment(_paymentId: string): Promise<CreatePaymentResponse> {
    return notImplemented("AsaasPaymentGateway.cancelPayment");
  }

  tokenizeCard(_request: TokenizeCardRequest): Promise<TokenizeCardResponse> {
    return notImplemented("AsaasPaymentGateway.tokenizeCard");
  }
}

export class MercadoPagoPaymentGateway
  implements PaymentGateway, PaymentRepository
{
  readonly name = "MercadoPago";

  createPayment(
    _request: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    return notImplemented("MercadoPagoPaymentGateway.createPayment");
  }

  getPaymentStatus(_paymentId: string): Promise<CreatePaymentResponse> {
    return notImplemented("MercadoPagoPaymentGateway.getPaymentStatus");
  }

  refundPayment(
    _paymentId: string,
    _amount?: number,
  ): Promise<CreatePaymentResponse> {
    return notImplemented("MercadoPagoPaymentGateway.refundPayment");
  }

  cancelPayment(_paymentId: string): Promise<CreatePaymentResponse> {
    return notImplemented("MercadoPagoPaymentGateway.cancelPayment");
  }

  tokenizeCard(_request: TokenizeCardRequest): Promise<TokenizeCardResponse> {
    return notImplemented("MercadoPagoPaymentGateway.tokenizeCard");
  }
}

export class StripePaymentGateway implements PaymentGateway, PaymentRepository {
  readonly name = "Stripe";

  createPayment(
    _request: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    return notImplemented("StripePaymentGateway.createPayment");
  }

  getPaymentStatus(_paymentId: string): Promise<CreatePaymentResponse> {
    return notImplemented("StripePaymentGateway.getPaymentStatus");
  }

  refundPayment(
    _paymentId: string,
    _amount?: number,
  ): Promise<CreatePaymentResponse> {
    return notImplemented("StripePaymentGateway.refundPayment");
  }

  cancelPayment(_paymentId: string): Promise<CreatePaymentResponse> {
    return notImplemented("StripePaymentGateway.cancelPayment");
  }

  tokenizeCard(_request: TokenizeCardRequest): Promise<TokenizeCardResponse> {
    return notImplemented("StripePaymentGateway.tokenizeCard");
  }
}
