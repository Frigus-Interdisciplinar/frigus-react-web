import { Check, Sparkles } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import Badge from "@/components/Common/Badge";

type Plan = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period?: string;
  badge?: string;
  features: string[];
  ctaLabel: string;
  isCurrent?: boolean;
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Para começar com o essencial.",
    price: "R$ 0,00",
    features: [
      "Até 40 produtos cadastrados",
      "1 geladeira ou despensa",
      "2 membros adicionais",
      "Sem custo mensal",
    ],
    ctaLabel: "Plano atual",
    isCurrent: true,
  },
  {
    id: "plus",
    name: "Plus",
    tagline: "Mais recursos para a sua rotina.",
    price: "R$ 29,90",
    period: "por mês",
    badge: "MAIS ESCOLHIDO",
    features: [
      "Produtos ilimitados",
      "Até 3 geladeiras ou espaços",
      "5 membros adicionais",
      "Produtos próprios, receitas e Money Saving",
    ],
    ctaLabel: "Escolher Plus",
    highlight: true,
  },
  {
    id: "family",
    name: "Plano Família",
    tagline: "Mais espaço para toda a família.",
    price: "R$ 49,90",
    period: "por mês",
    features: [
      "Produtos ilimitados",
      "Até 3 geladeiras ou espaços",
      "8 membros adicionais",
      "Produtos próprios, receitas e Money Saving",
    ],
    ctaLabel: "Escolher Família",
  },
];

export default function PlansPage() {
  return (
    <AppLayout activeSection="plans">
      <div className="space-y-8 max-w-5xl mx-auto py-2">
        {/* Cabeçalho */}
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <Badge variant="primary" className="mb-2">
            Usuário Doméstico
          </Badge>
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-frigus-navy">
            Escolha seu plano
          </h1>
          <p className="text-gray-500 text-sm font-sans">
            Três opções simples para a rotina da sua casa
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                plan.highlight
                  ? "bg-white border-2 border-frigus-primary shadow-lg ring-4 ring-blue-50"
                  : "bg-white border border-gray-200/80 shadow-xs hover:border-gray-300"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-frigus-accent text-frigus-navy shadow-sm uppercase flex items-center gap-1">
                    <Sparkles size={12} />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-montserrat font-bold text-xl text-frigus-navy">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 min-h-[32px]">
                    {plan.tagline}
                  </p>
                </div>

                <div className="py-2">
                  <span className="font-montserrat font-bold text-3xl sm:text-4xl text-frigus-navy">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-xs text-gray-400 ml-1.5 font-medium">
                      {plan.period}
                    </span>
                  )}
                </div>

                <div className="h-px bg-gray-100" />

                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Incluso no plano:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
                      <div className="w-4 h-4 rounded-full bg-blue-50 text-frigus-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  disabled={plan.isCurrent}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-center transition-all shadow-xs ${
                    plan.isCurrent
                      ? "bg-gray-100 text-gray-400 cursor-default"
                      : plan.highlight
                      ? "bg-frigus-primary hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                      : "bg-frigus-navy hover:bg-slate-900 text-white"
                  }`}
                >
                  {plan.ctaLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
