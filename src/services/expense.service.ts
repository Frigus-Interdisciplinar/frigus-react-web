import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import { validateForm } from "@/utils/validation.util";
import { expenseSchema } from "@/schemas/commercial.schema";
import type { Expense, MonthlyReport } from "@/types/commercial.type";
import {
  expenseResponseSchema,
  groupContextResponseSchema,
  monthlyReportResponseSchema,
} from "@/schemas/api-response.schema";
import { z } from "zod";

export function getCommercialGroupId(signal?: AbortSignal): Promise<string> {
  return serviceCall(
    async () =>
      validateForm(
        groupContextResponseSchema,
        await api.get<unknown>("/web/core/inventory/active-context", {
          signal,
        }),
      ).groupId,
  );
}

export function listExpenses(
  groupId: string,
  signal?: AbortSignal,
): Promise<Expense[]> {
  return serviceCall(
    async () =>
      validateForm(
        z.object({ content: z.array(expenseResponseSchema) }),
        await api.get<unknown>(
          `/web/core/commercial/groups/${encodeURIComponent(groupId)}/expenses?size=100`,
          { signal },
        ),
      ).content,
  );
}

export function createExpense(
  groupId: string,
  input: Omit<Expense, "id">,
): Promise<void> {
  const validatedInput = validateForm(expenseSchema, input);
  return serviceCall(() =>
    api.post<void>(
      `/web/core/commercial/groups/${encodeURIComponent(groupId)}/expenses`,
      validatedInput,
    ),
  );
}

export function getMonthlyExpenseReport(
  month: string,
  signal?: AbortSignal,
): Promise<MonthlyReport> {
  return serviceCall(async () => {
    const groupId = await getCommercialGroupId(signal);
    return validateForm(
      monthlyReportResponseSchema,
      await api.get<unknown>(
        `/web/core/commercial/groups/${encodeURIComponent(groupId)}/reports/monthly?month=${encodeURIComponent(month)}`,
        { signal },
      ),
    );
  });
}
