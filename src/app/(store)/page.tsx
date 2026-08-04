"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BenefitsSection,
  CategoriesSection,
  HeroSection,
} from "@/components/home";
import { ProductGrid, ProductSkeleton } from "@/components/product";
import { RewardTiers } from "@/components/rewards";
import { NewsletterForm } from "@/components/shared";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  useBestsellers,
  useNewArrivals,
  useOnSale,
  useProducts,
} from "@/hooks/use-products";
import { useRewardTiers } from "@/hooks/use-rewards";

const INSTAGRAM_SEEDS = [
  "ana-ig-1",
  "ana-ig-2",
  "ana-ig-3",
  "ana-ig-4",
  "ana-ig-5",
  "ana-ig-6",
] as const;

export default function HomePage() {
  const bestsellers = useBestsellers(8);
  const onSale = useOnSale({ pageSize: 8, sortBy: "newest" });
  const newArrivals = useNewArrivals(8);
  const featured = useProducts({
    pageSize: 8,
    sortBy: "relevance",
    filters: { isFeatured: true },
  });
  const recommendedFallback = useProducts({
    pageSize: 8,
    sortBy: "bestseller",
  });
  const rewardTiers = useRewardTiers();

  const recommendedProducts =
    featured.data?.items && featured.data.items.length > 0
      ? featured.data.items
      : (recommendedFallback.data?.items ?? []);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <BenefitsSection />
      <CategoriesSection />

      {/* Mais vendidos */}
      <section className="py-14 md:py-16">
        <Container>
          <SectionHeading
            eyebrow="Favoritos"
            title="Mais vendidos"
            subtitle="Os queridinhos que já conquistaram nossas clientes."
            action={{ label: "Ver todos", href: "/produtos" }}
          />
          {bestsellers.isLoading ? (
            <ProductSkeleton count={8} />
          ) : bestsellers.data && bestsellers.data.length > 0 ? (
            <ProductGrid products={bestsellers.data} />
          ) : (
            <EmptyState
              title="Em breve"
              description="Os mais vendidos aparecem aqui em breve."
            />
          )}
        </Container>
      </section>

      {/* Promoções */}
      <section className="bg-surface py-14 md:py-16">
        <Container>
          <SectionHeading
            eyebrow="Aproveite"
            title="Promoções"
            subtitle="Seleção especial com preços que valem a pena."
            action={{ label: "Ver ofertas", href: "/categorias/ofertas" }}
          />
          {onSale.isLoading ? (
            <ProductSkeleton count={8} />
          ) : onSale.data && onSale.data.items.length > 0 ? (
            <ProductGrid products={onSale.data.items} />
          ) : (
            <EmptyState
              title="Sem promoções no momento"
              description="Volte em breve para novas ofertas."
            />
          )}
        </Container>
      </section>

      {/* Lançamentos */}
      <section className="py-14 md:py-16">
        <Container>
          <SectionHeading
            eyebrow="Novidades"
            title="Lançamentos"
            subtitle="Acabaram de chegar para renovar o seu necessário."
            action={{ label: "Ver lançamentos", href: "/produtos" }}
          />
          {newArrivals.isLoading ? (
            <ProductSkeleton count={8} />
          ) : newArrivals.data && newArrivals.data.length > 0 ? (
            <ProductGrid products={newArrivals.data} />
          ) : (
            <EmptyState
              title="Sem lançamentos"
              description="Novidades em preparação."
            />
          )}
        </Container>
      </section>

      {/* Recomendados */}
      <section className="bg-brand-glow py-14 md:py-16">
        <Container>
          <SectionHeading
            eyebrow="Para você"
            title="Recomendados"
            subtitle="Uma curadoria Hello Ana Make para inspirar o seu look."
            action={{ label: "Explorar", href: "/produtos" }}
          />
          {featured.isLoading || recommendedFallback.isLoading ? (
            <ProductSkeleton count={8} />
          ) : recommendedProducts.length > 0 ? (
            <ProductGrid products={recommendedProducts} />
          ) : (
            <EmptyState
              title="Sem recomendações"
              description="Explore nosso catálogo completo."
              action={{ label: "Ver produtos", href: "/produtos" }}
            />
          )}
        </Container>
      </section>

      {/* Campaign banner */}
      <section className="py-14 md:py-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-hero-mesh">
            <div className="absolute inset-0">
              <Image
                src="https://picsum.photos/seed/hello-ana-campaign/1400/500"
                alt=""
                fill
                className="object-cover opacity-35"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/25 via-transparent to-nude/40" />
            </div>
            <div className="relative flex flex-col items-start gap-4 px-6 py-14 sm:px-10 md:max-w-lg md:py-20">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                Campanha
              </p>
              <h2 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
                Monte seu ritual com frete especial
              </h2>
              <p className="text-sm text-text-secondary md:text-base">
                Descubra kits e combinações pensadas para o dia a dia — e
                desbloqueie brindes no programa de recompensas.
              </p>
              <Link
                href="/categorias/kits"
                className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
              >
                Ver kits
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Rewards */}
      <section className="border-y border-border bg-white py-14 md:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Programa"
                title="Recompensas Hello Ana"
                subtitle="Quanto mais você compra, mais brindes exclusivos desbloqueia."
                className="mb-0"
              />
              <Link
                href="/produtos"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary-light px-5 text-sm font-medium text-primary-dark transition-colors hover:bg-primary hover:text-white"
              >
                Começar a comprar
              </Link>
            </div>
            <div>
              {rewardTiers.isLoading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div
                      key={i}
                      className="h-20 animate-pulse rounded-2xl bg-nude"
                    />
                  ))}
                </div>
              ) : rewardTiers.data && rewardTiers.data.length > 0 ? (
                <RewardTiers tiers={rewardTiers.data} />
              ) : (
                <EmptyState
                  title="Recompensas em breve"
                  description="O programa de brindes estará disponível em breve."
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="bg-surface py-14 md:py-16">
        <Container size="md" className="text-center">
          <SectionHeading
            align="center"
            eyebrow="Novidades"
            title="Receba inspirações e ofertas"
            subtitle="Assine e fique por dentro de lançamentos, tutoriais e cupons exclusivos."
          />
          <NewsletterForm
            className="mx-auto max-w-lg"
            buttonLabel="Quero receber"
          />
        </Container>
      </section>

      {/* Instagram / community */}
      <section className="py-14 md:py-16">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Comunidade"
            title="@helloanamake"
            subtitle="Looks reais, bastidores e inspirações do dia a dia."
          />
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 md:gap-3">
            {INSTAGRAM_SEEDS.map((seed, index) => (
              <li
                key={seed}
                className="animate-fade-up relative aspect-square overflow-hidden rounded-2xl bg-nude"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <Image
                  src={`https://picsum.photos/seed/${seed}/400/400`}
                  alt={`Look da comunidade Hello Ana Make ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </div>
  );
}
