import { Link, useNavigate } from "react-router-dom";
import { Check, ArrowLeft, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import FrigusLogo from "@/assets/frigus-logo-text.svg";

export default function PlansDomesticPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#0F172A] flex flex-col justify-between p-6 sm:p-10 transition-colors">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#E1E7F0] dark:border-[#343941]">
        <div className="flex items-center gap-4">
          <Link
            to="/choose-profile"
            className="p-2 rounded-xl text-gray-500 hover:text-frigus-primary hover:bg-white dark:hover:bg-[#1C1E22] transition-colors"
            aria-label="Voltar para escolha de perfil"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <img src={FrigusLogo} alt="Frigus Logo" className="h-9 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-frigus-primary dark:text-[#A7BCFF] bg-blue-50 dark:bg-[#1B2A4A] px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/40">
            Etapa 2 de 2
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto my-auto py-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-frigus-navy dark:text-white font-display leading-tight">
            Escolha o plano para sua casa
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
            Três opções simples para organizar sua rotina no seu ritmo
          </p>
        </div>

        {/* 3 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Plan 1: Free */}
          <div className="relative bg-white dark:bg-[#1C1E22] rounded-2xl border border-[#C9DEF9] dark:border-[#343941] p-7 flex flex-col justify-between shadow-sm">
            <div className="absolute top-0 left-6 right-6 h-1 bg-[#32A77B] rounded-b-md" />
            <div>
              <h3 className="text-2xl font-bold text-frigus-navy dark:text-white">Free</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Para começar com o essencial.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-frigus-navy dark:text-white">R$ 0,00</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/mês</span>
              </div>

              <div className="h-px bg-[#E1E7F0] dark:bg-[#343941] my-6" />

              <ul className="space-y-3.5 text-sm text-[#1B2C62] dark:text-gray-300">
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-[#32A77B] shrink-0 mt-0.5" />
                  <span>1 estoque residencial</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-[#32A77B] shrink-0 mt-0.5" />
                  <span>Até 30 alimentos cadastrados</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-[#32A77B] shrink-0 mt-0.5" />
                  <span>Alertas básicos de validade</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-[#32A77B] shrink-0 mt-0.5" />
                  <span>Acesso individual</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => navigate("/home")}
              className="mt-8 w-full h-11 border border-frigus-primary text-frigus-primary dark:text-[#A7BCFF] dark:border-[#A7BCFF] hover:bg-blue-50 dark:hover:bg-blue-950/30 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              Começar grátis
            </button>
          </div>

          {/* Plan 2: Familiar */}
          <div className="relative bg-white dark:bg-[#1C1E22] rounded-2xl border border-[#C9DEF9] dark:border-[#343941] p-7 flex flex-col justify-between shadow-sm">
            <div className="absolute top-0 left-6 right-6 h-1 bg-frigus-primary rounded-b-md" />
            <div>
              <h3 className="text-2xl font-bold text-frigus-navy dark:text-white">Familiar</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Para rotinas compartilhadas na casa.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-frigus-navy dark:text-white">R$ 14,90</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/mês</span>
              </div>

              <div className="h-px bg-[#E1E7F0] dark:bg-[#343941] my-6" />

              <ul className="space-y-3.5 text-sm text-[#1B2C62] dark:text-gray-300">
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-primary shrink-0 mt-0.5" />
                  <span>Até 3 estoques (geladeira, despensa, etc.)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-primary shrink-0 mt-0.5" />
                  <span>Até 150 alimentos cadastrados</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-primary shrink-0 mt-0.5" />
                  <span>Compartilhe com até 5 membros</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-primary shrink-0 mt-0.5" />
                  <span>Sugestão de receitas com IA</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout?plan=family")}
              className="mt-8 w-full h-11 bg-frigus-primary hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-sm"
            >
              Assinar Familiar
            </button>
          </div>

          {/* Plan 3: Familiar Plus (Highlight) */}
          <div className="relative bg-[#131C55] dark:bg-[#161F38] text-white rounded-2xl border-2 border-frigus-primary p-7 flex flex-col justify-between shadow-xl">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-frigus-accent text-frigus-navy font-bold text-xs px-3.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Sparkles className="size-3.5" />
              <span>Mais popular</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mt-1">Familiar Plus</h3>
              <p className="text-sm text-[#C9DEF9] mt-1">
                Controle total, membros ilimitados e receitas.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">R$ 19,90</span>
                <span className="text-sm text-[#C9DEF9]">/mês</span>
              </div>

              <div className="h-px bg-white/20 my-6" />

              <ul className="space-y-3.5 text-sm text-gray-200">
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-accent shrink-0 mt-0.5" />
                  <span>Estoques e alimentos ilimitados</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-accent shrink-0 mt-0.5" />
                  <span>Membros da família ilimitados</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-accent shrink-0 mt-0.5" />
                  <span>Chat integrado e lista colaborativa</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-accent shrink-0 mt-0.5" />
                  <span>Receitas personalizadas sem limite</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout?plan=family-plus")}
              className="mt-8 w-full h-11 bg-frigus-accent hover:bg-[#eab950] text-frigus-navy font-bold rounded-xl text-sm transition-all cursor-pointer shadow-md"
            >
              Assinar Familiar Plus
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 dark:text-gray-500 pt-6">
        © 2026 Frigus. Todos os direitos reservados.
      </footer>
    </div>
  );
}
