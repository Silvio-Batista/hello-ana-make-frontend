"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { useAuthStore } from "@/stores";

interface AdminHeaderProps {
  title?: string;
  onMenuClick: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-white px-4 lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-secondary hover:text-text-primary lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="flex items-center gap-2 lg:hidden">
        <Image
          src="/logo.png"
          alt="Hello Ana Make"
          width={28}
          height={28}
          className="rounded object-contain"
        />
        <span className="text-sm font-semibold text-text-primary">Admin</span>
      </div>

      {title ? (
        <h1 className="hidden text-sm font-medium text-text-secondary lg:block">
          {title}
        </h1>
      ) : null}

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-sm text-text-secondary sm:inline">
          {user?.name}
        </span>
        <span className="flex size-8 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary-dark">
          {user?.name?.charAt(0).toUpperCase() ?? "A"}
        </span>
      </div>
    </header>
  );
}
