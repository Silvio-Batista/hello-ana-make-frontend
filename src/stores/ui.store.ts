"use client";

import { create } from "zustand";

interface UiState {
  miniCartOpen: boolean;
  searchOpen: boolean;
  signupModalOpen: boolean;
  mobileMenuOpen: boolean;

  setMiniCartOpen: (open: boolean) => void;
  toggleMiniCart: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSignupModalOpen: (open: boolean) => void;
  toggleSignupModal: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  closeAll: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  miniCartOpen: false,
  searchOpen: false,
  signupModalOpen: false,
  mobileMenuOpen: false,

  setMiniCartOpen: (open) => set({ miniCartOpen: open }),
  toggleMiniCart: () => set((s) => ({ miniCartOpen: !s.miniCartOpen })),

  setSearchOpen: (open) => set({ searchOpen: open }),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),

  setSignupModalOpen: (open) => set({ signupModalOpen: open }),
  toggleSignupModal: () => set((s) => ({ signupModalOpen: !s.signupModalOpen })),

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),

  closeAll: () =>
    set({
      miniCartOpen: false,
      searchOpen: false,
      signupModalOpen: false,
      mobileMenuOpen: false,
    }),
}));
