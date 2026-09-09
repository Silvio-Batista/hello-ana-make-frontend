import type { Metadata } from "next";
import {
  CookieConsentReviewButton,
  PageHeader,
  PolicySection,
} from "@/components/shared";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Como a Hello Ana Make usa cookies no site.",
};

const LAST_UPDATED = "7 de setembro de 2026";

export default function PoliticaDeCookiesPage() {
  return (
    <>
      <PageHeader
        title="Política de Cookies"
        description={`Última atualização: ${LAST_UPDATED}`}
      />
      <Container size="sm" className="py-10 md:py-14">
        <PolicySection title="1. O que são cookies">
          <p>
            Cookies são pequenos arquivos armazenados no seu navegador que
            ajudam o Site a funcionar corretamente e a lembrar suas
            preferências entre visitas.
          </p>
        </PolicySection>

        <PolicySection title="2. Cookies que usamos hoje">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Essenciais</strong> — mantêm você logado, guardam o
              carrinho de compras (inclusive antes de fazer login) e o
              token de sessão. Sem eles o Site não funciona.
            </li>
            <li>
              <strong>Preferências</strong> — lembram escolhas como cupom
              aplicado e se você já viu o pop-up de boas-vindas.
            </li>
          </ul>
          <p>
            Hoje não utilizamos cookies de publicidade/rastreamento de
            terceiros. Se isso mudar, esta política será atualizada antes da
            ativação.
          </p>
        </PolicySection>

        <PolicySection title="3. Como gerenciar cookies">
          <p>
            Ao visitar o Site pela primeira vez, você escolhe se aceita ou
            rejeita os cookies não essenciais no banner exibido. Você pode
            mudar de ideia a qualquer momento clicando no botão abaixo, ou
            bloquear/apagar cookies diretamente nas configurações do seu
            navegador. Bloquear cookies essenciais pode impedir o
            funcionamento do carrinho e do login.
          </p>
          <CookieConsentReviewButton />
        </PolicySection>

        <PolicySection title="4. Mais informações">
          <p>
            Para saber mais sobre como tratamos dados pessoais, veja nossa{" "}
            <a href="/privacidade" className="font-medium text-primary hover:underline">
              Política de Privacidade
            </a>
            .
          </p>
        </PolicySection>
      </Container>
    </>
  );
}
