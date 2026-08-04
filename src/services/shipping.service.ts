import type {
  ShipmentRequest,
  ShipmentResponse,
  ShippingQuoteRequest,
  ShippingQuoteResponse,
} from "@/contracts";
import { shippingRepository } from "@/lib/container";

export const shippingService = {
  calculateQuote(request: ShippingQuoteRequest): Promise<ShippingQuoteResponse> {
    return shippingRepository.quote(request);
  },

  createShipment(request: ShipmentRequest): Promise<ShipmentResponse> {
    return shippingRepository.createShipment(request);
  },

  getTracking(trackingCode: string): Promise<ShipmentResponse> {
    return shippingRepository.getTracking(trackingCode);
  },
};
