import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export interface PolicySectionProps {
  title: string;
  children: ReactNode;
}

/** Bloco de seção numerada usado nas páginas de termos/privacidade/cookies/ajuda. */
export function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="font-display text-xl font-semibold text-text-primary">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-text-secondary">
        {children}
      </div>
    </section>
  );
}

/**
 * Aviso de que o texto abaixo é placeholder — usado nas páginas com implicação
 * jurídica (termos, privacidade, cookies) até serem revisadas/substituídas.
 */
export function PlaceholderNotice({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  );
}
