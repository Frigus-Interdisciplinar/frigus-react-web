import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/schemas/auth.schema";
import { loginResponseSchema, userSchema } from "@/schemas/api.schema";
import { request, emptyResponse } from "./request";
import { useStore } from "@/store/store";

export async function login(data: LoginInput) {
  const res = await request(loginResponseSchema, "/web/auth/login", "POST", loginSchema.parse(data));
  return res;
}

export async function register(data: RegisterInput) {
  const res = await request(userSchema, "/web/auth/register", "POST", registerSchema.parse(data));
  return res;
}

export async function refresh() {
  const session = await request(loginResponseSchema, "/web/auth/refresh", "POST", {});
  useStore.getState().login(session.user, session.accessToken, session.refreshToken);
  return session;
}
export async function logout() {
  await request(emptyResponse, "/web/auth/logout", "POST", {});
  useStore.getState().logout();
}
