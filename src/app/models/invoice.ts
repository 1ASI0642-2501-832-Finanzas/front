export interface Invoice {
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
  walletId: number;
}

export interface Cost {
  reason: string;
  value: string;
  type: string;
}
