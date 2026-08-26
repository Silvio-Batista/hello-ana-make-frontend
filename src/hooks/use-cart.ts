"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AddCartItemRequest,
  Cart,
  SelectShippingRequest,
  ShippingOption,
} from "@/contracts";
import { cartService } from "@/services";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { useToast } from "@/components/ui/toast";
import { rewardKeys, useRewardProgress } from "@/hooks/use-rewards";

export const cartKeys = {
  all: ["cart"] as const,
  detail: () => [...cartKeys.all, "detail"] as const,
};

const EMPTY_TOTALS: Cart["totals"] = {
  subtotal: 0,
  discount: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  itemCount: 0,
  currency: "BRL",
};

const EMPTY_ITEMS: Cart["items"] = [];

export function useCartQuery() {
  // Numa carga fria, a sessão persistida (Zustand) ainda não reidratou do
  // localStorage no primeiro render — buscar o carrinho antes disso manda a
  // requisição sem Authorization e resolve pro carrinho guest errado em vez do
  // carrinho do usuário logado. Espera reidratar antes de disparar.
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: () => cartService.getCart(),
    staleTime: 0,
    enabled: hasHydrated,
  });
}

function useCartMutation<TVars>(mutationFn: (vars: TVars) => Promise<Cart>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (cart) => {
      qc.setQueryData(cartKeys.detail(), cart);
      void qc.invalidateQueries({ queryKey: rewardKeys.all });
    },
  });
}

export function useAddCartItem() {
  return useCartMutation((input: AddCartItemRequest) => cartService.addItem(input));
}

export function useUpdateCartItemQuantity() {
  return useCartMutation(({ itemId, quantity }: { itemId: string; quantity: number }) =>
    cartService.updateItemQuantity(itemId, quantity),
  );
}

export function useRemoveCartItem() {
  return useCartMutation((itemId: string) => cartService.removeItem(itemId));
}

export function useClearCart() {
  return useCartMutation<void>(() => cartService.clear());
}

export function useSelectCartShipping() {
  return useCartMutation((input: SelectShippingRequest) => cartService.selectShipping(input));
}

export function useRemoveCartCoupon() {
  return useCartMutation<void>(() => cartService.removeCoupon());
}

export function useApplyCartCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => cartService.applyCoupon(code),
    onSuccess: ({ cart }) => {
      qc.setQueryData(cartKeys.detail(), cart);
      void qc.invalidateQueries({ queryKey: rewardKeys.all });
    },
  });
}

/** Hook agregado usado pelas telas de carrinho/checkout/header. */
export function useCart() {
  const { toast } = useToast();

  const cartQuery = useCartQuery();
  const cart = cartQuery.data;

  const savedForLater = useCartStore((s) => s.savedForLater);
  const addSavedForLater = useCartStore((s) => s.addSavedForLater);
  const removeSavedForLater = useCartStore((s) => s.removeSavedForLater);
  const shippingOption = useCartStore((s) => s.shippingOption);
  const shippingCep = useCartStore((s) => s.shippingCep);
  const setShippingOptionLocal = useCartStore((s) => s.setShippingOption);

  const addItemMutation = useAddCartItem();
  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();
  const clearMutation = useClearCart();
  const applyCouponMutation = useApplyCartCoupon();
  const removeCouponMutation = useRemoveCartCoupon();
  const selectShippingMutation = useSelectCartShipping();

  const items = cart?.items ?? EMPTY_ITEMS;
  const totals = cart?.totals ?? EMPTY_TOTALS;
  const couponCode = cart?.couponCode ?? null;
  const couponMessage = couponCode
    ? (cart?.couponMessage ?? null)
    : applyCouponMutation.error instanceof Error
      ? applyCouponMutation.error.message
      : null;

  const rewardProgress = useRewardProgress(cart?.rewardEligibleAmount ?? 0);

  const reportError = useCallback(
    (err: unknown, fallback: string) => {
      toast(err instanceof Error ? err.message : fallback, "error");
    },
    [toast],
  );

  // Memoizados: identidade estável entre renders, senão qualquer efeito que os
  // tenha como dependência (ex.: ShippingStep) reexecuta a cada render e, como a
  // própria chamada dispara um novo fetch do carrinho, vira um loop infinito.
  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        await updateQuantityMutation.mutateAsync({ itemId, quantity });
      } catch (err) {
        reportError(err, "Não foi possível atualizar a quantidade.");
      }
    },
    [updateQuantityMutation, reportError],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        await removeItemMutation.mutateAsync(itemId);
      } catch (err) {
        reportError(err, "Não foi possível remover o item.");
      }
    },
    [removeItemMutation, reportError],
  );

  const clearCart = useCallback(async () => {
    await clearMutation.mutateAsync();
  }, [clearMutation]);

  const applyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      try {
        await applyCouponMutation.mutateAsync(code);
        return true;
      } catch {
        return false;
      }
    },
    [applyCouponMutation],
  );

  const removeCoupon = useCallback(async () => {
    try {
      await removeCouponMutation.mutateAsync();
    } catch (err) {
      reportError(err, "Não foi possível remover o cupom.");
    }
  }, [removeCouponMutation, reportError]);

  const setShipping = useCallback(
    async (option: ShippingOption | null, cep?: string | null) => {
      setShippingOptionLocal(option, cep);
      if (!option) return;
      try {
        await selectShippingMutation.mutateAsync({
          shippingOptionId: option.id,
          zipCode: (cep ?? shippingCep ?? "").replace(/\D/g, ""),
        });
      } catch (err) {
        reportError(err, "Não foi possível selecionar o frete.");
      }
    },
    [setShippingOptionLocal, selectShippingMutation, shippingCep, reportError],
  );

  const saveForLater = useCallback(
    (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      addSavedForLater(item);
      void removeItemMutation.mutateAsync(itemId).catch((err: unknown) => {
        reportError(err, "Não foi possível salvar o item para depois.");
      });
    },
    [items, addSavedForLater, removeItemMutation, reportError],
  );

  const moveToCart = useCallback(
    (itemId: string) => {
      const item = savedForLater.find((i) => i.id === itemId);
      if (!item) return;
      removeSavedForLater(itemId);
      void addItemMutation
        .mutateAsync({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })
        .catch((err: unknown) => {
          reportError(err, "Não foi possível mover o item ao carrinho.");
        });
    },
    [savedForLater, removeSavedForLater, addItemMutation, reportError],
  );

  return {
    items,
    savedForLater,
    couponCode,
    couponMessage,
    freeShipping: cart?.freeShipping ?? false,
    shippingOption,
    shippingCep,
    subtotal: totals.subtotal,
    eligibleAmount: cart?.rewardEligibleAmount ?? 0,
    totals,
    rewardProgress,
    itemCount: totals.itemCount,
    // isPending (não isLoading): a query fica `enabled: false` até a sessão
    // reidratar, e isLoading é `false` nesse meio-tempo (fetchStatus "idle"),
    // o que faria telas que dependem disso acharem o carrinho vazio cedo demais.
    isLoading: cartQuery.isPending,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    setShipping,
    saveForLater,
    moveToCart,
  };
}

/** Reexport das keys de reward para invalidação no carrinho. */
export { rewardKeys };
