"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader, ProductForm } from "@/components/admin";
import { Skeleton } from "@/components/ui";
import { useAdminProduct } from "@/hooks/use-admin";

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading } = useAdminProduct(params.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <p className="text-sm text-text-secondary">Produto não encontrado.</p>
        <Link
          href="/admin/produtos"
          className="mt-2 inline-block text-sm text-primary hover:underline"
        >
          Voltar aos produtos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/produtos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>
      <PageHeader
        title="Editar produto"
        description={product.name}
      />
      <ProductForm
        product={product}
        onSuccess={() => router.push("/admin/produtos")}
      />
    </div>
  );
}
