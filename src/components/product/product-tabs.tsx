"use client";

import { useState, type ReactNode } from "react";
import type { Product } from "@/contracts";
import { cn } from "@/lib/utils";

export interface ProductTabsProps {
  product: Product;
  className?: string;
}

type TabId =
  | "description"
  | "ingredients"
  | "howToUse"
  | "benefits"
  | "technicalInfo";

interface TabDef {
  id: TabId;
  label: string;
  available: boolean;
}

export function ProductTabs({ product, className }: ProductTabsProps) {
  const tabs: TabDef[] = (
    [
      {
        id: "description" as const,
        label: "Descrição",
        available: Boolean(product.description),
      },
      {
        id: "ingredients" as const,
        label: "Ingredientes",
        available: Boolean(product.ingredients),
      },
      {
        id: "howToUse" as const,
        label: "Como usar",
        available: Boolean(product.howToUse),
      },
      {
        id: "benefits" as const,
        label: "Benefícios",
        available: Boolean(product.benefits && product.benefits.length > 0),
      },
      {
        id: "technicalInfo" as const,
        label: "Informações técnicas",
        available: Boolean(
          product.technicalInfo &&
            Object.keys(product.technicalInfo).length > 0,
        ),
      },
    ] satisfies TabDef[]
  ).filter((t) => t.available);

  const [active, setActive] = useState<TabId>(
    tabs[0]?.id ?? "description",
  );

  if (tabs.length === 0) return null;

  let content: ReactNode = null;
  switch (active) {
    case "description":
      content = (
        <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
          {product.description}
        </p>
      );
      break;
    case "ingredients":
      content = (
        <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
          {product.ingredients}
        </p>
      );
      break;
    case "howToUse":
      content = (
        <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
          {product.howToUse}
        </p>
      );
      break;
    case "benefits":
      content = (
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-text-secondary">
          {(product.benefits ?? []).map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      );
      break;
    case "technicalInfo":
      content = (
        <dl className="grid gap-3 sm:grid-cols-2">
          {Object.entries(product.technicalInfo ?? {}).map(([key, value]) => (
            <div key={key} className="rounded-xl bg-surface px-3 py-2.5">
              <dt className="text-xs font-medium tracking-wide text-text-secondary uppercase">
                {key}
              </dt>
              <dd className="mt-0.5 text-sm text-text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      );
      break;
  }

  return (
    <section className={cn("w-full", className)}>
      <div
        className="flex gap-1 overflow-x-auto border-b border-border"
        role="tablist"
        aria-label="Detalhes do produto"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              active === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-5">
        {content}
      </div>
    </section>
  );
}
