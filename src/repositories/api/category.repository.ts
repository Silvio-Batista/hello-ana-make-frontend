import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/contracts";
import type { CategoryRepository } from "@/repositories/interfaces";
import { notImplemented } from "@/repositories/utils";

export class ApiCategoryRepository implements CategoryRepository {
  list(): Promise<Category[]> {
    return notImplemented("ApiCategoryRepository.list");
  }

  getById(_id: string): Promise<Category | null> {
    return notImplemented("ApiCategoryRepository.getById");
  }

  getBySlug(_slug: string): Promise<Category | null> {
    return notImplemented("ApiCategoryRepository.getBySlug");
  }

  getChildren(_parentId: string): Promise<Category[]> {
    return notImplemented("ApiCategoryRepository.getChildren");
  }

  getTree(): Promise<Category[]> {
    return notImplemented("ApiCategoryRepository.getTree");
  }

  create(_input: CreateCategoryInput): Promise<Category> {
    return notImplemented("ApiCategoryRepository.create");
  }

  update(_id: string, _input: UpdateCategoryInput): Promise<Category> {
    return notImplemented("ApiCategoryRepository.update");
  }

  remove(_id: string): Promise<void> {
    return notImplemented("ApiCategoryRepository.remove");
  }
}
