import type { AuthUser } from "@/types/auth.type";
import { authUserResponseSchema } from "@/schemas/api-response.schema";
import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import { validateForm } from "@/utils/validation.util";

export interface ProfileUpdate {
  name?: string;
  birthDate?: string;
  profilePictureUrl?: string;
}

export function getProfile(): Promise<AuthUser> {
  return serviceCall(async () =>
    validateForm(
      authUserResponseSchema,
      await api.get<unknown>("/web/profile"),
    ),
  );
}

interface ProfilePictureUploadTicket {
  uploadUrl: string;
  profilePictureUrl: string;
}

export function updateProfile(data: ProfileUpdate): Promise<AuthUser> {
  return serviceCall(async () =>
    validateForm(
      authUserResponseSchema,
      await api.patch<unknown>("/web/profile", data),
    ),
  );
}

export function updateProfilePicture(file: File): Promise<AuthUser> {
  return serviceCall(async () => {
    const ticket = await api.post<ProfilePictureUploadTicket>(
      "/web/profile/picture-upload",
      { contentType: file.type },
    );

    const uploadResponse = await fetch(ticket.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!uploadResponse.ok) {
      throw new Error("Não foi possível enviar a foto. Tente novamente.");
    }

    return validateForm(
      authUserResponseSchema,
      await api.patch<unknown>("/web/profile", {
        profilePictureUrl: ticket.profilePictureUrl,
      }),
    );
  });
}
