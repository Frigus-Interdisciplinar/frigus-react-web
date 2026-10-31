import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import { validateForm } from "@/utils/validation.util";
import { discardSchema } from "@/schemas/commercial.schema";
import type { Discard } from "@/types/commercial.type";
import { discardResponseSchema } from "@/schemas/api-response.schema";
import { z } from "zod";

export function listDiscards(signal?: AbortSignal): Promise<Discard[]> {
  return serviceCall(
    async () =>
      validateForm(
        z.object({ content: z.array(discardResponseSchema) }),
        await api.get<unknown>("/web/core/discards?size=100", { signal }),
      ).content,
  );
}

export function createDiscard(
  input: Pick<Discard, "stockProductId" | "quantity" | "reason">,
): Promise<void> {
  const validatedInput = validateForm(discardSchema, input);
  return serviceCall(() =>
    api.post<void>("/web/core/discards", validatedInput),
  );
}
