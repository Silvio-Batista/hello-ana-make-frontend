"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/contracts";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export function ProductGallery({
  images,
  productName,
  className,
}: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeIndex, setActiveIndex] = useState(() => {
    const primary = sorted.findIndex((img) => img.isPrimary);
    return primary >= 0 ? primary : 0;
  });
  const [zoomed, setZoomed] = useState(false);

  const active = sorted[activeIndex] ?? sorted[0];

  if (!active) {
    return (
      <div
        className={cn(
          "aspect-square rounded-2xl bg-nude",
          className,
        )}
        aria-label="Sem imagem"
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <button
        type="button"
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-2xl bg-nude",
          "cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          zoomed && "cursor-zoom-out",
        )}
        onClick={() => setZoomed((z) => !z)}
        onMouseLeave={() => setZoomed(false)}
        aria-label={zoomed ? "Reduzir imagem" : "Ampliar imagem"}
      >
        <Image
          src={active.url}
          alt={active.alt || productName}
          fill
          priority
          className={cn(
            "object-cover transition-transform duration-300 ease-out",
            zoomed ? "scale-150" : "scale-100",
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </button>

      {sorted.length > 1 ? (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((image, index) => (
            <li key={image.id} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  setZoomed(false);
                }}
                aria-label={`Ver imagem ${index + 1}`}
                aria-current={index === activeIndex}
                className={cn(
                  "relative size-16 overflow-hidden rounded-xl border-2 bg-nude transition-colors sm:size-20",
                  index === activeIndex
                    ? "border-primary"
                    : "border-transparent hover:border-border",
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${productName} — ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
