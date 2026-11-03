import { useRef } from "react";
import { ArrowLeft, Camera, Check, User } from "lucide-react";
import { Link } from "react-router-dom";
import useProfileEditor from "@/hooks/useProfileEditor";

export default function ProfileEditPage() {
  const {
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
  } = useProfileEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials =
    user?.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-frigus-primary hover:underline dark:text-blue-400"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Minha conta
        </Link>
        <h1 className="mt-4 font-montserrat text-2xl font-bold text-frigus-navy dark:text-white md:text-3xl">
          Editar dados pessoais
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          Atualize seu nome, data de nascimento e foto de perfil.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          <Check size={16} aria-hidden="true" />
          Alterações salvas.
        </p>
      )}

      <section className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-[#343941] dark:bg-[#1C1E22] md:p-8">
        <h2 className="font-montserrat text-base font-bold text-frigus-navy dark:text-white">
          Foto de perfil
        </h2>
        <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-blue-50 bg-frigus-ice text-2xl font-bold text-frigus-navy dark:border-[#343941] dark:bg-[#252A32] dark:text-blue-300">
            {previewUrl ? (
              <img src={previewUrl} alt="Prévia da foto de perfil" className="h-full w-full object-cover" />
            ) : (
              initials || <User size={26} aria-hidden="true" />
            )}
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              PNG ou JPG, até 5 MB.
            </p>
            <input
              id="profile-photo"
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="sr-only"
              aria-label="Selecionar foto de perfil"
              onChange={(event) => handlePhotoChange(event.currentTarget.files?.[0])}
            />
            <label htmlFor="profile-photo" className="sr-only">
              Selecionar foto de perfil
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-frigus-navy hover:bg-gray-50 dark:border-[#343941] dark:text-white dark:hover:bg-[#252A32]"
              >
                <Camera size={16} aria-hidden="true" />
                Escolher foto
              </button>
              {photo && (
                <button
                  type="button"
                  onClick={() => void savePhoto()}
                  disabled={uploadingPhoto || saving}
                  className="rounded-xl bg-frigus-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingPhoto ? "Enviando…" : "Salvar foto"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void savePersonalData();
        }}
        className="space-y-6 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-[#343941] dark:bg-[#1C1E22] md:p-8"
      >
        <h2 className="font-montserrat text-base font-bold text-frigus-navy dark:text-white">
          Dados pessoais
        </h2>
        <label htmlFor="profile-name" className="block space-y-2">
          <span className="text-sm font-semibold text-frigus-navy dark:text-white">Nome completo</span>
          <input
            required
            id="profile-name"
            minLength={1}
            maxLength={120}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "profile-name-error" : undefined}
            value={personalData.name}
            onChange={(event) => updatePersonalField("name", event.currentTarget.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-frigus-navy outline-none focus:border-frigus-primary focus:ring-2 focus:ring-frigus-primary/15 dark:border-[#343941] dark:bg-[#171819] dark:text-white"
          />
          {fieldErrors.name && <span id="profile-name-error" className="text-xs text-red-600 dark:text-red-300">{fieldErrors.name}</span>}
        </label>
        <label htmlFor="profile-birth-date" className="block space-y-2">
          <span className="text-sm font-semibold text-frigus-navy dark:text-white">Data de nascimento</span>
          <input
            type="date"
            aria-invalid={Boolean(fieldErrors.birthDate)}
            aria-describedby={fieldErrors.birthDate ? "profile-birth-date-error" : undefined}
            id="profile-birth-date"
            value={personalData.birthDate}
            onChange={(event) => updatePersonalField("birthDate", event.currentTarget.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-frigus-navy outline-none focus:border-frigus-primary focus:ring-2 focus:ring-frigus-primary/15 dark:border-[#343941] dark:bg-[#171819] dark:text-white"
          />
          {fieldErrors.birthDate && <span id="profile-birth-date-error" className="text-xs text-red-600 dark:text-red-300">{fieldErrors.birthDate}</span>}
        </label>
        <label htmlFor="profile-email" className="block space-y-2">
          <span className="text-sm font-semibold text-frigus-navy dark:text-white">E-mail</span>
          <input
            type="email"
            id="profile-email"
            value={user?.email ?? ""}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-[#343941] dark:bg-[#252A32] dark:text-neutral-400"
          />
          <span className="block text-xs text-gray-400 dark:text-neutral-500">A alteração de e-mail não está disponível por esta tela.</span>
        </label>
        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5 dark:border-[#343941]">
          <Link
            to="/profile"
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-frigus-navy hover:bg-gray-50 dark:border-[#343941] dark:text-white dark:hover:bg-[#252A32]"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving || uploadingPhoto || !personalData.name.trim()}
            className="rounded-xl bg-frigus-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
