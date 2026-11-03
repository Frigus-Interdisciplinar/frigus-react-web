import { api } from "@/utils/api.util";
import { validateForm } from "@/utils/validation.util";
import {
  planCatalogSchema,
  planSubscriptionSchema,
} from "@/schemas/plan.schema";
import { refreshSession } from "./auth.service";
import type { Plan, PlanSubscription } from "@/types/plan.type";
import type { AuthUser } from "@/types/auth.type";
import { serviceCall } from "@/utils/service.util";

export async function listPlans(signal?: AbortSignal): Promise<Plan[]> {
  return serviceCall(async () =>
    validateForm(
      planCatalogSchema,
      await api.get<unknown>("/web/plans", { signal }),
    ),
  );
}

export async function getMySubscription(
  signal?: AbortSignal,
): Promise<PlanSubscription> {
  return serviceCall(async () =>
    validateForm(
      planSubscriptionSchema,
      await api.get<unknown>("/web/plans/subscription", { signal }),
    ),
  );
}

export async function finishPlanSelection(
  signal?: AbortSignal,
): Promise<AuthUser> {
  return serviceCall(async () => {
    const { user } = await refreshSession(signal);
    if (user.planSelectionRequired)
      throw new Error(
        "A ativação do plano ainda não foi confirmada. Tente novamente.",
      );
    return user;
  });
}
