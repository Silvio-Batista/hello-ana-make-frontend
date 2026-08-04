/**
 * Categoria de produtos (suporta hierarquia via parentId).
 */
export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  parentId?: string;
  productCount?: number;
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}
