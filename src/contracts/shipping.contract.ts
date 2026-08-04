import type { Address } from "./address.contract";

/**
 * Item considerado no cálculo de frete.
 */
export interface ShippingQuoteItem {
  productId: string;
  variantId: string;
  quantity: number;
  weightGrams?: number;
  widthCm?: number;
  heightCm?: number;
  lengthCm?: number;
}

/**
 * Solicitação de cotação de frete.
 */
export interface ShippingQuoteRequest {
  zipCode: string;
  items: ShippingQuoteItem[];
  /** Valor do subtotal para frete grátis / regras. */
  subtotal?: number;
}

/**
 * Opção de frete disponível.
 */
export interface ShippingOption {
  id: string;
  provider: string;
  serviceName: string;
  serviceCode: string;
  price: number;
  currency: string;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  isFree: boolean;
}

/**
 * Resposta de cotação com opções disponíveis.
 */
export interface ShippingQuoteResponse {
  zipCode: string;
  options: ShippingOption[];
  quotedAt: string;
}

/**
 * Solicitação de criação de envio/etiqueta.
 */
export interface ShipmentRequest {
  orderId: string;
  shippingOptionId: string;
  address: Address;
  items: ShippingQuoteItem[];
  invoiceNumber?: string;
}

/**
 * Resposta após criação do envio.
 */
export interface ShipmentResponse {
  id: string;
  orderId: string;
  trackingCode: string;
  trackingUrl?: string;
  labelUrl?: string;
  provider: string;
  serviceName: string;
  price: number;
  status: "pending" | "labeled" | "shipped" | "in_transit" | "delivered" | "failed" | "cancelled";
  estimatedDeliveryAt?: string;
  createdAt: string;
}

/**
 * Contrato do provedor de frete (implementações concretas no backend/adapters).
 */
export interface ShippingProvider {
  readonly name: string;
  quote(request: ShippingQuoteRequest): Promise<ShippingQuoteResponse>;
  createShipment(request: ShipmentRequest): Promise<ShipmentResponse>;
  getTracking(trackingCode: string): Promise<ShipmentResponse>;
  cancelShipment?(shipmentId: string): Promise<void>;
}
