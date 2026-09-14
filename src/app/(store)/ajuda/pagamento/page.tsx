import type { Metadata } from "next";
import { PageHeader, PolicySection } from "@/components/shared";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Formas de Pagamento",
  description: "Cartão, Pix, boleto e parcelamento.",
};

export default function FormasDePagamentoPage() {
  return (
    <>
      <PageHeader
        title="Formas de pagamento"
        description="Formas de pagamento aceitas na Hello Ana Make."
      />
      <Container size="sm" className="py-10 md:py-14">
        <PolicySection title="Cartão de crédito">
          <p>
            Aceitamos as principais bandeiras, com parcelamento disponível no
            checkout (o número de parcelas e o valor mínimo por parcela são
            exibidos antes da confirmação do pedido).
          </p>
        </PolicySection>

        <PolicySection title="Pix">
          <p>
            Pagamento aprovado em poucos minutos. Ao escolher Pix no
            checkout, geramos um QR code e código &quot;copia e cola&quot; com prazo
            de validade — o pedido é confirmado automaticamente assim que o
            pagamento é identificado.
          </p>
        </PolicySection>

        <PolicySection title="Boleto bancário">
          <p>
            O boleto pode levar até alguns dias úteis para compensar após o
            pagamento. O pedido só é confirmado depois da compensação.
          </p>
        </PolicySection>

        <PolicySection title="Cartão de débito e outras opções">
          <p>
            Dependendo da configuração da loja, também podem estar
            disponíveis débito, carteira digital e crédito de loja — as
            opções habilitadas aparecem diretamente na etapa de pagamento do
            checkout.
          </p>
        </PolicySection>

        <PolicySection title="Segurança">
          <p>
            Os dados do seu cartão são processados diretamente pelo nosso
            gateway de pagamentos e não ficam armazenados nos nossos
            servidores.
          </p>
        </PolicySection>

        <PolicySection title="Dúvidas sobre um pagamento">
          <p>
            Fale com a gente em{" "}
            <a
              href="mailto:helloanamakeup@gmail.com"
              className="font-medium text-primary hover:underline"
            >
              helloanamakeup@gmail.com
            </a>{" "}
            informando o número do pedido.
          </p>
        </PolicySection>
      </Container>
    </>
  );
}
