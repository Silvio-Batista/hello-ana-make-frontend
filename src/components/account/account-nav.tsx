"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gift,
  Heart,
  MapPin,
  Package,
  Settings,
  Tag,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/conta", label: "Minha conta", icon: UserRound, exact: true },
  { href: "/conta/pedidos", label: "Pedidos", icon: Package },
  { href: "/conta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/conta/enderecos", label: "Endereços", icon: MapPin },
  { href: "/conta/cupons", label: "Cupons", icon: Tag },
  { href: "/conta/recompensas", label: "Recompensas", icon: Gift },
  { href: "/conta/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function AccountNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu da conta" className={cn("flex flex-col gap-1", className)}>
      {LINKS.map((link) => {
        const Icon = link.icon;
        const active =
          "exact" in link && link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary-light text-primary-dark"
                : "text-text-secondary hover:bg-secondary hover:text-text-primary",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
