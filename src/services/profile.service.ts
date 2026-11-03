import type { AuthUser } from "@/types/auth.type";
import type { ProfileUpdate } from "@/types/profile.type";
import {
  profilePictureUploadTicketSchema,
  profileUpdateSchema,
} from "@/schemas/profile.schema";
import { authUserResponseSchema } from "@/schemas/api-response.schema";
import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import { sanitizeText, validateForm } from "@/utils/validation.util";

const MAX_PROFILE_PICTURE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PROFILE_PICTURE_TYPES = new Set(["image/png", "image/jpeg"]);

export function getProfile(): Promise<AuthUser> {
  return serviceCall(async () =>
    validateForm(
      authUserResponseSchema,
      await api.get<unknown>("/web/profile"),
    ),
  );
}

export function updateProfile(data: ProfileUpdate): Promise<AuthUser> {
  const validated = validateForm(profileUpdateSchema, {
    ...data,
    ...(data.name === undefined ? {} : { name: sanitizeText(data.name, 120) }),
  });
  return serviceCall(async () =>
    validateForm(
      authUserResponseSchema,
      await api.patch<unknown>("/web/profile", validated),
    ),
  );
}

export function updateProfilePicture(file: File): Promise<AuthUser> {
  return serviceCall(async () => {
    if (!ALLOWED_PROFILE_PICTURE_TYPES.has(file.type)) {
      throw new Error("Escolha uma imagem PNG ou JPG.");
    }
    if (file.size > MAX_PROFILE_PICTURE_SIZE_BYTES) {
      throw new Error("A foto deve ter no máximo 5 MB.");
    }

    const ticket = validateForm(
      profilePictureUploadTicketSchema,
      await api.post<unknown>(
        "/web/profile/picture-upload",
        { contentType: file.type },
      ),
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
