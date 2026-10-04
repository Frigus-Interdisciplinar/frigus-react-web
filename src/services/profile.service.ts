import { z } from "zod";
import { userSchema, profilePutSchema, profilePatchSchema, changePasswordSchema } from "@/schemas/api.schema";
import { request, emptyResponse } from "./request";
import { useStore } from "@/store/store";

export const profileService = {
  get: () => request(userSchema, "/web/profile"),
  update: (data: z.input<typeof profilePutSchema>) => request(userSchema, "/web/profile", "PUT", profilePutSchema.parse(data)),
  patch: (data: z.input<typeof profilePatchSchema>) => request(userSchema, "/web/profile", "PATCH", profilePatchSchema.parse(data)),
  changePassword: (data: z.input<typeof changePasswordSchema>) => request(emptyResponse, "/web/profile/password", "PATCH", changePasswordSchema.parse(data)),
  async deleteAccount() {
    await request(emptyResponse, "/web/profile", "DELETE");
    useStore.getState().logout();
  },
};
