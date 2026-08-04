/** Sessão mock compartilhada entre repositórios (auth, address, order, favorites). */
let currentUserId: string | null = "user-001";

export function getCurrentUserId(): string | null {
  return currentUserId;
}

export function setCurrentUserId(userId: string | null): void {
  currentUserId = userId;
}

export function requireCurrentUserId(): string {
  if (!currentUserId) {
    throw new Error("Usuário não autenticado.");
  }
  return currentUserId;
}
