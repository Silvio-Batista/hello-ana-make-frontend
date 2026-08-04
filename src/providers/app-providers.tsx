"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { QueryProvider } from "@/providers/query-provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ToastProvider>{children}</ToastProvider>
    </QueryProvider>
  );
}
