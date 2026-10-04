import { Link, useNavigate } from "react-router-dom";
import { Check, ArrowLeft, Store, ShieldCheck } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import FrigusLogo from "@/assets/frigus-logo-text.svg";

export default function PlansCommercialPage() {
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
            Um plano completo para o seu comércio
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
            Controle estoque, compras e equipe sem limite de crescimento
          </p>
        </div>

        {/* 2-Column Commercial Plan Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Benefits & Features (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1C1E22] rounded-2xl border border-[#C9DEF9] dark:border-[#343941] p-8 sm:p-10 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-frigus-primary dark:text-[#A7BCFF] tracking-wider uppercase">
                <Store className="size-4" />
                <span>Plano Comercial</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-frigus-navy dark:text-white mt-3 leading-snug font-display">
                Estrutura completa para uma operação sem limites
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Tenha uma visão clara do estoque e dê acesso à equipe de uma única rede.
              </p>

              <div className="h-px bg-[#E1E7F0] dark:bg-[#343941] my-6" />

              <span className="text-xs font-semibold text-frigus-navy dark:text-gray-300 uppercase tracking-wide">
                Incluído no plano
              </span>

              <ul className="mt-4 space-y-3.5 text-sm text-[#1B2C62] dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="size-5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-frigus-primary dark:text-[#A7BCFF] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-3.5" />
                  </span>
                  <span>Produtos armazenados sem limite de cadastros</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="size-5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-frigus-primary dark:text-[#A7BCFF] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-3.5" />
                  </span>
                  <span>Geladeiras, freezers e estoques ilimitados</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="size-5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-frigus-primary dark:text-[#A7BCFF] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-3.5" />
                  </span>
                  <span>Equipe ilimitada com níveis de acesso e permissões</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="size-5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-frigus-primary dark:text-[#A7BCFF] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-3.5" />
                  </span>
                  <span>Controle de lotes, datas de validade e alertas de reposição</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-[#FFF9E6] dark:bg-[#382C10] border border-[#F9C968]/40 text-xs font-medium text-[#8F6405] dark:text-[#FDE68A] flex items-center gap-3">
              <ShieldCheck className="size-5 shrink-0 text-[#D97706]" />
              <span>Ideal para mercados, restaurantes, padarias, açougues e redes locais.</span>
            </div>
          </div>

          {/* Right: Checkout / Subscription CTA (5 cols) */}
          <div className="lg:col-span-5 relative bg-[#131C55] dark:bg-[#161F38] text-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div className="absolute top-0 left-8 right-8 h-1 bg-frigus-accent rounded-b-md" />
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EAF1FF]/20 text-[#C9DEF9] mb-4">
                Acesso Completo
              </div>

              <h3 className="text-2xl font-bold text-white">Plano Comercial</h3>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-5xl font-extrabold text-white">R$ 99,90</span>
                <span className="text-sm text-[#C9DEF9]">/mês</span>
              </div>

              <div className="h-px bg-white/15 my-6" />

              <p className="text-sm text-[#C9DEF9] leading-relaxed">
                Uma assinatura para toda a operação da sua rede, sem cobrança por usuário adicional ou por volume de produtos.
              </p>
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={() => navigate("/checkout?plan=commercial")}
                className="w-full h-12 bg-frigus-accent hover:bg-[#eab950] text-frigus-navy font-bold rounded-xl text-base transition-all cursor-pointer shadow-lg shadow-black/20"
              >
                Escolher plano comercial
              </button>
              <p className="text-center text-xs text-[#C9DEF9]/70 mt-3">
                Cancele a qualquer momento sem taxas adicionais
              </p>
            </div>
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
