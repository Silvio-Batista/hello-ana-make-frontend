import type {
  AddressRepository,
  AdminRepository,
  AuthRepository,
  BrandRepository,
  CategoryRepository,
  CouponRepository,
  FavoriteRepository,
  OrderRepository,
  PaymentRepository,
  ProductRepository,
  PromotionRepository,
  RewardRepository,
  ShippingRepository,
} from "@/repositories/interfaces";
import {
  ApiAddressRepository,
  ApiAdminRepository,
  ApiAuthRepository,
  ApiBrandRepository,
  ApiCategoryRepository,
  ApiCouponRepository,
  ApiFavoriteRepository,
  ApiOrderRepository,
  ApiPaymentRepository,
  ApiProductRepository,
  ApiPromotionRepository,
  ApiRewardRepository,
  AsaasPaymentGateway,
  MercadoPagoPaymentGateway,
  StripePaymentGateway,
  SuperFreteShippingRepository,
} from "@/repositories/api";
import {
  MockAddressRepository,
  MockAdminRepository,
  MockAuthRepository,
  MockBrandRepository,
  MockCategoryRepository,
  MockCouponRepository,
  MockFavoriteRepository,
  MockOrderRepository,
  MockPaymentRepository,
  MockProductRepository,
  MockPromotionRepository,
  MockRewardRepository,
  MockShippingRepository,
} from "@/repositories/mock";

const useApi = process.env.NEXT_PUBLIC_DATA_SOURCE === "api";

export const productRepository: ProductRepository = useApi
  ? new ApiProductRepository()
  : new MockProductRepository();

export const categoryRepository: CategoryRepository = useApi
  ? new ApiCategoryRepository()
  : new MockCategoryRepository();

export const couponRepository: CouponRepository = useApi
  ? new ApiCouponRepository()
  : new MockCouponRepository();

export const orderRepository: OrderRepository = useApi
  ? new ApiOrderRepository()
  : new MockOrderRepository();

export const addressRepository: AddressRepository = useApi
  ? new ApiAddressRepository()
  : new MockAddressRepository();

export const authRepository: AuthRepository = useApi
  ? new ApiAuthRepository()
  : new MockAuthRepository();

export const rewardRepository: RewardRepository = useApi
  ? new ApiRewardRepository()
  : new MockRewardRepository();

export const shippingRepository: ShippingRepository = useApi
  ? new SuperFreteShippingRepository()
  : new MockShippingRepository();

export const paymentRepository: PaymentRepository = useApi
  ? new ApiPaymentRepository()
  : new MockPaymentRepository();

export const promotionRepository: PromotionRepository = useApi
  ? new ApiPromotionRepository()
  : new MockPromotionRepository();

export const favoriteRepository: FavoriteRepository = useApi
  ? new ApiFavoriteRepository()
  : new MockFavoriteRepository();

export const brandRepository: BrandRepository = useApi
  ? new ApiBrandRepository()
  : new MockBrandRepository();

export const adminRepository: AdminRepository = useApi
  ? new ApiAdminRepository()
  : new MockAdminRepository();

/** Gateways stubs para wiring futuro com Laravel. */
export const paymentGateways = {
  asaas: new AsaasPaymentGateway(),
  mercadopago: new MercadoPagoPaymentGateway(),
  stripe: new StripePaymentGateway(),
} as const;

export const container = {
  productRepository,
  categoryRepository,
  couponRepository,
  orderRepository,
  addressRepository,
  authRepository,
  rewardRepository,
  shippingRepository,
  paymentRepository,
  promotionRepository,
  favoriteRepository,
  brandRepository,
  adminRepository,
  paymentGateways,
} as const;

export default container;
