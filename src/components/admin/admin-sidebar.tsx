"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  ExternalLink,
  Gift,
  LayoutDashboard,
  LogOut,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  Tags,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  external?: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
  { label: "Categorias", href: "/admin/categorias", icon: Tags },
  { label: "Marcas", href: "/admin/marcas", icon: Award },
  { label: "Cupons", href: "/admin/cupons", icon: Ticket },
  { label: "Promoções", href: "/admin/promocoes", icon: Percent },
  { label: "Recompensas", href: "/admin/recompensas", icon: Gift },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

function isActivePath(pathname: string, item: AdminNavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    onNavigate?.();
    router.push("/admin/login");
  };

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col bg-[#2D2027] text-white",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Image
          src="/logo.png"
          alt="Hello Ana Make"
          width={36}
          height={36}
          className="rounded-lg bg-white/10 object-contain p-0.5"
        />
        <div>
          <p className="text-sm font-semibold tracking-wide">Hello Ana Make</p>
          <p className="text-xs text-white/50">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden />
          Ver loja
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-4 shrink-0" aria-hidden />
          Sair
        </button>
      </div>
    </aside>
  );
}
