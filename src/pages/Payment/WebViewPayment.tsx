import { useState, type FormEvent } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Checkbox from "@/components/Checkbox";

export default function WebViewPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const planId = searchParams.get("plan") || "family-plus";
  const planName =
    searchParams.get("name") ||
    (planId === "commercial"
      ? "Plano Comercial"
      : planId === "family"
        ? "Familiar"
        : planId === "enterprise-report"
          ? "Relatório de Tendências"
          : planId === "enterprise-ad"
            ? "Pacote de Anúncios"
            : "Familiar Plus");

  const planPrice =
    searchParams.get("price") ||
    (planId === "commercial"
      ? "R$ 99,90"
      : planId === "family"
        ? "R$ 14,90"
        : planId === "enterprise-report"
          ? "R$ 250,00"
          : planId === "enterprise-ad"
            ? "R$ 50,00"
            : "R$ 19,90");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;

    setIsProcessing(true);
    setTimeout(() => {
      // Navigate to success webview with params
      navigate(
        `/checkout/webview/success?plan=${planId}&name=${encodeURIComponent(
          planName
        )}&price=${encodeURIComponent(planPrice)}`
      );
    }, 900);
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-[#0B0D12] flex justify-center py-0 sm:py-6 px-0 sm:px-4">
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[840px] bg-white dark:bg-[#15181E] border-x sm:border border-slate-200 dark:border-[#262A33] sm:rounded-2xl shadow-xl flex flex-col justify-between">
        {/* Topbar */}
        <div>
          <header className="px-5 py-4 border-b border-slate-200 dark:border-[#262A33] flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="p-1 text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white rounded-lg transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">
              Pagamento
            </h1>
            <ThemeToggle />
          </header>

          <form id="webview-payment-form" onSubmit={handleSubmit} className="p-5 space-y-6">
            {/* Order summary */}
            <div>
              <span className="text-xs font-semibold text-[#2552C8] dark:text-[#5B89F7] uppercase tracking-wider">
                Resumo da compra
              </span>
              <div className="mt-2.5 p-4 rounded-xl bg-slate-50 dark:bg-[#1C1E24] border border-slate-200/80 dark:border-[#2C303B]">
                <p className="text-xs text-slate-500 dark:text-neutral-400">Plano selecionado</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {planName}
                </p>
                <p className="text-sm font-semibold text-[#2552C8] dark:text-[#5B89F7] mt-1">
                  {planPrice}/mês
                </p>
              </div>
            </div>

            {/* Card details */}
            <div className="space-y-3.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Dados do cartão
              </h2>

              <Input
                label="Nome no cartão"
                placeholder="Como aparece no cartão"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />

              <Input
                label="Número do cartão"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Validade"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  maxLength={5}
                  required
                />
                <Input
                  label="CVV"
                  placeholder="000"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>

              <div className="pt-2 flex items-start gap-2.5">
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  id="webview-terms"
                />
                <label
                  htmlFor="webview-terms"
                  className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed cursor-pointer select-none"
                >
                  Li e aceito os{" "}
                  <Link to="/terms" className="text-[#2552C8] dark:text-[#5B89F7] underline">
                    Termos de uso
                  </Link>{" "}
                  e a{" "}
                  <Link to="/privacy" className="text-[#2552C8] dark:text-[#5B89F7] underline">
                    Política de privacidade
                  </Link>
                  .
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed bottom bar */}
        <div className="p-4 border-t border-slate-200 dark:border-[#262A33] bg-white dark:bg-[#15181E] space-y-2 sm:rounded-b-2xl">
          <Button
            type="submit"
            form="webview-payment-form"
            disabled={!acceptedTerms || isProcessing}
            className="w-full h-12 text-base font-semibold"
          >
            {isProcessing ? "Processando..." : `Pagar ${planPrice}`}
          </Button>
          <div className="flex justify-center">
            <Link
              to={`/checkout/webview/error?plan=${planId}&name=${encodeURIComponent(
                planName
              )}&price=${encodeURIComponent(planPrice)}`}
              className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
            >
              Simular erro de pagamento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
