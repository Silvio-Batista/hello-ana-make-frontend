import type {
  ShipmentRequest,
  ShipmentResponse,
  ShippingProvider,
  ShippingQuoteRequest,
  ShippingQuoteResponse,
} from "@/contracts";

export type { ShippingProvider };

/**
 * Repositório de frete (fachada sobre ShippingProvider).
 */
export interface ShippingRepository {
  quote(request: ShippingQuoteRequest): Promise<ShippingQuoteResponse>;
  createShipment(request: ShipmentRequest): Promise<ShipmentResponse>;
  getTracking(trackingCode: string): Promise<ShipmentResponse>;
  cancelShipment?(shipmentId: string): Promise<void>;
}
