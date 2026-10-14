import type { LoginInput, RegisterInput } from "@/schemas/auth.schema";
import type { LoginResponseDto, RegisterResponseDto } from "@/types/auth.type";
import { api } from "@/utils/api.util";

export interface PasswordRecoveryRequest {
  email: string;
}

export interface VerifyPasswordRecoveryCodeRequest extends PasswordRecoveryRequest {
  code: string;
}

export interface ResetPasswordRequest extends VerifyPasswordRecoveryCodeRequest {
  newPassword: string;
}

export async function login(data: LoginInput) {
  const res = await api.post<LoginResponseDto>("/web/auth/login", data);
  return res;
}

export async function register(data: RegisterInput) {
  const res = await api.post<RegisterResponseDto>("/web/auth/register", {
    ...data,
    birthDate: new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${data.birthDate}T12:00:00Z`)),
  });
  return res;
}

export async function refreshSession() {
  return api.post<LoginResponseDto>("/web/auth/refresh", {});
}

export async function logout() {
  return api.post<void>("/web/auth/logout", {});
}

export async function getProfile() {
  return api.get<LoginResponseDto["user"]>("/web/profile");
}

export async function ensureStarterWorkspace(accountType: LoginResponseDto["user"]["accountType"]) {
  const groups = await api.get<Array<{ id: string; name: string }>>("/web/core/groups");
  if (groups.length > 0) return groups[0];

  const labels = { DOMESTIC: "Minha casa", COMMERCIAL: "Meu estabelecimento", BUSINESS: "Minha empresa" };
  const group = await api.post<{ id: string; name: string }>("/web/core/groups", { name: labels[accountType] });
  await api.post("/web/core/inventory/stocks", { groupId: group.id, name: accountType === "DOMESTIC" ? "Despensa" : "Estoque principal" });
  return group;
}

export async function requestPasswordRecovery(data: PasswordRecoveryRequest) {
  return api.post<void>("/web/auth/forgot-password", data);
}

export async function verifyPasswordRecoveryCode(data: VerifyPasswordRecoveryCodeRequest) {
  return api.post<void>("/web/auth/verify-reset-code", data);
}

export async function resetPassword(data: ResetPasswordRequest) {
  return api.post<void>("/web/auth/reset-password", data);
}
