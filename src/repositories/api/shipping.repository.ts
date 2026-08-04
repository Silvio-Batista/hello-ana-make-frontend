import type {
  ShipmentRequest,
  ShipmentResponse,
  ShippingProvider,
  ShippingQuoteRequest,
  ShippingQuoteResponse,
} from "@/contracts";
import type { ShippingRepository } from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiShippingRepository implements ShippingRepository {
  quote(_request: ShippingQuoteRequest): Promise<ShippingQuoteResponse> {
    return notImplemented("ApiShippingRepository.quote");
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

/** Stub SuperFrete — configure API Laravel / integração SuperFrete. */
export class SuperFreteShippingRepository
  implements ShippingRepository, ShippingProvider
{
  readonly name = "SuperFrete";

  quote(_request: ShippingQuoteRequest): Promise<ShippingQuoteResponse> {
    return notImplemented("SuperFreteShippingRepository.quote");
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
