import type {
  ShipmentRequest,
  ShipmentResponse,
  ShippingProvider,
  ShippingQuoteRequest,
  ShippingQuoteResponse,
} from "@/contracts";
import type { ShippingRepository } from "@/repositories/interfaces";
import { apiPost } from "@/lib/http-client";
import { notImplemented } from "@/repositories/utils";

function quote(request: ShippingQuoteRequest): Promise<ShippingQuoteResponse> {
  return apiPost<ShippingQuoteResponse>(
    "/shipping/quote",
    { zipCode: request.zipCode, subtotal: request.subtotal },
    { auth: false },
  );
}

export class ApiShippingRepository implements ShippingRepository {
  quote(request: ShippingQuoteRequest): Promise<ShippingQuoteResponse> {
    return quote(request);
  }

  createShipment(_request: ShipmentRequest): Promise<ShipmentResponse> {
    return notImplemented("ApiShippingRepository.createShipment");
  }

  getTracking(_trackingCode: string): Promise<ShipmentResponse> {
    return notImplemented("ApiShippingRepository.getTracking");
  }

  cancelShipment(_shipmentId: string): Promise<void> {
    return notImplemented("ApiShippingRepository.cancelShipment");
  }
}

/** SuperFrete real ainda não exposto pelo backend — quote() usa o mock fixo do backend (ver AGENTS.md §7). */
export class SuperFreteShippingRepository
  implements ShippingRepository, ShippingProvider
{
  readonly name = "SuperFrete";

  quote(request: ShippingQuoteRequest): Promise<ShippingQuoteResponse> {
    return quote(request);
  }

  createShipment(_request: ShipmentRequest): Promise<ShipmentResponse> {
    return notImplemented("SuperFreteShippingRepository.createShipment");
  }

  getTracking(_trackingCode: string): Promise<ShipmentResponse> {
    return notImplemented("SuperFreteShippingRepository.getTracking");
  }

  cancelShipment(_shipmentId: string): Promise<void> {
    return notImplemented("SuperFreteShippingRepository.cancelShipment");
  }
}
