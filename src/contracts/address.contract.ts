/**
 * Endereço de entrega ou cobrança.
 */
export interface Address {
  id: string;
  userId?: string;
  label?: string;
  recipientName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
