/**
 * Marca de produtos de beleza.
 */
export interface Brand {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  /** Curadoria do admin: aparece no menu do topo do site. */
  showInNavbar: boolean;
  /** Ordem entre as marcas com showInNavbar=true (menor primeiro). */
  navbarOrder: number;
  createdAt: string;
  updatedAt: string;
}
