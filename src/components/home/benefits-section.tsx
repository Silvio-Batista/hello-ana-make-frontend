import {
  CreditCard,
  Headphones,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BENEFITS: BenefitItem[] = [
  {
    icon: CreditCard,
    title: "Pagamento seguro",
    description: "Pix, cartão e parcelamento com proteção total.",
  },
  {
    icon: Truck,
    title: "Entrega Brasil",
    description: "Enviamos para todo o país com rastreio.",
  },
  {
    icon: ShieldCheck,
    title: "Produtos originais",
    description: "Cosméticos autênticos e selecionados com carinho.",
  },
  {
    icon: Headphones,
    title: "Atendimento",
    description: "Suporte humano para tirar dúvidas e escolher.",
  },
];

export interface BenefitsSectionProps {
  className?: string;
}

export function BenefitsSection({ className }: BenefitsSectionProps) {
  return (
    <section className={cn("border-b border-border bg-white py-10", className)}>
      <Container>
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="animate-fade-up text-center md:text-left"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary-light text-primary md:mx-0">
                  <Icon className="size-5" aria-hidden />
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
