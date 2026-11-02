import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import type { GroupDto } from "@/types/group.type";
import { employeeInvitationSchema } from "@/schemas/commercial.schema";
import { validateForm } from "@/utils/validation.util";
import { groupResponseSchema } from "@/schemas/api-response.schema";
import { z } from "zod";

export function listGroups(signal?: AbortSignal): Promise<GroupDto[]> {
  return serviceCall(async () =>
    validateForm(
      z.array(groupResponseSchema),
      await api.get<unknown>("/web/core/groups", { signal }),
    ),
  );
}

export function inviteGroupMember(
  groupId: string,
  input: { email: string; name?: string; memberRole: "EDITOR" | "VIEWER" },
): Promise<void> {
  const validatedInput = validateForm(employeeInvitationSchema, input);
  return serviceCall(() =>
    api.post<void>(
      `/web/core/groups/${encodeURIComponent(groupId)}/invitations`,
      validatedInput,
    ),
  );
}
