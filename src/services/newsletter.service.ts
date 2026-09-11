import type { NewsletterSubscribeResponse } from "@/contracts";
import { newsletterRepository } from "@/lib/container";

export const newsletterService = {
  subscribe(email: string): Promise<NewsletterSubscribeResponse> {
    return newsletterRepository.subscribe(email);
  },
};
