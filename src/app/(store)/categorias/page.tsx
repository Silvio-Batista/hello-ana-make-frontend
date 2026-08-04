"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/shared";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { LayoutGrid } from "lucide-react";

export default function CategoriesPage() {
  const { data, isLoading, isError, refetch } = useCategories();

  const categories = (data ?? [])
    .filter((cat) => cat.isActive)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div className="bg-brand-glow pb-16">
      <PageHeader
        title="Categorias"
        description="Navegue pelas coleções Hello Ana Make e encontre o que combina com você."
      />

      <Container className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Não foi possível carregar as categorias"
            onRetry={() => void refetch()}
          />
        ) : categories.length === 0 ? (
          <EmptyState
            icon={<LayoutGrid className="size-6" aria-hidden />}
            title="Nenhuma categoria"
            description="As categorias aparecerão em breve."
          />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((category, index) => (
              <li
                key={category.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <Link
                  href={`/categorias/${category.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-nude"
                >
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-text-primary/75 via-text-primary/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h2 className="font-display text-xl font-semibold text-white">
                      {category.name}
                    </h2>
                    {category.description ? (
                      <p className="mt-1 line-clamp-2 text-xs text-white/85">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}
