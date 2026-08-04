"use client";

import { Heart } from "lucide-react";
import { ProductGrid } from "@/components/product";
import { EmptyState, ErrorState, Spinner } from "@/components/ui";
import { useFavorites } from "@/hooks";

export default function FavoritosPage() {
  const favorites = useFavorites();

  return (
    <div>
      <h2 className="mb-4 font-display text-xl font-semibold text-text-primary">
        Favoritos
      </h2>

      {favorites.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Carregando favoritos" />
        </div>
      ) : favorites.isError ? (
        <ErrorState
          title="Não foi possível carregar os favoritos"
          onRetry={() => void favorites.refetch()}
        />
      ) : !favorites.data?.items.length ? (
        <EmptyState
          icon={<Heart className="size-6" aria-hidden />}
          title="Nenhum favorito ainda"
          description="Toque no coração nos produtos que você ama para salvá-los aqui."
          action={{ label: "Explorar", href: "/", variant: "primary" }}
        />
      ) : (
        <ProductGrid products={favorites.data.items} />
      )}
    </div>
  );
}
