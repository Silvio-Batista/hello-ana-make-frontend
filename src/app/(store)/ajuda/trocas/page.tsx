import type { Metadata } from "next";
import { PageHeader, PolicySection } from "@/components/shared";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Trocas e Devoluções",
  description: "Prazo de arrependimento, como solicitar e reembolso.",
};

export default function TrocasEDevolucoesPage() {
  return (
    <>
      <PageHeader
        title="Trocas e devoluções"
        description="Sua satisfação é prioridade. Veja como funciona."
      />
      <Container size="sm" className="py-10 md:py-14">
        <PolicySection title="Direito de arrependimento (7 dias)">
          <p>
            Como a compra é feita à distância, você tem até{" "}
            <strong>7 dias corridos</strong> após o recebimento do produto
            para desistir da compra, sem precisar justificar, conforme o
            Código de Defesa do Consumidor (art. 49). O reembolso é integral,
            incluindo o frete pago.
          </p>
        </PolicySection>

        <PolicySection title="Troca por defeito ou avaria">
          <p>
            Recebeu um produto com defeito, avariado ou diferente do
            pedido? Entre em contato em até 7 dias para itens não duráveis
            (cosméticos) relatando o problema — se possível, com fotos — para
            agilizar a análise e a troca ou reembolso.
          </p>
        </PolicySection>

        <PolicySection title="Condições para devolução">
          <ul className="list-disc space-y-1 pl-5">
            <li>Produto na embalagem original, sem indícios de uso;</li>
            <li>Lacre de segurança intacto, quando aplicável;</li>
            <li>Nota fiscal ou número do pedido em mãos.</li>
          </ul>
          <p>
            Por se tratar de itens de higiene/cosméticos, produtos abertos ou
            usados só são aceitos em caso de defeito comprovado.
          </p>
        </PolicySection>

        <PolicySection title="Como solicitar">
          <p>
            Acesse{" "}
            <a href="/conta/pedidos" className="font-medium text-primary hover:underline">
              Meus pedidos
            </a>{" "}
            e localize o pedido, ou fale diretamente com a gente em{" "}
            <a
              href="mailto:helloanamakeup@gmail.com"
              className="font-medium text-primary hover:underline"
            >
              helloanamakeup@gmail.com
            </a>{" "}
            informando o número do pedido e o motivo da troca/devolução.
          </p>
        </PolicySection>

        <PolicySection title="Prazo e forma de reembolso">
          <p>
            Após recebermos e conferirmos o produto devolvido, o reembolso é
            feito pelo mesmo meio de pagamento usado na compra (estorno no
            cartão, Pix ou saldo da conta), respeitando os prazos da
            operadora/instituição financeira.
          </p>
        </PolicySection>
      </Container>
    </>
  );
}
