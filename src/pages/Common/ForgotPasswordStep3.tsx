import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import { resetPassword } from "@/services/auth.service";

export default function ForgotPasswordStep3() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const recovery = location.state as { email?: string; code?: string } | null;

  if (!recovery?.email || !recovery.code) return <Navigate to="/forgot-password" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,20}$/.test(password)) {
      setError("A senha deve conter de 8 a 20 caracteres, com letra maiúscula, minúscula, número e caractere especial.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas informadas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email: recovery!.email!, code: recovery!.code!, newPassword: password });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={"Defina uma senha\nnova e segura"}
      description="Escolha uma senha para voltar a usar o Frigus com total segurança e controle."
      cardTitle="Sua conta protegida"
      cardDescription="Use uma senha forte e que você ainda não utilize em outros serviços para proteger seus dados."
    >
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[480px] bg-white dark:bg-[#1C1E22] rounded-2xl shadow-[0_16px_34px_0_rgba(19,28,85,0.08)] dark:shadow-[0_16px_34px_0_rgba(0,0,0,0.4)] border border-[#C9DEF9] dark:border-[#343941] p-8 sm:p-10 flex flex-col gap-6">
        {success ? (
          <div className="flex flex-col items-center text-center py-4 gap-4">
            <CheckCircle2 className="size-16 text-emerald-500" />
            <h3 className="text-2xl font-bold text-frigus-navy dark:text-white">
              Senha redefinida com sucesso!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sua senha foi atualizada. Agora você já pode acessar sua conta normalmente.
            </p>
            <Button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full h-12 text-base font-bold mt-3 shadow-md"
            >
              Ir para o Login
            </Button>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-frigus-navy dark:text-white leading-tight font-display">
                Criar nova senha
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                Digite e confirme sua nova senha para continuar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                id="new-password"
                label="Nova senha"
                type="password"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                helperText="Use de 8 a 20 caracteres, com maiúscula, minúscula, número e símbolo."
              />

              <Input
                id="confirm-password"
                label="Confirmar senha"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-200 dark:border-red-900/40">
                  <ShieldAlert className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full h-12 text-base font-bold shadow-md shadow-frigus-primary/20"
              >
                {loading ? "Salvando..." : "Salvar nova senha"}
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-frigus-primary dark:text-[#A7BCFF] hover:underline"
                >
                  Cancelar e voltar
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
