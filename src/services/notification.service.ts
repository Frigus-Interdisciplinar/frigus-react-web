import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import { notificationPageResponseSchema } from "@/schemas/api-response.schema";
import { validateForm } from "@/utils/validation.util";
import type { ApiNotification } from "@/types/notification.type";

export function listNotifications(
  signal?: AbortSignal,
): Promise<ApiNotification[]> {
  return serviceCall(
    async () =>
      validateForm(
        notificationPageResponseSchema,
        await api.get<unknown>("/web/core/notifications?page=0&size=50", {
          signal,
        }),
      ).content,
  );
}

export function markAllNotificationsRead(): Promise<void> {
  return serviceCall(() =>
    api.patch<void>("/web/core/notifications/read-all", {}),
  );
}

export function markNotificationRead(id: string): Promise<void> {
  return serviceCall(() =>
    api.patch<void>(
      `/web/core/notifications/${encodeURIComponent(id)}/read`,
      {},
    ),
  );
}
