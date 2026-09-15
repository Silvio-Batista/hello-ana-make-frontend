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
import { useBrand } from "@/hooks/use-brands";
import { useProducts } from "@/hooks/use-products";
import { PackageSearch } from "lucide-react";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export default function BrandPage({ params }: BrandPageProps) {
  const { slug } = use(params);
  const {
    data: brand,
    isLoading: brandLoading,
    isError: brandError,
    refetch: refetchBrand,
  } = useBrand(slug);

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
      brandIds: brand ? [brand.id] : undefined,
    },
  });

  if (brandLoading) {
    return (
      <div className="bg-brand-glow pb-16">
        <PageHeader title="Carregando…" />
        <Container className="mt-8">
          <ProductSkeleton count={8} />
        </Container>
      </div>
    );
  }

  if (brandError) {
    return (
      <div className="bg-brand-glow py-16">
        <Container>
          <ErrorState
            title="Erro ao carregar a marca"
            onRetry={() => void refetchBrand()}
          />
        </Container>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="bg-brand-glow py-16">
        <Container>
          <EmptyState
            icon={<PackageSearch className="size-6" aria-hidden />}
            title="Marca não encontrada"
            description="Confira o endereço ou explore o catálogo completo."
            action={{ label: "Ver produtos", href: "/produtos" }}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-brand-glow pb-16">
      <PageHeader
        title={brand.name}
        description={brand.description}
        breadcrumb={
          <nav aria-label="Breadcrumb" className="text-sm text-text-secondary">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-primary">
                  Início
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-text-primary">{brand.name}</li>
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
                title="Nenhum produto desta marca"
                description="Explore outras marcas ou o catálogo completo."
                action={{ label: "Ver todos os produtos", href: "/produtos" }}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
