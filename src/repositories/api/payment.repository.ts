import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentGateway,
} from "@/contracts";
import type { PaymentRepository } from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiPaymentRepository implements PaymentRepository {
  createPayment(
    _request: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    return notImplemented("ApiPaymentRepository.createPayment");
  }

  getPaymentStatus(_paymentId: string): Promise<CreatePaymentResponse> {
    return notImplemented("ApiPaymentRepository.getPaymentStatus");
  }

  refundPayment(
    _paymentId: string,
    _amount?: number,
  ): Promise<CreatePaymentResponse> {
    return notImplemented("ApiPaymentRepository.refundPayment");
  }

  cancelPayment(_paymentId: string): Promise<CreatePaymentResponse> {
    return notImplemented("ApiPaymentRepository.cancelPayment");
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
}
