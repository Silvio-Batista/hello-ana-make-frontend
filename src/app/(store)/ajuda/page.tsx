import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, RefreshCw, Truck, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Central de Ajuda",
  description: "Trocas e devoluções, frete e entrega, formas de pagamento.",
};

const TOPICS: { href: string; title: string; description: string; icon: LucideIcon }[] = [
  {
    href: "/ajuda/trocas",
    title: "Trocas e devoluções",
    description: "Prazo de arrependimento, como solicitar e reembolso.",
    icon: RefreshCw,
  },
  {
    href: "/ajuda/frete",
    title: "Frete e entrega",
    description: "Opções de envio, prazos e rastreamento do pedido.",
    icon: Truck,
  },
  {
    href: "/ajuda/pagamento",
    title: "Formas de pagamento",
    description: "Cartão, Pix, boleto e parcelamento.",
    icon: CreditCard,
  },
];

export default function AjudaPage() {
  return (
    <>
      <PageHeader
        title="Central de ajuda"
        description="Escolha um assunto abaixo. Se não encontrar o que precisa, fale com a gente."
      />
      <Container size="md" className="py-10 md:py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {TOPICS.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 transition-colors hover:border-primary"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="font-display text-base font-semibold text-text-primary">
                {title}
              </span>
              <span className="text-sm text-text-secondary">{description}</span>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface/60 p-6 text-sm text-text-secondary">
          Não achou sua resposta?{" "}
          <a
            href="mailto:ola@helloanamake.com.br"
            className="font-medium text-primary hover:underline"
          >
            ola@helloanamake.com.br
          </a>{" "}
          ou (11) 99999-0000.
        </div>
      </Container>
    </>
  );
}
