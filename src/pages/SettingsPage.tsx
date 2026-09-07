import { useState } from "react";
import { User, Lock, AlertOctagon, Check } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";

export default function SettingsPage() {
  const [expiryReminder, setExpiryReminder] = useState(true);
  const [shoppingReminder, setShoppingReminder] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [theme, setTheme] = useState<"light" | "system" | "dark">("light");
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
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
              Configurações
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-sans">
              Personalize sua conta e deixe a experiência do seu jeito
            </p>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-frigus-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs self-start sm:self-auto"
          >
            {savedFeedback ? <Check size={16} /> : null}
            <span>{savedFeedback ? "Salvo com sucesso!" : "Salvar alterações"}</span>
          </button>
        </div>

        {/* Card de Conta */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="font-montserrat font-bold text-frigus-navy text-base">
              Conta
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Dados pessoais e segurança de acesso.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-frigus-primary flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-frigus-navy">Dados pessoais</p>
                  <p className="text-[11px] text-gray-400">Nome, e-mail e telefone</p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-frigus-navy hover:bg-gray-50 transition-colors shadow-2xs">
                Editar
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-frigus-primary flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-frigus-navy">Segurança e acesso</p>
                  <p className="text-[11px] text-gray-400">
                    Senha alterada há 3 meses • Gerencie sua senha
                  </p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-frigus-navy hover:bg-gray-50 transition-colors shadow-2xs">
                Alterar
              </button>
            </div>
          </div>
        </div>

        {/* Card de Notificações */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="font-montserrat font-bold text-frigus-navy text-base">
              Notificações
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
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
                className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-bold text-frigus-navy">{pref.title}</p>
                  <p className="text-[11px] text-gray-400">{pref.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pref.checked}
                    onChange={pref.onChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-frigus-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Card de Aparência */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="font-montserrat font-bold text-frigus-navy text-base">
              Aparência
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Tema do aplicativo e preferência visual.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light" as const, label: "Claro" },
              { id: "system" as const, label: "Sistema" },
              { id: "dark" as const, label: "Escuro" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all ${
                  theme === opt.id
                    ? "border-frigus-primary bg-blue-50 text-frigus-primary shadow-xs"
                    : "border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-100/60"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zona de Perigo */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-red-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertOctagon size={18} />
            <h3 className="font-montserrat font-bold text-base">Excluir conta</h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Remove permanentemente seus dados, receitas salvas e o acesso familiar à plataforma Frigus.
          </p>
          <button className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors border border-red-200">
            Excluir minha conta
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
