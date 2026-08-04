"use client";

import type { Brand } from "@/contracts";
import type { Category } from "@/contracts";
import type { ProductFilters, ProductSortBy } from "@/contracts";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface ProductFiltersValue {
  filters: ProductFilters;
  sortBy: ProductSortBy;
}

export interface ProductFiltersProps {
  value: ProductFiltersValue;
  onChange: (value: ProductFiltersValue) => void;
  categories?: Category[];
  brands?: Brand[];
  className?: string;
}

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: "relevance", label: "Relevância" },
  { value: "newest", label: "Mais recentes" },
  { value: "bestseller", label: "Mais vendidos" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "rating", label: "Melhor avaliação" },
  { value: "name_asc", label: "Nome A–Z" },
  { value: "name_desc", label: "Nome Z–A" },
];

export function ProductFiltersPanel({
  value,
  onChange,
  categories = [],
  brands = [],
  className,
}: ProductFiltersProps) {
  const { filters, sortBy } = value;

  const updateFilters = (patch: Partial<ProductFilters>) => {
    onChange({
      sortBy,
      filters: { ...filters, ...patch },
    });
  };

  const toggleId = (
    key: "categoryIds" | "brandIds",
    id: string,
    checked: boolean,
  ) => {
    const current = filters[key] ?? [];
    const next = checked
      ? [...current, id]
      : current.filter((item) => item !== id);
    updateFilters({ [key]: next.length > 0 ? next : undefined });
  };

  return (
    <aside
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-border bg-white p-4 sm:p-5",
        className,
      )}
    >
      <Select
        label="Ordenar por"
        name="sortBy"
        options={SORT_OPTIONS}
        value={sortBy}
        onChange={(e) =>
          onChange({
            filters,
            sortBy: e.target.value as ProductSortBy,
          })
        }
      />

      {categories.length > 0 ? (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-text-primary">
            Categoria
          </legend>
          <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
            {categories.map((cat) => (
              <Checkbox
                key={cat.id}
                name={`cat-${cat.id}`}
                label={`${cat.name}${cat.productCount != null ? ` (${cat.productCount})` : ""}`}
                checked={(filters.categoryIds ?? []).includes(cat.id)}
                onChange={(e) =>
                  toggleId("categoryIds", cat.id, e.target.checked)
                }
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      {brands.length > 0 ? (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-text-primary">
            Marca
          </legend>
          <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
            {brands.map((brand) => (
              <Checkbox
                key={brand.id}
                name={`brand-${brand.id}`}
                label={brand.name}
                checked={(filters.brandIds ?? []).includes(brand.id)}
                onChange={(e) =>
                  toggleId("brandIds", brand.id, e.target.checked)
                }
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-text-primary">
          Preço
        </legend>
        <div className="flex items-center gap-2">
          <Input
            name="priceMin"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Mín."
            aria-label="Preço mínimo"
            value={filters.priceMin ?? ""}
            onChange={(e) => {
              const raw = e.target.value;
              updateFilters({
                priceMin: raw === "" ? undefined : Number(raw),
              });
            }}
          />
          <span className="text-text-secondary">–</span>
          <Input
            name="priceMax"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Máx."
            aria-label="Preço máximo"
            value={filters.priceMax ?? ""}
            onChange={(e) => {
              const raw = e.target.value;
              updateFilters({
                priceMax: raw === "" ? undefined : Number(raw),
              });
            }}
          />
        </div>
      </fieldset>

      <Checkbox
        name="inStockOnly"
        label="Somente em estoque"
        checked={Boolean(filters.inStockOnly)}
        onChange={(e) =>
          updateFilters({
            inStockOnly: e.target.checked ? true : undefined,
          })
        }
      />

      <Checkbox
        name="onSale"
        label="Em promoção"
        checked={Boolean(filters.onSale)}
        onChange={(e) =>
          updateFilters({
            onSale: e.target.checked ? true : undefined,
          })
        }
      />
    </aside>
  );
}

/** Alias solicitado pelo brief (product-filters.tsx). */
export { ProductFiltersPanel as ProductFilters };
