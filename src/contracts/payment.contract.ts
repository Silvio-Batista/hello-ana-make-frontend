/**
 * Métodos de pagamento aceitos.
 */
export type PaymentMethod =
  | "credit_card"
  | "debit_card"
  | "pix"
  | "boleto"
  | "wallet"
  | "store_credit";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "authorized"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

/**
 * Dados de cartão (tokenizados — nunca enviar PAN completo).
 */
export interface CardPaymentData {
  token: string;
  installments: number;
  holderName: string;
  brand?: string;
  lastFourDigits?: string;
}

/**
 * Dados específicos de PIX.
 */
export interface PixPaymentData {
  expiresInSeconds?: number;
}

/**
 * Solicitação de criação de pagamento.
 */
export interface CreatePaymentRequest {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  card?: CardPaymentData;
  pix?: PixPaymentData;
  returnUrl?: string;
  metadata?: Record<string, string>;
}

/**
 * Resposta da criação de pagamento.
 */
export interface CreatePaymentResponse {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  /** QR Code / copia-e-cola PIX. */
  pixQrCode?: string;
  pixQrCodeUrl?: string;
  pixExpiresAt?: string;
  /** URL do boleto. */
  boletoUrl?: string;
  boletoBarcode?: string;
  /** URL de redirecionamento (3DS / wallet). */
  redirectUrl?: string;
  transactionId?: string;
  message?: string;
  createdAt: string;
}

/**
 * Dados de cartão + endereço de cobrança para tokenização (POST /payments/tokenize-card).
 * O Asaas não expõe SDK client-side/chave pública — a tokenização acontece no backend,
 * autenticada com a access_token secreta (nunca exposta ao navegador). Nome/e-mail/CPF/
 * telefone do titular vêm do perfil do usuário autenticado, não precisam ser reenviados.
 */
export interface TokenizeCardRequest {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  postalCode: string;
  addressNumber: string;
  addressComplement?: string;
}

export interface TokenizeCardResponse {
  token: string;
  brand?: string;
  lastFourDigits?: string;
}

/**
 * Contrato do gateway de pagamento.
 */
export interface PaymentGateway {
  readonly name: string;
  createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse>;
  getPaymentStatus(paymentId: string): Promise<CreatePaymentResponse>;
  refundPayment?(paymentId: string, amount?: number): Promise<CreatePaymentResponse>;
  cancelPayment?(paymentId: string): Promise<CreatePaymentResponse>;
}
