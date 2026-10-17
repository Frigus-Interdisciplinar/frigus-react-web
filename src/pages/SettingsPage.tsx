import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import { useStore } from "@/store/store";
import { profileService } from "@/services/profile.service";
import { uploadProfilePicture } from "@/services/profile-picture.service";
import { notificationService } from "@/services/notification.service";
import type { z } from "zod";
import { userPreferencesSchema, notificationSchema } from "@/schemas/api.schema";

type Preferences = z.output<typeof userPreferencesSchema>;

export default function SettingsPage() {
  const user = useStore((state) => state.user);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState(user?.name ?? "");
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? "");
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [notifications, setNotifications] = useState<z.output<typeof notificationSchema>[]>([]);
  const [password, setPassword] = useState({ oldPassword: "", newPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    Promise.all([notificationService.preferences(), notificationService.list({ page: 0, size: 20 }, true)])
      .then(([value, page]) => { setPreferences(value); setNotifications(page.content); })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar as configurações."));
  }, []);

  if (!user) return <Navigate to="/login" replace />;
  const currentUser = user;

  const initials = currentUser.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("") || "?";
  const accountTypeLabel = { DOMESTIC: "doméstica", COMMERCIAL: "comercial", BUSINESS: "empresarial" }[currentUser.accountType];

  async function saveProfile(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { const updated = await profileService.update({ name, birthDate }); useStore.setState((state) => ({ user: { ...state.user!, ...updated } })); setMessage("Perfil atualizado."); }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Não foi possível salvar o perfil."); }
    finally { setBusy(false); }
  }

  async function savePreferences(next: Preferences) {
    setPreferences(next); setError("");
    try { setPreferences(await notificationService.updatePreferences(next)); }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Não foi possível salvar as preferências."); }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setPasswordMessage("");
    try { await profileService.changePassword(password); setPassword({ oldPassword: "", newPassword: "" }); setPasswordMessage("Senha alterada. Suas outras sessões foram revogadas."); }
    catch (changeError) { setError(changeError instanceof Error ? changeError.message : "Não foi possível alterar a senha."); }
    finally { setBusy(false); }
  }

  async function markAllRead() {
    try { await notificationService.markAllRead(); setNotifications([]); }
    catch (readError) { setError(readError instanceof Error ? readError.message : "Não foi possível marcar as notificações como lidas."); }
  }

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
    <WorkspaceLayout activeSection="settings" title="Configurações" subtitle="Perfil, segurança e preferências da conta.">
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold">Perfil da conta</h2>
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
        <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="mt-5 rounded-lg bg-frigus-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? "Enviando foto..." : "Escolher foto"}
        </button>
        <p className="mt-3 text-xs text-slate-500">PNG ou JPEG, até 250 KB.</p>
        <form onSubmit={saveProfile} className="mt-7 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <label className="text-sm font-semibold">Nome<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 font-normal" /></label>
          <label className="text-sm font-semibold">Nascimento (dd/MM/aaaa)<input required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 font-normal" /></label>
          <button disabled={busy} className="rounded-lg border border-frigus-primary px-4 py-2.5 text-sm font-bold text-frigus-primary sm:col-span-2">Salvar perfil</button>
        </form>
        {message && <p className="mt-3 text-sm text-green-700" role="status">{message}</p>}
      </section>
      <div className="mx-auto mt-5 grid max-w-3xl gap-5 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Notificações</h2><p className="mt-1 text-xs text-slate-500">Preferências são salvas na sua conta.</p>
          {preferences && <div className="mt-4 space-y-3">{([ ["expirationAlertsEnabled","Alertas de validade"],["lowStockAlertsEnabled","Estoque baixo"],["shoppingRemindersEnabled","Lembretes de compras"],["weeklySummaryEnabled","Resumo semanal"] ] as const).map(([key,label])=><label key={key} className="flex items-center justify-between gap-3 text-sm"><span>{label}</span><input type="checkbox" checked={preferences[key]} onChange={(e)=>void savePreferences({...preferences,[key]:e.target.checked})} /></label>)}<label className="flex items-center justify-between text-sm"><span>Tema</span><select value={preferences.theme} onChange={(e)=>void savePreferences({...preferences,theme:e.target.value as Preferences["theme"]})} className="rounded border p-1.5"><option value="SYSTEM">Sistema</option><option value="LIGHT">Claro</option><option value="DARK">Escuro</option></select></label></div>}
          <div className="mt-5 flex items-center justify-between"><h3 className="text-sm font-bold">Não lidas ({notifications.length})</h3>{notifications.length>0&&<button onClick={()=>void markAllRead()} className="text-xs font-semibold text-frigus-primary">Marcar todas como lidas</button>}</div><div className="mt-2 max-h-56 space-y-2 overflow-auto">{notifications.map((item)=><div key={item.id} className="rounded-lg bg-slate-50 p-3"><p className="text-sm font-semibold">{item.title}</p><p className="text-xs text-slate-600">{item.body}</p></div>)}{!notifications.length&&<p className="text-xs text-slate-500">Nenhuma notificação não lida.</p>}</div>
        </section>
        <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Segurança</h2><form onSubmit={changePassword} className="mt-4 space-y-3"><label className="block text-sm font-semibold">Senha atual<input required type="password" value={password.oldPassword} onChange={(e)=>setPassword({...password,oldPassword:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 font-normal"/></label><label className="block text-sm font-semibold">Nova senha<input required type="password" value={password.newPassword} onChange={(e)=>setPassword({...password,newPassword:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 font-normal"/></label><p className="text-xs text-slate-500">8–20 caracteres, com maiúscula, minúscula, número e símbolo.</p><button disabled={busy} className="rounded-lg bg-frigus-primary px-4 py-2.5 text-sm font-bold text-white">Alterar senha</button>{passwordMessage&&<p role="status" className="text-sm text-green-700">{passwordMessage}</p>}</form></section>
      </div>
    </WorkspaceLayout>
  );
}
