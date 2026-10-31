export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export interface UserPreferences {
  expirationAlertsEnabled: boolean;
  lowStockAlertsEnabled: boolean;
  shoppingRemindersEnabled: boolean;
  weeklySummaryEnabled: boolean;
  theme: "LIGHT" | "DARK" | "SYSTEM";
}
