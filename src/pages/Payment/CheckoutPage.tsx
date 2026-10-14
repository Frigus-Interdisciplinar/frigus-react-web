import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  QrCode,
  FileText,
  Check,
  ArrowLeft,
  Lock,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Checkbox from "@/components/Checkbox";
import FrigusLogo from "@/assets/frigus-logo-text.svg";
import { api } from "@/utils/api.util";

interface PlanDetails {
  id: string;
  name: string;
  category: string;
  price: string;
  priceNumber: number;
  planCode?: string;
  period: string;
  description: string;
  benefits: string[];
}

const PLANS: Record<string, PlanDetails> = {
  family: {
    id: "family",
    name: "Familiar",
    planCode: "FAMILY",
    category: "Doméstico",
    price: "R$ 49,99",
    priceNumber: 49.99,
    period: "por mês",
    description: "Até 3 estoques, 150 alimentos cadastrados e até 5 membros da família.",
    benefits: [
      "Até 3 estoques residenciais",
      "Até 150 alimentos cadastrados",
      "Até 5 membros da família",
      "Receitas com IA integradas",
    ],
  },
  "family-plus": {
    id: "family-plus",
    name: "Familiar Plus",
    planCode: "PLUS",
    category: "Doméstico",
    price: "R$ 29,99",
    priceNumber: 29.99,
    period: "por mês",
    description: "Produtos ilimitados, receitas avançadas e membros adicionais sem limite.",
    benefits: [
      "Estoques e produtos ilimitados",
      "Membros da família ilimitados",
      "Chat interno e lista colaborativa",
      "Receitas personalizadas sem limite",
    ],
  },
  commercial: {
    id: "commercial",
    name: "Plano Comercial",
    planCode: "COMMERCIAL",
    category: "Comercial",
    price: "R$ 119,99",
    priceNumber: 119.99,
    period: "por mês",
    description: "Estoque, compras, controle de lotes e equipe sem limites.",
    benefits: [
      "Produtos armazenados sem limite",
      "Geladeiras, freezers e estoques ilimitados",
      "Equipe ilimitada com níveis de acesso",
      "Controle de validade e desperdícios",
    ],
  },
  "enterprise-ad": {
    id: "enterprise-ad",
    name: "Pacote de Anúncios",
    category: "Empresarial",
    price: "R$ 50,00",
    priceNumber: 50.0,
    period: "100 anúncios",
    description: "Divulgue seus produtos para um público qualificado em receitas e buscas.",
    benefits: [
      "100 anúncios ativos na plataforma",
      "Destaque em buscas de ingredientes",
      "Métricas de cliques e impressões",
      "Público segmentado por hábitos de consumo",
    ],
  },
  "enterprise-report": {
    id: "enterprise-report",
    name: "Relatório de Tendências",
    category: "Empresarial",
    price: "R$ 250,00",
    priceNumber: 250.0,
    period: "por mês",
    description: "Acesso mensal a dados anonimizados e relatórios estratégicos de consumo.",
    benefits: [
      "Hábitos e preferências alimentares",
      "Tendências de consumo regional",
      "Apoio para estoque e lançamentos",
      "Exportação completa em CSV e PDF",
    ],
  },
};

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const planKey = searchParams.get("plan") || "family-plus";
  const plan = PLANS[planKey] || PLANS["family-plus"];

  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "boleto">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setCheckoutError("");
    if (!acceptTerms) { setCheckoutError("Aceite os termos para continuar."); return; }
    if (!plan.planCode) { setCheckoutError("Este pacote empresarial ainda não está disponível para compra no sistema."); return; }
    if (paymentMethod === "card" && cardNumber.replace(/\D/g, "").length !== 4) { setCheckoutError("Informe os quatro dígitos de demonstração."); return; }
    setLoading(true);
    try {
      const transaction = await api.post<{ id: string; status: string }>("/web/core/transactions/checkout", {
        planCode: plan.planCode,
        paymentMethod: paymentMethod === "card" ? "CREDIT_CARD" : paymentMethod === "pix" ? "PIX" : "BOLETO",
        ...(paymentMethod === "card" ? { fakeCardLast4: cardNumber.replace(/\D/g, "").slice(-4) } : {}),
        ...(paymentMethod === "pix" ? { fakePixKey: `frigus-${crypto.randomUUID()}` } : {}),
      });
      navigate(`/checkout/webview/success?transactionId=${encodeURIComponent(transaction.id)}&plan=${encodeURIComponent(plan.id)}&name=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(finalPrice)}`);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Não foi possível iniciar a transação. Tente novamente.");
    } finally { setLoading(false); }
  };

  const finalPrice = plan.priceNumber.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#0F172A] flex flex-col justify-between p-6 sm:p-10 transition-colors">
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#E1E7F0] dark:border-[#343941]">
        <div className="flex items-center gap-4">
          <Link
            to="/choose-profile"
            className="p-2 rounded-xl text-gray-500 hover:text-frigus-primary hover:bg-white dark:hover:bg-[#1C1E22] transition-colors"
            aria-label="Voltar aos planos"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <img src={FrigusLogo} alt="Frigus Logo" className="h-9 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
            <Lock className="size-3.5" />
            <span>Ambiente Seguro SSL</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto my-auto py-8">
        <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          Ambiente de demonstração: a API registra e simula a transação, sem cobrar cartão, emitir PIX ou boleto real.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Payment Details (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1C1E22] rounded-2xl border border-[#C9DEF9] dark:border-[#343941] p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-frigus-navy dark:text-white font-display">
              Forma de pagamento
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Escolha como deseja realizar o pagamento da sua assinatura.
            </p>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-3 my-6">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-frigus-primary bg-blue-50/60 dark:bg-blue-950/40 text-frigus-primary dark:text-[#A7BCFF] ring-2 ring-frigus-primary/20"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <CreditCard className="size-5" />
                <span>Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "pix"
                    ? "border-frigus-primary bg-blue-50/60 dark:bg-blue-950/40 text-frigus-primary dark:text-[#A7BCFF] ring-2 ring-frigus-primary/20"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <QrCode className="size-5" />
                <span>Pix Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("boleto")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "boleto"
                    ? "border-frigus-primary bg-blue-50/60 dark:bg-blue-950/40 text-frigus-primary dark:text-[#A7BCFF] ring-2 ring-frigus-primary/20"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <FileText className="size-5" />
                <span>Boleto Bancário</span>
              </button>
            </div>

            <div className="mb-5">
              <Checkbox
                id="terms-checkout"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                label={<span className="text-xs text-gray-500 dark:text-gray-400">Li e concordo com os Termos de Serviço e com a renovação automática.</span>}
              />
            </div>

            {/* Credit Card Form */}
            {paymentMethod === "card" && (
              <form onSubmit={(e) => { e.preventDefault(); void handleCheckout(); }} className="space-y-4">
                <Input
                  id="card-last-four"
                  label="Quatro dígitos de demonstração"
                  placeholder="4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  required
                />

                <Button
                  type="submit"
                  disabled={loading || !acceptTerms || cardNumber.length !== 4}
                  className="w-full h-12 text-base font-bold shadow-md shadow-frigus-primary/20 mt-4"
                >
                  {loading ? "Processando pagamento..." : `Pagar ${finalPrice}`}
                </Button>
              </form>
            )}

            {/* Pix Option */}
            {paymentMethod === "pix" && (
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 text-center space-y-4">
                <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <QrCode className="size-8" />
                </div>
                <h4 className="font-bold text-base text-frigus-navy dark:text-white">
                  Simulação de pagamento via Pix
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  O sistema vai registrar uma transação de demonstração. Nenhum QR Code será emitido.
                </p>
                <Button
                  type="button"
                  disabled={loading || !acceptTerms}
                  onClick={() => void handleCheckout()}
                  className="w-full h-12 text-base font-bold shadow-md"
                >
                  Simular transação Pix · {finalPrice}
                </Button>
              </div>
            )}

            {/* Boleto Option */}
            {paymentMethod === "boleto" && (
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 text-center space-y-4">
                <div className="size-16 rounded-full bg-blue-100 dark:bg-blue-900/40 text-frigus-primary dark:text-[#A7BCFF] mx-auto flex items-center justify-center">
                  <FileText className="size-8" />
                </div>
                <h4 className="font-bold text-base text-frigus-navy dark:text-white">
                  Simulação de boleto
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  O sistema vai registrar uma transação de demonstração. Nenhum boleto será emitido.
                </p>
                <Button
                  type="button"
                  disabled={loading || !acceptTerms}
                  onClick={() => void handleCheckout()}
                  className="w-full h-12 text-base font-bold shadow-md"
                >
                  Simular boleto · {finalPrice}
                </Button>
              </div>
            )}
            {checkoutError && <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-300">{checkoutError}</p>}
          </div>

          {/* Right Summary: Plan & Benefits (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#1C1E22] rounded-2xl border border-[#C9DEF9] dark:border-[#343941] p-6 sm:p-8 shadow-sm">
              <span className="text-xs font-semibold text-frigus-primary dark:text-[#A7BCFF] uppercase tracking-wider">
                Resumo do pedido
              </span>

              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-frigus-navy dark:text-white">
                    {plan.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Módulo {plan.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-frigus-navy dark:text-white">
                    {plan.price}
                  </span>
                  <p className="text-xs text-gray-400">{plan.period}</p>
                </div>
              </div>

              <div className="h-px bg-[#E1E7F0] dark:bg-[#343941] my-5" />

              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Benefícios ativos
              </span>
              <ul className="mt-3 space-y-2.5 text-xs text-[#1B2C62] dark:text-gray-300">
                {plan.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="mt-6 pt-5 border-t border-[#E1E7F0] dark:border-[#343941] space-y-2 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{plan.price}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-frigus-navy dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span>Total a pagar</span>
                  <span className="text-frigus-primary dark:text-[#A7BCFF]">{finalPrice}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-xs text-gray-600 dark:text-gray-300">
              Esta tela usa o processador de demonstração da API. Não insira dados reais de pagamento.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 dark:text-gray-500 pt-6">
        © 2026 Frigus · Ambiente de demonstração
      </footer>
    </div>
  );
}
