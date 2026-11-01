import { Navigate, useNavigate } from "react-router-dom";
import { Home, Store, Building2, Check, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import FrigusLogo from "@/assets/frigus-logo-text.svg";
import { useState } from "react";
import type { AccountType } from "@/types/auth.type";
import { chooseOnboardingAccountType } from "@/services/auth.service";
import { useStore } from "@/store/store";
import { getAccountHome, getPlansPath } from "@/utils/plan.util";

export default function ChooseProfilePage() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const saveUser = useStore((state) => state.login);
  const [saving, setSaving] = useState<AccountType | null>(null);
  const [error, setError] = useState("");

  if (user && !user.planSelectionRequired) {
    return <Navigate to={getAccountHome(user.accountType)} replace />;
  }

  const handleChooseProfile = async (accountType: AccountType) => {
    setSaving(accountType);
    setError("");
    try {
      const updatedUser = await chooseOnboardingAccountType(accountType);
      saveUser(updatedUser);
      navigate(getPlansPath(accountType), { replace: true });
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível salvar seu perfil. Tente novamente.",
      );
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#0F172A] flex flex-col justify-between p-6 sm:p-10 transition-colors">
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#E1E7F0] dark:border-[#343941]">
        <div className="flex items-center gap-2">
          <img src={FrigusLogo} alt="Frigus Logo" className="h-9 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-frigus-primary dark:text-[#A7BCFF] bg-blue-50 dark:bg-[#1B2A4A] px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/40">
            Etapa 1 de 2
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-6xl w-full mx-auto my-auto py-8"
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-frigus-navy dark:text-white font-display leading-tight">
            Escolha o seu perfil
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
            Selecione o perfil que combina com o seu jeito de usar o Frigus
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          <div className="relative bg-white dark:bg-[#1C1E22] rounded-2xl border border-[#C9DEF9] dark:border-[#343941] p-7 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-200 group">
            <div className="absolute top-0 left-6 right-6 h-1.5 bg-[#32A77B] rounded-b-md" />
            <div>
              <div className="size-14 rounded-2xl bg-[#E6F5EF] dark:bg-[#143224] flex items-center justify-center text-[#32A77B] mb-5">
                <Home className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-frigus-navy dark:text-white">
                Doméstico
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Para cuidar da rotina e dos alimentos da sua casa.
              </p>

              <div className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F5EE] dark:bg-[#1A382A] text-[#2F9B6C] dark:text-[#34D399]">
                Para casa e família
              </div>

              <ul className="mt-6 space-y-3 text-sm text-[#1B2C62] dark:text-gray-300">
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-[#32A77B] shrink-0 mt-0.5" />
                  <span>Estoque e validade em um só lugar</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-[#32A77B] shrink-0 mt-0.5" />
                  <span>Receitas com o que você já tem</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-[#32A77B] shrink-0 mt-0.5" />
                  <span>Rotina compartilhada com a família</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 space-y-2.5">
              <button
                type="button"
                onClick={() => void handleChooseProfile("DOMESTIC")}
                disabled={saving !== null}
                className="w-full h-11 bg-frigus-primary hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:cursor-wait disabled:opacity-60"
              >
                <span>{saving === "DOMESTIC" ? "Salvando perfil…" : "Continuar com perfil doméstico"}</span>
                {saving !== "DOMESTIC" && <ArrowRight className="size-4" />}
              </button>
            </div>
          </div>

          <div className="relative bg-white dark:bg-[#1C1E22] rounded-2xl border border-[#C9DEF9] dark:border-[#343941] p-7 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-200 group">
            <div className="absolute top-0 left-6 right-6 h-1.5 bg-[#E8B84F] rounded-b-md" />
            <div>
              <div className="size-14 rounded-2xl bg-[#FFF6E3] dark:bg-[#3D2F14] flex items-center justify-center text-[#D97706] mb-5">
                <Store className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-frigus-navy dark:text-white">
                Comercial
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Para organizar estoque, compras e equipe do estabelecimento.
              </p>

              <div className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF6E3] dark:bg-[#3D2F14] text-[#D97706] dark:text-[#FBBF24]">
                Para lojas e restaurantes
              </div>

              <ul className="mt-6 space-y-3 text-sm text-[#1B2C62] dark:text-gray-300">
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-[#D97706] shrink-0 mt-0.5" />
                  <span>Produtos e estoques ilimitados</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-[#D97706] shrink-0 mt-0.5" />
                  <span>Controle de compras e desperdícios</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-[#D97706] shrink-0 mt-0.5" />
                  <span>Acesso para toda a equipe</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 space-y-2.5">
              <button
                type="button"
                onClick={() => void handleChooseProfile("COMMERCIAL")}
                disabled={saving !== null}
                className="w-full h-11 bg-frigus-primary hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:cursor-wait disabled:opacity-60"
              >
                <span>{saving === "COMMERCIAL" ? "Salvando perfil…" : "Continuar com perfil comercial"}</span>
                {saving !== "COMMERCIAL" && <ArrowRight className="size-4" />}
              </button>
            </div>
          </div>

          <div className="relative bg-white dark:bg-[#1C1E22] rounded-2xl border border-[#C9DEF9] dark:border-[#343941] p-7 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-200 group">
            <div className="absolute top-0 left-6 right-6 h-1.5 bg-frigus-primary rounded-b-md" />
            <div>
              <div className="size-14 rounded-2xl bg-[#EAF1FF] dark:bg-[#16274B] flex items-center justify-center text-frigus-primary dark:text-[#A7BCFF] mb-5">
                <Building2 className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-frigus-navy dark:text-white">
                Empresarial
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Para divulgar produtos e acompanhar o interesse do público.
              </p>

              <div className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF1FF] dark:bg-[#1B2A4A] text-frigus-primary dark:text-[#A7BCFF]">
                Para marcas e fornecedores
              </div>

              <ul className="mt-6 space-y-3 text-sm text-[#1B2C62] dark:text-gray-300">
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-primary shrink-0 mt-0.5" />
                  <span>Campanhas e promoções por produto</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-primary shrink-0 mt-0.5" />
                  <span>Relatórios com dados anonimizados</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-primary shrink-0 mt-0.5" />
                  <span>Alcance e tendências em um painel</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 space-y-2.5">
              <button
                type="button"
                onClick={() => void handleChooseProfile("BUSINESS")}
                disabled={saving !== null}
                className="w-full h-11 bg-frigus-primary hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:cursor-wait disabled:opacity-60"
              >
                <span>{saving === "BUSINESS" ? "Salvando perfil…" : "Continuar com perfil empresarial"}</span>
                {saving !== "BUSINESS" && <ArrowRight className="size-4" />}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-400 dark:text-gray-500 pt-6">
        © 2026 Frigus. Todos os direitos reservados.
      </footer>
    </div>
  );
}
