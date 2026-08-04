import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export interface CartEmptyProps {
  className?: string;
}

export function CartEmpty({ className }: CartEmptyProps) {
  return (
    <EmptyState
      className={cn(className)}
      icon={<ShoppingBag className="size-6" aria-hidden />}
      title="Seu carrinho está vazio"
      description="Que tal explorar nossas novidades e montar o look perfeito?"
      action={{
        label: "Ver produtos",
        href: "/",
        variant: "primary",
      }}
    />
  );
}
