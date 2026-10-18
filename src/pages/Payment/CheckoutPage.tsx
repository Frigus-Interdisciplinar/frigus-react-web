import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  QrCode,
  FileText,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Checkbox from "@/components/Checkbox";
import AuthLayout from "@/components/AuthLayout";
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
    <AuthLayout
      title={<>Sua escolha,<br />do seu jeito</>}
      description="Confira o plano e os dados antes de confirmar a assinatura."
      cardTitle={`${plan.name} · ${plan.price}/${plan.period.replace("por ", "")}`}
      cardDescription={plan.description}
    >
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6"><ThemeToggle /></div>
      <main className="w-full max-w-[576px] py-12">
        <div className="rounded-xl border border-[#C9DEF9] bg-white p-6 shadow-sm dark:border-[#34383E] dark:bg-[#1B1D20] sm:p-9">
          <p className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            Ambiente de demonstração: nenhuma cobrança é feita e nenhum dado real de cartão é solicitado.
          </p>
            <h1 className="text-2xl font-bold text-frigus-navy dark:text-white font-display">
              Finalizar pagamento
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
              Selecione uma forma de pagamento para registrar sua assinatura.
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

            <div className="mb-5 mt-4">
              <Checkbox
                id="terms-checkout"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                label={<span className="text-xs text-gray-500 dark:text-gray-400">Li e aceito os <Link to="/terms" className="text-frigus-primary underline underline-offset-2 dark:text-[#A7BCFF]">Termos de uso e a Política de privacidade</Link>.</span>}
              />
            </div>

            {/* Credit Card Form */}
            {paymentMethod === "card" && (
              <form onSubmit={(e) => { e.preventDefault(); void handleCheckout(); }} className="space-y-4">
                <Input
                  id="card-last-four"
                  label="Número de demonstração"
                  placeholder="Digite os 4 dígitos de teste"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  required
                />

                <Button
                  type="submit"
                  disabled={loading || !acceptTerms || cardNumber.length !== 4}
                  className="w-full h-[58px] rounded-md text-sm font-bold shadow-md shadow-frigus-primary/20 mt-4"
                >
                  {loading ? "Processando pagamento..." : "Confirmar pagamento"}
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
                  className="w-full h-[58px] rounded-md text-sm font-bold shadow-md"
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
                  className="w-full h-[58px] rounded-md text-sm font-bold shadow-md"
                >
                  Simular boleto · {finalPrice}
                </Button>
              </div>
            )}
            {checkoutError && <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-300">{checkoutError}</p>}
          <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-[#E1E7F0] pt-4 text-xs text-[#64748B] dark:border-[#34383E] dark:text-neutral-400 sm:flex-row">
            <span>Mudou de ideia?</span>
            <Link to="/choose-profile" className="font-semibold text-frigus-primary underline underline-offset-2 dark:text-[#A7BCFF]">Voltar aos planos</Link>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}
