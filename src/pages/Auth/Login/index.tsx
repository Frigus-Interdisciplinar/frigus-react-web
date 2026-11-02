import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import ThemeToggle from "@/components/ThemeToggle";
import { ShieldCheck } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import {
  ensureStarterWorkspace,
  login,
  loginWithGoogle,
} from "@/services/auth.service";
import { useStore } from "@/store/store";
import { loginSchema } from "@/schemas/auth.schema";
import { getAccountHome, getSessionDestination } from "@/utils/plan.util";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    rawPassword: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"email" | "rawPassword", string>>
  >({});
  const navigate = useNavigate();
  const location = useLocation();
  const saveUser = useStore((state) => state.login);

  const completeLogin = async (
    session: Awaited<ReturnType<typeof login>>,
    googleLogin = false,
  ) => {
    if (!session.user.planSelectionRequired)
      await ensureStarterWorkspace(session.user.accountType);
    saveUser(session.user);
    const fallback = getAccountHome(session.user.accountType);
    const requested = (location.state as { from?: unknown } | null)?.from;
    const returnTo =
      typeof requested === "string" &&
      requested.startsWith("/") &&
      !requested.startsWith("//")
        ? requested
        : fallback;
    navigate(
      session.user.planSelectionRequired
        ? googleLogin && !session.user.pendingPlanTransactionId
          ? "/choose-profile"
          : getSessionDestination(session.user)
        : returnTo,
      { replace: true },
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const validation = loginSchema.safeParse(credentials);
    if (!validation.success) {
      const nextErrors: Partial<Record<"email" | "rawPassword", string>> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (
          (field === "email" || field === "rawPassword") &&
          !nextErrors[field]
        ) {
          nextErrors[field] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      await completeLogin(await login(credentials));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível entrar. Confira seus dados e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (idToken: string) => {
    setError("");
    setLoading(true);
    try {
      await completeLogin(
        await loginWithGoogle(idToken, credentials.rememberMe),
        true,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível entrar com o Google. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
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

      <div className="rounded-2xl bg-white dark:bg-[#1B1D20] border border-[#C9DEF9] dark:border-[#34383E] shadow-[0_16px_34px_0_rgba(19,28,85,0.08)] dark:shadow-[0_16px_34px_0_rgba(0,0,0,0.4)] w-full max-w-[576px] p-7 sm:p-12 flex flex-col items-center justify-center transition-colors">
        <div className="w-full text-left">
          <h2 className="font-bold text-frigus-navy dark:text-white text-2xl sm:text-3xl leading-tight font-display">
            Bem-vindo de volta
          </h2>

          <p className="font-normal text-gray-500 dark:text-gray-400 text-sm mt-1.5">
            Entre para continuar cuidando melhor da sua rotina.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 w-full mt-6"
        >
          <Input
            id="login-input-email"
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={credentials.email}
            maxLength={254}
            error={fieldErrors.email}
            onChange={(e) => {
              setError("");
              setFieldErrors((current) => ({ ...current, email: undefined }));
              setCredentials((current) => ({
                ...current,
                email: e.target.value,
              }));
            }}
            required
            autoFocus
            className="h-[58px] rounded-md"
          />

          <Input
            id="login-input-password"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={credentials.rawPassword}
            maxLength={128}
            error={fieldErrors.rawPassword}
            onChange={(e) => {
              setError("");
              setFieldErrors((current) => ({
                ...current,
                rawPassword: undefined,
              }));
              setCredentials((current) => ({
                ...current,
                rawPassword: e.target.value,
              }));
            }}
            showPasswordToggle
            required
            className="h-[58px] rounded-md"
          />

          <div className="flex justify-between items-center w-full text-xs">
            <Checkbox
              id="remember-me"
              label="Manter conectado"
              checked={credentials.rememberMe}
              onChange={(e) =>
                setCredentials((current) => ({
                  ...current,
                  rememberMe: e.target.checked,
                }))
              }
            />
            <Link
              to="/forgot-password"
              className="inline-flex min-h-11 items-center text-frigus-primary dark:text-[#A7BCFF] font-semibold hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>

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
              className="w-full h-[58px] rounded-md text-base font-bold shadow-md shadow-frigus-primary/20"
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
              className="inline-flex min-h-11 items-center text-frigus-primary dark:text-[#A7BCFF] font-bold hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </form>

        <div className="flex w-full items-center gap-3 py-5 text-xs text-gray-400 dark:text-gray-500" aria-hidden="true">
          <span className="h-px flex-1 bg-gray-200 dark:bg-[#343941]" />
          <span>ou</span>
          <span className="h-px flex-1 bg-gray-200 dark:bg-[#343941]" />
        </div>
        <GoogleSignInButton
          disabled={loading}
          onCredential={handleGoogleCredential}
          onError={setError}
        />
      </div>
    </AuthLayout>
  );
}
