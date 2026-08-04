"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/contracts";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

export interface RelatedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function RelatedProducts({
  products,
  title = "Você também pode gostar",
  subtitle,
  className,
}: RelatedProductsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className={cn("w-full", className)}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <SectionHeading
          title={title}
          subtitle={subtitle}
          className="mb-0"
        />
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Anterior"
            className="flex size-10 items-center justify-center rounded-xl border border-border text-text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Próximo"
            className="flex size-10 items-center justify-center rounded-xl border border-border text-text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-2 sm:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[160px] shrink-0 sm:w-[200px] md:w-[220px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
