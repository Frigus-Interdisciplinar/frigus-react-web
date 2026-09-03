import { useState, type FormEvent } from "react";
import { Info, ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simula envio de e-mail de recuperação
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <AuthLayout
      title={"Recupere o acesso\nsem complicação"}
      description="Informe seu e-mail e receba as instruções para criar uma nova senha com segurança."
      cardTitle="Tudo certo por aqui"
      cardDescription="O link de recuperação é protegido e fica disponível por tempo limitado."
    >
      <div className="rounded-frigus bg-frigus-white shadow-[0_16px_34px_0_rgba(19,28,85,0.10)] w-full max-w-[576px] p-8 sm:p-12 flex flex-col">
        <div className="text-left mb-6">
          <h2 className="font-bold text-frigus-navy text-[28px] sm:text-[32px] leading-tight">
            Esqueceu sua senha?
          </h2>
          <p className="font-normal text-[#70809F] text-[16px] mt-1">
            Digite o e-mail cadastrado para receber o link de recuperação.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center text-center py-4 gap-4">
            <CheckCircle2 className="size-16 text-green-500" />
            <h3 className="text-xl font-bold text-frigus-navy">
              E-mail de recuperação enviado!
            </h3>
            <p className="text-[#70809F] text-[15px] max-w-[400px]">
              Se houver uma conta associada a <strong className="text-frigus-navy">{email}</strong>, você receberá um link com as instruções para redefinir sua senha.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-frigus-primary font-bold text-[15px] underline hover:text-frigus-secondary mt-4"
            >
              <ArrowLeft className="size-4" /> Voltar para o login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="forgot-password-email"
              label="E-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Aviso link seguro */}
            <div className="bg-[#ECF2FD] rounded-xl p-4 flex items-start sm:items-center gap-3">
              <Info className="size-5 text-frigus-primary shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-[14px] text-[#70809F] leading-snug">
                O link é válido por 30 minutos e será enviado apenas para o e-mail cadastrado.
              </p>
            </div>

            <div className="mt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full h-[54px] text-base font-bold shadow-[0_8px_18px_0_rgba(37,82,200,0.2)]"
              >
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </div>

            <div className="text-center mt-3">
              <a
                href="/login"
                className="inline-flex items-center gap-2 text-frigus-primary font-bold text-[15px] underline hover:text-frigus-secondary"
              >
                <ArrowLeft className="size-4" /> Voltar para o login
              </a>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
