import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export interface LoadingPageProps {
  label?: string;
  className?: string;
}

export function LoadingPage({
  label = "Carregando...",
  className,
}: LoadingPageProps) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <Spinner size="lg" label={label} />
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}
