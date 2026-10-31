import { z } from "zod";

export const userPreferencesSchema = z.object({
  expirationAlertsEnabled: z.boolean(),
  lowStockAlertsEnabled: z.boolean(),
  shoppingRemindersEnabled: z.boolean(),
  weeklySummaryEnabled: z.boolean(),
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]),
});
