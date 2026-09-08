import type { Metadata } from "next";
import { PageHeader, PolicySection } from "@/components/shared";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Frete e Entrega",
  description: "Opções de envio, prazos e rastreamento do pedido.",
};

export default function FreteEEntregaPage() {
  return (
    <>
      <PageHeader
        title="Frete e entrega"
        description="Entregamos para todo o Brasil."
      />
      <Container size="sm" className="py-10 md:py-14">
        <PolicySection title="Opções de envio">
          <p>
            No carrinho e no checkout você vê as opções de frete disponíveis
            para o seu CEP, com prazo estimado e valor — incluindo opções que
            podem ficar grátis a partir de um valor mínimo de compra, quando
            configurado pela loja.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Correios PAC — mais econômico, prazo maior;</li>
            <li>Correios SEDEX — mais rápido;</li>
            <li>Envio expresso via transportadora parceira.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Prazo de processamento">
          <p>
            Pedidos pagos são preparados e despachados em até 2 dias úteis.
            O prazo de entrega mostrado no checkout é contado a partir da
            postagem, não da compra.
          </p>
        </PolicySection>

        <PolicySection title="Como rastrear seu pedido">
          <p>
            Assim que o pedido é despachado, o código de rastreio aparece em{" "}
            <a href="/conta/pedidos" className="font-medium text-primary hover:underline">
              Meus pedidos
            </a>{" "}
            junto com o status da entrega.
          </p>
        </PolicySection>

        <PolicySection title="Pedido não chegou ou chegou danificado?">
          <p>
            Entre em contato em{" "}
            <a
              href="mailto:ola@helloanamake.com.br"
              className="font-medium text-primary hover:underline"
            >
              ola@helloanamake.com.br
            </a>{" "}
            com o número do pedido — vamos verificar junto à transportadora e
            resolver o mais rápido possível.
          </p>
        </PolicySection>
      </Container>
    </>
  );
}
