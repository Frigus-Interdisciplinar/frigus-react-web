export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "BOLETO";

export interface CheckoutTransactionInput {
  planCode: string;
  paymentMethod?: PaymentMethod;
  fakeCardLast4?: string;
  fakePixKey?: string;
}

export interface Transaction {
  id: string;
  status: string;
  amount?: number;
  planCode?: string;
}

export interface CheckoutInput {
  acceptTerms: true;
  planCode: string;
  paymentMethod: "card" | "pix" | "boleto";
  cardNumber?: string;
}
