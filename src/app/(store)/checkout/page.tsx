"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CardPaymentData, CreatePaymentResponse, Order } from "@/contracts";
import {
  AddressStep,
  CheckoutOrderSummary,
  CheckoutSteps,
  ConfirmationStep,
  IdentificationStep,
  PaymentStep,
  ShippingStep,
} from "@/components/checkout";
import { PageHeader } from "@/components/shared";
import { Container, Spinner } from "@/components/ui";
import {
  useAuth,
  useCart,
  useCreateAddress,
  useCreateOrder,
} from "@/hooks";
import { useCheckoutStore } from "@/stores";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuth();

  const {
    items,
    couponCode,
    couponMessage,
    shippingOption,
    totals,
    isLoading: isCartLoading,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const step = useCheckoutStore((s) => s.step);
  const addressId = useCheckoutStore((s) => s.addressId);
  const newAddress = useCheckoutStore((s) => s.newAddress);
  const shippingOptionId = useCheckoutStore((s) => s.shippingOptionId);
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const notes = useCheckoutStore((s) => s.notes);
  const setStep = useCheckoutStore((s) => s.setStep);
  const resetCheckout = useCheckoutStore((s) => s.reset);

  const createAddress = useCreateAddress();
  const createOrder = useCreateOrder();

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [confirmedPayment, setConfirmedPayment] = useState<CreatePaymentResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isCartLoading && items.length === 0 && step < 5 && !confirmedOrder) {
      router.replace("/carrinho");
    }
  }, [isCartLoading, items.length, step, confirmedOrder, router]);

  const handleSubmitOrder = async (cardPayment?: CardPaymentData) => {
    setSubmitError(null);

    if (!paymentMethod || !shippingOptionId) {
      setSubmitError("Selecione frete e forma de pagamento.");
      return;
    }

    if (!isAuthenticated && !hasHydrated) {
      setSubmitError("Aguarde um instante e tente novamente.");
      return;
    }

    setIsSubmitting(true);
    try {
      let shippingAddressId = addressId;

      if (!shippingAddressId && newAddress) {
        const created = await createAddress.mutateAsync(newAddress);
        shippingAddressId = created.id;
      }

      if (!shippingAddressId) {
        setSubmitError("Selecione ou informe um endereço de entrega.");
        setIsSubmitting(false);
        setStep(2);
        return;
      }

      const result = await createOrder.mutateAsync({
        request: {
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          shippingAddressId,
          shippingOptionId,
          paymentMethod,
          couponCode: couponCode ?? undefined,
          notes: notes.trim() || undefined,
        },
        payment:
          paymentMethod === "pix" || paymentMethod === "boleto"
            ? {}
            : paymentMethod === "credit_card" && cardPayment
              ? { card: cardPayment }
              : undefined,
      });

      await clearCart();
      resetCheckout();
      setConfirmedOrder(result.order);
      setConfirmedPayment(result.payment ?? null);
      setStep(5);

      if (isAuthenticated) {
        router.push(`/conta/pedidos/${result.order.id}`);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível criar o pedido.";
      if (message.includes("não autenticado") || message.includes("autenticado")) {
        setSubmitError(
          "Faça login para finalizar o pedido. Demo: ana.silva@email.com / helloana123",
        );
        setStep(1);
      } else {
        setSubmitError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCartLoading && step < 5) {
    return (
      <>
        <PageHeader title="Checkout" description="Finalize sua compra em poucos passos" />
        <Container className="flex justify-center py-16">
          <Spinner label="Carregando checkout" />
        </Container>
      </>
    );
  }

  if (confirmedOrder && step === 5) {
    return (
      <>
        <PageHeader title="Checkout" description="Pedido realizado com sucesso" />
        <Container className="py-8 md:py-10">
          <CheckoutSteps current={5} className="mb-8" />
          <ConfirmationStep order={confirmedOrder} payment={confirmedPayment ?? undefined} />
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Checkout"
        description="Finalize sua compra em poucos passos"
      />
      <Container className="py-8 md:py-10">
        <CheckoutSteps current={step} className="mb-8 max-w-3xl" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div>
            {step === 1 ? <IdentificationStep /> : null}
            {step === 2 ? <AddressStep /> : null}
            {step === 3 ? <ShippingStep /> : null}
            {step === 4 ? (
              <PaymentStep
                onSubmitOrder={handleSubmitOrder}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            ) : null}
            {step === 5 && confirmedOrder ? (
              <ConfirmationStep order={confirmedOrder} payment={confirmedPayment ?? undefined} />
            ) : null}
          </div>

          {step < 5 ? (
            <CheckoutOrderSummary
              items={items}
              totals={totals}
              couponCode={couponCode}
              couponMessage={couponMessage}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
              shippingLabel={shippingOption?.serviceName}
              className="sticky top-24"
            />
          ) : null}
        </div>
      </Container>
    </>
  );
}
