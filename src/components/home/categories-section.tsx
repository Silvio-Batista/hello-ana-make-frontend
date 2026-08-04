"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";

const FEATURED_SLUGS = [
  "maquiagem",
  "olhos",
  "boca",
  "rosto",
  "skincare",
  "acessorios",
  "kits",
  "ofertas",
] as const;

export interface CategoriesSectionProps {
  className?: string;
}

export function CategoriesSection({ className }: CategoriesSectionProps) {
  const { data, isLoading } = useCategories();

  const categories = (data ?? [])
    .filter((cat) =>
      FEATURED_SLUGS.includes(cat.slug as (typeof FEATURED_SLUGS)[number]),
    )
    .sort(
      (a, b) =>
        FEATURED_SLUGS.indexOf(a.slug as (typeof FEATURED_SLUGS)[number]) -
        FEATURED_SLUGS.indexOf(b.slug as (typeof FEATURED_SLUGS)[number]),
    );

  return (
    <section className={cn("bg-brand-glow py-14 md:py-16", className)}>
      <Container>
        <SectionHeading
          eyebrow="Explore"
          title="Categorias"
          subtitle="Encontre o que combina com o seu ritual de beleza."
          action={{ label: "Ver todas", href: "/categorias" }}
        />

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
            {categories.map((category, index) => (
              <li
                key={category.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-text-primary/70 via-text-primary/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <p className="font-display text-lg font-semibold text-white sm:text-xl">
                      {category.name}
                    </p>
                    {category.productCount != null ? (
                      <p className="mt-0.5 text-xs text-white/80">
                        {category.productCount} produtos
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
