"use client";

import { useState } from "react";
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
import { useCategories } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import { PackageSearch } from "lucide-react";

export default function ProductsPage() {
  const [filterState, setFilterState] = useState<ProductFiltersValue>({
    filters: {},
    sortBy: "relevance",
  });

  const { data: categories } = useCategories();
  const { data, isLoading, isError, refetch } = useProducts({
    page: 1,
    pageSize: 24,
    sortBy: filterState.sortBy,
    filters: filterState.filters,
  });

  return (
    <div className="bg-brand-glow pb-16">
      <PageHeader
        title="Produtos"
        description="Explore maquiagem, skincare e acessórios selecionados pela Hello Ana Make."
      />

      <Container className="mt-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <ProductFilters
            value={filterState}
            onChange={setFilterState}
            categories={categories}
            className="h-fit lg:sticky lg:top-24"
          />

          <div>
            {isLoading ? (
              <ProductSkeleton count={12} />
            ) : isError ? (
              <ErrorState
                title="Não foi possível carregar os produtos"
                onRetry={() => void refetch()}
              />
            ) : data && data.items.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-text-secondary">
                  {data.total}{" "}
                  {data.total === 1 ? "produto encontrado" : "produtos encontrados"}
                </p>
                <ProductGrid products={data.items} />
              </>
            ) : (
              <EmptyState
                icon={<PackageSearch className="size-6" aria-hidden />}
                title="Nenhum produto encontrado"
                description="Ajuste os filtros ou explore outras categorias."
                action={{ label: "Limpar filtros", onClick: () => setFilterState({ filters: {}, sortBy: "relevance" }) }}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
