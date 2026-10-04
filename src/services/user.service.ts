import { z } from "zod";
import { uuid, userSchema, accountTypeSchema, pageSchema, type Paging } from "@/schemas/api.schema";
import { request, query, emptyResponse } from "./request";
const path = (userId: string) => `/web/user/${uuid.parse(userId)}`;
export const userService = {
  list: (paging?: Paging) => request(pageSchema(userSchema), "/web/user", "GET", undefined, query(paging)),
  get: (userId: string) => request(userSchema, path(userId)),
  findByEmail: (email: string) => request(userSchema, "/web/user/search", "GET", undefined, { params: { email: z.email().parse(email) } }),
  updateRole: (userId: string, role: "USER" | "ADMIN") => request(userSchema, `${path(userId)}/role`, "PATCH", { role: z.enum(["USER", "ADMIN"]).parse(role) }),
  updateAccountType: (userId: string, accountType: z.input<typeof accountTypeSchema>) => request(userSchema, `${path(userId)}/account-type`, "PATCH", { accountType: accountTypeSchema.parse(accountType) }),
  resetPassword: (userId: string, newPassword: string) => request(emptyResponse, `${path(userId)}/password`, "PATCH", { newPassword: z.string().min(8).parse(newPassword) }),
  delete: (userId: string) => request(emptyResponse, path(userId), "DELETE"),
};
