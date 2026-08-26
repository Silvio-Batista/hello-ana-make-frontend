"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import type {
  CreateProductInput,
  Product,
  ProductImage,
  ProductVariant,
} from "@/contracts";
import {
  Button,
  Checkbox,
  Input,
  Select,
  Textarea,
  useToast,
} from "@/components/ui";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  useAdminBrands,
  useAdminCategories,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/use-admin";
import { slugify } from "@/lib/utils";

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyVariant(): ProductVariant {
  return {
    id: createId("var"),
    sku: "",
    name: "Padrão",
    attributes: {},
    price: 0,
    stock: 0,
    isAvailable: true,
  };
}

function emptyImage(): ProductImage {
  return {
    id: createId("img"),
    url: "",
    alt: "",
    sortOrder: 0,
    isPrimary: false,
  };
}

interface ProductFormState {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  brandId: string;
  categoryId: string;
  ingredients: string;
  howToUse: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
}

function productToForm(product: Product): ProductFormState {
  return {
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    brandId: product.brand.id,
    categoryId: product.category.id,
    ingredients: product.ingredients ?? "",
    howToUse: product.howToUse ?? "",
    isFeatured: Boolean(product.isFeatured),
    isNew: Boolean(product.isNew),
    isBestseller: Boolean(product.isBestseller),
    variants: product.variants.length > 0 ? product.variants : [emptyVariant()],
    images: product.images.length > 0 ? product.images : [emptyImage()],
  };
}

function emptyForm(): ProductFormState {
  return {
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    brandId: "",
    categoryId: "",
    ingredients: "",
    howToUse: "",
    isFeatured: false,
    isNew: false,
    isBestseller: false,
    variants: [emptyVariant()],
    images: [emptyImage()],
  };
}

interface ProductFormProps {
  product?: Product | null;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const { data: brands = [] } = useAdminBrands();
  const { data: categories = [] } = useAdminCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [form, setForm] = useState<ProductFormState>(() =>
    product ? productToForm(product) : emptyForm(),
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(product));

  useEffect(() => {
    if (product) {
      setForm(productToForm(product));
      setSlugTouched(true);
    }
  }, [product]);

  const isEditing = Boolean(product);
  const isPending = createProduct.isPending || updateProduct.isPending;

