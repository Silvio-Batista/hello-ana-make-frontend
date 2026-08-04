import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Great_Vibes } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "Hello Ana Make | Maquiagem e Beleza",
    template: "%s | Hello Ana Make",
  },
  description:
    "Hello Ana Make — maquiagem, skincare e cosméticos com acabamento premium. Frete para todo o Brasil.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-text-primary">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
