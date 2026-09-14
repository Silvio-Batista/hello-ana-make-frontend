import type { NewsletterSubscribeResponse } from "@/contracts";
import type { NewsletterRepository } from "@/repositories/interfaces";
import { delay } from "@/repositories/utils";

export class MockNewsletterRepository implements NewsletterRepository {
  async subscribe(_email: string): Promise<NewsletterSubscribeResponse> {
    await delay();
    return { message: "Inscrição confirmada! Fique de olho na sua caixa de entrada." };
  }
}
