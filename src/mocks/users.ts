import type { User } from "@/contracts";

/** Senha mock dos clientes: helloana123 | Admin: admin123 */
export const users: User[] = [
  {
    id: "user-001",
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "(11) 98888-1001",
    document: "123.456.789-00",
    avatarUrl: "https://picsum.photos/seed/user-ana/200/200",
    birthDate: "1992-04-15",
    role: "customer",
    emailVerified: true,
    createdAt: "2025-06-12T14:30:00.000Z",
    updatedAt: "2026-07-01T10:00:00.000Z",
  },
  {
    id: "user-002",
    name: "Marina Costa",
    email: "marina.costa@email.com",
    phone: "(21) 97777-2002",
    document: "987.654.321-00",
    avatarUrl: "https://picsum.photos/seed/user-marina/200/200",
    role: "customer",
    emailVerified: false,
    createdAt: "2026-07-28T09:15:00.000Z",
    updatedAt: "2026-07-28T09:15:00.000Z",
  },
  {
    id: "admin-001",
    name: "Admin Hello Ana",
    email: "admin@helloana.make",
    role: "admin",
    emailVerified: true,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2026-07-01T10:00:00.000Z",
  },
];

export const mockPasswords: Record<string, string> = {
  "ana.silva@email.com": "helloana123",
  "marina.costa@email.com": "helloana123",
  "admin@helloana.make": "admin123",
};

/** Usuários que ainda não finalizaram a primeira compra. */
export const firstPurchaseUserIds = new Set(["user-002"]);
