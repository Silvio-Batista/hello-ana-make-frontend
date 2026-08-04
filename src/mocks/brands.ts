import type { Brand } from "@/contracts";

const now = "2026-01-01T00:00:00.000Z";

export const brands: Brand[] = [
  {
    id: "brand-ana-glow",
    slug: "ana-glow",
    name: "Ana Glow",
    description:
      "Linha assinatura Hello Ana Make com acabamento luminoso e fórmulas clean.",
    logo: "https://picsum.photos/seed/anaglow/200/200",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "brand-velvet-rose",
    slug: "velvet-rose",
    name: "Velvet Rose",
    description:
      "Batons e blushs cremosos inspirados em tons rosados sofisticados.",
    logo: "https://picsum.photos/seed/velvetrose/200/200",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "brand-lumina-beauty",
    slug: "lumina-beauty",
    name: "Lumina Beauty",
    description: "Iluminadores, primers e bases com efeito glow natural.",
    logo: "https://picsum.photos/seed/lumina/200/200",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "brand-nude-studio",
    slug: "nude-studio",
    name: "Nude Studio",
    description: "Nudes versáteis para pele, olhos e boca do dia a noite.",
    logo: "https://picsum.photos/seed/nudestudio/200/200",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "brand-crystal-kiss",
    slug: "crystal-kiss",
    name: "Crystal Kiss",
    description: "Glosses e lip oils com brilho cristalino e hidratação intensa.",
    logo: "https://picsum.photos/seed/crystalkiss/200/200",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "brand-skin-ritual",
    slug: "skin-ritual",
    name: "Skin Ritual",
    description: "Skincare que prepara a pele para a maquiagem perfeita.",
    logo: "https://picsum.photos/seed/skinritual/200/200",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "brand-hello-ana",
    slug: "hello-ana",
    name: "Hello Ana",
    description: "Marca própria com kits exclusivos e edições limitadas.",
    logo: "https://picsum.photos/seed/helloana/200/200",
    website: "https://helloanamake.com.br",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

export function getBrandById(id: string): Brand {
  const brand = brands.find((b) => b.id === id);
  if (!brand) throw new Error(`Brand not found: ${id}`);
  return brand;
}
