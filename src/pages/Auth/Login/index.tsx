import { useState, type FormEvent } from "react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { login } from "@/services/auth.service";
import { useStore } from "@/store/store";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [rawPassword, setRawPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const store = useStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await login({ email, rawPassword });
      store.login(res.user, res.accessToken, res.refreshToken);
      console.log(store.user, store.accessToken, store.refreshToken, rememberMe);
    } catch (err) {
      console.error(err);
      setError("Credenciais inválidas. Verifique seu e-mail e senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={"Menos desperdício\nMais leveza no dia a dia"}
      description={
        <>
          Acompanhe seus alimentos, organize compras e <br />
          aproveite melhor tudo o que já está em casa
        </>
      }
      cardTitle="Sua rotina em um só lugar"
      cardDescription={
        <>
          Estoque, validade, receitas e lista de compras <br />
          conectados de forma simples.
        </>
      }
    >
      <div className="rounded-frigus bg-frigus-white shadow-[0_16px_34px_0_rgba(19,28,85,0.10)] w-full max-w-[520px] p-8 sm:p-12 flex flex-col items-center justify-center">
        <div className="w-full text-left">
          <h2 className="font-bold text-frigus-navy text-[28px] sm:text-[32px] leading-tight">
            Bem-vindo(a) de volta!
          </h2>

          <p className="font-normal text-[#70809F] text-[16px] mt-1">
            Entre para continuar cuidando melhor da sua rotina.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mt-8">
          <Input
            id="login-input-email"
            label="Email"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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

          <div className="flex justify-between items-center w-full mt-1">
            <Checkbox
              id="remember-me"
              label="Manter conectado"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <a
              href="/forgot-password"
              className="text-frigus-primary text-sm font-semibold underline hover:text-frigus-secondary"
            >
              Esqueci minha senha
            </a>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <div className="mt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full h-[52px] text-base font-bold shadow-[0_8px_18px_0_rgba(37,82,200,0.2)]"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>

          <p className="text-center mt-3 text-slate-500 text-sm">
            Ainda não tem uma conta?{" "}
            <a
              href="/register"
              className="text-frigus-primary text-sm font-bold underline hover:text-frigus-secondary"
            >
              Cadastre-se
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
