"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useAuthStore, useUiStore } from "@/stores";

const NAV_CATEGORIES = [
  { label: "Maquiagem", slug: "maquiagem" },
  { label: "Olhos", slug: "olhos" },
  { label: "Boca", slug: "boca" },
  { label: "Rosto", slug: "rosto" },
  { label: "Skincare", slug: "skincare" },
  { label: "Kits", slug: "kits" },
  { label: "Ofertas", slug: "ofertas" },
] as const;

export function SiteHeader() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen);
  const searchOpen = useUiStore((s) => s.searchOpen);
  const toggleMobileMenu = useUiStore((s) => s.toggleMobileMenu);
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const toggleMiniCart = useUiStore((s) => s.toggleMiniCart);
  const { itemCount } = useCart();

  const accountHref = isAuthenticated ? "/conta" : "/login";

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    router.push(q ? `/busca?q=${encodeURIComponent(q)}` : "/busca");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        {/* Mobile hamburger */}
        <button
          type="button"
          className="rounded-xl p-2 text-text-primary transition-colors hover:bg-secondary lg:hidden"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="size-5" aria-hidden />
          ) : (
            <Menu className="size-5" aria-hidden />
          )}
        </button>

        <Link
          href="/"
          className="relative mx-auto block h-9 w-[140px] shrink-0 lg:mx-0 lg:h-10 lg:w-[160px]"
          aria-label="Hello Ana Make — início"
        >
          <Image
            src="/logo.png"
            alt="Hello Ana Make"
            fill
            priority
            className="object-contain object-left"
            sizes="160px"
          />
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Categorias"
        >
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorias/${cat.slug}`}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-sm font-medium text-text-secondary",
                "transition-colors hover:bg-secondary hover:text-primary",
              )}
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            className="hidden rounded-xl p-2 text-text-primary transition-colors hover:bg-secondary sm:inline-flex"
            aria-label="Buscar"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="size-5" aria-hidden />
          </button>

          <Link
            href={accountHref}
            className="hidden rounded-xl p-2 text-text-primary transition-colors hover:bg-secondary sm:inline-flex"
            aria-label={isAuthenticated ? "Minha conta" : "Entrar"}
          >
            <User className="size-5" aria-hidden />
          </Link>

          <Link
            href="/conta/favoritos"
            className="hidden rounded-xl p-2 text-text-primary transition-colors hover:bg-secondary sm:inline-flex"
            aria-label="Favoritos"
          >
            <Heart className="size-5" aria-hidden />
          </Link>

          <button
            type="button"
            className="relative rounded-xl p-2 text-text-primary transition-colors hover:bg-secondary"
            aria-label={`Carrinho${itemCount > 0 ? `, ${itemCount} itens` : ""}`}
            onClick={toggleMiniCart}
          >
            <ShoppingBag className="size-5" aria-hidden />
            {itemCount > 0 ? (
              <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </Container>

      {/* Search bar */}
      {searchOpen ? (
        <div className="border-t border-border bg-white">
          <Container className="py-3">
            <form onSubmit={submitSearch} className="flex gap-2">
              <Input
                name="q"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftAddon={<Search className="size-4" aria-hidden />}
                autoFocus
                aria-label="Buscar produtos"
              />
              <Link
                href="/busca"
                className="hidden shrink-0 items-center text-sm font-medium text-primary sm:inline-flex"
                onClick={() => setSearchOpen(false)}
              >
                Ver tudo
              </Link>
            </form>
          </Container>
        </div>
      ) : null}

      {/* Mobile menu */}
      {mobileMenuOpen ? (
        <div className="border-t border-border bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <form onSubmit={submitSearch} className="mb-3">
              <Input
                name="q"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftAddon={<Search className="size-4" aria-hidden />}
                aria-label="Buscar produtos"
              />
            </form>
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorias/${cat.slug}`}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-1 border-t border-border pt-3">
              <Link
                href={accountHref}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAuthenticated ? "Minha conta" : "Entrar"}
              </Link>
              <Link
                href="/conta/favoritos"
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Favoritos
              </Link>
              <Link
                href="/busca"
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Busca
              </Link>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
