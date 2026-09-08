import type { Metadata } from "next";
import { PageHeader, PlaceholderNotice, PolicySection } from "@/components/shared";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Hello Ana Make coleta, usa e protege seus dados.",
};

const LAST_UPDATED = "7 de setembro de 2026";

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <PageHeader
        title="Política de Privacidade"
        description={`Última atualização: ${LAST_UPDATED}`}
      />
      <Container size="sm" className="py-10 md:py-14">
        <PlaceholderNotice>
          Texto placeholder gerado automaticamente — <strong>não é assessoria
          jurídica</strong>. Antes de operar com clientes reais, revise este
          conteúdo à luz da LGPD (Lei nº 13.709/2018) com um advogado, já que
          o Site coleta CPF/CNPJ, endereço e dados de pagamento.
        </PlaceholderNotice>

        <PolicySection title="1. Quem trata seus dados">
          <p>
            A Hello Ana Make é a controladora dos dados pessoais coletados
            neste Site, nos termos da Lei Geral de Proteção de Dados (LGPD).
          </p>
        </PolicySection>

        <PolicySection title="2. Quais dados coletamos">
          <ul className="list-disc space-y-1 pl-5">
            <li>Identificação: nome, e-mail, telefone, CPF/CNPJ, data de nascimento;</li>
            <li>Endereço: para entrega e cobrança;</li>
            <li>
              Pagamento: dados de cartão são processados diretamente pelo
              nosso gateway de pagamentos e não ficam armazenados nos nossos
              servidores;
            </li>
            <li>Navegação: cookies e dados de uso do Site (ver Política de Cookies);</li>
            <li>Pedidos e histórico de compras, favoritos e avaliações.</li>
          </ul>
        </PolicySection>

        <PolicySection title="3. Para que usamos seus dados">
          <ul className="list-disc space-y-1 pl-5">
            <li>Processar pedidos, pagamentos, entregas e trocas/devoluções;</li>
            <li>Comunicar sobre o status do pedido (e-mail transacional);</li>
            <li>Enviar novidades e promoções, caso você opte por recebê-las;</li>
            <li>Cumprir obrigações legais e fiscais;</li>
            <li>Prevenir fraude e proteger a segurança da conta.</li>
          </ul>
        </PolicySection>

        <PolicySection title="4. Com quem compartilhamos">
          <p>
            Compartilhamos dados apenas com prestadores necessários à
            operação (gateway de pagamento, transportadoras, provedor de
            e-mail transacional) e quando exigido por lei. Não vendemos seus
            dados pessoais a terceiros.
          </p>
        </PolicySection>

        <PolicySection title="5. Seus direitos">
          <p>
            Você pode solicitar a qualquer momento a confirmação, acesso,
            correção, anonimização, portabilidade ou eliminação dos seus
            dados, além de revogar consentimentos (ex.: e-mails de
            marketing), entrando em contato pelo canal abaixo.
          </p>
        </PolicySection>

        <PolicySection title="6. Retenção e segurança">
          <p>
            Mantemos seus dados pelo tempo necessário para cumprir as
            finalidades descritas e obrigações legais (ex.: fiscais),
            adotando medidas técnicas e organizacionais razoáveis para
            proteger contra acesso não autorizado.
          </p>
        </PolicySection>

        <PolicySection title="7. Cookies">
          <p>
            Usamos cookies para o funcionamento do carrinho de compras, login
            e melhoria da experiência. Veja detalhes na nossa{" "}
            <a href="/cookies" className="font-medium text-primary hover:underline">
              Política de Cookies
            </a>
            .
          </p>
        </PolicySection>

        <PolicySection title="8. Alterações desta política">
          <p>
            Podemos atualizar esta Política periodicamente. A versão vigente é
            sempre a publicada nesta página, com a data de atualização
            indicada no topo.
          </p>
        </PolicySection>

        <PolicySection title="9. Contato do encarregado (DPO)">
          <p>
            Para exercer seus direitos ou tirar dúvidas sobre o tratamento de
            dados, entre em contato em{" "}
            <a
              href="mailto:ola@helloanamake.com.br"
              className="font-medium text-primary hover:underline"
            >
              ola@helloanamake.com.br
            </a>
            .
          </p>
        </PolicySection>
      </Container>
    </>
  );
}
