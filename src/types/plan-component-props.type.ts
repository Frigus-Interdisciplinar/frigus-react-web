import type { AccountType } from "@/types/auth.type";
import type { Plan } from "@/types/plan.type";

export type PlanSelectionProps = {
  accountType: AccountType;
  planSelectionRequired: boolean;
  plans: Plan[];
  loading: boolean;
  loadError: string;
  actionError: string;
  activating: string | null;
  onRetry: () => void;
  onChoosePlan: (plan: Plan) => void;
};

export type PlanSelectionPageProps = {
  accountType: AccountType;
};
