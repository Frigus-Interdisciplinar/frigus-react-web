import { api } from "@/utils/api.util";
import type { LoginInput, RegisterInput } from "@/schemas/auth.schema";
import type { LoginResponseDto, RegisterResponseDto } from "@/types/auth.type";

export async function login(data: LoginInput) {
  const res = await api.post<LoginResponseDto>("/web/auth/login", data);
  return res;
}

export async function register(data: RegisterInput) {
  const res = await api.post<RegisterResponseDto>("web/auth/register", data);
  return res;
}