import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/store";
import type {
  ProfileFieldErrors,
  ProfilePersonalData,
} from "@/types/profile.type";
import {
  getProfile,
  updateProfile,
  updateProfilePicture,
} from "@/services/profile.service";
import { profileUpdateSchema } from "@/schemas/profile.schema";

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/png", "image/jpeg"]);

export default function useProfileEditor() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.login);
  const [personalData, setPersonalData] = useState<ProfilePersonalData>({
    name: user?.name ?? "",
    birthDate: user?.birthDate ?? "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePictureUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
  const [saved, setSaved] = useState(false);
  const previewObjectUrl = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    void getProfile()
      .then((currentUser) => {
        if (!active) return;
        setUser(currentUser);
        setPersonalData({
          name: currentUser.name,
          birthDate: currentUser.birthDate ?? "",
        });
        setPreviewUrl(currentUser.profilePictureUrl ?? "");
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [setUser]);

  useEffect(
    () => () => {
      if (previewObjectUrl.current) {
        URL.revokeObjectURL(previewObjectUrl.current);
      }
    },
    [],
  );

  const updatePersonalField = (
    field: keyof ProfilePersonalData,
    value: string,
  ) => {
    setPersonalData((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setSaved(false);
  };

  const handlePhotoChange = (file?: File) => {
    if (!file) return;
    if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
      setError("Escolha uma imagem PNG ou JPG.");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setError("A foto deve ter no máximo 5 MB.");
      return;
    }
    setError("");
    setSaved(false);
    if (previewObjectUrl.current) {
      URL.revokeObjectURL(previewObjectUrl.current);
    }
    previewObjectUrl.current = URL.createObjectURL(file);
    setPreviewUrl(previewObjectUrl.current);
    setPhoto(file);
  };

  const savePersonalData = async () => {
    if (!user || saving || uploadingPhoto) return;
    setError("");
    setSaved(false);
    const validation = profileUpdateSchema.safeParse({
      name: personalData.name.trim(),
      ...(personalData.birthDate ? { birthDate: personalData.birthDate } : {}),
    });
    if (!validation.success) {
      const nextErrors: ProfileFieldErrors = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (
          (field === "name" || field === "birthDate") &&
          !nextErrors[field]
        ) {
          nextErrors[field] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      setError(validation.error.issues[0]?.message ?? "Confira os dados informados.");
      return;
    }
    setFieldErrors({});
    setSaving(true);
    try {
      const updatedUser = await updateProfile(validation.data);
      setUser(updatedUser);
      setPersonalData({
        name: updatedUser.name,
        birthDate: updatedUser.birthDate ?? "",
      });
      setSaved(true);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível salvar seus dados pessoais.",
      );
    } finally {
      setSaving(false);
    }
  };

  const savePhoto = async () => {
    if (!user || !photo || uploadingPhoto || saving) return;
    setUploadingPhoto(true);
    setError("");
    setSaved(false);
    try {
      const updatedUser = await updateProfilePicture(photo);
      setUser(updatedUser);
      if (previewObjectUrl.current) {
        URL.revokeObjectURL(previewObjectUrl.current);
        previewObjectUrl.current = null;
      }
      setPreviewUrl(updatedUser.profilePictureUrl ?? "");
      setPhoto(null);
      setSaved(true);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível atualizar sua foto de perfil.",
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  return {
    user,
    personalData,
    updatePersonalField,
    photo,
    previewUrl,
    saving,
    uploadingPhoto,
    error,
    fieldErrors,
    saved,
    handlePhotoChange,
    savePersonalData,
    savePhoto,
  };
}
