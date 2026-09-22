import { useState, type FormEvent } from "react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { register } from "@/services/auth.service";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

    try {
      setLoading(true);
      const res = await register({
        name,
        email,
        rawPassword: password,
        birthDate: "2000-01-01",
      });
      console.log("Register response:", res);
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao criar a conta. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={"Comece uma rotina\nmais organizada"}
      description="Crie sua conta e personalize o Frigus de acordo com a sua casa, o seu comércio ou a sua empresa."
      cardTitle="Feito para caber na sua vida"
      cardDescription="Depois do cadastro, você escolhe o tipo de uso e vê apenas os planos certos para você."
    >
      <div className="rounded-frigus bg-frigus-white shadow-[0_16px_34px_0_rgba(19,28,85,0.10)] w-full max-w-[660px] p-8 sm:p-10 flex flex-col">
        <div className="text-left mb-6">
          <h2 className="font-bold text-frigus-navy text-[28px] sm:text-[32px] leading-tight">
            Crie sua conta
          </h2>
          <p className="font-normal text-[#70809F] text-[16px] mt-1">
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
                <span className="text-[14px] text-[#70809F] leading-snug">
                  Li e aceito os{" "}
                  <a
                    href="/terms"
                    className="text-frigus-primary font-medium underline hover:text-frigus-secondary"
                  >
                    Termos de uso
                  </a>{" "}
                  e a{" "}
                  <a
                    href="/privacy"
                    className="text-frigus-primary font-medium underline hover:text-frigus-secondary"
                  >
                    Política de privacidade.
                  </a>
                </span>
              }
            />
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
              {loading ? "Criando conta..." : "Continuar"}
            </Button>
          </div>

          <p className="text-center mt-3 text-[#70809F] text-[15px]">
            Já tem uma conta?{" "}
            <a
              href="/login"
              className="text-frigus-primary font-bold underline hover:text-frigus-secondary"
            >
              Entrar
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
