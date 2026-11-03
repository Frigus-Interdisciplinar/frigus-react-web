export type PlanBillingInterval = "MONTHLY" | "YEARLY";
export type PlanSubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "CANCELED"
  | "EXPIRED"
  | "DELINQUENT";

export interface PlanBenefit {
  code: string;
  label: string;
  enabled: boolean;
  limit?: number | null;
}

export interface Plan {
  id: number;
  planCode: string;
  name: string;
  description: string;
  price: number;
  billingInterval: PlanBillingInterval | null;
  active: boolean;
  benefits: PlanBenefit[];
}

export interface PlanSubscriptionPlan {
  planCode: string;
  name: string;
  description: string;
  price: number;
  billingInterval: PlanBillingInterval | null;
  limits: {
    maxProductsPerStock: number;
    maxStocks: number;
  } | null;
}

export interface PlanSubscription {
  status: PlanSubscriptionStatus;
  plan: PlanSubscriptionPlan;
}
