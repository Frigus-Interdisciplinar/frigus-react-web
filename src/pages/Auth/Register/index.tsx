import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import ThemeToggle from "@/components/ThemeToggle";
import { ensureStarterWorkspace, register, login } from "@/services/auth.service";
import { useStore } from "@/store/store";
import type { AccountType } from "@/types/auth.type";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [accountType, setAccountType] = useState<AccountType>("DOMESTIC");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const saveUser = useStore((state) => state.login);

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

    if (!birthDate) {
      setError("Informe sua data de nascimento.");
      return;
    }

    setLoading(true);
    try {
      const account = await register({ name: name.trim(), email: email.trim(), rawPassword: password, birthDate, accountType });
      const session = await login({ email: account.email, rawPassword: password, rememberMe: true });
      await ensureStarterWorkspace(session.user.accountType);
      saveUser(session.user);
      navigate(accountType === "COMMERCIAL" ? "/commercial" : accountType === "BUSINESS" ? "/enterprise" : "/home", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar sua conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={"Comece uma rotina\nmais organizada"}
      description="Crie sua conta e personalize o Frigus de acordo com a sua casa, o seu comércio ou a sua empresa."
      cardTitle="Feito para caber na sua vida"
      cardDescription="Escolha o tipo de conta que combina com a sua casa, o seu comércio ou a sua empresa."
    >
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1B1D20] border border-[#C9DEF9] dark:border-[#34383E] shadow-[0_16px_34px_0_rgba(19,28,85,0.08)] dark:shadow-[0_16px_34px_0_rgba(0,0,0,0.4)] w-full max-w-[576px] p-7 sm:p-12 flex flex-col transition-colors">
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

          <Input id="register-input-birth-date" label="Data de nascimento" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />

          <label className="flex flex-col gap-1.5 text-sm font-medium text-frigus-navy dark:text-white">
            Tipo de conta
            <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountType)} className="h-11 rounded-lg border border-[#C9DEF9] bg-white px-3 text-sm dark:border-[#343941] dark:bg-[#15171A] dark:text-white">
              <option value="DOMESTIC">Doméstico</option>
              <option value="COMMERCIAL">Comercial</option>
              <option value="BUSINESS">Empresarial</option>
            </select>
          </label>

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
