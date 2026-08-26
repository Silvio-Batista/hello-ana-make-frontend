"use client";

import { useRef } from "react";
import { Loader2, Upload } from "lucide-react";
import { Input, useToast } from "@/components/ui";
import { useUploadImage } from "@/hooks/use-admin";

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  placeholder?: string;
}

/** Campo de URL de imagem com upload direto (POST /admin/uploads). */
export function ImageUploadField({
  label,
  value,
  onChange,
  required,
  placeholder = "https://...",
}: ImageUploadFieldProps) {
  const { toast } = useToast();
  const uploadImage = useUploadImage();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = await uploadImage.mutateAsync(file);
      onChange(result.url);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erro ao enviar imagem.",
        "error",
      );
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Input
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      rightAddon={
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            aria-label="Enviar imagem"
            disabled={uploadImage.isPending}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg p-1 text-text-secondary hover:bg-secondary hover:text-primary disabled:opacity-50"
          >
            {uploadImage.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="size-4" aria-hidden />
            )}
          </button>
        </>
      }
    />
  );
}
