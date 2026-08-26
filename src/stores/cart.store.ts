"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, ShippingOption } from "@/contracts";

/**
 * Estado do carrinho que não existe no backend (/cart): itens "salvos para
 * depois" e a opção de frete completa escolhida (o backend só devolve
 * `shippingOptionId`, então guardamos o objeto cotado para exibir label/prazo).
 * Os itens, totais e cupom do carrinho em si vêm do servidor — ver hooks/use-cart.ts.
 */
interface CartUiState {
  savedForLater: CartItem[];
  shippingOption: ShippingOption | null;
  shippingCep: string | null;

  addSavedForLater: (item: CartItem) => void;
  removeSavedForLater: (itemId: string) => void;
  setShippingOption: (option: ShippingOption | null, cep?: string | null) => void;
}

export const useCartStore = create<CartUiState>()(
  persist(
    (set) => ({
      savedForLater: [],
      shippingOption: null,
      shippingCep: null,

      addSavedForLater: (item) => {
        set((state) => ({
          savedForLater: [...state.savedForLater.filter((i) => i.id !== item.id), item],
        }));
      },

      removeSavedForLater: (itemId) => {
        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i.id !== itemId),
        }));
      },

      setShippingOption: (option, cep) => {
        set((state) => ({
          shippingOption: option,
          shippingCep: cep !== undefined ? cep : state.shippingCep,
        }));
      },
    }),
    {
      name: "hello-ana-cart-ui",
      partialize: (state) => ({
        savedForLater: state.savedForLater,
        shippingOption: state.shippingOption,
        shippingCep: state.shippingCep,
      }),
    },
  ),
);
