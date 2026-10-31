export interface Discard {
  id: number;
  stockProductId: number;
  quantity: number;
  reason?: string;
  date: string;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  expenseDate: string;
  supplier?: string;
}

export interface MonthlyReport {
  month: string;
  totalExpenses: number;
  purchaseTotal: number;
  completedPurchases: number;
  expensesByCategory: Record<string, number>;
}

export type CommercialMemberRole = "EDITOR" | "VIEWER";

export interface Employee {
  userId: string;
  name: string;
  email: string;
  memberRole?: CommercialMemberRole | "OWNER";
  isOwner?: boolean;
}

export interface GroupInvitation {
  id: string;
  name?: string;
  email: string;
  acceptedAt?: string;
  revokedAt?: string;
}
