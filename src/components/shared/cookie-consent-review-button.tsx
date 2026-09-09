"use client";

import { Button } from "@/components/ui";
import { clearCookieConsent } from "@/lib/cookie-consent";
import { COOKIE_CONSENT_RESET_EVENT } from "./cookie-consent-banner";

/** Reabre o banner de cookies para o visitante revisar/trocar a escolha feita. */
export function CookieConsentReviewButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        clearCookieConsent();
        window.dispatchEvent(new Event(COOKIE_CONSENT_RESET_EVENT));
      }}
    >
      Revisar minha escolha de cookies
    </Button>
  );
}
