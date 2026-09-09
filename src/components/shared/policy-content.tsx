import type { ReactNode } from "react";

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
