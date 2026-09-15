"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { useBrands } from "@/hooks/use-brands";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useAuthStore, useUiStore } from "@/stores";

export function SiteHeader() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // Navbar por marca (não por categoria fixa) — curadoria do admin em Marcas
  // ("mostrar no menu"/"ordem"), pra deixar quem entra pra comprar um batom, por
  // exemplo, navegar pela marca em vez de ter que escolher entre olhos/boca/rosto.
  const { data: brands } = useBrands();
  const navBrands = (brands ?? [])
    .filter((b) => b.showInNavbar)
    .sort((a, b) => a.navbarOrder - b.navbarOrder);
  // O resto das marcas (não destacadas no topo) fica atrás de "Outros" — dropdown no
  // desktop, seção expansível no mobile — pra não sumir do menu quem não foi escolhida
  // pro destaque, só não ocupar espaço logo de cara.
  const otherBrands = (brands ?? [])
    .filter((b) => !b.showInNavbar)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  // Estados separados: o dropdown do desktop fecha ao clicar fora (via ref), a seção
  // do mobile é só um acordeão dentro do menu que já está aberto — se os dois
  // compartilhassem o mesmo estado, o listener de "clique fora" (que só conhece o
  // DOM do desktop) fecharia e reabriria o próprio botão do mobile no mesmo clique.
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherMobileOpen, setOtherMobileOpen] = useState(false);
  const otherMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!otherOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (!otherMenuRef.current?.contains(event.target as Node)) {
        setOtherOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [otherOpen]);

  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen);
  const searchOpen = useUiStore((s) => s.searchOpen);
  const toggleMobileMenu = useUiStore((s) => s.toggleMobileMenu);
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const toggleMiniCart = useUiStore((s) => s.toggleMiniCart);
  const { itemCount } = useCart();

  // Some ao fechar o menu mobile, senão reabrir mostra o acordeão ainda expandido.
  useEffect(() => {
    if (!mobileMenuOpen) setOtherMobileOpen(false);
  }, [mobileMenuOpen]);

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
          aria-label="Marcas"
        >
          {navBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marcas/${brand.slug}`}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-sm font-medium text-text-secondary",
                "transition-colors hover:bg-secondary hover:text-primary",
              )}
            >
              {brand.name}
            </Link>
          ))}
          {otherBrands.length > 0 ? (
            <div ref={otherMenuRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={otherOpen}
                onClick={() => setOtherOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-text-secondary",
                  "transition-colors hover:bg-secondary hover:text-primary",
                )}
              >
                Outros
                <ChevronDown className="size-3.5" aria-hidden />
              </button>
              {otherOpen ? (
                <div
                  role="menu"
                  className="absolute top-full left-0 z-50 mt-1 grid max-h-80 w-56 grid-cols-1 gap-0.5 overflow-y-auto rounded-xl border border-border bg-white p-1.5 shadow-lg"
                >
                  {otherBrands.map((brand) => (
                    <Link
                      key={brand.slug}
                      href={`/marcas/${brand.slug}`}
                      role="menuitem"
                      onClick={() => setOtherOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-secondary hover:text-primary"
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
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
            {navBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/marcas/${brand.slug}`}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {brand.name}
              </Link>
            ))}
            {otherBrands.length > 0 ? (
              <div>
                <button
                  type="button"
                  aria-expanded={otherMobileOpen}
                  onClick={() => setOtherMobileOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-secondary"
                >
                  Outros
                  <ChevronDown
                    className={cn("size-4 transition-transform", otherMobileOpen && "rotate-180")}
                    aria-hidden
                  />
                </button>
                {otherMobileOpen ? (
                  <div className="flex flex-col gap-1 pl-3">
                    {otherBrands.map((brand) => (
                      <Link
                        key={brand.slug}
                        href={`/marcas/${brand.slug}`}
                        className="rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-secondary"
                        onClick={() => {
                          setOtherMobileOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
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
