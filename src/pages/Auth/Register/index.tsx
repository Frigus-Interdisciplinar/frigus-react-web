import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos de uso para continuar.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to choose-profile (Step 1 of 2 in onboarding)
      navigate("/choose-profile");
    }, 400);
  };

  return (
    <AuthLayout
      title={"Comece uma rotina\nmais organizada"}
      description="Crie sua conta e personalize o Frigus de acordo com a sua casa, o seu comércio ou a sua empresa."
      cardTitle="Feito para caber na sua vida"
      cardDescription="Depois do cadastro, você escolhe o tipo de uso e vê apenas os planos certos para você."
    >
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1C1E22] border border-[#C9DEF9] dark:border-[#343941] shadow-[0_16px_34px_0_rgba(19,28,85,0.08)] dark:shadow-[0_16px_34px_0_rgba(0,0,0,0.4)] w-full max-w-[540px] p-8 sm:p-10 flex flex-col transition-colors">
        <div className="text-left mb-6">
          <h2 className="font-bold text-frigus-navy dark:text-white text-2xl sm:text-3xl leading-tight font-display">
            Crie sua conta
          </h2>
          <p className="font-normal text-gray-500 dark:text-gray-400 text-sm mt-1.5">
            Leva menos de dois minutos para começar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="register-input-name"
            label="Nome completo"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <Input
            id="register-input-email"
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="register-input-password"
            label="Senha"
            type="password"
            placeholder="Crie uma senha segura"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle
            required
          />

          <Input
            id="register-input-confirm-password"
            label="Confirmar senha"
            type="password"
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPasswordToggle
            required
          />

          <div className="mt-1">
            <Checkbox
              id="register-terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              label={
                <span className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                  Li e aceito os{" "}
                  <span className="text-frigus-primary dark:text-[#A7BCFF] font-medium underline">
                    Termos de uso
                  </span>{" "}
                  e a{" "}
                  <span className="text-frigus-primary dark:text-[#A7BCFF] font-medium underline">
                    Política de privacidade.
                  </span>
                </span>
              }
            />
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
              {loading ? "Criando conta..." : "Continuar"}
            </Button>
          </div>

          <p className="text-center mt-3 text-gray-500 dark:text-gray-400 text-sm">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-frigus-primary dark:text-[#A7BCFF] font-bold hover:underline"
            >
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
