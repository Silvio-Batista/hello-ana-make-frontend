"use client";

import { use } from "react";
import Link from "next/link";
import {
  ProductDetailSkeleton,
  ProductGallery,
  ProductInfo,
  ProductReviews,
  ProductTabs,
  RelatedProducts,
} from "@/components/product";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useProduct, useRelated } from "@/hooks/use-products";
import { PackageX } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const { data: product, isLoading, isError, refetch } = useProduct(slug);
  const related = useRelated(product?.id ?? "", 8);

  if (isLoading) {
    return (
      <div className="bg-brand-glow py-10 md:py-14">
        <Container>
          <ProductDetailSkeleton />
        </Container>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-brand-glow py-16">
        <Container>
          <ErrorState
            title="Erro ao carregar o produto"
            description="Tente novamente em instantes."
            onRetry={() => void refetch()}
          />
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-brand-glow py-16">
        <Container>
          <EmptyState
            icon={<PackageX className="size-6" aria-hidden />}
            title="Produto indisponível"
            description="Este item não está disponível ou o link pode estar incorreto."
            action={{ label: "Ver catálogo", href: "/produtos" }}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-brand-glow pb-16">
      <Container className="pt-6 md:pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-secondary">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-primary">
                Início
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/produtos" className="hover:text-primary">
                Produtos
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={`/categorias/${product.category.slug}`}
                className="hover:text-primary"
              >
                {product.category.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="truncate font-medium text-text-primary">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
          <ProductInfo product={product} />
        </div>

        <div className="mt-12 md:mt-16">
          <ProductTabs product={product} />
        </div>

        <div className="mt-12 md:mt-16">
          <ProductReviews rating={product.rating} />
        </div>

        {related.data && related.data.length > 0 ? (
          <div className="mt-12 md:mt-16">
            <RelatedProducts products={related.data} />
          </div>
        ) : null}
      </Container>
    </div>
  );
}
