import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/contracts";

/**
 * Repositório de categorias.
 */
export interface CategoryRepository {
  list(): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  getBySlug(slug: string): Promise<Category | null>;
  getChildren(parentId: string): Promise<Category[]>;
  getTree(): Promise<Category[]>;
  create(input: CreateCategoryInput): Promise<Category>;
  update(id: string, input: UpdateCategoryInput): Promise<Category>;
  remove(id: string): Promise<void>;
}
