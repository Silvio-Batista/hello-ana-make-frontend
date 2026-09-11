/** Resposta de POST /newsletter/subscribe — idempotente, sempre sucesso se o e-mail for válido. */
export interface NewsletterSubscribeResponse {
  message: string;
}
