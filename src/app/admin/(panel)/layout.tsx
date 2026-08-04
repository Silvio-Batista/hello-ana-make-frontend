"use client";

import type { ReactNode } from "react";
import { AdminGuard, AdminShell } from "@/components/admin";

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
