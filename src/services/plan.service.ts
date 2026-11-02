import { api } from "@/utils/api.util";
import { validateForm } from "@/utils/validation.util";
import {
  planCatalogSchema,
  planSubscriptionSchema,
} from "@/schemas/plan.schema";
import { ensureStarterWorkspace, refreshSession } from "./auth.service";

export async function listPlans(signal?: AbortSignal) {
  return validateForm(
    planCatalogSchema,
    await api.get<unknown>("/web/plans", { signal }),
  );
}

export async function getMySubscription(signal?: AbortSignal) {
  return validateForm(
    planSubscriptionSchema,
    await api.get<unknown>("/web/plans/subscription", { signal }),
  );
}

export async function finishPlanSelection(signal?: AbortSignal) {
  const { user } = await refreshSession(signal);
  if (user.planSelectionRequired)
    throw new Error(
      "A ativação do plano ainda não foi confirmada. Tente novamente.",
    );
  await ensureStarterWorkspace(user.accountType, signal);
  return user;
}
