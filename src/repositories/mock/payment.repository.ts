import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
} from "@/contracts";
import type { PaymentRepository } from "@/repositories/interfaces";
import { delay } from "@/repositories/utils";

const payments = new Map<string, CreatePaymentResponse>();

export class MockPaymentRepository implements PaymentRepository {
  async createPayment(
    request: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    await delay();
    const id = `pay-${Date.now()}`;
    const now = new Date().toISOString();

    let response: CreatePaymentResponse = {
      id,
      orderId: request.orderId,
      method: request.method,
      status: "pending",
      amount: request.amount,
      currency: request.currency,
      createdAt: now,
      message: "Pagamento criado (mock).",
    };

    if (request.method === "pix") {
      response = {
        ...response,
        pixQrCode: `00020126580014BR.GOV.BCB.PIX0136${id}520400005303986540${request.amount.toFixed(2)}5802BR5925HELLO ANA MAKE LTDA6009SAO PAULO62070503***6304ABCD`,
        pixQrCodeUrl: `https://picsum.photos/seed/${id}/300/300`,
        pixExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      };
    } else if (request.method === "boleto") {
      response = {
        ...response,
        boletoUrl: `https://example.com/boleto/${id}`,
        boletoBarcode: "23793.38128 60000.000003 00000.000400 1 84340000010000",
      };
    } else {
      response = {
        ...response,
        status: "authorized",
        transactionId: `txn-${id}`,
        redirectUrl: request.returnUrl,
      };
    }

    payments.set(id, response);
    return response;
  }

  async getPaymentStatus(paymentId: string): Promise<CreatePaymentResponse> {
    await delay();
    const payment = payments.get(paymentId);
    if (!payment) throw new Error("Pagamento não encontrado.");
    return payment;
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<CreatePaymentResponse> {
    await delay();
    const payment = payments.get(paymentId);
    if (!payment) throw new Error("Pagamento não encontrado.");
    const updated: CreatePaymentResponse = {
      ...payment,
      status: amount && amount < payment.amount ? "partially_refunded" : "refunded",
      message: "Reembolso processado (mock).",
    };
    payments.set(paymentId, updated);
    return updated;
  }

  async cancelPayment(paymentId: string): Promise<CreatePaymentResponse> {
    await delay();
    const payment = payments.get(paymentId);
    if (!payment) throw new Error("Pagamento não encontrado.");
    const updated: CreatePaymentResponse = {
      ...payment,
      status: "cancelled",
      message: "Pagamento cancelado (mock).",
    };
    payments.set(paymentId, updated);
    return updated;
  }
}
