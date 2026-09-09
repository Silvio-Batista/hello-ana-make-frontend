const COOKIE_CONSENT_KEY = "hello-ana-cookie-consent";

export type CookieConsentStatus = "accepted" | "rejected";

export function getCookieConsent(): CookieConsentStatus | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setCookieConsent(status: CookieConsentStatus): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOKIE_CONSENT_KEY, status);
}

export function clearCookieConsent(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(COOKIE_CONSENT_KEY);
}
