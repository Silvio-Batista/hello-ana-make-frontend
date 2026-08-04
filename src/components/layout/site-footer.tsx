import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/shared/newsletter-form";

const CATEGORY_LINKS = [
  { label: "Maquiagem", href: "/categorias/maquiagem" },
  { label: "Olhos", href: "/categorias/olhos" },
  { label: "Boca", href: "/categorias/boca" },
  { label: "Rosto", href: "/categorias/rosto" },
  { label: "Skincare", href: "/categorias/skincare" },
  { label: "Kits", href: "/categorias/kits" },
  { label: "Ofertas", href: "/categorias/ofertas" },
] as const;

const HELP_LINKS = [
  { label: "Central de ajuda", href: "/ajuda" },
  { label: "Trocas e devoluções", href: "/ajuda/trocas" },
  { label: "Frete e entrega", href: "/ajuda/frete" },
  { label: "Formas de pagamento", href: "/ajuda/pagamento" },
  { label: "Política de privacidade", href: "/privacidade" },
  { label: "Termos de uso", href: "/termos" },
] as const;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: FacebookIcon,
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: YoutubeIcon,
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="relative block h-9 w-[140px]"
              aria-label="Hello Ana Make"
            >
              <Image
                src="/logo.png"
                alt="Hello Ana Make"
                fill
                className="object-contain object-left"
                sizes="140px"
              />
            </Link>
            <p className="text-sm leading-relaxed text-text-secondary">
              Hello Ana Make é a sua loja de beleza com maquiagem, skincare e
              kits exclusivos. Qualidade, tendências e brindes em todo pedido.
            </p>
            <ul className="flex flex-col gap-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" aria-hidden />
                <a
                  href="mailto:ola@helloanamake.com.br"
                  className="hover:text-primary"
                >
                  ola@helloanamake.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden />
                <a href="tel:+5511999990000" className="hover:text-primary">
                  (11) 99999-0000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>São Paulo, SP — Brasil</span>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-text-primary">
              Categorias
            </h3>
            <ul className="flex flex-col gap-2">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-text-primary">
              Ajuda
            </h3>
            <ul className="flex flex-col gap-2">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + social */}
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="mb-2 font-display text-base font-semibold text-text-primary">
                Novidades
              </h3>
              <p className="mb-3 text-sm text-text-secondary">
                Receba lançamentos e ofertas exclusivas.
              </p>
              <NewsletterForm buttonLabel="Assinar" />
            </div>
            <div>
              <h3 className="mb-3 font-display text-base font-semibold text-text-primary">
                Redes sociais
              </h3>
              <div className="flex gap-2">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-xl border border-border bg-white text-text-secondary transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-text-secondary">
            Formas de pagamento: Pix, cartão de crédito, boleto e carteiras
            digitais.
          </p>
          <p className="text-xs text-text-secondary">
            © {year} Hello Ana Make. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