  const updateField = <K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : slugify(name),
    }));
  };

  const updateVariant = (
    index: number,
    patch: Partial<ProductVariant> & {
      color?: string;
      colorHex?: string;
      volume?: string;
    },
  ) => {
    setForm((prev) => {
      const variants = [...prev.variants];
      const current = variants[index];
      const { color, colorHex, volume, ...rest } = patch;
      variants[index] = {
        ...current,
        ...rest,
        attributes: {
          ...current.attributes,
          ...(color !== undefined ? { color } : {}),
          ...(colorHex !== undefined ? { colorHex } : {}),
          ...(volume !== undefined ? { volume } : {}),
        },
      };
      return { ...prev, variants };
    });
  };

  const updateImage = (index: number, patch: Partial<ProductImage>) => {
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = { ...images[index], ...patch };
      return { ...prev, images };
    });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.brandId || !form.categoryId) {
      toast("Selecione marca e categoria.", "error");
      return;
    }

    if (form.variants.length === 0) {
      toast("Adicione pelo menos uma variante.", "error");
      return;
    }

    const images = form.images
      .filter((img) => img.url.trim())
      .map((img, i) => ({
        ...img,
        alt: img.alt || form.name,
        sortOrder: i,
        isPrimary: i === 0,
      }));

    const input: CreateProductInput = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      brandId: form.brandId,
      categoryId: form.categoryId,
      images,
      variants: form.variants.map((v) => ({
        ...v,
        sku: v.sku.trim(),
        name: v.name.trim(),
        price: Number(v.price),
        promotionalPrice:
          v.promotionalPrice !== undefined && v.promotionalPrice > 0
            ? Number(v.promotionalPrice)
            : undefined,
        stock: Number(v.stock),
        isAvailable: v.stock > 0,
      })),
      ingredients: form.ingredients.trim() || undefined,
      howToUse: form.howToUse.trim() || undefined,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      isBestseller: form.isBestseller,
    };

    try {
      if (isEditing && product) {
        await updateProduct.mutateAsync({ id: product.id, input });
        toast("Produto atualizado com sucesso.", "success");
      } else {
        await createProduct.mutateAsync(input);
        toast("Produto criado com sucesso.", "success");
      }
      onSuccess?.();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Não foi possível salvar o produto.",
        "error",
      );
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-xl border border-border bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">
          Informações básicas
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Nome"
            name="name"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
          <Input
            label="Slug"
            name="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              updateField("slug", e.target.value);
            }}
            required
          />
          <div className="md:col-span-2">
            <Input
              label="Descrição curta"
              name="shortDescription"
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Textarea
              label="Descrição"
              name="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
            />
          </div>
          <Select
            label="Marca"
            name="brandId"
            value={form.brandId}
            onChange={(e) => updateField("brandId", e.target.value)}
            options={brands.map((b) => ({ value: b.id, label: b.name }))}
            placeholder="Selecione a marca"
            required
          />
          <Select
            label="Categoria"
            name="categoryId"
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Selecione a categoria"
            required
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-text-primary">Variantes</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Plus className="size-4" />}
            onClick={() =>
              updateField("variants", [...form.variants, emptyVariant()])
            }
          >
            Adicionar
          </Button>
        </div>
        <div className="space-y-4">
          {form.variants.map((variant, index) => (
            <div
              key={variant.id}
              className="rounded-lg border border-border bg-[#FAF8F9] p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-text-secondary uppercase">
                  Variante {index + 1}
                </p>
                {form.variants.length > 1 ? (
                  <button
                    type="button"
                    aria-label="Remover variante"
                    className="rounded-lg p-1.5 text-error hover:bg-error/10"
                    onClick={() =>
                      updateField(
                        "variants",
                        form.variants.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                  </button>
                ) : null}
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  label="Nome"
                  value={variant.name}
                  onChange={(e) => updateVariant(index, { name: e.target.value })}
                  required
                />
                <Input
                  label="SKU"
                  value={variant.sku}
                  onChange={(e) => updateVariant(index, { sku: e.target.value })}
                  required
                />
                <Input
                  label="Estoque"
                  type="number"
                  min={0}
                  value={variant.stock}
                  onChange={(e) =>
                    updateVariant(index, { stock: Number(e.target.value) })
                  }
                  required
                />
                <Input
                  label="Preço"
                  type="number"
                  min={0}
                  step="0.01"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(index, { price: Number(e.target.value) })
                  }
                  required
                />
                <Input
                  label="Preço promocional"
                  type="number"
                  min={0}
                  step="0.01"
                  value={variant.promotionalPrice ?? ""}
                  onChange={(e) =>
                    updateVariant(index, {
                      promotionalPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
                <Input
                  label="Cor"
                  value={variant.attributes.color ?? ""}
                  onChange={(e) =>
                    updateVariant(index, { color: e.target.value })
                  }
                />
                <Input
                  label="Hex da cor"
                  value={variant.attributes.colorHex ?? ""}
                  onChange={(e) =>
                    updateVariant(index, { colorHex: e.target.value })
                  }
                  placeholder="#E83E8C"
                />
                <Input
                  label="Volume"
                  value={variant.attributes.volume ?? ""}
                  onChange={(e) =>
                    updateVariant(index, { volume: e.target.value })
                  }
                  placeholder="30ml"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-text-primary">Imagens</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Plus className="size-4" />}
            onClick={() =>
              updateField("images", [...form.images, emptyImage()])
            }
          >
            Adicionar
          </Button>
        </div>
        <div className="space-y-3">
          {form.images.map((image, index) => (
            <div key={image.id} className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <ImageUploadField
                  label={index === 0 ? "URL" : undefined}
                  value={image.url}
                  onChange={(url) => updateImage(index, { url })}
                />
              </div>
              <Input
                label={index === 0 ? "Texto alternativo" : undefined}
                value={image.alt}
                onChange={(e) => updateImage(index, { alt: e.target.value })}
                className="flex-1"
              />
              {form.images.length > 1 ? (
                <button
                  type="button"
                  aria-label="Remover imagem"
                  className="mt-auto mb-1 self-end rounded-lg p-2 text-error hover:bg-error/10 sm:self-center"
                  onClick={() =>
                    updateField(
                      "images",
                      form.images.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">
          Detalhes e flags
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Textarea
            label="Ingredientes"
            value={form.ingredients}
            onChange={(e) => updateField("ingredients", e.target.value)}
          />
          <Textarea
            label="Como usar"
            value={form.howToUse}
            onChange={(e) => updateField("howToUse", e.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <Checkbox
            name="isFeatured"
            label="Destaque"
            checked={form.isFeatured}
            onChange={(e) => updateField("isFeatured", e.target.checked)}
          />
          <Checkbox
            name="isNew"
            label="Lançamento"
            checked={form.isNew}
            onChange={(e) => updateField("isNew", e.target.checked)}
          />
          <Checkbox
            name="isBestseller"
            label="Mais vendido"
            checked={form.isBestseller}
            onChange={(e) => updateField("isBestseller", e.target.checked)}
          />
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Button type="submit" loading={isPending}>
          {isEditing ? "Salvar alterações" : "Criar produto"}
        </Button>
      </div>
    </form>
  );
}
