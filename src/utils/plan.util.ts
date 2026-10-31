import type { AccountType, AuthUser } from "@/types/auth.type";

const homePaths: Record<AccountType, string> = {
  DOMESTIC: "/home",
  COMMERCIAL: "/commercial",
  BUSINESS: "/enterprise",
};

const planPaths: Record<AccountType, string> = {
  DOMESTIC: "/plans/domestic",
  COMMERCIAL: "/plans/commercial",
  BUSINESS: "/plans/enterprise",
};

const accountPlans: Record<AccountType, readonly string[]> = {
  DOMESTIC: ["FREE", "PLUS", "FAMILY"],
  COMMERCIAL: ["FREE", "COMMERCIAL"],
  BUSINESS: ["FREE", "ENTERPRISE"],
};
const legacyPlanCodes: Record<string, string> = {
  family: "FAMILY",
  "family-plus": "PLUS",
  commercial: "COMMERCIAL",
  enterprise: "ENTERPRISE",
};

export const getAccountHome = (accountType: AccountType) =>
  homePaths[accountType];
export const getPlansPath = (accountType: AccountType) =>
  planPaths[accountType];
export const getSessionDestination = (user: AuthUser) =>
  user.planSelectionRequired
    ? user.pendingPlanTransactionId
      ? `/checkout/webview/success?transactionId=${encodeURIComponent(user.pendingPlanTransactionId)}`
      : getPlansPath(user.accountType)
    : getAccountHome(user.accountType);
export const isPlanAvailableForAccount = (
  planCode: string,
  accountType: AccountType,
) => accountPlans[accountType].includes(planCode);

export function resolveCheckoutPlanCode(
  value: string | null,
): string | undefined {
  if (!value) return undefined;
  if (Object.hasOwn(legacyPlanCodes, value)) return legacyPlanCodes[value];
  return ["FREE", "PLUS", "FAMILY", "COMMERCIAL", "ENTERPRISE"].includes(value)
    ? value
    : undefined;
}

export const formatPlanPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
