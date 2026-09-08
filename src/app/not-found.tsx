import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { StoreShell } from "@/components/layout";
import { Container, EmptyState } from "@/components/ui";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

/**
 * Fica fora do grupo (store) de propósito: rotas sem correspondência nenhuma
 * (ex.: /qualquer-coisa) caem aqui direto, sem passar pelo layout do grupo —
 * por isso montamos o StoreShell na mão pra manter cabeçalho/rodapé da loja
 * em vez do 404 genérico do Next.
 */
export default function NotFound() {
  return (
    <StoreShell>
      <Container size="sm" className="py-20 md:py-28">
        <EmptyState
          icon={<SearchX className="size-6" aria-hidden />}
          title="Página não encontrada"
          description="O endereço que você acessou não existe ou foi movido. Confira o link ou volte para a loja."
          action={{ label: "Voltar para a loja", href: "/" }}
        />
        <p className="mt-2 text-center text-sm text-text-secondary">
          Ou veja nossas{" "}
          <Link href="/categorias" className="font-medium text-primary hover:underline">
            categorias
          </Link>{" "}
          ou fale com a gente na{" "}
          <Link href="/ajuda" className="font-medium text-primary hover:underline">
            Central de ajuda
          </Link>
          .
        </p>
      </Container>
    </StoreShell>
  );
}
