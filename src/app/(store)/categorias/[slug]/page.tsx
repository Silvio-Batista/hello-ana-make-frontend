"use client";

import { use, useState } from "react";
import Link from "next/link";
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
import { useCategory } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import { PackageSearch } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const {
    data: category,
    isLoading: categoryLoading,
    isError: categoryError,
    refetch: refetchCategory,
  } = useCategory(slug);

  const [filterState, setFilterState] = useState<ProductFiltersValue>({
    filters: {},
    sortBy: "relevance",
  });

  const { data, isLoading, isError, refetch } = useProducts({
    page: 1,
    pageSize: 24,
    sortBy: filterState.sortBy,
    filters: {
      ...filterState.filters,
      categoryIds: category ? [category.id] : undefined,
    },
  });

  if (categoryLoading) {
    return (
      <div className="bg-brand-glow pb-16">
        <PageHeader title="Carregando…" />
        <Container className="mt-8">
          <ProductSkeleton count={8} />
        </Container>
      </div>
    );
  }

  if (categoryError) {
    return (
      <div className="bg-brand-glow py-16">
        <Container>
          <ErrorState
            title="Erro ao carregar a categoria"
            onRetry={() => void refetchCategory()}
          />
        </Container>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="bg-brand-glow py-16">
        <Container>
          <EmptyState
            icon={<PackageSearch className="size-6" aria-hidden />}
            title="Categoria não encontrada"
            description="Confira o endereço ou explore outras coleções."
            action={{ label: "Ver categorias", href: "/categorias" }}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-brand-glow pb-16">
      <PageHeader
        title={category.name}
        description={category.description}
        breadcrumb={
          <nav aria-label="Breadcrumb" className="text-sm text-text-secondary">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-primary">
                  Início
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/categorias" className="hover:text-primary">
                  Categorias
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-text-primary">{category.name}</li>
            </ol>
          </nav>
        }
      />

      <Container className="mt-8">
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
                title="Não foi possível carregar os produtos"
                onRetry={() => void refetch()}
              />
            ) : data && data.items.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-text-secondary">
                  {data.total}{" "}
                  {data.total === 1 ? "produto" : "produtos"}
                </p>
                <ProductGrid products={data.items} />
              </>
            ) : (
              <EmptyState
                icon={<PackageSearch className="size-6" aria-hidden />}
                title="Nenhum produto nesta categoria"
                description="Explore outras coleções ou o catálogo completo."
                action={{ label: "Ver todos os produtos", href: "/produtos" }}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
