import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";

export default function ForgotPasswordStep2() {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || "seu e-mail";

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;
    const newDigits = [...digits];
    pasteData.split("").forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);
    const nextIdx = Math.min(pasteData.length, 5);
    inputsRef.current[nextIdx]?.focus();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (digits.some((d) => !d)) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/recover-password/step-3", { state: { email } });
    }, 400);
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }, 600);
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <AuthLayout
      title={"Use o código enviado\npara continuar"}
      description="Enviamos um código de verificação para o seu endereço de e-mail cadastrado."
      cardTitle="Código de segurança"
      cardDescription="Digite os 6 dígitos recebidos para desbloquear a redefinição de senha."
    >
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[500px] bg-white dark:bg-[#1C1E22] rounded-2xl shadow-[0_16px_34px_0_rgba(19,28,85,0.08)] dark:shadow-[0_16px_34px_0_rgba(0,0,0,0.4)] border border-[#C9DEF9] dark:border-[#343941] p-8 sm:p-10 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-frigus-navy dark:text-white leading-tight font-display">
            Digite o código
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            Enviamos o código para <strong className="text-frigus-navy dark:text-gray-200">{email}</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-14 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold text-frigus-navy dark:text-white bg-white dark:bg-[#232D42] border border-[#D5DEED] dark:border-[#343941] rounded-xl focus:outline-none focus:ring-2 focus:ring-frigus-primary/40 focus:border-frigus-primary transition-all duration-150"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span>Não recebeu o código?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-semibold text-frigus-primary dark:text-[#A7BCFF] hover:underline cursor-pointer disabled:opacity-50"
            >
              {resending ? "Reenviando..." : "Reenviar código"}
            </button>
          </div>

          {resendSuccess && (
            <p className="text-xs text-green-600 dark:text-green-400 text-center font-medium">
              Código reenviado com sucesso!
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || !isComplete}
            className="w-full h-12 text-base font-bold shadow-md shadow-frigus-primary/20"
          >
            {loading ? "Validando..." : "Confirmar código"}
          </Button>

          <div className="text-center pt-1">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-frigus-primary dark:text-[#A7BCFF] hover:underline"
            >
              <ArrowLeft className="size-4" /> Voltar ao Login
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
