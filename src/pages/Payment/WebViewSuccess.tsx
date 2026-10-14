import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Check, Clock3, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import { api } from "@/utils/api.util";

export default function WebViewSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const plan = searchParams.get("plan") || "";
  const planName = searchParams.get("name") || "Familiar Plus";
  const planPrice = searchParams.get("price") || "R$ 19,90";
  const transactionId = searchParams.get("transactionId");
  const [status, setStatus] = useState<string>("PENDING");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!transactionId) { setError("Não encontramos uma transação para acompanhar."); return; }
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const refresh = async () => {
      try {
        const transaction = await api.get<{ status: string }>(`/web/core/transactions/${transactionId}`);
        if (!active) return;
        setStatus(transaction.status);
        if (["PENDING", "PROCESSING"].includes(transaction.status)) timer = setTimeout(refresh, 1800);
      } catch {
        if (active) setError("Não foi possível consultar o estado da transação.");
      }
    };
    void refresh();
    return () => { active = false; clearTimeout(timer); };
  }, [transactionId]);

  const approved = status === "APPROVED";
  const rejected = ["REJECTED", "ERROR", "CANCELED"].includes(status);

  const handleReturnToApp = () => {
    // If running in a mobile webview with postMessage bridge
    const rnwv = (window as unknown as { ReactNativeWebView?: { postMessage: (msg: string) => void } }).ReactNativeWebView;
    if (rnwv) {
      rnwv.postMessage(JSON.stringify({ type: "PAYMENT_RESULT", status }));
    } else if (plan?.startsWith("enterprise")) {
      navigate("/enterprise");
    } else if (plan?.startsWith("commercial")) {
      navigate("/commercial/stock");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-[#0B0D12] flex justify-center py-0 sm:py-6 px-0 sm:px-4">
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[840px] bg-white dark:bg-[#15181E] border-x sm:border border-slate-200 dark:border-[#262A33] sm:rounded-2xl shadow-xl flex flex-col justify-between">
        {/* Topbar */}
        <div>
          <header className="px-5 py-4 border-b border-slate-200 dark:border-[#262A33] flex items-center justify-between">
            <span className="w-5" />
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">
              Pagamento
            </h1>
            <ThemeToggle />
          </header>

          <main className="p-6 flex flex-col items-center text-center">
            {/* Success Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mt-6 shadow-sm ${approved ? "bg-[#E8F5EE] dark:bg-[#122C23] text-[#22795C] dark:text-[#48C78E]" : rejected ? "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300" : "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"}`}>
              {approved ? <Check className="w-9 h-9 stroke-[3]" /> : rejected ? <X className="w-9 h-9" /> : <Clock3 className="w-9 h-9" />}
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-6">
              {approved ? "Transação aprovada" : rejected ? "Transação não aprovada" : "Aguardando confirmação"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-neutral-400 mt-2.5 max-w-[320px] leading-relaxed">
              {approved ? "A simulação aprovou a transação e ativou o plano. Nenhuma cobrança real foi feita." : rejected ? "A transação de demonstração não foi aprovada. Você pode voltar e tentar novamente." : "Estamos consultando o processamento de demonstração. Nenhuma cobrança real será feita."}
            </p>
            {error && <p role="alert" className="mt-3 text-xs text-red-700 dark:text-red-300">{error}</p>}

            {/* Receipt Card */}
            <div className="w-full mt-8 p-5 rounded-2xl bg-slate-50 dark:bg-[#1C1E24] border border-slate-200/80 dark:border-[#2C303B] text-left">
              <span className="text-[11px] font-bold text-slate-400 dark:text-neutral-400 uppercase tracking-wider">
                PLANO
              </span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {planName}
              </p>

              <hr className="my-3.5 border-slate-200 dark:border-[#2C303B]" />

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 dark:text-neutral-400 uppercase tracking-wider">
                  VALOR DA TRANSAÇÃO
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {planPrice}
                </span>
              </div>
            </div>
          </main>
        </div>

        {/* Fixed bottom bar */}
        <div className="p-4 border-t border-slate-200 dark:border-[#262A33] bg-white dark:bg-[#15181E] sm:rounded-b-2xl">
          <Button
            type="button"
            onClick={handleReturnToApp}
            className="w-full h-12 text-base font-semibold"
          >
            {approved ? "Voltar ao aplicativo" : "Voltar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
