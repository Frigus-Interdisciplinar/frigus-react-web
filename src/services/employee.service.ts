import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import { validateForm } from "@/utils/validation.util";
import { employeeInvitationSchema } from "@/schemas/commercial.schema";
import type {
  CommercialMemberRole,
  GroupInvitation,
} from "@/types/commercial.type";
import {
  employeeResponseSchema,
  groupContextResponseSchema,
  invitationResponseSchema,
} from "@/schemas/api-response.schema";
import { z } from "zod";

import type { CommercialTeam } from "@/types/commercial.type";
export type { CommercialTeam } from "@/types/commercial.type";

export function getCommercialTeam(
  signal?: AbortSignal,
): Promise<CommercialTeam> {
  return serviceCall(async () => {
    const { groupId } = validateForm(
      groupContextResponseSchema,
      await api.get<unknown>("/web/core/inventory/active-context", { signal }),
    );
    const [employees, invitations] = await Promise.all([
      api.get<unknown>(
        `/web/core/commercial/groups/${encodeURIComponent(groupId)}/employees`,
        { signal },
      ),
      api.get<unknown>(
        `/web/core/groups/${encodeURIComponent(groupId)}/invitations`,
        { signal },
      ),
    ]);
    return {
      groupId,
      employees: validateForm(z.array(employeeResponseSchema), employees),
      invitations: validateForm(
        z.array(invitationResponseSchema),
        invitations,
      ).filter((item) => !item.acceptedAt && !item.revokedAt),
    };
  });
}

export function inviteCommercialEmployee(
  groupId: string,
  input: { name?: string; email: string; memberRole: CommercialMemberRole },
): Promise<void> {
  const validatedInput = validateForm(employeeInvitationSchema, input);
  return serviceCall(() =>
    api.post<void>(
      `/web/core/commercial/groups/${encodeURIComponent(groupId)}/employees/invitations`,
      validatedInput,
    ),
  );
}

export function listPendingInvitations(
  groupId: string,
): Promise<GroupInvitation[]> {
  return serviceCall(async () =>
    validateForm(
      z.array(invitationResponseSchema),
      await api.get<unknown>(
        `/web/core/groups/${encodeURIComponent(groupId)}/invitations`,
      ),
    ).filter((item) => !item.acceptedAt && !item.revokedAt),
  );
}

export function updateCommercialMemberRole(
  groupId: string,
  userId: string,
  memberRole: CommercialMemberRole,
): Promise<void> {
  return serviceCall(() =>
    api.patch<void>(`/web/core/groups/${groupId}/members/${userId}/role`, {
      memberRole,
    }),
  );
}
