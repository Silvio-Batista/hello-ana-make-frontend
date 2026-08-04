import type { Address } from "./address.contract";
import type { ProductVariantAttributes } from "./product.contract";
import type { PaymentMethod, PaymentStatus } from "./payment.contract";

/**
 * Status do ciclo de vida do pedido.
 */
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "returned";

/**
 * Item de um pedido (snapshot no momento da compra).
 */
export interface OrderItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  variantSku: string;
  variantName: string;
  attributes: ProductVariantAttributes;
  image: string;
  unitPrice: number;
  promotionalPrice?: number;
  quantity: number;
  lineTotal: number;
}

/**
 * Pedido completo.
 */
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  shippingOptionId?: string;
  trackingCode?: string;
  trackingUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

/**
 * Payload para criação de pedido a partir do carrinho.
 */
export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
  shippingAddressId: string;
  billingAddressId?: string;
  shippingOptionId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}
