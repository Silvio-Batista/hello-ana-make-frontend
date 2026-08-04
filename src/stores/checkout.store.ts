"use client";

import { create } from "zustand";
import type { Address, PaymentMethod } from "@/contracts";
import type { AddressInput } from "@/repositories/interfaces";

export type CheckoutStep = 1 | 2 | 3 | 4 | 5;

export interface CheckoutIdentification {
  email: string;
  name: string;
  isGuest: boolean;
}

interface CheckoutState {
  step: CheckoutStep;
  identification: CheckoutIdentification;
  addressId: string | null;
  newAddress: AddressInput | null;
  shippingOptionId: string | null;
  paymentMethod: PaymentMethod | null;
  notes: string;

  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setIdentification: (data: Partial<CheckoutIdentification>) => void;
  setAddressId: (id: string | null) => void;
  setNewAddress: (address: AddressInput | null) => void;
  setShippingOptionId: (id: string | null) => void;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
}

const initialIdentification: CheckoutIdentification = {
  email: "",
  name: "",
  isGuest: true,
};

const initialState = {
  step: 1 as CheckoutStep,
  identification: initialIdentification,
  addressId: null as string | null,
  newAddress: null as AddressInput | null,
  shippingOptionId: null as string | null,
  paymentMethod: null as PaymentMethod | null,
  notes: "",
};

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  nextStep: () => {
    const current = get().step;
    if (current < 5) {
      set({ step: (current + 1) as CheckoutStep });
    }
  },

  prevStep: () => {
    const current = get().step;
    if (current > 1) {
      set({ step: (current - 1) as CheckoutStep });
    }
  },

  setIdentification: (data) =>
    set((state) => ({
      identification: { ...state.identification, ...data },
    })),

  setAddressId: (id) => set({ addressId: id }),

  setNewAddress: (address) => set({ newAddress: address }),

  setShippingOptionId: (id) => set({ shippingOptionId: id }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setNotes: (notes) => set({ notes }),

  reset: () => set({ ...initialState, identification: { ...initialIdentification } }),
}));

/** Tipo auxiliar para endereço completo quando necessário na UI. */
export type CheckoutAddress = Address;
