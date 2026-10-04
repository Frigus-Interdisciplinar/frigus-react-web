import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import ThemeToggle from "@/components/ThemeToggle";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [rawPassword, setRawPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !rawPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    // UI-only flow for now (sem services por hora)
    setTimeout(() => {
      setLoading(false);
      navigate("/home");
    }, 400);
  };

  return (
    <AuthLayout
      title={"Menos desperdício\nMais leveza no dia a dia"}
      description="Acompanhe seus alimentos, organize compras e aproveite melhor tudo o que já está em casa."
      cardTitle="Sua rotina em um só lugar"
      cardDescription="Estoque, validade, receitas e lista de compras conectados de forma simples."
    >
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1C1E22] border border-[#C9DEF9] dark:border-[#343941] shadow-[0_16px_34px_0_rgba(19,28,85,0.08)] dark:shadow-[0_16px_34px_0_rgba(0,0,0,0.4)] w-full max-w-[480px] p-8 sm:p-10 flex flex-col items-center justify-center transition-colors">
        <div className="w-full text-left">
          <h2 className="font-bold text-frigus-navy dark:text-white text-2xl sm:text-3xl leading-tight font-display">
            Bem-vindo(a) de volta!
          </h2>

          <p className="font-normal text-gray-500 dark:text-gray-400 text-sm mt-1.5">
            Entre para continuar cuidando melhor da sua rotina.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mt-6">
          <Input
            id="login-input-email"
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <Input
            id="login-input-password"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={rawPassword}
            onChange={(e) => setRawPassword(e.target.value)}
            showPasswordToggle
            required
          />

          <div className="flex justify-between items-center w-full text-xs">
            <Checkbox
              id="remember-me"
              label="Manter conectado"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link
              to="/forgot-password"
              className="text-frigus-primary dark:text-[#A7BCFF] font-semibold hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium">{error}</p>
          )}

          <div className="mt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full h-12 text-base font-bold shadow-md shadow-frigus-primary/20"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-gray-400 dark:text-gray-500">
            <ShieldCheck className="size-4 text-frigus-primary shrink-0" />
            <span>Seus dados permanecem protegidos</span>
          </div>

          <p className="text-center mt-2 text-gray-500 dark:text-gray-400 text-sm">
            Ainda não tem uma conta?{" "}
            <Link
              to="/register"
              className="text-frigus-primary dark:text-[#A7BCFF] font-bold hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
