import type {
  ShipmentRequest,
  ShipmentResponse,
  ShippingQuoteRequest,
  ShippingQuoteResponse,
} from "@/contracts";
import type { ShippingRepository } from "@/repositories/interfaces";
import { buildShippingQuote, shippingRates } from "@/mocks";
import { delay } from "@/repositories/utils";

const shipments = new Map<string, ShipmentResponse>();

export class MockShippingRepository implements ShippingRepository {
  async quote(request: ShippingQuoteRequest): Promise<ShippingQuoteResponse> {
    await delay();
    const zip = request.zipCode.replace(/\D/g, "");
    if (zip.length !== 8) {
      throw new Error("CEP inválido. Informe um CEP com 8 dígitos.");
    }
    return buildShippingQuote(zip, request.subtotal ?? 0);
  }

  async createShipment(request: ShipmentRequest): Promise<ShipmentResponse> {
    await delay();
    const rate = shippingRates.find((r) => r.id === request.shippingOptionId);
    if (!rate) throw new Error("Opção de frete inválida.");

    const trackingCode = `BR${Math.floor(Math.random() * 1_000_000_000)}HA`;
    const shipment: ShipmentResponse = {
      id: `shp-${Date.now()}`,
      orderId: request.orderId,
      trackingCode,
      trackingUrl: `https://rastreamento.correios.com.br/${trackingCode}`,
      labelUrl: undefined,
      provider: rate.provider,
      serviceName: rate.serviceName,
      price: rate.basePrice,
      status: "labeled",
      estimatedDeliveryAt: new Date(
        Date.now() + rate.estimatedDaysMax * 24 * 60 * 60 * 1000,
      ).toISOString(),
      createdAt: new Date().toISOString(),
    };

    shipments.set(trackingCode, shipment);
    shipments.set(shipment.id, shipment);
    return shipment;
  }

  async getTracking(trackingCode: string): Promise<ShipmentResponse> {
    await delay();
    const shipment = shipments.get(trackingCode);
    if (!shipment) {
      return {
        id: `shp-track-${trackingCode}`,
        orderId: "unknown",
        trackingCode,
        provider: "Correios",
        serviceName: "PAC",
        price: 0,
        status: "in_transit",
        createdAt: new Date().toISOString(),
      };
    }
    return shipment;
  }

  async cancelShipment(shipmentId: string): Promise<void> {
    await delay();
    const shipment = shipments.get(shipmentId);
    if (shipment) {
      shipments.set(shipmentId, { ...shipment, status: "cancelled" });
    }
  }
}
