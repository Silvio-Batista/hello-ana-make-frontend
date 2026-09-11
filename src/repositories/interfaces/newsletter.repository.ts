import type { NewsletterSubscribeResponse } from "@/contracts";

/** Inscrição na newsletter (POST /newsletter/subscribe, sem autenticação). */
export interface NewsletterRepository {
  subscribe(email: string): Promise<NewsletterSubscribeResponse>;
}
