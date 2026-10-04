import { useState, type FormEvent } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  QrCode,
  FileText,
  ShieldCheck,
  Check,
  ArrowLeft,
  Lock,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Checkbox from "@/components/Checkbox";
import FrigusLogo from "@/assets/frigus-logo-text.svg";

interface PlanDetails {
  id: string;
  name: string;
  category: string;
  price: string;
  priceNumber: number;
  period: string;
  description: string;
  benefits: string[];
}

const PLANS: Record<string, PlanDetails> = {
  family: {
    id: "family",
    name: "Familiar",
    category: "Doméstico",
    price: "R$ 14,90",
    priceNumber: 14.9,
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
    category: "Doméstico",
    price: "R$ 19,90",
    priceNumber: 19.9,
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
    category: "Comercial",
    price: "R$ 99,90",
    priceNumber: 99.9,
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
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState("1");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Formatar número do cartão
  const handleCardNumberChange = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  // Formatar validade MM/AA
  const handleExpiryChange = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "FRIGUS10") {
      setCouponApplied(true);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/checkout/webview/success", { state: { plan } });
    }, 600);
  };

  const discountAmount = couponApplied ? plan.priceNumber * 0.1 : 0;
  const finalPrice = (plan.priceNumber - discountAmount).toLocaleString("pt-BR", {
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

            {/* Credit Card Form */}
            {paymentMethod === "card" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="card-name"
                  label="Nome impresso no cartão"
                  placeholder="Como aparece no cartão"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />

                <Input
                  id="card-number"
                  label="Número do cartão"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  maxLength={19}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="card-expiry"
                    label="Validade"
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    maxLength={5}
                    required
                  />

                  <Input
                    id="card-cvv"
                    label="CVV / Código de segurança"
                    placeholder="000"
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="installments" className="text-sm font-semibold text-frigus-navy dark:text-gray-200">
                    Parcelamento
                  </label>
                  <select
                    id="installments"
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    className="w-full h-11 bg-white dark:bg-[#1C1E22] rounded-lg border border-[#D5DEED] dark:border-[#343941] px-3.5 text-sm text-[#1B2C62] dark:text-white focus:outline-none focus:ring-2 focus:ring-frigus-primary/30"
                  >
                    <option value="1">1x de {finalPrice} sem juros</option>
                    <option value="2">2x de {(plan.priceNumber / 2).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} sem juros</option>
                    <option value="3">3x de {(plan.priceNumber / 3).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} sem juros</option>
                  </select>
                </div>

                <div className="pt-2">
                  <Checkbox
                    id="terms-checkout"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    label={
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Li e concordo com os Termos de Serviço e com a renovação automática.
                      </span>
                    }
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !acceptTerms || !cardNumber || !cardName}
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
                  Pagamento instantâneo via Pix
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Após confirmar, você receberá um QR Code para escanear com o app do seu banco. A liberação do plano é imediata!
                </p>
                <Button
                  type="button"
                  onClick={() => navigate("/checkout/webview/success", { state: { plan } })}
                  className="w-full h-12 text-base font-bold shadow-md"
                >
                  Gerar QR Code Pix de {finalPrice}
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
                  Boleto Bancário
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  O boleto pode ser pago em qualquer banco ou aplicativo até o vencimento. O prazo de compensação é de até 2 dias úteis.
                </p>
                <Button
                  type="button"
                  onClick={() => navigate("/checkout/webview/success", { state: { plan } })}
                  className="w-full h-12 text-base font-bold shadow-md"
                >
                  Emitir Boleto de {finalPrice}
                </Button>
              </div>
            )}
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

              {/* Coupon Form */}
              <div className="mt-6 pt-5 border-t border-[#E1E7F0] dark:border-[#343941]">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cupom (ex: FRIGUS10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 h-9 rounded-lg border border-gray-200 dark:border-gray-700 px-3 text-xs bg-gray-50 dark:bg-gray-800 text-frigus-navy dark:text-white uppercase"
                  />
                  <Button type="submit" variant="secondary" className="h-9 px-3 text-xs">
                    Aplicar
                  </Button>
                </form>
                {couponApplied && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium">
                    Cupom de 10% de desconto aplicado com sucesso!
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="mt-6 pt-5 border-t border-[#E1E7F0] dark:border-[#343941] space-y-2 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{plan.price}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Desconto (10%)</span>
                    <span>- {discountAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-frigus-navy dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span>Total a pagar</span>
                  <span className="text-frigus-primary dark:text-[#A7BCFF]">{finalPrice}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3.5">
              <ShieldCheck className="size-6 text-frigus-primary dark:text-[#A7BCFF] shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-frigus-navy dark:text-gray-200">Garantia incondicional de 7 dias</p>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                  Se você não amar a experiência no Frigus, basta nos enviar uma mensagem e devolveremos 100% do valor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 dark:text-gray-500 pt-6">
        © 2026 Frigus. Pagamentos processados com criptografia de ponta a ponta.
      </footer>
    </div>
  );
}
