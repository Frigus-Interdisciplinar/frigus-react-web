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

interface ProfilePictureUploadTicket {
  path: string;
  token: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const profilePictureBucket =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? "profile-picture";

function encodeStoragePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
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
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("O envio de foto de perfil não está configurado.");
    }

    const ticket = await api.post<ProfilePictureUploadTicket>(
      "/web/profile/picture-upload",
      { contentType: file.type },
    );
    const encodedPath = encodeStoragePath(ticket.path);
    const uploadUrl = new URL(
      `/storage/v1/object/upload/sign/${encodeURIComponent(profilePictureBucket)}/${encodedPath}`,
      supabaseUrl,
    );
    uploadUrl.searchParams.set("token", ticket.token);

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": file.type,
      },
      body: file,
    });
    if (!uploadResponse.ok) {
      throw new Error("Não foi possível enviar a foto. Tente novamente.");
    }

    const profilePictureUrl = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(profilePictureBucket)}/${encodedPath}`;
    return validateForm(
      authUserResponseSchema,
      await api.patch<unknown>("/web/profile", { profilePictureUrl }),
    );
  });
}
