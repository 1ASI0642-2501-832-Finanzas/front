export interface Invoice {
  id?: number;  // Devuelto por el backend
  invoiceType: string;
  financialInstitutionName: string;
  number: string;
  series: string;
  issuerName: string;
  issuerRuc: string;
  currency: string;
  amount: number;
  igv: number;
  emissionDate: string;
  dueDate: string;
  discountDate: string;
  terms: string;
  nominalRate: number;
  effectiveRate: number;
  initialCosts: Cost[];
  finalCosts: Cost[];
  status: string;
  walletId: number; // ID de la cartera
  tcea?: number;  // Devuelto por el backend
  wallet?: Wallet; // Información adicional de la cartera
}

export interface Cost {
  id?: number;  // Devuelto por el backend en GET
  reason: string;
  value: number;
  type: string;
}

export interface Wallet {
  id: number;
  name: string;
  description: string;
  discountDate: string;
  tcea?: number;
  user?: User; // Información del usuario si se necesita
}

export interface User {
  id: number;
  email: string;
  username: string;
  roles: string[]; // Lista de roles
}
