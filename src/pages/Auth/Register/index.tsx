import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import ThemeToggle from "@/components/ThemeToggle";

import { useStore } from "@/store/store";
import type { AccountType } from "@/types/auth.type";
import { registerSchema } from "@/schemas/auth.schema";
import { getPlansPath } from "@/utils/plan.util";
import { useServiceOperations } from "@/hooks/useServiceOperations";

type RegistrationFields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  accountType: AccountType | "";
  acceptTerms: boolean;
};

export default function RegisterPage() {
  const apiOperations = useServiceOperations();
  const [registration, setRegistration] = useState<RegistrationFields>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    accountType: "",
    acceptTerms: false,
  });
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RegistrationFields, string>>
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const saveUser = useStore((state) => state.login);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const nextErrors: Partial<Record<keyof RegistrationFields, string>> = {};

    const validation = registerSchema.safeParse({
      name: registration.name,
      email: registration.email,
      rawPassword: registration.password,
      birthDate: registration.birthDate,
      accountType: registration.accountType,
    });
    if (!validation.success) {
      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (
          (field === "name" ||
            field === "email" ||
            field === "birthDate" ||
            field === "accountType") &&
          !nextErrors[field]
        ) {
          nextErrors[field] = issue.message;
        }
        if (field === "rawPassword" && !nextErrors.password) {
          nextErrors.password = issue.message;
        }
      }
    }
    if (registration.password !== registration.confirmPassword) {
      nextErrors.confirmPassword = "As senhas não coincidem.";
    }
    if (!registration.acceptTerms) {
      nextErrors.acceptTerms =
        "Você precisa aceitar os termos de uso para continuar.";
    }
    setFieldErrors(nextErrors);
    if (!validation.success || Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const account = await apiOperations.auth.register(validation.data);
      const session = await apiOperations.auth.login({
        email: account.email,
        rawPassword: registration.password,
        rememberMe: true,
      });
      saveUser(session.user);
      navigate(getPlansPath(session.user.accountType), { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível criar sua conta. Tente novamente.",
      );
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
            Primeiro, crie sua conta. Em seguida, escolha seu plano.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            id="register-input-name"
            label="Nome completo"
            placeholder="Digite seu nome"
            value={registration.name}
            maxLength={120}
            error={fieldErrors.name}
            onChange={(e) =>
              setRegistration((current) => ({
                ...current,
                name: e.target.value,
              }))
            }
            required
            autoFocus
          />

          <Input
            id="register-input-email"
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={registration.email}
            maxLength={254}
            error={fieldErrors.email}
            onChange={(e) =>
              setRegistration((current) => ({
                ...current,
                email: e.target.value,
              }))
            }
            required
          />

          <Input
            id="register-input-birth-date"
            label="Data de nascimento"
            type="date"
            value={registration.birthDate}
            error={fieldErrors.birthDate}
            onChange={(e) =>
              setRegistration((current) => ({
                ...current,
                birthDate: e.target.value,
              }))
            }
            required
          />

          <label
            htmlFor="field-pages-auth-register-index-tsx-1"
            className="flex flex-col gap-1.5 text-sm font-medium text-frigus-navy dark:text-white"
          >
            Tipo de conta
            <select
              id="field-pages-auth-register-index-tsx-1"
              value={registration.accountType}
              required
              onChange={(e) =>
                setRegistration((current) => ({
                  ...current,
                  accountType: e.target.value as AccountType | "",
                }))
              }
              className="h-11 rounded-lg border border-[#C9DEF9] bg-white px-3 text-sm dark:border-[#343941] dark:bg-[#15171A] dark:text-white"
            >
              <option value="">Selecione o tipo de conta</option>
              <option value="DOMESTIC">Doméstico</option>
              <option value="COMMERCIAL">Comercial</option>
              <option value="BUSINESS">Empresarial</option>
            </select>
          </label>
          {fieldErrors.accountType && (
            <p role="alert" className="text-xs text-red-600">
              {fieldErrors.accountType}
            </p>
          )}

          <Input
            id="register-input-password"
            label="Senha"
            type="password"
            placeholder="Crie uma senha segura"
            value={registration.password}
            maxLength={20}
            error={fieldErrors.password}
            onChange={(e) =>
              setRegistration((current) => ({
                ...current,
                password: e.target.value,
              }))
            }
            showPasswordToggle
            required
          />

          <Input
            id="register-input-confirm-password"
            label="Confirmar senha"
            type="password"
            placeholder="Digite a senha novamente"
            value={registration.confirmPassword}
            maxLength={20}
            error={fieldErrors.confirmPassword}
            onChange={(e) =>
              setRegistration((current) => ({
                ...current,
                confirmPassword: e.target.value,
              }))
            }
            showPasswordToggle
            required
          />

          <div className="mt-1">
            <Checkbox
              id="register-terms"
              checked={registration.acceptTerms}
              onChange={(e) =>
                setRegistration((current) => ({
                  ...current,
                  acceptTerms: e.target.checked,
                }))
              }
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
          {fieldErrors.acceptTerms && (
            <p role="alert" className="text-xs text-red-600">
              {fieldErrors.acceptTerms}
            </p>
          )}

          {error && (
            <p role="alert" className="text-xs text-red-500 font-medium">
              {error}
            </p>
          )}

          <div className="mt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              aria-live="polite"
              className="w-full h-12 text-base font-bold shadow-md shadow-frigus-primary/20"
            >
              {loading ? "Criando conta..." : "Continuar"}
            </Button>
          </div>

          <p className="text-center mt-3 text-gray-500 dark:text-gray-400 text-sm">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-frigus-primary dark:text-[#A7BCFF] font-bold hover:underline"
            >
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
