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
      toast("Imagem enviada!", "success");
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
    <div className="flex items-end gap-3">
      {/* Prévia da imagem já enviada/colada — sem isso, a única confirmação de que o
          upload funcionou era o texto da URL no campo, fácil de passar batido. */}
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL dinâmica (upload do admin), fora do domínio otimizado pelo next/image em alguns ambientes.
        <img
          src={value}
          alt=""
          className="size-11 shrink-0 rounded-lg border border-border object-cover"
        />
      ) : null}
      <div className="flex-1">
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
      </div>
    </div>
  );
}
