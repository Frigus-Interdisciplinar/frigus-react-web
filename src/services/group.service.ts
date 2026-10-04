import { z } from "zod";
import { groupSchema, groupCreateSchema, groupUpdateSchema, uuid } from "@/schemas/api.schema";
import { request, emptyResponse } from "./request";
const path = (groupId: string) => `/web/core/groups/${uuid.parse(groupId)}`;
export const groupService = {
  list: () => request(z.array(groupSchema), "/web/core/groups"),
  get: (groupId: string) => request(groupSchema, path(groupId)),
  create: (data: z.input<typeof groupCreateSchema>) => request(groupSchema, "/web/core/groups", "POST", groupCreateSchema.parse(data)),
  update: (groupId: string, data: z.input<typeof groupUpdateSchema>) => request(groupSchema, path(groupId), "PUT", groupUpdateSchema.parse(data)),
  addMember: (groupId: string, userId: string) => request(groupSchema, `${path(groupId)}/members`, "POST", { userId: uuid.parse(userId) }),
  removeMember: (groupId: string, userId: string) => request(emptyResponse, `${path(groupId)}/members/${uuid.parse(userId)}`, "DELETE"),
};
