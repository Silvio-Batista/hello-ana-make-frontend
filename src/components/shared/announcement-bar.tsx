import { Truck } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

export interface AnnouncementBarProps {
  threshold?: number;
  message?: string;
  className?: string;
}

export function AnnouncementBar({
  threshold = 199,
  message,
  className,
}: AnnouncementBarProps) {
  const text =
    message ??
    `Frete grátis em compras acima de ${formatCurrency(threshold)}`;

  return (
    <div
      className={cn(
        "bg-text-primary text-white",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium tracking-wide sm:text-sm">
        <Truck className="size-3.5 shrink-0 text-primary-light" aria-hidden />
        <p>{text}</p>
      </div>
    </div>
  );
}
