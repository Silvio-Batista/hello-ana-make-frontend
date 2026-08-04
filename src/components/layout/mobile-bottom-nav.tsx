"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Grid3x3,
  Heart,
  Home,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores";

const NAV_ITEMS = [
  { label: "Início", href: "/", icon: Home, type: "link" as const },
  {
    label: "Categorias",
    href: "/categorias",
    icon: Grid3x3,
    type: "link" as const,
  },
  { label: "Busca", href: "/busca", icon: Search, type: "link" as const },
  {
    label: "Favoritos",
    href: "/conta/favoritos",
    icon: Heart,
    type: "link" as const,
  },
  {
    label: "Carrinho",
    href: "/carrinho",
    icon: ShoppingBag,
    type: "cart" as const,
  },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const toggleMiniCart = useUiStore((s) => s.toggleMiniCart);
  const { itemCount } = useCart();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Navegação inferior"
    >
      <ul className="mx-auto flex h-14 max-w-lg items-stretch justify-around px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          if (item.type === "cart") {
            return (
              <li key={item.label} className="flex-1">
                <button
                  type="button"
                  onClick={toggleMiniCart}
                  className={cn(
                    "relative flex h-full w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                    "transition-colors",
                    isActive ? "text-primary" : "text-text-secondary",
                  )}
                  aria-label={`Carrinho${itemCount > 0 ? `, ${itemCount} itens` : ""}`}
                >
                  <span className="relative">
                    <Icon className="size-5" aria-hidden />
                    {itemCount > 0 ? (
                      <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                        {itemCount > 99 ? "99+" : itemCount}
                      </span>
                    ) : null}
                  </span>
                  {item.label}
                </button>
              </li>
            );
          }

          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                  "transition-colors",
                  isActive ? "text-primary" : "text-text-secondary",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
