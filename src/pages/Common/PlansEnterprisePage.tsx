import { Link, useNavigate } from "react-router-dom";
import { Check, ArrowLeft, Megaphone, BarChart3 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import FrigusLogo from "@/assets/frigus-logo-text.svg";

export default function PlansEnterprisePage() {
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
            Soluções para a sua empresa
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
            Divulgue produtos e transforme tendências em decisões melhores
          </p>
        </div>

        {/* 2 Enterprise Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Solution 1: Anúncios */}
          <div className="relative bg-white dark:bg-[#1C1E22] rounded-2xl border border-[#C9DEF9] dark:border-[#343941] p-8 sm:p-10 flex flex-col justify-between shadow-sm">
            <div className="absolute top-0 left-8 right-8 h-1 bg-amber-400 rounded-b-md" />
            <div>
              <div className="size-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <Megaphone className="size-6" />
              </div>
              <h3 className="text-2xl font-bold text-frigus-navy dark:text-white">
                Anúncio e divulgação
              </h3>
              <div className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/70 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                Para ganhar alcance
              </div>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-frigus-navy dark:text-white">R$ 0,50</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">por anúncio</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Defina o período e revise o pagamento antes de publicar.
              </p>

              <div className="h-px bg-[#E1E7F0] dark:bg-[#343941] my-6" />

              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Incluído
              </span>
              <ul className="mt-3 space-y-3 text-sm text-[#1B2C62] dark:text-gray-300">
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Divulgação de produtos e promoções</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Recomendações personalizadas para usuários</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Presença de marca em receitas e campanhas</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout?plan=enterprise-ad")}
              className="mt-8 w-full h-12 bg-frigus-primary hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-sm"
            >
              Escolher anúncios
            </button>
          </div>

          {/* Solution 2: Relatório de Tendências */}
          <div className="relative bg-[#131C55] dark:bg-[#161F38] text-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div className="absolute top-0 left-8 right-8 h-1 bg-frigus-primary rounded-b-md" />
            <div>
              <div className="size-12 rounded-xl bg-blue-500/20 text-[#A7BCFF] flex items-center justify-center mb-5">
                <BarChart3 className="size-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Relatório de tendências
              </h3>
              <div className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-[#C9DEF9]">
                Para decidir com dados
              </div>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">R$ 250,00</span>
                <span className="text-sm text-[#C9DEF9]">/mês</span>
              </div>
              <p className="text-xs text-[#C9DEF9]/80 mt-1">
                Transforme dados anonimizados em decisões estratégicas.
              </p>

              <div className="h-px bg-white/15 my-6" />

              <span className="text-xs font-semibold text-[#C9DEF9]/60 uppercase tracking-wide">
                Incluído
              </span>
              <ul className="mt-3 space-y-3 text-sm text-gray-200">
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-accent shrink-0 mt-0.5" />
                  <span>Hábitos e preferências alimentares agregadas</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-accent shrink-0 mt-0.5" />
                  <span>Tendências de consumo e validade de produtos</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-frigus-accent shrink-0 mt-0.5" />
                  <span>Apoio para estoque, campanhas e novos produtos</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout?plan=enterprise-report")}
              className="mt-8 w-full h-12 bg-white hover:bg-gray-100 text-frigus-navy font-bold rounded-xl text-sm transition-all cursor-pointer shadow-md"
            >
              Escolher relatório mensal
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
