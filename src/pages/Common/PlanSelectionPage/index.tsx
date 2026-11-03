import { Navigate } from "react-router-dom";
import PlanSelection from "@/components/PlanSelection";
import { usePlanSelectionController } from "@/hooks/usePlanSelectionController";
import type { PlanSelectionPageProps } from "@/types/plan-component-props.type";

export default function PlanSelectionPage({
  accountType,
}: PlanSelectionPageProps) {
  const state = usePlanSelectionController(accountType);
  const { redirectTo, ...props } = state;
  if (redirectTo) return <Navigate to={redirectTo} replace />;
  return <PlanSelection {...props} />;
}
