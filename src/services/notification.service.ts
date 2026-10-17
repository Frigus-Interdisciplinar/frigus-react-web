import { z } from "zod";
import { uuid, notificationSchema, pageSchema, userPreferencesSchema, type Paging } from "@/schemas/api.schema";
import { request, query, emptyResponse } from "./request";
const root = "/web/core/notifications";
export const notificationService = {
  list: (paging?: Paging, unread = false) => request(pageSchema(notificationSchema), unread ? `${root}/unread` : root, "GET", undefined, query(paging)),
  unreadCount: () => request(z.object({ count: z.number().int().nonnegative() }), `${root}/unread-count`),
  markRead: (notificationId: string) => request(notificationSchema, `${root}/${uuid.parse(notificationId)}/read`, "PATCH"),
  markAllRead: () => request(emptyResponse, `${root}/read-all`, "PATCH"),
  preferences: () => request(userPreferencesSchema, "/web/core/preferences"),
  updatePreferences: (data: z.input<typeof userPreferencesSchema>) => request(userPreferencesSchema, "/web/core/preferences", "PUT", userPreferencesSchema.parse(data)),
};
