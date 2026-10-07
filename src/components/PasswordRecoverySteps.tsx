import type { FormEvent, ReactNode } from "react";
import { ArrowLeft, CheckCircle2, Info, MailCheck } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";

interface EmailStepProps {
  email: string;
  error: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

interface CodeStepProps {
  code: string;
  email: string;
  error: string;
  loading: boolean;
  notice: string;
  resendSeconds: number;
  onBack: () => void;
  onCodeChange: (code: string) => void;
  onResend: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

interface PasswordStepProps {
  confirmPassword: string;
  error: string;
  loading: boolean;
  password: string;
  onConfirmPasswordChange: (password: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function EmailStep({
  email,
  error,
  loading,
  onEmailChange,
  onSubmit,
}: EmailStepProps) {
  return (
    <>
      <StepHeading
        title="Esqueceu sua senha?"
        description="Digite o e-mail cadastrado para receber um código de recuperação."
      />

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Input
          id="forgot-password-email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          required
        />

        <InfoMessage>
          Se existir uma conta com esse e-mail, enviaremos um código válido por
          10 minutos.
        </InfoMessage>

        <FormError>{error}</FormError>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="mt-1 h-[54px] w-full text-base font-bold shadow-[0_8px_18px_0_rgba(37,82,200,0.2)]"
        >
          {loading ? "Enviando..." : "Enviar código"}
        </Button>

        <div className="mt-1 text-center">
          <BackToLogin />
        </div>
      </form>
    </>
  );
}

export function CodeStep({
  code,
  email,
  error,
  loading,
  notice,
  resendSeconds,
  onBack,
  onCodeChange,
  onResend,
  onSubmit,
}: CodeStepProps) {
  return (
    <>
      <StepHeading
        title="Digite o código"
        description={
          <>
            Enviamos um código de 6 dígitos para{" "}
            <strong className="font-semibold text-frigus-navy">{email}</strong>.
          </>
        }
      />

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <CodeInput value={code} onChange={onCodeChange} />
        <FormError>{error}</FormError>

        {notice && (
          <p role="status" className="text-sm text-green-700">
            {notice}
          </p>
        )}

        <div className="-mt-2 flex flex-wrap items-center justify-center gap-x-1 text-sm text-[#596B8B]">
          <span>Não recebeu?</span>
          <button
            type="button"
            onClick={onResend}
            disabled={resendSeconds > 0 || loading}
            className="font-semibold text-frigus-primary underline underline-offset-4 disabled:cursor-not-allowed disabled:text-[#70809F]"
          >
            {resendSeconds > 0
              ? `Reenviar em ${resendSeconds}s`
              : "Reenviar código"}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading || code.length !== 6}
          className="h-[54px] w-full text-base font-bold shadow-[0_8px_18px_0_rgba(37,82,200,0.2)]"
        >
          {loading ? "Verificando..." : "Confirmar código"}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-frigus-primary underline underline-offset-4"
          >
            Alterar e-mail
          </button>
        </div>
      </form>
    </>
  );
}

export function PasswordStep({
  confirmPassword,
  error,
  loading,
  password,
  onConfirmPasswordChange,
  onPasswordChange,
  onSubmit,
}: PasswordStepProps) {
  return (
    <>
      <StepHeading
        title="Crie sua senha"
        description="O código foi confirmado. Agora escolha uma nova senha."
      />

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          id="recovery-new-password"
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          placeholder="Digite sua nova senha"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          required
        />

        <Input
          id="recovery-confirm-password"
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          placeholder="Digite a senha novamente"
          value={confirmPassword}
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
          required
        />

        <p className="text-[13px] leading-relaxed text-[#596B8B]">
          Use de 8 a 20 caracteres, com letra maiúscula, minúscula, número e
          caractere especial.
        </p>

        <FormError>{error}</FormError>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="mt-1 h-[54px] w-full text-base font-bold shadow-[0_8px_18px_0_rgba(37,82,200,0.2)]"
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </Button>

        <div className="mt-1 text-center">
          <BackToLogin />
        </div>
      </form>
    </>
  );
}

export function CompleteStep() {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <CheckCircle2 aria-hidden="true" className="size-16 text-green-600" />
      <h2 className="text-[28px] font-bold leading-tight text-frigus-navy">
        Senha atualizada
      </h2>
      <p className="max-w-[400px] text-[15px] text-[#596B8B]">
        Sua senha foi alterada com sucesso. Entre com a nova senha para
        continuar.
      </p>
      <a
        href="/login"
        className="mt-3 inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-frigus-primary px-6 font-bold text-white shadow-[0_8px_18px_0_rgba(37,82,200,0.2)] hover:bg-frigus-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-frigus-primary"
      >
        <MailCheck aria-hidden="true" className="size-5" />
        Ir para o login
      </a>
    </div>
  );
}

function CodeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="recovery-code"
        className="text-[15px] font-semibold leading-tight text-frigus-navy"
      >
        Código de recuperação
      </label>

      <div className="relative mx-auto w-full max-w-[328px] rounded-xl focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-frigus-primary">
        <div aria-hidden="true" className="grid h-[58px] grid-cols-6 gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <span
              key={index}
              className={`flex items-center justify-center rounded-lg border bg-white font-mono text-2xl font-bold text-frigus-navy ${
                value.length === index
                  ? "border-frigus-primary"
                  : "border-[#D5DEED]"
              }`}
            >
              {value[index] ?? ""}
            </span>
          ))}
        </div>

        <input
          id="recovery-code"
          aria-label="Código de recuperação com 6 dígitos"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          value={value}
          onChange={(event) =>
            onChange(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          required
          className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
        />
      </div>
    </div>
  );
}

function StepHeading({
  title,
  description,
}: {
  title: string;
  description: ReactNode;
}) {
  return (
    <div className="mb-6 text-left">
      <h2 className="text-[28px] font-bold leading-tight text-frigus-navy sm:text-[32px]">
        {title}
      </h2>
      <p className="mt-1 text-[16px] text-[#596B8B]">{description}</p>
    </div>
  );
}

function InfoMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[#ECF2FD] p-4">
      <Info className="mt-0.5 size-5 shrink-0 text-frigus-primary" />
      <p className="text-[14px] leading-snug text-[#596B8B]">{children}</p>
    </div>
  );
}

function FormError({ children }: { children: string }) {
  if (!children) return null;

  return (
    <p role="alert" className="text-sm text-red-600">
      {children}
    </p>
  );
}

function BackToLogin() {
  return (
    <a
      href="/login"
      className="inline-flex items-center gap-2 text-[15px] font-bold text-frigus-primary underline underline-offset-4 hover:text-frigus-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-frigus-primary"
    >
      <ArrowLeft className="size-4" />
      Voltar para o login
    </a>
  );
}
