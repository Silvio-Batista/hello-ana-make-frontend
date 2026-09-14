import type { NewsletterSubscribeResponse } from "@/contracts";
import type { NewsletterRepository } from "@/repositories/interfaces";
import { apiPost } from "@/lib/http-client";

export class ApiNewsletterRepository implements NewsletterRepository {
  subscribe(email: string): Promise<NewsletterSubscribeResponse> {
    return apiPost<NewsletterSubscribeResponse>(
      "/newsletter/subscribe",
      { email },
      { auth: false },
    );
  }
}
