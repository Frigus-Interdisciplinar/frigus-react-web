import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";

export default function ForgotPasswordStep1() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/recover-password/step-2", { state: { email } });
    }, 400);
  };

  return (
    <AuthLayout
      title={"Recupere o acesso\nsem complicação"}
      description="Informe seu e-mail e receba as instruções para criar uma nova senha com segurança."
      cardTitle="Vamos enviar um código para o seu e-mail"
      cardDescription="Você receberá um código de 6 dígitos para validar sua identidade com total proteção."
    >
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[480px] bg-white dark:bg-[#1C1E22] rounded-2xl shadow-[0_16px_34px_0_rgba(19,28,85,0.08)] dark:shadow-[0_16px_34px_0_rgba(0,0,0,0.4)] border border-[#C9DEF9] dark:border-[#343941] p-8 sm:p-10 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-frigus-navy dark:text-white leading-tight font-display">
            Recuperar senha
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            Informe o e-mail da sua conta para receber o código de recuperação.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            id="recovery-email"
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50/70 dark:bg-[#131C55]/30 border border-blue-100 dark:border-blue-900/40 text-xs text-[#1F5F97] dark:text-[#A7BCFF]">
            <ShieldCheck className="size-4 shrink-0 text-frigus-primary" />
            <span>O código de segurança expira em 15 minutos para sua proteção.</span>
          </div>

          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full h-12 text-base font-bold shadow-md shadow-frigus-primary/20"
          >
            {loading ? "Enviando..." : "Enviar código"}
          </Button>

          <div className="text-center pt-2">
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
