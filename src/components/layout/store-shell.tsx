"use client";

import { useEffect, type ReactNode } from "react";
import { AnnouncementBar } from "@/components/shared/announcement-bar";
import { SignupPromoModal } from "@/components/shared/signup-promo-modal";
import { useUiStore } from "@/stores";
import { MiniCart } from "./mini-cart";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export interface StoreShellProps {
  children: ReactNode;
}

const SIGNUP_PROMO_KEY = "hello-ana-signup-promo-seen";

export function StoreShell({ children }: StoreShellProps) {
  const signupModalOpen = useUiStore((s) => s.signupModalOpen);
  const setSignupModalOpen = useUiStore((s) => s.setSignupModalOpen);

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(SIGNUP_PROMO_KEY);
      if (!seen) {
        const timer = window.setTimeout(() => {
          setSignupModalOpen(true);
        }, 2500);
        return () => window.clearTimeout(timer);
      }
    } catch {
      // ignore storage errors
    }
  }, [setSignupModalOpen]);

  const handleCloseSignup = () => {
    setSignupModalOpen(false);
    try {
      window.localStorage.setItem(SIGNUP_PROMO_KEY, "1");
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <SiteFooter />
      <MobileBottomNav />
      <MiniCart />
      <SignupPromoModal open={signupModalOpen} onClose={handleCloseSignup} />
    </div>
  );
}
