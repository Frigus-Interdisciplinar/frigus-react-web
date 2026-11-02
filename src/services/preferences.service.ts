import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import type { UserPreferences } from "@/types/notification.type";
import { userPreferencesSchema } from "@/schemas/preferences.schema";
import { validateForm } from "@/utils/validation.util";

export function getUserPreferences(
  signal?: AbortSignal,
): Promise<UserPreferences> {
  return serviceCall(async () =>
    validateForm(
      userPreferencesSchema,
      await api.get<unknown>("/web/core/preferences", { signal }),
    ),
  );
}

export function updateUserPreferences(
  preferences: UserPreferences,
  signal?: AbortSignal,
): Promise<void> {
  const validatedPreferences = validateForm(userPreferencesSchema, preferences);
  return serviceCall(() =>
    api.put<void>("/web/core/preferences", validatedPreferences, { signal }),
  );
}
