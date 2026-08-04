import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-hero-mesh",
        className,
      )}
    >
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1800&h=1200&fit=crop"
          alt="Maquiagem Hello Ana Make"
          fill
          priority
          className="object-cover object-center opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff9fb]/95 via-[#fff9fb]/80 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[78vh] lg:px-8">
        <div className="max-w-xl animate-fade-up">
          <div className="relative mb-6 h-14 w-[200px] sm:h-16 sm:w-[240px]">
            <Image
              src="/logo.png"
              alt="Hello Ana Make"
              fill
              priority
              className="object-contain object-left"
              sizes="240px"
            />
          </div>

          <p className="font-script text-3xl text-primary sm:text-4xl">
            Hello Ana Make
          </p>

          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-text-primary sm:text-5xl lg:text-[3.25rem]">
            Beleza que celebra você
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary sm:text-lg">
            Maquiagem e skincare selecionados para um visual sofisticado, com
            frete para todo o Brasil.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/produtos"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-base font-medium text-white shadow-sm shadow-primary/20 transition-colors hover:bg-primary-dark"
            >
              Ver coleção
            </Link>
            <Link
              href="/categorias/ofertas"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white/80 px-6 text-base font-medium text-text-primary backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
            >
              Ofertas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
