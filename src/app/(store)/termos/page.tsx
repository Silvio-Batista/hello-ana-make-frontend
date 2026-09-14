import type { Metadata } from "next";
import { PageHeader, PolicySection } from "@/components/shared";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso da loja Hello Ana Make.",
};

const LAST_UPDATED = "7 de setembro de 2026";

export default function TermosDeUsoPage() {
  return (
    <>
      <PageHeader
        title="Termos de Uso"
        description={`Última atualização: ${LAST_UPDATED}`}
      />
      <Container size="sm" className="py-10 md:py-14">
        <PolicySection title="1. Aceitação dos termos">
          <p>
            Ao acessar e utilizar o site Hello Ana Make (&quot;Site&quot;), você
            concorda integralmente com estes Termos de Uso e com a nossa{" "}
            <a href="/privacidade" className="font-medium text-primary hover:underline">
              Política de Privacidade
            </a>
            . Se você não concordar com algum destes termos, não utilize o
            Site.
          </p>
        </PolicySection>

        <PolicySection title="2. Cadastro e conta">
          <p>
            Para comprar no Site é necessário criar uma conta com dados
            verdadeiros, completos e atualizados. Você é responsável por
            manter a confidencialidade da sua senha e por todas as atividades
            realizadas na sua conta.
          </p>
        </PolicySection>

        <PolicySection title="3. Produtos, preços e disponibilidade">
          <p>
            Fazemos o possível para manter preços, descrições e estoque
            atualizados, mas erros podem ocorrer. Reservamo-nos o direito de
            corrigir preços incorretos e de cancelar pedidos afetados por erro
            evidente, com reembolso integral quando aplicável.
          </p>
        </PolicySection>

        <PolicySection title="4. Pedidos, pagamento e cancelamento">
          <p>
            O pedido é confirmado após a aprovação do pagamento (cartão de
            crédito/débito, Pix, boleto ou outra forma disponível no
            checkout). Pedidos podem ser cancelados enquanto estiverem em
            status pendente de pagamento, pago ou em processamento, conforme
            as regras descritas na área &quot;Meus pedidos&quot;.
          </p>
        </PolicySection>

        <PolicySection title="5. Direito de arrependimento">
          <p>
            Nos termos do art. 49 do Código de Defesa do Consumidor, você tem
            até <strong>7 (sete) dias corridos</strong> após o recebimento do
            produto para desistir da compra, sem necessidade de justificativa,
            com reembolso integral. Veja os detalhes em{" "}
            <a href="/ajuda/trocas" className="font-medium text-primary hover:underline">
              Trocas e devoluções
            </a>
            .
          </p>
        </PolicySection>

        <PolicySection title="6. Propriedade intelectual">
          <p>
            Marca, logotipo, textos, imagens e demais conteúdos do Site são de
            propriedade da Hello Ana Make ou de seus licenciantes, sendo
            vedada a reprodução sem autorização prévia.
          </p>
        </PolicySection>

        <PolicySection title="7. Limitação de responsabilidade">
          <p>
            O Site é fornecido &quot;como está&quot;. Não nos responsabilizamos por
            indisponibilidades temporárias, uso indevido por terceiros ou
            eventos fora do nosso controle razoável.
          </p>
        </PolicySection>

        <PolicySection title="8. Alterações destes termos">
          <p>
            Podemos atualizar estes Termos periodicamente. A versão vigente é
            sempre a publicada nesta página, com a data de atualização
            indicada no topo.
          </p>
        </PolicySection>

        <PolicySection title="9. Contato">
          <p>
            Dúvidas sobre estes termos? Fale conosco em{" "}
            <a
              href="mailto:helloanamakeup@gmail.com"
              className="font-medium text-primary hover:underline"
            >
              helloanamakeup@gmail.com
            </a>
            .
          </p>
        </PolicySection>
      </Container>
    </>
  );
}
