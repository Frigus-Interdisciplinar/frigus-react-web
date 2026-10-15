import { useRef, useState, type ChangeEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useStore } from "@/store/store";
import { profileService } from "@/services/profile.service";
import { uploadProfilePicture } from "@/services/profile-picture.service";

export default function SettingsPage() {
  const user = useStore((state) => state.user);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) return <Navigate to="/login" replace />;
  const currentUser = user;

  const initials = currentUser.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("") || "?";
  const accountTypeLabel = { DOMESTIC: "doméstica", COMMERCIAL: "comercial", BUSINESS: "empresarial" }[currentUser.accountType];

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    setMessage("");
    setError("");
    try {
      const profilePictureUrl = await uploadProfilePicture(file);
      const updatedUser = await profileService.patch({ profilePictureUrl });
      useStore.setState((state) => ({ user: { ...state.user!, ...updatedUser } }));
      setMessage("Foto de perfil atualizada.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Não foi possível atualizar a foto.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F8FC] px-5 py-10 text-frigus-navy">
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm sm:p-10">
        <Link to="/login" className="text-sm font-semibold text-frigus-primary underline">Voltar</Link>
        <h1 className="mt-6 text-2xl font-bold">Perfil da conta</h1>
        <p className="mt-2 text-sm text-slate-500">A foto também identifica sua conta {accountTypeLabel}.</p>

        <div className="mt-8 flex items-center gap-5">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E7F0FF] text-2xl font-bold text-frigus-navy">
            {currentUser.profilePictureUrl ? <img src={currentUser.profilePictureUrl} alt="Foto atual do perfil" className="h-full w-full object-cover" /> : initials}
          </div>
          <div>
            <p className="font-semibold">{currentUser.name}</p>
            <p className="mt-1 text-sm text-slate-500">{currentUser.email}</p>
          </div>
        </div>

        <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="sr-only" onChange={handleFileChange} />
        <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="mt-7 rounded-lg bg-frigus-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? "Enviando foto..." : "Escolher foto"}
        </button>
        <p className="mt-3 text-xs text-slate-500">PNG ou JPEG, até 250 KB.</p>
        {message && <p className="mt-4 text-sm text-green-700" role="status">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}
      </section>
    </main>
  );
}
