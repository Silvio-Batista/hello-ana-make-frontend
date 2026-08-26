export type { Brand } from "./brand.contract";

export type { Category } from "./category.contract";

export type {
  ProductImage,
  ProductVariantAttributes,
  ProductVariant,
  ProductPricing,
  ProductInventory,
  ProductRating,
  ProductBadge,
  ProductPromotion,
  Product,
  ProductFilters,
  ProductSortBy,
  ProductListParams,
  ProductListResponse,
} from "./product.contract";

export type {
  CartItem,
  Cart,
  CartTotals,
  AddCartItemRequest,
  UpdateCartItemRequest,
  SelectShippingRequest,
} from "./cart.contract";

export type {
  CouponType,
  CouponValidationStatus,
  Coupon,
  CouponValidationResult,
} from "./coupon.contract";

export type { RewardTier, RewardProgress, CartRewardGift } from "./reward.contract";

export type {
  ShippingQuoteItem,
  ShippingQuoteRequest,
  ShippingQuoteResponse,
  ShippingOption,
  ShipmentRequest,
  ShipmentResponse,
  ShippingProvider,
} from "./shipping.contract";

export type {
  PaymentMethod,
  PaymentStatus,
  CardPaymentData,
  PixPaymentData,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentGateway,
  TokenizeCardRequest,
  TokenizeCardResponse,
} from "./payment.contract";

export type {
  OrderStatus,
  OrderItem,
  Order,
  CreateOrderRequest,
} from "./order.contract";

export type { Address } from "./address.contract";

export type {
  User,
  AuthSession,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  SignupPromotionResponse,
} from "./auth.contract";

export type {
  PromotionType,
  ProgressiveDiscountTier,
  BuyXGetYRule,
  KitItem,
  Promotion,
} from "./promotion.contract";

export type {
  AdminDashboardStats,
  AdminOrderListParams,
  UpdateOrderStatusRequest,
  AdminCustomer,
  AdminCustomerListParams,
  AdminCustomerListResponse,
  UploadImageResponse,
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateCouponInput,
  UpdateCouponInput,
  CreatePromotionInput,
  UpdatePromotionInput,
  CreateBrandInput,
  UpdateBrandInput,
  CreateRewardTierInput,
  UpdateRewardTierInput,
  StoreSettings,
  StoreIntegrationsSettings,
} from "./admin.contract";
