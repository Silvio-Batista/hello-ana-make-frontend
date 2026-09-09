import type { NextConfig } from "next";

// Permite renderizar via <Image> as URLs de upload retornadas pelo backend
// (UploadsController — produto/categoria/marca/home), que apontam pro próprio
// domínio da API, não pra um CDN externo. Derivado de NEXT_PUBLIC_API_URL (disponível
// em build time) pra acompanhar automaticamente onde o backend estiver hospedado.
function apiRemotePattern() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000");
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
    };
  } catch {
    return { protocol: "http" as const, hostname: "localhost", port: "8000" };
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      apiRemotePattern(),
      {
        protocol: "https",
        hostname: "hello-ana-make-backend.onrender.com",
      },
      // CDN das mídias reais do feed do Instagram (grid "Comunidade" da home).
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
      },
    ],
  },
};

export default nextConfig;
