"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader, ProductForm } from "@/components/admin";

export default function AdminNewProductPage() {
  const router = useRouter();

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
        title="Novo produto"
        description="Preencha os dados do produto e variantes"
      />
      <ProductForm onSuccess={() => router.push("/admin/produtos")} />
    </div>
  );
}
