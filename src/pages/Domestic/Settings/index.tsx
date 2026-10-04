import { useState } from "react";
import { User, Lock, AlertOctagon, Check } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsPage() {
  const [expiryReminder, setExpiryReminder] = useState(true);
  const [shoppingReminder, setShoppingReminder] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const { theme, setTheme } = useTheme();
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <AppLayout activeSection="settings">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Cabeçalho */}
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
            className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
          >
            {savedFeedback ? <Check size={16} /> : null}
            <span>{savedFeedback ? "Salvo com sucesso!" : "Salvar alterações"}</span>
          </button>
        </div>

        {/* Card de Conta */}
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
                  <p className="text-xs font-bold text-frigus-navy dark:text-white">Dados pessoais</p>
                  <p className="text-[11px] text-gray-400 dark:text-neutral-400">Nome, e-mail e telefone</p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-[#343941] bg-white dark:bg-[#1C1E22] text-xs font-bold text-frigus-navy dark:text-white hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors shadow-2xs cursor-pointer">
                Editar
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-frigus-primary dark:text-blue-400 flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-frigus-navy dark:text-white">Segurança e acesso</p>
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

        {/* Card de Notificações */}
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
                checked: expiryReminder,
                onChange: () => setExpiryReminder(!expiryReminder),
              },
              {
                title: "Lista de compras",
                desc: "Quando a lista for alterada por membros da família",
                checked: shoppingReminder,
                onChange: () => setShoppingReminder(!shoppingReminder),
              },
              {
                title: "Resumo semanal",
                desc: "Um resumo do consumo e desperdício evitado na sua casa",
                checked: weeklySummary,
                onChange: () => setWeeklySummary(!weeklySummary),
              },
            ].map((pref, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941] flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-bold text-frigus-navy dark:text-white">{pref.title}</p>
                  <p className="text-[11px] text-gray-400 dark:text-neutral-400">{pref.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
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

        {/* Card de Aparência */}
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

        {/* Zona de Perigo */}
        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 md:p-8 border border-red-100 dark:border-red-900/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertOctagon size={18} />
            <h3 className="font-montserrat font-bold text-base">Excluir conta</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Remove permanentemente seus dados, receitas salvas e o acesso familiar à plataforma Frigus.
          </p>
          <button className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 text-xs font-bold transition-colors border border-red-200 dark:border-red-900/60 cursor-pointer">
            Excluir minha conta
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
