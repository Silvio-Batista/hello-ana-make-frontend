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
  createdAt: string;
  updatedAt: string;
}
