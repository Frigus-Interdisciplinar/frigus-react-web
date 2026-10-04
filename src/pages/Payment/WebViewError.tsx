import { useSearchParams, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";

export default function WebViewError() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const planId = searchParams.get("plan") || "family-plus";
  const planName = searchParams.get("name") || "Familiar Plus";
  const planPrice = searchParams.get("price") || "R$ 19,90";

  const handleRetry = () => {
    navigate(
      `/checkout/webview?plan=${planId}&name=${encodeURIComponent(
        planName
      )}&price=${encodeURIComponent(planPrice)}`
    );
  };

  const handleReturnToApp = () => {
    const rnwv = (window as unknown as { ReactNativeWebView?: { postMessage: (msg: string) => void } }).ReactNativeWebView;
    if (rnwv) {
      rnwv.postMessage(
        JSON.stringify({ type: "PAYMENT_CANCELLED", status: "error" })
      );
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
            {/* Error Icon */}
            <div className="w-16 h-16 rounded-full bg-[#FCECF0] dark:bg-[#32161A] text-[#DA5B68] dark:text-[#F87171] flex items-center justify-center mt-12 shadow-sm">
              <AlertCircle className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-6">
              Não foi possível pagar
            </h2>
            <p className="text-sm text-slate-600 dark:text-neutral-400 mt-2.5 max-w-[320px] leading-relaxed">
              Confira os dados do cartão ou tente outra forma de pagamento. Nenhuma cobrança foi
              concluída.
            </p>
          </main>
        </div>

        {/* Fixed bottom bar */}
        <div className="p-4 border-t border-slate-200 dark:border-[#262A33] bg-white dark:bg-[#15181E] space-y-3 sm:rounded-b-2xl">
          <Button
            type="button"
            onClick={handleRetry}
            className="w-full h-12 text-base font-semibold"
          >
            Tentar novamente
          </Button>
          <button
            type="button"
            onClick={handleReturnToApp}
            className="w-full py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            Voltar ao aplicativo
          </button>
        </div>
      </div>
    </div>
  );
}
