"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ProductFiltersValue } from "@/components/product";
import {
  ProductFilters,
  ProductGrid,
  ProductSkeleton,
} from "@/components/product";
import { PageHeader } from "@/components/shared";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useSearch } from "@/hooks/use-products";
import { Search } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [filterState, setFilterState] = useState<ProductFiltersValue>({
    filters: {},
    sortBy: "relevance",
  });

  const trimmed = query.trim();
  const { data, isLoading, isError, refetch } = useSearch(trimmed, {
    page: 1,
    pageSize: 24,
    sortBy: filterState.sortBy,
    filters: filterState.filters,
  });

  const needsQuery = trimmed.length < 2;

  return (
    <div className="bg-brand-glow pb-16">
      <PageHeader
        title="Busca"
        description={
          trimmed
            ? `Resultados para “${trimmed}”`
            : "Digite ao menos 2 caracteres para buscar produtos."
        }
      />

      <Container className="mt-8">
        {needsQuery ? (
          <EmptyState
            icon={<Search className="size-6" aria-hidden />}
            title="O que você procura?"
            description="Use a busca no topo ou digite um termo na URL, por exemplo /busca?q=batom."
            action={{ label: "Ver produtos", href: "/produtos" }}
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <ProductFilters
              value={filterState}
              onChange={setFilterState}
              className="h-fit lg:sticky lg:top-24"
            />

            <div>
              {isLoading ? (
                <ProductSkeleton count={12} />
              ) : isError ? (
                <ErrorState
                  title="Não foi possível buscar"
                  onRetry={() => void refetch()}
                />
              ) : data && data.items.length > 0 ? (
                <>
                  <p className="mb-4 text-sm text-text-secondary">
                    {data.total}{" "}
                    {data.total === 1
                      ? "produto encontrado"
                      : "produtos encontrados"}
                  </p>
                  <ProductGrid products={data.items} />
                </>
              ) : (
                <EmptyState
                  icon={<Search className="size-6" aria-hidden />}
                  title="Nenhum resultado"
                  description={`Não encontramos produtos para “${trimmed}”. Tente outro termo.`}
                  action={{ label: "Ver catálogo", href: "/produtos" }}
                />
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-brand-glow pb-16">
          <PageHeader title="Busca" description="Carregando resultados…" />
          <Container className="mt-8">
            <ProductSkeleton count={8} />
          </Container>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
