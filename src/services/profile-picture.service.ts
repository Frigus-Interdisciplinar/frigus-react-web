import { createClient } from "@supabase/supabase-js";
import { profileService } from "@/services/profile.service";

const MAX_FILE_SIZE = 256_000;
const allowedTypes = new Set(["image/jpeg", "image/png"]);

export async function uploadProfilePicture(file: File): Promise<string> {
  if (!allowedTypes.has(file.type)) throw new Error("Escolha uma imagem PNG ou JPEG.");
  if (file.size > MAX_FILE_SIZE) throw new Error("A imagem deve ter no máximo 250 KB.");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
  const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET;
  if (!supabaseUrl || !publishableKey || !bucket) {
    throw new Error("Configure VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY e VITE_SUPABASE_STORAGE_BUCKET.");
  }

  const supabase = createClient(supabaseUrl, publishableKey);
  const { path, token } = await profileService.createPictureUpload(file.type);
  const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file, {
    cacheControl: "3600",
    contentType: file.type,
  });
  if (error) throw new Error(`Não foi possível enviar a foto: ${error.message}`);

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
