import { useEffect, useRef, useState } from "react";
import { User, Lock, AlertOctagon, Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "react-router-dom";

import type { UserPreferences } from "@/types/notification.type";
import { useServiceOperations } from "@/hooks/useServiceOperations";

export default function SettingsPage() {
  const apiOperations = useServiceOperations();
  const [preferences, setPreferences] = useState<UserPreferences>({
    expirationAlertsEnabled: true,
    lowStockAlertsEnabled: true,
    shoppingRemindersEnabled: true,
    weeklySummaryEnabled: false,
    theme: "SYSTEM",
  });
  const { theme, setTheme } = useTheme();
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const saveController = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void apiOperations.preferences.getUserPreferences(controller.signal)
      .then((saved) => {
        if (!controller.signal.aborted) setPreferences(saved);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error
              ? reason.message
              : "Não foi possível carregar as preferências.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      controller.abort();
      saveController.current?.abort();
      clearTimeout(feedbackTimer.current);
    };
  }, [apiOperations.preferences]);

  const handleSave = async () => {
    if (loading || saveController.current) return;
    const controller = new AbortController();
    saveController.current = controller;
    clearTimeout(feedbackTimer.current);
    setSavedFeedback(false);
    setSaving(true);
    setError("");
    try {
      await apiOperations.preferences.updateUserPreferences(
        { ...preferences, theme: theme === "dark" ? "DARK" : "LIGHT" },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setSavedFeedback(true);
      feedbackTimer.current = setTimeout(() => setSavedFeedback(false), 2000);
    } catch (reason) {
      if (!controller.signal.aborted)
        setError(
          reason instanceof Error
            ? reason.message
            : "Não foi possível salvar as preferências.",
        );
    } finally {
      if (!controller.signal.aborted) setSaving(false);
      if (saveController.current === controller) saveController.current = null;
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
              Configurações
            </h1>
            <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1 font-sans">
              Personalize sua conta e deixe a experiência do seu jeito
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
          >
            {savedFeedback ? <Check size={16} /> : null}
            <span>
              {saving
                ? "Salvando…"
                : savedFeedback
                  ? "Salvo com sucesso!"
                  : "Salvar alterações"}
            </span>
          </button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        {loading && <p role="status">Carregando preferências…</p>}

        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 md:p-8 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-6">
          <div>
            <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
              Conta
            </h3>
            <p className="text-xs text-gray-400 dark:text-neutral-400 mt-0.5">
              Dados pessoais e segurança de acesso.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-frigus-primary dark:text-blue-400 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-frigus-navy dark:text-white">
                    Dados pessoais
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-neutral-400">
                    Nome, e-mail e telefone
                  </p>
                </div>
              </div>
              <Link to="/profile/edit" className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-[#343941] bg-white dark:bg-[#1C1E22] text-xs font-bold text-frigus-navy dark:text-white hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors shadow-2xs cursor-pointer">
                Editar
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-frigus-primary dark:text-blue-400 flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-frigus-navy dark:text-white">
                    Segurança e acesso
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-neutral-400">
                    Senha alterada há 3 meses • Gerencie sua senha
                  </p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-[#343941] bg-white dark:bg-[#1C1E22] text-xs font-bold text-frigus-navy dark:text-white hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors shadow-2xs cursor-pointer">
                Alterar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 md:p-8 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-6">
          <div>
            <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
              Notificações
            </h3>
            <p className="text-xs text-gray-400 dark:text-neutral-400 mt-0.5">
              Escolha quais avisos deseja receber.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Lembretes de validade",
                desc: "Antes dos produtos vencerem no estoque",
                checked: preferences.expirationAlertsEnabled,
                onChange: () =>
                  setPreferences((current) => ({
                    ...current,
                    expirationAlertsEnabled: !current.expirationAlertsEnabled,
                  })),
              },
              {
                title: "Lista de compras",
                desc: "Quando a lista for alterada por membros da família",
                checked: preferences.shoppingRemindersEnabled,
                onChange: () =>
                  setPreferences((current) => ({
                    ...current,
                    shoppingRemindersEnabled: !current.shoppingRemindersEnabled,
                  })),
              },
              {
                title: "Resumo semanal",
                desc: "Um resumo do consumo e desperdício evitado na sua casa",
                checked: preferences.weeklySummaryEnabled,
                onChange: () =>
                  setPreferences((current) => ({
                    ...current,
                    weeklySummaryEnabled: !current.weeklySummaryEnabled,
                  })),
              },
            ].map((pref) => (
              <div
                key={pref.title}
                className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941] flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-bold text-frigus-navy dark:text-white">
                    {pref.title}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-neutral-400">
                    {pref.desc}
                  </p>
                </div>
                <label
                  htmlFor={`preference-${pref.title}`}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    id={`preference-${pref.title}`}
                    type="checkbox"
                    aria-label={pref.title}
                    disabled={loading || saving}
                    checked={pref.checked}
                    onChange={pref.onChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-frigus-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 md:p-8 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-6">
          <div>
            <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
              Aparência
            </h3>
            <p className="text-xs text-gray-400 dark:text-neutral-400 mt-0.5">
              Tema do aplicativo e preferência visual.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "light" as const, label: "Claro" },
              { id: "dark" as const, label: "Escuro" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                  theme === opt.id
                    ? "border-frigus-primary dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-frigus-primary dark:text-blue-400 shadow-xs"
                    : "border-gray-200 dark:border-[#343941] bg-gray-50/50 dark:bg-[#252A32] text-gray-600 dark:text-neutral-300 hover:bg-gray-100/60 dark:hover:bg-[#2e343e]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 md:p-8 border border-red-100 dark:border-red-900/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertOctagon size={18} />
            <h3 className="font-montserrat font-bold text-base">
              Excluir conta
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Remove permanentemente seus dados, receitas salvas e o acesso
            familiar à plataforma Frigus.
          </p>
          <button className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 text-xs font-bold transition-colors border border-red-200 dark:border-red-900/60 cursor-pointer">
            Excluir minha conta
          </button>
        </div>
      </div>
    </>
  );
}
