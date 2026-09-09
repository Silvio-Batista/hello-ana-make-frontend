"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import {
  getCookieConsent,
  setCookieConsent,
  type CookieConsentStatus,
} from "@/lib/cookie-consent";

/** Disparado pela página de Política de Cookies para reabrir o banner. */
export const COOKIE_CONSENT_RESET_EVENT = "cookie-consent-reset";

export function CookieConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);

    const onReset = () => setVisible(true);
    window.addEventListener(COOKIE_CONSENT_RESET_EVENT, onReset);
    return () => window.removeEventListener(COOKIE_CONSENT_RESET_EVENT, onReset);
  }, []);

  if (!visible || pathname?.startsWith("/admin")) return null;

  const decide = (status: CookieConsentStatus) => {
    setCookieConsent(status);
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-text-secondary">
          Usamos cookies essenciais para o carrinho e o login funcionarem, e
          cookies de preferência para lembrar suas escolhas no site. Não
          usamos cookies de publicidade ou analytics de terceiros hoje. Saiba
          mais na nossa{" "}
          <Link
            href="/cookies"
            className="font-medium text-primary hover:underline"
          >
            Política de Cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => decide("rejected")}>
            Rejeitar não essenciais
          </Button>
          <Button size="sm" onClick={() => decide("accepted")}>
            Aceitar todos
          </Button>
        </div>
      </div>
    </div>
  );
}
