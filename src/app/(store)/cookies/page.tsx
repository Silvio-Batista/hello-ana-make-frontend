import type { Metadata } from "next";
import { PageHeader, PlaceholderNotice, PolicySection } from "@/components/shared";
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
        <PlaceholderNotice>
          Texto placeholder gerado automaticamente — <strong>não é assessoria
          jurídica</strong>. Revise antes de operar com clientes reais,
          especialmente se adicionar cookies de analytics/anúncios (ex.: Meta
          Pixel, Google Analytics), que normalmente exigem banner de
          consentimento.
        </PlaceholderNotice>

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
            terceiros. Se isso mudar, esta política e um banner de
            consentimento serão adicionados antes da ativação.
          </p>
        </PolicySection>

        <PolicySection title="3. Como gerenciar cookies">
          <p>
            Você pode bloquear ou apagar cookies nas configurações do seu
            navegador a qualquer momento. Bloquear cookies essenciais pode
            impedir o funcionamento do carrinho e do login.
          </p>
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
